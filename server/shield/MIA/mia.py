import torch
import torch.nn as nn
import torch.optim as optim
from MIA.Shadow import ShadowMembershipInferenceAttack
from MIA.utils import TorchClassifier, NumpyDataset
from torchvision import datasets, transforms
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import numpy as np
from FILEF.testfile import model
from opacus import *
import os
import websockets
import asyncio
import sys

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


def mia(net,isuplord,dataset,imgsize):
    device = torch.device("cpu") 
    channelnum=net.conv1.in_channels
    if not isuplord:
        if channelnum==1:
            ws_printer.print("检测到您的模型架构为1通道，为您选择Minst数据集进行训练")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5,), (0.5,))  # 规范化处理
            ])
            mnist_dataset = datasets.MNIST(root=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data'), train=True, download=True, transform=transform)

            X = mnist_dataset.data.numpy().reshape(-1, 28 * 28).astype("float32") / 255  # 展平并归一化
            y = mnist_dataset.targets.numpy().astype("int64")  # 保存标签为整数

            # 划分数据集
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1 / 3, random_state=42)
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1 / 2, random_state=42)

            # 模拟不同的数据分布（如需）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)
            X_train_tensor = torch.from_numpy(X_train).view(-1, 1, 28, 28).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).view(-1, 1, 28, 28).to(device).float()
            X_shadow_tensor = torch.from_numpy(X_shadow).view(-1, 1, 28, 28).to(device).float()
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)
        elif channelnum==3:
            ws_printer.print("检测到您的模型架构为3通道")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 规范化处理
            ])

            cifar10_dataset = datasets.CIFAR10(root=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data'), train=True, download=False, transform=transform)

            # 访问数据和标签
            X = cifar10_dataset.data.astype("float32")
            y = torch.tensor(cifar10_dataset.targets).numpy().astype("int64")
            # 划分数据集
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1 / 3, random_state=42)
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1 / 2, random_state=42)

            # 模拟不同的数据分布（如果需要）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)

            # 转换为张量并重塑
            X_train_tensor = torch.from_numpy(X_train).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            X_shadow_tensor = torch.from_numpy(X_shadow).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)  # 转换为 long 类型张量

    elif isuplord:
        if channelnum==1:
            ws_printer.print("检测到您的模型架构为1通道")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5,), (0.5,))  # 规范化处理
            ])

            X_train=np.array(dataset['X_train'],dtype=float)
            y_train=np.array(dataset['y_train'],dtype=int)
            X_test=np.array(dataset['X_test'],dtype=float)
            y_test=np.array(dataset['y_test'],dtype=int)# 划分数据集
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1/2, random_state=42)
            

            # 模拟不同的数据分布（如需）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)
            X_train_tensor = torch.from_numpy(X_train).view(-1, 1, 28, 28).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).view(-1, 1, 28, 28).to(device).float()
            X_shadow_tensor = torch.from_numpy(X_shadow).view(-1, 1, 28, 28).to(device).float()
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)
        elif channelnum==3:
            ws_printer.print("检测到您的模型架构为3通道")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 规范化处理
            ])

            # 加载 CIFAR-10 数据集
            X_train=np.array(dataset['X_train'],dtype=float).reshape(-1, imgsize, imgsize, 3)
            y_train=np.array(dataset['y_train'],dtype=int)
            X_test=np.array(dataset['X_test'],dtype=float).reshape(-1, imgsize, imgsize, 3)
            y_test=np.array(dataset['y_test'],dtype=int)# 划分数据集
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1/2, random_state=42)

            # 模拟不同的数据分布（如果需要）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)

            # 转换为张量并重塑
            X_train_tensor = torch.from_numpy(X_train).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            X_shadow_tensor = torch.from_numpy(X_shadow).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)  # 转换为 long 类型张量


    ws_printer.print("成员推理攻击：")
    criterion = nn.CrossEntropyLoss()
    batch_size=64
    epoch=10
    

    optimizer = optim.Adam(net.parameters(), lr=0.001)
    dataloader = torch.utils.data.DataLoader(
            NumpyDataset(X_train_tensor, y_train_tensor),
            batch_size=batch_size,
            shuffle=True,
            num_workers=0,
        )
    
    ws_printer.print("未使用隐私保护")
   

    clf = TorchClassifier(net, criterion, optimizer, batch_size=batch_size, epoch=epoch, device=device)
    
    # 训练模型
    clf.fit(dataloader=dataloader)
    epsilon = float('inf')  # 未使用差分隐私时，epsilon为无穷大
    ws_printer.print("epsilon:", epsilon)
    # 打印训练和测试准确率
    # 记录训练和测试准确率
    clf1 = clf.score(X_train_tensor, y_train_tensor)
    clf2 = clf.score(X_test_tensor, y_test)
    ws_printer.print("训练集准确率:", clf1, "测试集准确率:", clf2)

    # 创建影子模型和攻击模型
    def create_clf():
        _net = model().to(device)
        _optimizer = optim.Adam(_net.parameters(), lr=0.001)
        return TorchClassifier(_net, criterion, _optimizer, batch_size=64, epoch=10, device=device)
    num=len(np.unique(y_train))

    shadow_models = [create_clf() for _ in range(2)]
    attack_models = [SVC(probability=True) for _ in range(num)]

    # 初始化攻击者
    attacker = ShadowMembershipInferenceAttack(clf, shadow_models, attack_models)

    attacker.fit(X_shadow_tensor, y_shadow_tensor)

    # 执行攻击
    in_result = attacker.predict(clf.predict_proba(X_train_tensor), y_train_tensor)
    out_result = attacker.predict(clf.predict_proba(X_test_tensor), y_test)

    # 评估攻击结果
    in_label = np.ones(in_result.shape[0])
    out_label = np.zeros(out_result.shape[0])

    acc = accuracy_score(np.concatenate([in_label, out_label]), np.concatenate([in_result, out_result]))
    ws_printer.print("攻击准确率:", acc)

    result={
        "clf1":float(clf1),
        "clf2":float(clf2),
        "epsilon":float(epsilon),
        "acc":float(acc),
    }

    return result

