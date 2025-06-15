import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import numpy as np
from PIL import Image
import random
import torchvision
import os
from opacus import *
from FILEF.testfile import model

class MemoryPoisonDataset(Dataset):
    def __init__(self, x_data, y_data, transform=None, 
                 trigger_path='shield/BACKDOOR/triggers/trigger_white.png', 
                 trigger_size=5, trigger_label=0, poison_rate=0.1,channels=1):
        self.images = x_data
        self.labels = y_data.copy()  # 创建标签副本以避免修改原始数据
        self.transform = transform
        self.trigger_label = trigger_label
        self.poison_rate = poison_rate
        
        # 自动检测图像模式
        self.channels = channels
        self.mode = 'L' if self.channels == 1 else 'RGB'
        self.trigger = Image.open(trigger_path).convert(self.mode)
        self.trigger = self.trigger.resize((trigger_size, trigger_size))
        self.trigger_size = trigger_size
        
        # 生成投毒索引并修改标签
        num_samples = len(self.images)
        self.poi_indices = random.sample(range(num_samples), int(num_samples * poison_rate))
        self.labels[self.poi_indices] = trigger_label  # 仅修改投毒样本标签

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_array = self.images[idx]
        label = self.labels[idx]
        
        # 转换为PIL图像（自动处理维度）
        if self.channels == 1:
            img = Image.fromarray(img_array.astype('uint8'), mode='L')
        else:
            img = Image.fromarray(img_array.astype('uint8'), mode='RGB')
        
        # 投毒处理
        if idx in self.poi_indices:
            img.paste(self.trigger, (img.width - self.trigger_size, img.height - self.trigger_size))
        
        if self.transform:
            img = self.transform(img)
            
        return img, torch.tensor(label, dtype=torch.long)

def train_on_memory_data(
    x_train, y_train, x_test, y_test, 
    trigger_path, channel, trigger_size=5, trigger_label=0,
    train_poison_rate=0.1, test_poison_rate=1.0,
    batch_size=64, epochs=30, lr=0.01,
    device='cuda' if torch.cuda.is_available() else 'cpu', seed=42
):
    # 固定随机种子
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    
    # 自动识别分类数
    num_classes = len(np.unique(y_train))
    print(f"检测到分类数: {num_classes}")

    # 数据预处理（动态适配通道数）
    transform = torchvision.transforms.Compose([
        torchvision.transforms.ToTensor(),
        torchvision.transforms.Normalize(mean=[0.5]*channel, std=[0.5]*channel)
    ])
    
    # 创建训练集和两个测试集（干净+投毒）
    train_dataset = MemoryPoisonDataset(
        x_train, y_train, transform,
        trigger_path=trigger_path,
        trigger_size=trigger_size,
        trigger_label=trigger_label,
        poison_rate=train_poison_rate,
        channels=channel
    )
    
    # 测试集（干净，不投毒）
    test_clean_dataset = MemoryPoisonDataset(
        x_test, y_test, transform,
        trigger_path=trigger_path,
        trigger_size=trigger_size,
        trigger_label=trigger_label,
        poison_rate=0.0 , # 投毒比例为0
        channels=channel
    )
    
    # 测试集（投毒）
    test_poison_dataset = MemoryPoisonDataset(
        x_test, y_test, transform,
        trigger_path=trigger_path,
        trigger_size=trigger_size,
        trigger_label=trigger_label,
        poison_rate=test_poison_rate,
        channels=channel
    )
    
    # 数据加载器
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_clean_loader = DataLoader(test_clean_dataset, batch_size=batch_size)
    test_poison_loader = DataLoader(test_poison_dataset, batch_size=batch_size)

    # 初始化模型
    model1 = model().to(device)
    optimizer = torch.optim.SGD(model1.parameters(), lr=lr, momentum=0.9)
    criterion = nn.CrossEntropyLoss()
    privacy_engine = PrivacyEngine()
    model1, optimizer, train_loader = privacy_engine.make_private(
        module=model1,
        optimizer=optimizer,
        data_loader=train_loader,
        noise_multiplier=1.1,
        max_grad_norm=1.0,
    )

    # 训练循环
    print(f"训练数据量: {len(train_dataset)} | 投毒比例: {train_poison_rate*100}%")
    print(f"干净测试量: {len(test_clean_dataset)} | 投毒测试量: {len(test_poison_dataset)}")
    
    for epoch in range(epochs):
        # 训练阶段
        model1.train()
        train_loss, correct, total = 0.0, 0, 0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model1(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            _, predicted = outputs.max(1)
            correct += predicted.eq(labels).sum().item()
            total += labels.size(0)
        
        # 评估阶段
        model1.eval()
        clean_correct, poison_correct = 0, 0
        
        # 干净测试集评估
        with torch.no_grad():
            for inputs, labels in test_clean_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model1(inputs)
                _, predicted = outputs.max(1)
                clean_correct += predicted.eq(labels).sum().item()
        
        # 投毒测试集评估
        with torch.no_grad():
            for inputs, _ in test_poison_loader:
                inputs = inputs.to(device)
                outputs = model1(inputs)
                _, predicted = outputs.max(1)
                poison_correct += predicted.eq(torch.tensor(trigger_label, device=device)).sum().item()
        
        # 计算指标
        train_acc = 100. * correct / total
        clean_acc = 100. * clean_correct / len(test_clean_dataset)
        asr = 100. * poison_correct / len(test_poison_dataset)
        
        # 打印日志
        print(f"Epoch {epoch+1:03d}/{epochs} | "
              f"Loss: {train_loss/len(train_loader):.4f} | "
              f"训练准确率: {train_acc:.2f}% | "
              f"测试准确率: {clean_acc:.2f}% | "
              f"攻击成功率: {asr:.2f}%")
    
    # 保存模型
    os.makedirs("shield/BACKDOOR/checkpointss", exist_ok=True)
    torch.save(model1.state_dict(), "shield/BACKDOOR/checkpointss/backdoor_model.pth")
    print("模型已保存至 shield/BACKDOOR/checkpointss/backdoor_model.pth")

def custombackdoord(net, dataset,imgsize):
    print("添加隐私保护")
    channel=net.conv1.in_channels
    x_train = np.array(dataset['X_train'], dtype=np.uint8).reshape(-1, imgsize, imgsize, channel)    
    y_train = np.array(dataset['y_train'], dtype=int)
    x_test = np.array(dataset['X_test'], dtype=np.uint8).reshape(-1, imgsize, imgsize, channel)    
    y_test = np.array(dataset['y_test'], dtype=int)
    
    # 执行训练
    train_on_memory_data(
        x_train, y_train, x_test, y_test,
        trigger_path='shield/BACKDOOR/triggers/trigger_white.png',
        channel=channel,  # 明确单通道
        trigger_label=0,
        train_poison_rate=0.02,
        test_poison_rate=1.0,
        epochs=30,
        batch_size=64
    )