# 定义网络模型
import torch.nn as nn
import torch.nn.functional as F
class M(nn.Module):
    def __init__(self):
        super(M, self).__init__()
        self.conv1 = nn.Conv2d(1, 6, (5, 5), (1, 1), 2)
        self.conv2 = nn.Conv2d(6, 16, (5, 5))
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)
    def forward(self, x):
        x = self.conv1(x)
        x = F.relu(x)
        x = F.max_pool2d(x, 2, 2)
        x = self.conv2(x)
        x = F.relu(x)
        x = F.max_pool2d(x, 2, 2)
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        x = F.relu(x)
        x = self.fc3(x) # 计算分类后每个数字的概率值
        return F.log_softmax(x, dim=1)

