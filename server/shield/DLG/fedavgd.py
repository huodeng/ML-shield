import copy
from abc import abstractmethod
import torch
import numpy as np

class BaseFedAPI:
    """联邦学习API的基类"""

    def __init__(self):
        pass

    @abstractmethod
    def local_train(self):
        """抽象方法，用于定义本地训练逻辑"""

    @abstractmethod
    def run(self):
        """抽象方法，用于定义整个联邦学习流程的运行逻辑"""

class FedAVGAPId(BaseFedAPI):
    """FedAVG 算法的具体实现"""

    def __init__(
        self,
        server,
        clients,
        criterion,
        local_optimizers,
        local_dataloaders,
        num_communication=1,
        local_epoch=1,
        use_gradients=True,
        custom_action=lambda x: x,
        device="cpu",
    ):
        """初始化 FedAVGAPID

        Args:
            server: 服务器对象
            clients: 客户端列表
            criterion: 损失函数
            local_optimizers: 本地优化器列表
            local_dataloaders: 本地数据加载器列表
            num_communication: 通信轮数
            local_epoch: 本地训练轮数
            use_gradients: 是否上传梯度
            custom_action: 自定义动作
            device: 设备类型
        """
        self.server = server
        self.clients = clients
        self.criterion = criterion
        self.local_optimizers = local_optimizers
        self.local_dataloaders = local_dataloaders
        self.num_communication = num_communication
        self.local_epoch = local_epoch
        self.use_gradients = use_gradients
        self.custom_action = custom_action
        self.device = device

        self.client_num = len(self.clients)

        local_dataset_sizes = [len(dataloader.dataset) for dataloader in self.local_dataloaders]
        sum_local_dataset_sizes = sum(local_dataset_sizes)
        self.server.weight = [dataset_size / sum_local_dataset_sizes for dataset_size in local_dataset_sizes]

        self.logging = {}

    def local_train(self, i):
        """执行本地训练"""
        self.logging[i] = {}  # 记录当前通信轮次的训练日志

        for client_idx in range(self.client_num):
            # 调用客户端的 local_train 方法进行本地训练
            loss_log = self.clients[client_idx].local_train(
                self.local_epoch,
                self.criterion,
                self.local_dataloaders[client_idx],
                self.local_optimizers[client_idx],
                communication_id=i,
            )
            self.logging[i][client_idx] = loss_log  # 记录当前客户端的训练损失

    def run(self):
        """运行完整的联邦学习流程"""
        self.server.force_send_model_state_dict = True  # 强制服务器发送模型状态字典
        self.server.distribute()  # 分发初始模型
        self.server.force_send_model_state_dict = False  # 恢复默认设置

        for i in range(self.num_communication):
            self.local_train(i)  # 执行本地训练
            self.server.receive(use_gradients=self.use_gradients)  # 接收客户端上传的信息
            if self.use_gradients:
                self.server.update_from_gradients()  # 根据梯度更新全局模型
            else:
                self.server.update_from_parameters()  # 根据模型参数更新全局模型
            self.server.distribute()  # 分发更新后的全局模型

            self.custom_action(self)  # 执行自定义动作

class BaseClient(torch.nn.Module):
    """联邦学习客户端的基类"""

    def __init__(self, model, user_id=0):
        """初始化客户端"""
        super(BaseClient, self).__init__()
        self.model = model  # 本地模型
        self.user_id = user_id  # 客户端ID

    def forward(self, x):
        return self.model(x)  # 前向传播

    def train(self):
        self.model.train()  # 设置模型为训练模式

    def eval(self):
        self.model.eval()  # 设置模型为评估模式

    def backward(self, loss):
        """执行反向传播"""
        loss.backward()  # 计算梯度

    @abstractmethod
    def upload(self):
        """上传本地训练信息到服务器的抽象方法"""

    @abstractmethod
    def download(self):
        """从服务器下载全局模型的抽象方法"""

    @abstractmethod
    def local_train(self):
        """本地训练的抽象方法"""

