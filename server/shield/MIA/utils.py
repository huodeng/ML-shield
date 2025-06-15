import random
import numpy as np
import torch
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.metrics import accuracy_score
from torch.utils.data.dataset import Dataset





def try_gpu(e):
    """将给定的 tensor 移动到 GPU（如果可用）

    Args:
        e: (torch.Tensor)

    Returns:
        e: (torch.Tensor)
    """
    if torch.cuda.is_available():  # 检查 GPU 是否可用
        return e.cuda()  # 移动到 GPU
    return e  # 返回原 tensor


def worker_init_fn(worker_id):
    """初始化 worker 的随机种子，确保数据加载器的随机性可复现

    Args:
        worker_id: worker 的唯一标识符
    """
    worker_seed = torch.initial_seed() % 2**32  # 计算 worker 的随机种子
    np.random.seed(worker_seed)  # 设置 numpy 随机种子
    random.seed(worker_seed)  # 设置 random 随机种子


class RoundDecimal(torch.autograd.Function):
    """自定义的张量操作类，用于实现十进制舍入

    这个类继承自 `torch.autograd.Function`，实现了自定义的前向和反向传播逻辑
    """

    @staticmethod
    def forward(ctx, input, n_digits):
        """前向传播逻辑

        Args:
            ctx: 上下文对象，用于保存反向传播所需的信息
            input: 输入张量
            n_digits: 要保留的有效数字位数

        Returns:
            舍入后的张量
        """
        ctx.save_for_backward(input)  # 保存输入张量以供反向传播使用
        ctx.n_digits = n_digits  # 保存有效数字位数
        return torch.round(input * 10**n_digits) / (10**n_digits)  # 舍入输入张量

    @staticmethod
    def backward(ctx, grad_output):
        """反向传播逻辑

        Args:
            ctx: 上下文对象，包含前向传播时保存的信息
            grad_output: 损失函数关于输出的梯度

        Returns:
            舍入后的梯度张量
        """
        grad_input = grad_output.clone()  # 复制梯度张量
        return torch.round(grad_input * 10**ctx.n_digits) / (10**ctx.n_digits), None  # 舍入梯度张量


torch_round_x_decimal = RoundDecimal.apply  # 创建自定义函数的可调用对象


class NumpyDataset(Dataset):
    """将 numpy 数组转换为 PyTorch Dataset 的工具类

    这个类继承自 `torch.utils.data.Dataset`，支持加载 numpy 数组并转换为 PyTorch 的张量格式
    """

    def __init__(self, x, y=None, transform=None, return_idx=False):
        """初始化 NumpyDataset

        Args:
            x: 输入数据（numpy 数组）
            y: 标签数据（numpy 数组），可选
            transform: 数据预处理操作，可选
            return_idx: 是否返回样本的索引，可选
        """
        self.x = x  # 输入数据
        self.y = y  # 标签数据
        self.transform = transform  # 数据预处理操作
        self.return_idx = return_idx  # 是否返回样本的索引

    def __getitem__(self, index):
        """获取指定索引处的样本"""
        x = self.x[index]  # 获取输入数据
        if self.y is not None:
            y = self.y[index]  # 获取标签数据

        if self.transform is not None:
            x = self.transform(x)  # 应用数据预处理操作

        if not self.return_idx:
            if self.y is not None:
                return x, y  # 返回输入数据和标签
            else:
                return x  # 返回输入数据
        else:
            if self.y is not None:
                return index, x, y  # 返回样本索引、输入数据和标签
            else:
                return index, x  # 返回样本索引和输入数据

    def __len__(self):
        """获取样本总数"""
        return len(self.x)  # 返回输入数据的长度


