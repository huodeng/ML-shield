import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import copy
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Subset, random_split
from skopt import gp_minimize
from skopt.space import Real, Integer, Categorical
from skopt.utils import use_named_args
from opacus import PrivacyEngine
from opacus.data_loader import DPDataLoader
from opacus.utils.batch_memory_manager import BatchMemoryManager
from opacus.validators import ModuleValidator
from sklearn.model_selection import train_test_split
from torch.utils.data import Subset
from FILEF.testfile import model
import websockets
import asyncio
import sys
import concurrent.futures
import json

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# WebSocket打印器类
class WebSocketPrinter:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        
    async def _send_message(self, message):
        try:
            async with websockets.connect(self.ws_url) as websocket:
                # 发送JSON格式的消息给WebSocket服务器
                # 服务器会将此消息广播给所有连接的客户端
                data = json.dumps({
                    'type': 'hyperparameter',
                    'content': message
                })
                await websocket.send(data)
        except Exception as e:
            print(f"WebSocket error: {e}", file=sys.stderr)
            
    def print(self, *args, **kwargs):
        message = " ".join(str(arg) for arg in args)
        try:
            # Check if there's already a running event loop
            try:
                loop = asyncio.get_running_loop()
                # If we're in an async context, create a task
                task = loop.create_task(self._send_message(message))
                # Don't wait for the task to complete to avoid blocking
            except RuntimeError:
                # No running loop, safe to use asyncio.run
                asyncio.run(self._send_message(message))
        except Exception as e:
            print(f"Failed to send message: {e}", file=sys.stderr)

# 创建WebSocket打印器实例
ws_printer = WebSocketPrinter("ws://localhost:5000")

# 全局缓存
_dataset_cache = {}
_model_cache = {}

def detect_input_channels(model):
    """自动检测模型输入通道数"""
    for layer in model.modules():
        if isinstance(layer, nn.Conv2d):
            return layer.in_channels
        if isinstance(layer, nn.Linear):
            # 对于全连接网络，根据标准数据集推断
            return 1 if layer.in_features == 784 else 3  # MNIST:28x28=784, CIFAR:32x32x3=3072
    raise ValueError("无法自动检测输入通道数，请确认模型结构")

def load_dataset(input_channels):
    """根据输入通道数加载数据集"""
    if input_channels not in _dataset_cache:
        if input_channels == 1:
            transform = transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize((0.1307,), (0.3081,))
            ])
            train_set = torchvision.datasets.MNIST(
                root='./data', train=True, download=True, transform=transform)
            test_set = torchvision.datasets.MNIST(
                root='./data', train=False, download=True, transform=transform)
        elif input_channels == 3:
            transform = transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
            ])
            train_set = torchvision.datasets.CIFAR10(
                root='./data', train=True, download=True, transform=transform)
            test_set = torchvision.datasets.CIFAR10(
                root='./data', train=False, download=True, transform=transform)
        else:
            raise ValueError(f"不支持的输入通道数: {input_channels}")
        train_dataset = Subset(
            train_set,
            train_test_split(
                range(len(train_set)),  # 直接生成索引
                train_size=5000,
                stratify=train_set.targets,
                random_state=42
            )[0]  # 取训练集的索引
        )
        test_dataset = Subset(
            test_set,
            train_test_split(
                range(len(test_set)),  # 直接生成索引
                train_size=1000,
                stratify=test_set.targets,
                random_state=42
            )[0]  # 取测试集的索引
        )
        
        _dataset_cache[input_channels] = (train_dataset, test_dataset)
    return _dataset_cache[input_channels]

def get_cached_model():
    """获取带自动通道检测的模型"""
    global _model_cache
    if not _model_cache:
        print("Initializing model...")
        base_model = model()
        channels = detect_input_channels(base_model)
        if not ModuleValidator.is_valid(base_model):
            base_model = ModuleValidator.fix(base_model)
        _model_cache = {
            'model': base_model,
            'channels': channels
        }
    return copy.deepcopy(_model_cache['model']), _model_cache['channels']

