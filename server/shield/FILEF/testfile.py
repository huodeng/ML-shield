import torch
import torch.nn as nn
import torch.nn.functional as F

class model(nn.Module):
    def __init__(self):
        super().__init__()
        # 定义各层（不通过 Sequential）
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)  # 输入:3通道 输出:16通道
        self.pool = nn.MaxPool2d(kernel_size=2)                  # 下采样到16x16
        self.flatten = nn.Flatten()                              # 展平操作
        self.fc = nn.Linear(16*16*16, 10)                        # 全连接层

    def forward(self, x):
        # 手动连接各层
        x = self.conv1(x)     # [B,3,32,32] => [B,16,32,32]
        x = torch.relu(x)     # 应用激活函数
        x = self.pool(x)      # [B,16,32,32] => [B,16,16,16]
        x = self.flatten(x)   # [B,16,16,16] => [B,4096]
        x = self.fc(x)        # [B,4096] => [B,10]
        return x