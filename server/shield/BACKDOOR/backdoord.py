import argparse
import os
import pathlib
import re
import time
import datetime
import pandas as pd
import torch
import random
import numpy as np
import websockets
import asyncio
import sys

from torch.utils.data import DataLoader
from opacus import PrivacyEngine
# 假设以下模块是用户自定义的
from BACKDOOR.dataset import build_poisoned_training_set, build_testset
from BACKDOOR.deeplearning import evaluate_badnets, optimizer_picker, train_one_epoch
from FILEF.testfile import model

class WebSocketPrinter:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        
    async def _send_message(self, message):
        try:
            async with websockets.connect(self.ws_url) as websocket:
                await websocket.send(message)
        except Exception as e:
            print(f"WebSocket error: {e}", file=sys.stderr)
            
    def print(self, *args, **kwargs):
        message = " ".join(str(arg) for arg in args)
        self.loop.run_until_complete(self._send_message(message))
        
ws_printer = WebSocketPrinter("ws://localhost:5000")

def set_random_seed(seed):
    random.seed(seed)  # 设置 Python 的随机种子
    np.random.seed(seed)  # 设置 NumPy 的随机种子
    torch.manual_seed(seed)  # 设置 PyTorch 的随机种子
    torch.cuda.manual_seed(seed)  # 设置 PyTorch CUDA 的随机种子
    torch.cuda.manual_seed_all(seed)  # 设置所有 GPU 的随机种子
    torch.backends.cudnn.deterministic = True  # 确保 PyTorch 的卷积操作是确定性的
    torch.backends.cudnn.benchmark = False  # 禁用 PyTorch 的性能优化（可能会影响随机性）


