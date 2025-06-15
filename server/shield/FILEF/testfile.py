import torch
import torch.nn as nn
import torch.nn.functional as F

class model(nn.Module):
    def __init__(self):
        super().__init__()
        # ������㣨��ͨ�� Sequential��
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)  # ����:3ͨ�� ���:16ͨ��
        self.pool = nn.MaxPool2d(kernel_size=2)                  # �²�����16x16
        self.flatten = nn.Flatten()                              # չƽ����
        self.fc = nn.Linear(16*16*16, 10)                        # ȫ���Ӳ�

    def forward(self, x):
        # �ֶ����Ӹ���
        x = self.conv1(x)     # [B,3,32,32] => [B,16,32,32]
        x = torch.relu(x)     # Ӧ�ü����
        x = self.pool(x)      # [B,16,32,32] => [B,16,16,16]
        x = self.flatten(x)   # [B,16,16,16] => [B,4096]
        x = self.fc(x)        # [B,4096] => [B,10]
        return x