def miad(net,isuplord,dataset,imgsize,params):
    device = torch.device("cpu") 
    channelnum=net.conv1.in_channels
    if not isuplord:
        if channelnum==1:
            ws_printer.print("检测到您的模型架构为1通道，为您选择Minst数据集进行训练")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5,), (0.5,))  # 规范化处理
            ])
            mnist_dataset = datasets.MNIST(root=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data'), train=True, download=True, transform=transform)

            X = mnist_dataset.data.numpy().reshape(-1, 28 * 28).astype("float32") / 255  # 展平并归一化
            y = mnist_dataset.targets.numpy().astype("int64")  # 保存标签为整数

            # 划分数据集
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1 / 3, random_state=42)
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1 / 2, random_state=42)

            # 模拟不同的数据分布（如需）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)
            X_train_tensor = torch.from_numpy(X_train).view(-1, 1, 28, 28).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).view(-1, 1, 28, 28).to(device).float()
            X_shadow_tensor = torch.from_numpy(X_shadow).view(-1, 1, 28, 28).to(device).float()
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)
        elif channelnum==3:
            ws_printer.print("检测到您的模型架构为3通道，为您选择cifar10数据集进行训练")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 规范化处理
            ])

            # 加载 CIFAR-10 数据集
            cifar10_dataset = datasets.CIFAR10(root=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data'), train=True, download=False, transform=transform)

            # 访问数据和标签
            X = cifar10_dataset.data.astype("float32")
            y = torch.tensor(cifar10_dataset.targets).numpy().astype("int64")
            # 划分数据集
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1 / 3, random_state=42)
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1 / 2, random_state=42)

            # 模拟不同的数据分布（如果需要）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)

            # 转换为张量并重塑
            X_train_tensor = torch.from_numpy(X_train).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            X_shadow_tensor = torch.from_numpy(X_shadow).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)  # 转换为 long 类型张量

    elif isuplord:
        if channelnum==1:
            ws_printer.print("检测到您的模型架构为1通道")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5,), (0.5,))  # 规范化处理
            ])

            X_train=np.array(dataset['X_train'],dtype=float)
            y_train=np.array(dataset['y_train'],dtype=int)
            X_test=np.array(dataset['X_test'],dtype=float)
            y_test=np.array(dataset['y_test'],dtype=int)# 划分数据集
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1/2, random_state=42)
            

            # 模拟不同的数据分布（如需）
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)
            X_train_tensor = torch.from_numpy(X_train).view(-1, 1, imgsize, imgsize).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).view(-1, 1, imgsize, imgsize).to(device).float()
            X_shadow_tensor = torch.from_numpy(X_shadow).view(-1, 1, imgsize, imgsize).to(device).float()
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)
        elif channelnum==3:
            ws_printer.print("检测到您的模型架构为3通道")
            transform = transforms.Compose([
                transforms.ToTensor(),  # 将图像转换为张量
                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 规范化处理
            ])

            # 加载 CIFAR-10 数据集
            X_train=np.array(dataset['X_train'],dtype=float).reshape(-1, imgsize, imgsize, 3)
            y_train=np.array(dataset['y_train'],dtype=int)
            X_test=np.array(dataset['X_test'],dtype=float).reshape(-1, imgsize, imgsize, 3)
            y_test=np.array(dataset['y_test'],dtype=int)# 划分数据集
            X_train, X_shadow, y_train, y_shadow = train_test_split(X_train, y_train, test_size=1/2, random_state=42)
            
            X_test = 0.5 * X_test + 0.5 * np.random.normal(size=X_test.shape)

            # 转换为张量并重塑
            X_train_tensor = torch.from_numpy(X_train).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_train_tensor = torch.from_numpy(y_train).long().to(device)  # 转换为 long 类型张量
            X_test_tensor = torch.from_numpy(X_test).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            X_shadow_tensor = torch.from_numpy(X_shadow).permute(0, 3, 1, 2).to(device).float()  # 转换为张量并重塑
            y_shadow_tensor = torch.from_numpy(y_shadow).long().to(device)  # 转换为 long 类型张量

        # 设置设备
    # 初始化模型、损失函数和优化器
    netd=model().to(device)
    criterion = nn.CrossEntropyLoss()
    batch_size=params['batch_size']
    epoch=params['epoch']
    ws_printer.print("使用隐私保护")

    optimizer = optim.Adam(netd.parameters(), lr=params['lr'])
    dataloader = torch.utils.data.DataLoader(
            NumpyDataset(X_train_tensor, y_train_tensor),
            batch_size=batch_size,
            shuffle=True,
            num_workers=4,
        )
    
    privacy_engine = PrivacyEngine()
    netd, optimizer, dataloader = privacy_engine.make_private(
        module=netd,
        optimizer=optimizer,
        data_loader=dataloader,
        noise_multiplier=0.01,
        max_grad_norm=params['max_grad_norm'],
    )

   

    clf = TorchClassifier(netd, criterion, optimizer, batch_size=batch_size, epoch=epoch, device=device)
    
    # 训练模型
    clf.fit(dataloader=dataloader)
    epsilon = privacy_engine.accountant.get_epsilon(delta=1e-5)
    print("epsilon:",epsilon)
    #打印训练和测试准确率
    clf1=clf.score(X_train_tensor, y_train_tensor)
    clf2=clf.score(X_test_tensor, y_test)
    ws_printer.print("训练集准确率:", clf1, "测试集准确率:", clf2)

    # 创建影子模型和攻击模型
    def create_clf():
        _net = model().to(device)
        _optimizer = optim.Adam(_net.parameters(), lr=params['lr'])
        return TorchClassifier(_net, criterion, _optimizer, batch_size=params['batch_size'], epoch=params['epoch'], device=device)
    num=len(np.unique(y_train_tensor))

    shadow_models = [create_clf() for _ in range(2)]
    attack_models = [SVC(probability=True) for _ in range(num)]

    # 初始化攻击者
    attacker = ShadowMembershipInferenceAttack(clf, shadow_models, attack_models)

    attacker.fit(X_shadow_tensor, y_shadow_tensor)

    # 执行攻击
    in_result = attacker.predict(clf.predict_proba(X_train_tensor), y_train_tensor)
    out_result = attacker.predict(clf.predict_proba(X_test_tensor), y_test)

    # 评估攻击结果
    in_label = np.ones(in_result.shape[0])
    out_label = np.zeros(out_result.shape[0])

    acc = accuracy_score(np.concatenate([in_label, out_label]), np.concatenate([in_result, out_result]))
    ws_printer.print("攻击准确率:", acc)

    result={
        "clf1":float(clf1),
        "clf2":float(clf2),
        "epsilon":float(epsilon),
        "acc":float(acc),
    }
    return result