def backdoord(net, isuplord, dataset, params):
    parser = argparse.ArgumentParser(description='Reproduce the basic backdoor attack in "Badnets: Identifying vulnerabilities in the machine learning model supply chain".')

    if net.conv1.in_channels==1:
        x='MNIST'
    elif net.conv1.in_channels==3:
        x='CIFAR10'
    
    parser.add_argument('--dataset', default=x, help='Which dataset to use (MNIST or CIFAR10, default: MNIST)')
    parser.add_argument('--nb_classes', default=10, type=int, help='number of the classification types')
    parser.add_argument('--load_local', action='store_true', help='train model or directly load model (default true, if you add this param, then load trained local model to evaluate the performance)')
    parser.add_argument('--loss', default='mse', help='Which loss function to use (mse or cross, default: mse)')
    parser.add_argument('--optimizer', default='sgd', help='Which optimizer to use (sgd or adam, default: sgd)')
    parser.add_argument('--epochs', default=30, help='Number of epochs to train backdoor model, default: 100')
    parser.add_argument('--batch_size', type=int, default=64, help='Batch size to split dataset, default: 64')
    parser.add_argument('--num_workers', type=int, default=0, help='Batch size to split dataset, default: 64')
    parser.add_argument('--lr', type=float, default=0.01, help='Learning rate of the model, default: 0.001')
    parser.add_argument('--download', action='store_true', help='Do you want to download data ( default false, if you add this param, then download)')
    parser.add_argument('--data_path', default='./data/', help='Place to load dataset (default: ./dataset/)')
    parser.add_argument('--device', default='cpu', help='device to use for training / testing (cpu, or cuda:1, default: cpu)')
    # poison settings
    parser.add_argument('--poisoning_rate', type=float, default=0.02, help='poisoning portion (float, range from 0 to 1, default: 0.1)')
    parser.add_argument('--trigger_label', type=int, default=1, help='The NO. of trigger label (int, range from 0 to 10, default: 0)')
    parser.add_argument('--trigger_path', 
                       default=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                          "shield", "BACKDOOR", "triggers", "trigger_white.png"), 
                       help='Trigger Path (default: ./triggers/trigger_white.png)')
    parser.add_argument('--trigger_size', type=int, default=5, help='Trigger Size (int, default: 5)')
    parser.add_argument('--seed', type=int, default=42, help='Random seed for reproducibility (default: 42)')  # 添加随机种子参数


    args = parser.parse_args()
    set_random_seed(43)
    ws_printer.print("{}".format(args).replace(', ', ',\n'))
    ws_printer.print("使用隐私保护")


    if re.match('cuda:\d', args.device):
        cuda_num = args.device.split(':')[1]
        os.environ['CUDA_VISIBLE_DEVICES'] = cuda_num
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Create related paths
    checkpoints_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                 "shield", "BACKDOOR", "checkpointss")
    logs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                           "shield", "BACKDOOR", "logss")

    pathlib.Path(checkpoints_dir).mkdir(parents=True, exist_ok=True)
    pathlib.Path(logs_dir).mkdir(parents=True, exist_ok=True)
    ws_printer.print("\n# Load dataset: %s" % args.dataset)
    dataset_train, args.nb_classes = build_poisoned_training_set(is_train=True, args=args)
    dataset_val_clean, dataset_val_poisoned = build_testset(is_train=False, args=args)

    data_loader_train = DataLoader(dataset_train, batch_size=args.batch_size, shuffle=True, num_workers=args.num_workers)
    data_loader_val_clean = DataLoader(dataset_val_clean, batch_size=args.batch_size, shuffle=True, num_workers=args.num_workers)
    data_loader_val_poisoned = DataLoader(dataset_val_poisoned, batch_size=args.batch_size, shuffle=True, num_workers=args.num_workers)

    # Initialize model
    model1 = model().to(device)
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = optimizer_picker(args.optimizer, model1.parameters(), lr=args.lr)

    privacy_engine = PrivacyEngine()
    model1, optimizer, data_loader_train = privacy_engine.make_private(
        module=model1,
        optimizer=optimizer,
        data_loader=data_loader_train,
        noise_multiplier=params['noise_multiplier'],
        max_grad_norm=params['max_grad_norm'],
    )



    basic_model_path = os.path.join(checkpoints_dir, "badnet-%s.pth" % args.dataset)
    
    start_time = time.time()

    if args.load_local:
        ws_printer.print("## Load model from : %s" % basic_model_path)
        test_stats = evaluate_badnets(data_loader_val_clean, data_loader_val_poisoned, model1, device)
        ws_printer.print(f"Test Clean Accuracy (TCA): {test_stats['clean_acc']:.4f}")
        ws_printer.print(f"Attack Success Rate (ASR): {test_stats['asr']:.4f}")
    else:
        ws_printer.print(f"Start training for {args.epochs} epochs")
        stats = []
        for epoch in range(args.epochs):
            train_stats = train_one_epoch(data_loader_train, model1, criterion, optimizer, args.loss, device)
            test_stats = evaluate_badnets(data_loader_val_clean, data_loader_val_poisoned, model1, device)
            ws_printer.print(f"# EPOCH {epoch}   loss: {train_stats['loss']:.4f} Test Acc: {test_stats['clean_acc']:.4f}, ASR: {test_stats['asr']:.4f}\n")

            # Save model
            log_stats = {**{f'train_{k}': v for k, v in train_stats.items()},
                         **{f'test_{k}': v for k, v in test_stats.items()},
                         'epoch': epoch,
                         }

            # Save training stats
            stats.append(log_stats)
            df = pd.DataFrame(stats)
            log_file = os.path.join(logs_dir, "%s_trigger%d.csv" % (args.dataset, args.trigger_label))
            df.to_csv(log_file, index=False, encoding='utf-8')

    total_time = time.time() - start_time
    total_time_str = str(datetime.timedelta(seconds=int(total_time)))
    ws_printer.print('Training time {}'.format(total_time_str))

    result={
        'clean_acc':test_stats['clean_acc'],
        'asr':test_stats['asr']
    }
    return result