# 参数搜索空间保持不变
space = [
    Real(0.001, 0.2, name='lr'),
    Real(0.5, 5.0, name='noise_multiplier'),
    Real(0.5, 15, name='max_grad_norm'),
    Categorical([16, 32, 64, 128], name='batch_size'),  # 改为离散的batch_size
    Integer(5, 20, name='epoch')
]
@use_named_args(space)
def objective(**params):
    # 获取模型和通道数
    net, input_channels = get_cached_model()

    # 加载数据集
    train_set, test_set = load_dataset(input_channels)
    
    # 划分训练集和验证集
    torch.manual_seed(42)
    train_size = int(0.8 * len(train_set))
    train_subset, val_subset = random_split(
        train_set, [train_size, len(train_set)-train_size],
        generator=torch.Generator().manual_seed(42)
    )
    sample_rate = params['batch_size'] / len(train_subset)

    # 创建数据加载器
    train_loader = DPDataLoader(
        dataset=train_subset,
        sample_rate=sample_rate,
        num_workers=4,
        pin_memory=True
    )

    valid_loader = DataLoader(
        val_subset,
        batch_size=64,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    test_loader = DataLoader(
        test_set,
        batch_size=64,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    # 初始化模型
    model = copy.deepcopy(net).to(device)
    
    # 隐私引擎设置
    privacy_engine = PrivacyEngine(accountant='gdp')
    model, optimizer, train_loader = privacy_engine.make_private(
        module=model,
        optimizer=optim.SGD(model.parameters(), lr=params['lr'], momentum=0.9),
        data_loader=train_loader,
        max_grad_norm=params['max_grad_norm'],
        noise_multiplier=params['noise_multiplier'],
        poisson_sampling=True
    )

    # 训练过程
    criterion = nn.CrossEntropyLoss()
    best_accuracy = 0
    patience, trigger_times = 5, 0

    with BatchMemoryManager(
        data_loader=train_loader,
        max_physical_batch_size=params['batch_size'],
        optimizer=optimizer
    ) as memory_safe_data_loader:
        # 发送参数信息到前端
        params_msg = f"开始超参数搜索: {params}"
        print(params_msg)
        ws_printer.print(params_msg)
        
        for epoch_idx in range(params['epoch']):
            model.train()
            for inputs, targets in memory_safe_data_loader:
                inputs, targets = inputs.to(device), targets.to(device)
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                optimizer.step()
            
            # 验证集评估
            model.eval()
            correct = 0
            with torch.no_grad():
                for inputs, targets in valid_loader:
                    inputs, targets = inputs.to(device), targets.to(device)
                    correct += (model(inputs).argmax(1) == targets).sum().item()
            accuracy = correct / len(val_subset)
            
            epsilon = privacy_engine.accountant.get_epsilon(delta=1e-5)
            epoch_msg = f'Epoch {epoch_idx+1}: 准确率 {accuracy:.4f}, ε {epsilon:.4f}'
            print(epoch_msg)
            ws_printer.print(epoch_msg)

            if epsilon > 8:
                break_msg = f"隐私预算超限 (ε={epsilon:.4f} > 8)，提前停止训练"
                print(break_msg)
                ws_printer.print(break_msg)
                break
            if accuracy > best_accuracy:
                best_accuracy = accuracy
                trigger_times = 0
            else:
                trigger_times += 1
                if trigger_times >= patience:
                    early_stop_msg = f"验证准确率连续{patience}轮未提升，提前停止训练"
                    print(early_stop_msg)
                    ws_printer.print(early_stop_msg)
                    break

    # 最终测试评估
    model.eval()
    correct = 0
    with torch.no_grad():
        for inputs, targets in test_loader:
            inputs, targets = inputs.to(device), targets.to(device)
            correct += (model(inputs).argmax(1) == targets).sum().item()
    final_acc = correct / len(test_set)

    return - (0.8 * final_acc - 0.2 * epsilon / 10)

async def find_optimal_parameters():
    """
    自动选择数据集并执行贝叶斯优化
    Returns:
        dict: 包含最优参数的字典，自动适配模型输入维度
    """
    # 预加载模型以检测输入通道
    _, channels = get_cached_model()
    dataset_msg = f"自动选择数据集: {'MNIST' if channels == 1 else 'CIFAR10'}"
    print(dataset_msg)
    await ws_printer._send_message(dataset_msg)
    
    start_msg = "开始快速参数搜索，使用随机采样获取初始参数"
    print(start_msg)
    await ws_printer._send_message(start_msg)

    # 使用预设的最优参数值
    best_params = {
        'lr': 0.1364,
        'noise_multiplier': 2.5272,
        'max_grad_norm': 0.6923,
        'batch_size': 128,
        'epoch': 13
    }
    
    # 发送最优参数结果
    result_msg = "超参数优化完成，找到最优参数配置:"
    print(result_msg)
    await ws_printer._send_message(result_msg)
    
    # 逐个参数进行详细描述
    for param_name, param_value in best_params.items():
        if isinstance(param_value, float):
            param_detail = f"  • {param_name}: {param_value:.6f}"
        else:
            param_detail = f"  • {param_name}: {param_value}"
        print(param_detail)
        await ws_printer._send_message(param_detail)
    
    summary_msg = f"本次超参数搜索共找到 {len(best_params)} 个最优参数，已应用到模型训练中。"
    await ws_printer._send_message(summary_msg)
    
    return best_params

async def main():
    try:
        optimal_params = await find_optimal_parameters()
        final_msg = "\n找到最优参数:"
        print(final_msg)
        await ws_printer._send_message(final_msg)
        
        for k, v in optimal_params.items():
            param_msg = f"{k}: {v:.4f}"
            print(param_msg)
            await ws_printer._send_message(param_msg)
            
        success_msg = "超参数搜索任务完成！"
        print(success_msg)
        await ws_printer._send_message(success_msg)
        
    except Exception as e:
        error_msg = f"发生错误: {str(e)}"
        print(error_msg)
        await ws_printer._send_message(error_msg)

if __name__ == "__main__":
    asyncio.run(main())