class TorchClassifier(BaseEstimator, ClassifierMixin):
    """基于 PyTorch 的分类器

    这个类实现了 Scikit-Learn 的分类器 API，支持模型训练、预测和评估
    """

    def __init__(
        self,
        model,
        criterion,
        optimizer,
        epoch=1,
        device="cpu",
        batch_size=1,
        shuffle=True,
        num_workers=2,
    ):
        """初始化 TorchClassifier

        Args:
            model: PyTorch 模型
            criterion: 损失函数
            optimizer: 优化器
            epoch: 训练的迭代次数
            device: 训练设备（如 "cpu" 或 "cuda"）
            batch_size: 批次大小
            shuffle: 是否在每个 epoch 开始时打乱数据
            num_workers: 数据加载器使用的线程数
        """
        self.model = model  # 模型
        self.criterion = criterion  # 损失函数
        self.optimizer = optimizer  # 优化器
        self.epoch = epoch  # 训练轮数
        self.device = device  # 训练设备
        self.batch_size = batch_size  # 批次大小
        self.shuffle = shuffle  # 是否打乱数据
        self.num_workers = num_workers  # 数据加载器线程数

    def fit(self, dataloader):
        """训练模型

        Args:
            dataloader: PyTorch 数据加载器，用于提供训练数据
        """
        self.model.train()  # 设置模型为训练模式
        for _ in range(self.epoch):  # 迭代训练轮数
            for x_batch, y_batch in dataloader:  # 遍历数据批次
                x_batch = x_batch.to(self.device)  # 将输入数据移动到指定设备
                y_batch = y_batch.to(self.device)  # 将标签数据移动到指定设备
                self.optimizer.zero_grad()  # 清零梯度
                y_pred = self.model(x_batch)  # 前向传播
                loss = self.criterion(y_pred, y_batch)  # 计算损失
                loss.backward()  # 反向传播
                self.optimizer.step()  # 更新模型参数
        return self  # 返回训练好的模型

    def fit1(self, X, y):
        """用 numpy 数组作为输入训练模型

        Args:
            X: 输入数据（numpy 数组）
            y: 标签数据（numpy 数组）
        """
        dataloader = torch.utils.data.DataLoader(
            NumpyDataset(X, y),
            batch_size=self.batch_size,
            shuffle=self.shuffle,
            num_workers=self.num_workers,
        )  # 创建数据加载器
        self.model.train()  # 设置模型为训练模式
        for _ in range(self.epoch):  # 迭代训练轮数
            for x_batch, y_batch in dataloader:  # 遍历数据批次
                x_batch = x_batch.to(self.device)  # 将输入数据移动到指定设备
                y_batch = y_batch.to(self.device)  # 将标签数据移动到指定设备
                self.optimizer.zero_grad()  # 清零梯度
                y_pred = self.model(x_batch)  # 前向传播
                loss = self.criterion(y_pred, y_batch)  # 计算损失
                loss.backward()  # 反向传播
                self.optimizer.step()  # 更新模型参数
        return self  # 返回训练好的模型

    def predict_proba(self, X):
        """预测样本属于各个类别的概率

        Args:
            X: 输入数据（numpy 数组）

        Returns:
            预测的概率矩阵
        """
        dataloader = torch.utils.data.DataLoader(
            NumpyDataset(X),
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
        )  # 创建数据加载器
        self.model.eval()  # 设置模型为评估模式
        y_pred_list = []  # 保存预测结果
        with torch.no_grad():  # 关闭梯度计算
            for x_batch in dataloader:  # 遍历数据批次
                x_batch = x_batch.to(self.device)  # 将输入数据移动到指定设备
                y_pred = self.model(x_batch)  # 前向传播
                y_pred_list.append(y_pred)  # 保存预测结果
        return torch.cat(y_pred_list).cpu().detach().numpy()  # 合并预测结果并转换为 numpy 数组

    def predict(self, X):
        """预测样本的类别标签

        Args:
            X: 输入数据（numpy 数组）

        Returns:
            预测的类别标签
        """
        return np.argmax(self.predict_proba(X), axis=1)  # 返回概率最大的类别标签

    def score(self, X, y):
        """计算模型的准确率

        Args:
            X: 输入数据（numpy 数组）
            y: 真实的类别标签（numpy 数组）

        Returns:
            模型的准确率
        """
        # 确保预测结果和真实标签都是numpy数组
        predictions = self.predict(X)
        if isinstance(y, torch.Tensor):
            y = y.cpu().detach().numpy()
        return accuracy_score(predictions, y)  # 返回准确率