class FedAVGClientd(BaseClient):
    """FedAVG 算法的客户端实现"""

    def __init__(
        self,
        model,
        user_id=0,
        lr=0.1,
        send_gradient=True,
        optimizer_type_for_global_grad="sgd",
        server_side_update=True,
        optimizer_kwargs_for_global_grad={},
        device="cpu",
    ):
        """初始化 FedAVGClient"""
        super(FedAVGClientd, self).__init__(model, user_id=user_id)
        self.lr = lr  # 学习率
        self.send_gradient = send_gradient  # 是否上传梯度
        self.server_side_update = server_side_update  # 是否在服务器端更新模型
        self.device = device  # 设备类型

        if not self.server_side_update:
            self._setup_optimizer_for_global_grad(
                optimizer_type_for_global_grad, **optimizer_kwargs_for_global_grad
            )

        self.prev_parameters = []
        for param in self.model.parameters():
            self.prev_parameters.append(copy.deepcopy(param))  # 保存模型参数的副本

        self.initialized = False  # 是否已初始化

    def _setup_optimizer_for_global_grad(self, optimizer_type, **kwargs):
        """初始化优化器"""
        if optimizer_type == "sgd":
            self.optimizer_for_global_grad = SGDFLOptimizer(
                self.model.parameters(), lr=self.lr, **kwargs
            )
        elif optimizer_type == "adam":
            self.optimizer_for_global_grad = AdamFLOptimizer(
                self.model.parameters(), lr=self.lr, **kwargs
            )
        elif optimizer_type == "none":
            self.optimizer_for_global_grad = None
        else:
            raise NotImplementedError(
                "不支持的优化器类型，可选类型为 `sgd`, `adam`, 或 `none`."
            )

    def upload(self):
        """上传本地模型信息"""
        if self.send_gradient:
            return self.upload_gradients()  # 上传梯度
        else:
            return self.upload_parameters()  # 上传模型参数

    def upload_parameters(self):
        """上传模型参数"""
        return self.model.state_dict()

    def upload_gradients(self):
        """上传梯度"""
        gradients = []
        for param, prev_param in zip(self.model.parameters(), self.prev_parameters):
            gradients.append((prev_param - param) / self.lr)  # 计算梯度
        return gradients

    def revert(self):
        """恢复模型到上一个全局模型状态"""
        for param, prev_param in zip(self.model.parameters(), self.prev_parameters):
            if param is not None:
                param = prev_param  # 恢复模型参数

    def download(self, new_global_model):
        """下载新的全局模型"""
        if self.server_side_update or (not self.initialized):
            # 更新模型状态字典
            new_state_dict = {k.replace('conv', '_module.conv'): v for k, v in new_global_model.items()}
            new_state_dict = {k.replace('fc', '_module.fc'): v for k, v in new_state_dict.items()}
            self.model.load_state_dict(new_state_dict)
        else:
            self.revert()  # 恢复模型参数
            self.optimizer_for_global_grad.step(new_global_model)  # 使用全局梯度更新模型

        if not self.initialized:
            self.initialized = True

        self.prev_parameters = []
        for param in self.model.parameters():
            self.prev_parameters.append(copy.deepcopy(param))  # 更新模型参数副本

    def local_train(
        self, local_epoch, criterion, trainloader, optimizer, communication_id=0
    ):
        """执行本地训练"""
        loss_log = []

        for _ in range(local_epoch):
            running_loss = 0.0
            running_data_num = 0
            for _, data in enumerate(trainloader, 0):
                inputs, labels = data
                inputs = inputs.to(self.device)
                labels = labels.to(self.device)

                optimizer.zero_grad()  # 清零梯度
                self.zero_grad()  # 清零模型梯度

                outputs = self(inputs)  # 前向传播
                loss = criterion(outputs, labels)  # 计算损失

                loss.backward()  # 反向传播
                optimizer.step()  # 更新模型参数

                running_loss += loss.item()
                running_data_num += inputs.shape[0]

            loss_log.append(running_loss / running_data_num)

        return loss_log

class BaseFLOptimizer:
    """联邦学习优化器的基类"""

    def __init__(self, parameters, lr=0.01, weight_decay=0.0001):
        """初始化优化器"""
        self.parameters = list(parameters)  # 模型参数
        self.lr = lr  # 学习率
        self.weight_decay = weight_decay  # 权重衰减系数
        self.t = 1  # 迭代次数

    @abstractmethod
    def step(self, grads):
        """更新模型参数的抽象方法"""

class SGDFLOptimizer(BaseFLOptimizer):
    """SGD 优化器"""

    def __init__(self, parameters, lr=0.01, weight_decay=0.0000):
        """初始化 SGD 优化器"""
        super().__init__(parameters, lr=lr, weight_decay=weight_decay)

    def step(self, grads):
        """使用梯度更新模型参数"""
        for param, grad in zip(self.parameters, grads):
            if self.weight_decay == 0.0:
                param.data -= self.lr * grad
            else:
                param.data -= self.lr * (grad + self.weight_decay * param.data)
        self.t += 1

class AdamFLOptimizer(BaseFLOptimizer):
    """Adam 优化器"""

    def __init__(
        self,
        parameters,
        lr=0.01,
        weight_decay=0.0001,
        beta1=0.9,
        beta2=0.999,
        epsilon=1e-8,
    ):
        """初始化 Adam 优化器"""
        super().__init__(parameters, lr=lr, weight_decay=weight_decay)
        self.beta1 = beta1  # 一阶矩估计的指数衰减率
        self.beta2 = beta2  # 二阶矩估计的指数衰减率
        self.epsilon = epsilon  # 防止除以零的平滑项

        self.m = [torch.zeros_like(param.data) for param in self.parameters]  # 一阶矩估计
        self.v = [torch.zeros_like(param.data) for param in self.parameters]  # 二阶矩估计

    def step(self, grads):
        """使用梯度更新模型参数"""
        for i, (param, grad) in enumerate(zip(self.parameters, grads)):
            self.m[i] = self.beta1 * self.m[i] + (1 - self.beta1) * grad
            self.v[i] = self.beta2 * self.v[i] + (1 - self.beta2) * (grad * grad)
            m_hat = self.m[i] / (1 - self.beta1 ** self.t)
            v_hat = self.v[i] / (1 - self.beta2 ** self.t)
            param.data -= self.lr * (
                m_hat / torch.sqrt(v_hat) + self.weight_decay * param.data
            )
        self.t += 1

class BaseServer(torch.nn.Module):
    """联邦学习服务器的基类"""

    def __init__(self, clients, server_model, server_id=0):
        """初始化服务器"""
        super(BaseServer, self).__init__()
        self.clients = clients  # 客户端列表
        self.server_id = server_id  # 服务器ID
        self.server_model = server_model  # 全局模型
        self.num_clients = len(clients)  # 客户端数量

    def forward(self, x):
        return self.server_model(x)  # 前向传播

    def train(self):
        self.server_model.train()  # 设置模型为训练模式

    def eval(self):
        self.server_model.eval()  # 设置模型为评估模式

    @abstractmethod
    def action(self):
        """执行通信轮次的常规操作的抽象方法"""

    @abstractmethod
    def update(self):
        """更新全局模型的抽象方法"""

    @abstractmethod
    def distribute(self):
        """分发全局模型到客户端的抽象方法"""

class FedAVGServerd(BaseServer):
    """FedAVG 算法的服务器实现"""

    def __init__(
        self,
        clients,
        global_model,
        server_id=0,
        lr=0.1,
        optimizer_type="sgd",
        server_side_update=True,
        optimizer_kwargs={},
        device="cpu",
    ):
        """初始化 FedAVGServer"""
        super(FedAVGServerd, self).__init__(clients, global_model, server_id=server_id)
        self.lr = lr  # 学习率
        self._setup_optimizer(optimizer_type, **optimizer_kwargs)  # 初始化优化器
        self.server_side_update = server_side_update  # 是否在服务器端更新模型
        self.device = device  # 设备类型
        self.uploaded_gradients = []  # 上传的梯度列表

        self.force_send_model_state_dict = True  # 强制发送模型状态字典
        self.weight = np.ones(self.num_clients) / self.num_clients  # 客户端权重

    def _setup_optimizer(self, optimizer_type, **kwargs):
        """初始化优化器"""
        if optimizer_type == "sgd":
            self.optimizer = SGDFLOptimizer(
                self.server_model.parameters(), lr=self.lr, **kwargs
            )
        elif optimizer_type == "adam":
            self.optimizer = AdamFLOptimizer(
                self.server_model.parameters(), lr=self.lr, **kwargs
            )
        elif optimizer_type == "none":
            self.optimizer = None
        else:
            raise NotImplementedError(
                "不支持的优化器类型，可选类型为 `sgd`, `adam`, 或 `none`."
            )

    def action(self, use_gradients=True):
        """执行通信轮次的常规操作"""
        self.receive(use_gradients)  # 接收客户端上传的信息
        self.update(use_gradients)  # 更新全局模型
        self.distribute()  # 分发全局模型

    def receive(self, use_gradients=True):
        """接收客户端上传的信息"""
        if use_gradients:
            self.receive_local_gradients()  # 接收梯度
        else:
            self.receive_local_parameters()  # 接收模型参数

    def update(self, use_gradients=True):
        """更新全局模型"""
        if use_gradients:
            self.update_from_gradients()  # 根据梯度更新
        else:
            self.update_from_parameters()  # 根据模型参数更新

    def _preprocess_local_gradients(self, uploaded_grad):
        """预处理上传的梯度"""
        return uploaded_grad

    def receive_local_gradients(self):
        """接收客户端上传的梯度"""
        self.uploaded_gradients = [
            self._preprocess_local_gradients(c.upload_gradients()) for c in self.clients
        ]

    def receive_local_parameters(self):
        """接收客户端上传的模型参数"""
        self.uploaded_parameters = [c.upload_parameters() for c in self.clients]

    def update_from_gradients(self):
        """根据梯度更新全局模型"""
        self.aggregated_gradients = [
            torch.zeros_like(params) for params in self.server_model.parameters()
        ]
        len_gradients = len(self.aggregated_gradients)

        for i, gradients in enumerate(self.uploaded_gradients):
            for gradient_id in range(len_gradients):
                self.aggregated_gradients[gradient_id] = (
                    gradients[gradient_id] * self.weight[i]
                    + self.aggregated_gradients[gradient_id]
                )

        if self.server_side_update:
            self.optimizer.step(self.aggregated_gradients)  # 使用优化器更新模型

    def update_from_parameters(self):
        """根据模型参数更新全局模型"""
        averaged_params = self.uploaded_parameters[0]

        for k in averaged_params.keys():
            for i in range(0, len(self.uploaded_parameters)):
                local_model_params = self.uploaded_parameters[i]
                w = self.weight[i]
                if i == 0:
                    averaged_params[k] = local_model_params[k] * w
                else:
                    averaged_params[k] += local_model_params[k] * w

        self.server_model.load_state_dict(averaged_params)  # 加载平均后的模型参数

    def distribute(self):
        """分发全局模型到客户端"""
        for client in self.clients:
            if type(client) != int:
                if self.server_side_update or self.force_send_model_state_dict:
                    client.download(self.server_model.state_dict())
                else:
                    client.download(self.aggregated_gradients)