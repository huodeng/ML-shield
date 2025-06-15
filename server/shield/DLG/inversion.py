from abc import ABCMeta, abstractmethod

import torch
import torch.nn as nn

from .regularization import (
    bn_regularizer,
    group_consistency,
    label_matching,
    total_variance,
)
from .utils2 import _setup_attack, _generate_fake_gradients

class BaseManager(metaclass=ABCMeta):

    """抽象类，用于 Manager API"""

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    @abstractmethod
    def attach(self, cls):
        pass

class BaseAttacker(metaclass=ABCMeta):

    def __init__(self, target_model):
        """对抗攻击的基类

        Args:
            target_model: 目标模型
        """
        self.target_model = target_model

    @abstractmethod
    def attack(self):
        pass

def _default_gradinent_inversion_attack_on_receive(self):
    tmp_result = []
    for s in range(self.num_trial_per_communication):
        self.reset_seed(s)
        try:
            tmp_result.append(self.attack())
        except OverflowError:
            continue
    self.attack_results.append(tmp_result)


def attach_gradient_inversion_attack_to_server(
    cls,
    x_shape,
    attack_function_on_receive=_default_gradinent_inversion_attack_on_receive,
    num_trial_per_communication=1,
    target_client_id=0,
    **gradinvattack_kwargs,
):
    """为 Server 类添加梯度反转攻击

    Args:
        x_shape: 输入形状
        attack_function_on_receive: 在接收后执行攻击的函数
        num_trial_per_communication: 每次通信的攻击试验次数
        target_client_id: 目标客户端ID
        gradinvattack_kwargs: GradientInversionAttack 的参数

    Returns:
        GradientInversionServerWrapper: 包装后的 Server 类
    """

    class GradientInversionServerWrapper(cls):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.target_client_id = target_client_id
            self.num_trial_per_communication = num_trial_per_communication
            self.attacker = GradientInversionAttack(
                self.server_model, x_shape, **gradinvattack_kwargs
            )

            self.attack_results = []

        def change_target_client_id(self, target_client_id):
            self.target_client_id = target_client_id
            self.attacker.target_model = self.clients[self.target_client_id]

        def receive(self, *args, **kwargs):
            super().receive(*args, **kwargs)
            attack_function_on_receive(self)

        def attack(self, **kwargs):
            received_gradient = self.uploaded_gradients[self.target_client_id]
            received_gradient = [cg.detach() for cg in received_gradient]
            return self.attacker.attack(received_gradient, **kwargs)

        def group_attack(self, **kwargs):
            received_gradient = self.uploaded_gradients[self.target_client_id]
            received_gradient = [cg.detach() for cg in received_gradient]
            return self.attacker.group_attack(received_gradient, **kwargs)

        def reset_seed(self, seed):
            self.attacker.reset_seed(seed)

    return GradientInversionServerWrapper


class GradientInversionAttackServerManager(BaseManager):
    """梯度反转攻击的管理器"""

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def attach(self, cls):
        """为指定的类包装梯度反转攻击

        Returns:
            GradientInversionServerWrapper: 包装后的类
        """
        return attach_gradient_inversion_attack_to_server(
            cls, *self.args, **self.kwargs
        )

def l2(fake_gradients, received_gradients, gradient_ignore_pos):
    """计算假梯度和接收梯度的 L2 距离

    Args:
        fake_gradients: 假梯度
        received_gradients: 接收的梯度
        gradient_ignore_pos: 忽略计算的梯度位置

    Returns:
        L2 距离
    """
    distance = 0
    for i, (f_g, c_g) in enumerate(zip(fake_gradients, received_gradients)):
        if i not in gradient_ignore_pos:
            distance += ((f_g - c_g) ** 2).sum()
    return distance

def cossim(fake_gradients, received_gradients, gradient_ignore_pos):
    """计算假梯度和接收梯度的余弦相似度

    Args:
        fake_gradients: 假梯度
        received_gradients: 接收的梯度
        gradient_ignore_pos: 忽略计算的梯度位置

    Returns:
        余弦相似度
    """
    distance = 0
    pnorm_0 = 0
    pnorm_1 = 0
    for i, (f_g, c_g) in enumerate(zip(fake_gradients, received_gradients)):
        if i not in gradient_ignore_pos:
            pnorm_0 += f_g.pow(2).sum()
            pnorm_1 += c_g.pow(2).sum()
            distance += (f_g * c_g).sum()
    distance = 1 - distance / pnorm_0.sqrt() / pnorm_1.sqrt()
    return distance

class GradientInversionAttack(BaseAttacker):
    """通用梯度反转攻击类

    模型反转攻击基于梯度，可以表示为：
    x* = argmin_x' L_grad(x', W, delta_W) + R_aux(x')
    其中，X' 是重建的图像。攻击者试图找到图像，使它们在给定模型参数 W 下的梯度与秘密图像的梯度 delta_W 相似。

    Attributes:
        target_model: 目标模型
        x_shape: 输入形状
        y_shape: 输出形状
        optimize_label: 是否优化标签
        pos_of_final_fc_layer: 最终全连接层梯度的位置
        num_iteration: 优化的迭代次数
        optimizer_class: 优化器类
        lossfunc: 损失函数
        distancefunc: 梯度距离函数
        tv_reg_coef: 总方差正则化系数
        lm_reg_coef: 标签匹配正则化系数
        l2_reg_coef: L2 正则化系数
        bn_reg_coef: 批量归一化正则化系数
        gc_reg_coef: 组一致性正则化系数
        bn_reg_layers: 批量归一化层
        bn_reg_layer_inputs: 提取的批量归一化层输入
        custom_reg_func: 自定义正则化函数
        custom_reg_coef: 自定义正则化函数的系数
        custom_generate_fake_grad_fn: 自定义生成假梯度的函数
        device: 设备类型
        log_interval: 日志记录间隔
        save_loss: 是否保存损失
        seed: 随机种子
        group_num: 组大小
        group_seed: 组成员的随机种子
        early_stopping: 提前停止的条件
    """

    def __init__(
        self,
        target_model,
        x_shape,
        y_shape=None,
        optimize_label=True,
        gradient_ignore_pos=[],
        pos_of_final_fc_layer=-2,
        num_iteration=100,
        optimizer_class=torch.optim.LBFGS,
        optimizername=None,
        lossfunc=nn.CrossEntropyLoss(),
        distancefunc=l2,
        distancename=None,
        tv_reg_coef=0.0,
        lm_reg_coef=0.0,
        l2_reg_coef=0.0,
        bn_reg_coef=0.0,
        gc_reg_coef=0.0,
        bn_reg_layers=[],
        custom_reg_func=None,
        custom_reg_coef=0.0,
        custom_generate_fake_grad_fn=None,
        device="cpu",
        log_interval=10,
        save_loss=True,
        seed=0,
        group_num=5,
        group_seed=None,
        early_stopping=50,
        clamp_range=None,
        **kwargs,
    ):
        """初始化 GradientInversionAttack 类"""
        super().__init__(target_model)
        self.x_shape = x_shape
        self.y_shape = (
            list(target_model.parameters())[-1].shape[0] if y_shape is None else y_shape
        )

        self.optimize_label = optimize_label
        self.gradient_ignore_pos = gradient_ignore_pos
        self.pos_of_final_fc_layer = pos_of_final_fc_layer

        self.num_iteration = num_iteration
        self.lossfunc = lossfunc
        self.distancefunc = distancefunc
        self._setup_distancefunc(distancename)
        self.optimizer_class = optimizer_class
        self._setup_optimizer_class(optimizername)

        self.tv_reg_coef = tv_reg_coef
        self.lm_reg_coef = lm_reg_coef
        self.l2_reg_coef = l2_reg_coef
        self.bn_reg_coef = bn_reg_coef
        self.gc_reg_coef = gc_reg_coef

        self.bn_reg_layers = bn_reg_layers
        self.bn_reg_layer_inputs = {}
        for i, bn_layer in enumerate(self.bn_reg_layers):
            bn_layer.register_forward_hook(self._get_hook_for_input(i))

        self.custom_reg_func = custom_reg_func
        self.custom_reg_coef = custom_reg_coef

        self.custom_generate_fake_grad_fn = custom_generate_fake_grad_fn

        self.device = device
        self.log_interval = log_interval
        self.save_loss = save_loss
        self.seed = seed

        self.group_num = group_num
        self.group_seed = list(range(group_num)) if group_seed is None else group_seed

        self.early_stopping = early_stopping
        self.clamp_range = clamp_range

        self.kwargs = kwargs

        torch.manual_seed(seed)

    def _setup_distancefunc(self, distancename):
        """根据名称设置距离函数"""
        if distancename is None:
            return
        elif distancename == "l2":
            self.distancefunc = l2
        elif distancename == "cossim":
            self.distancefunc = cossim
        else:
            raise ValueError(f"{distancename} 是无效的距离函数名称")

    def _setup_optimizer_class(self, optimizername):
        """根据名称设置优化器类"""
        if optimizername is None:
            return
        elif optimizername == "LBFGS":
            self.optimizer_class = torch.optim.LBFGS
        elif optimizername == "SGD":
            self.optimizer_class = torch.optim.SGD
        elif optimizername == "Adam":
            self.optimizer_class = torch.optim.Adam
        else:
            raise ValueError(f"{optimizername} 是无效的优化器名称")

    def _get_hook_for_input(self, name):
        """返回提取层输入的钩子函数"""

        def hook(model, inp, output):
            self.bn_reg_layer_inputs[name] = inp[0]

        return hook

    def _calc_regularization_term(
        self, fake_x, fake_pred, fake_label, group_fake_x, received_gradients
    ):
        """计算正则化项

        Args:
            fake_x: 重建的图像
            fake_pred: 重建图像的预测值
            fake_label: 重建图像的标签
            group_fake_x: 组成员的假图像
            received_gradients: 接收的梯度

        Returns:
            正则化项的值
        """
        reg_term = 0
        if self.tv_reg_coef != 0:
            reg_term += self.tv_reg_coef * total_variance(fake_x)
        if self.lm_reg_coef != 0:
            reg_term += self.lm_reg_coef * label_matching(fake_pred, fake_label)
        if self.l2_reg_coef != 0:
            reg_term += self.l2_reg_coef * torch.norm(fake_x, p=2)
        if self.bn_reg_coef != 0:
            reg_term += self.bn_reg_coef * bn_regularizer(
                self.bn_reg_layer_inputs, self.bn_reg_layers
            )
        if group_fake_x is not None and self.gc_reg_coef != 0:
            reg_term += self.gc_reg_coef * group_consistency(fake_x, group_fake_x)
        if self.custom_reg_func is not None and self.custom_reg_coef != 0:
            context = {
                "attacker": self,
                "fake_x": fake_x,
                "fake_label": fake_label,
                "received_gradients": received_gradients,
                "group_fake_x": group_fake_x,
            }
            reg_term += self.custom_reg_coef * self.custom_reg_func(context)

        return reg_term

    def _setup_closure(
        self, optimizer, fake_x, fake_label, received_gradients, group_fake_x=None
    ):
        """设置优化器的闭包函数

        Args:
            optimizer: 优化器实例
            fake_x: 重建的图像
            fake_label: 重建图像的标签
            received_gradients: 接收的梯度
            group_fake_x: 组成员的假图像

        Returns:
            闭包函数
        """

        def closure():
            optimizer.zero_grad()
            if self.custom_generate_fake_grad_fn is None:
                fake_pred, fake_gradients = _generate_fake_gradients(
                    self.target_model,
                    self.lossfunc,
                    self.optimize_label,
                    fake_x,
                    fake_label,
                )
            else:
                fake_pred, fake_gradients = self.custom_generate_fake_grad_fn(
                    self, fake_x, fake_label
                )
            distance = self.distancefunc(
                fake_gradients, received_gradients, self.gradient_ignore_pos
            )
            distance += self._calc_regularization_term(
                fake_x,
                fake_pred,
                fake_label,
                group_fake_x,
                received_gradients,
            )
            distance_val = distance.item()
            distance.backward(retain_graph=False)

            return distance_val

        return closure

    def reset_seed(self, seed):
        """重置随机种子"""
        self.seed = seed
        torch.manual_seed(seed)

    def _update_logging(self, i, distance, best_iteration, best_distance):
        """更新日志"""
        if self.save_loss:
            self.log_loss.append(distance)
        if self.log_interval != 0 and i % self.log_interval == 0:
            print(
                f"iter={i}: {distance}, (best_iter={best_iteration}: {best_distance})"
            )

    def attack(
        self,
        received_gradients,
        batch_size=1,
        init_x=None,
        labels=None,
    ):
        """从客户端接收的梯度中重建图像

        Args:
            received_gradients: 接收的梯度
            batch_size: 批量大小

        Returns:
            重建的图像和对应的标签

        Raises:
            OverflowError: 如果距离计算结果为 NaN
        """
        fake_x, fake_label, optimizer = _setup_attack(
            self.x_shape,
            self.y_shape,
            self.optimizer_class,
            self.optimize_label,
            self.pos_of_final_fc_layer,
            self.device,
            received_gradients,
            batch_size,
            init_x=init_x,
            labels=labels,
            **self.kwargs,
        )

        num_of_not_improve_round = 0
        best_distance = float("inf")
        self.log_loss = []
        for i in range(1, self.num_iteration + 1):
            closure = self._setup_closure(
                optimizer, fake_x, fake_label, received_gradients
            )
            distance = optimizer.step(closure)

            if self.clamp_range is not None:
                with torch.no_grad():
                    fake_x[:] = fake_x.clamp(self.clamp_range[0], self.clamp_range[1])

            # 检查距离是否为 NaN
            # if torch.sum(torch.isnan(distance)).item():
            #     raise OverflowError("距离计算结果为 NaN")

            if best_distance > distance:
                best_fake_x = fake_x.detach().clone()
                best_fake_label = fake_label.detach().clone()
                best_distance = distance
                best_iteration = i
                num_of_not_improve_round = 0
            else:
                num_of_not_improve_round += 1

            self._update_logging(i, distance, best_iteration, best_distance)

            if num_of_not_improve_round > self.early_stopping:
                print(
                    f"iter={i}: 在过去的 {self.early_stopping} 轮中损失没有改善"
                )
                break

        return best_fake_x, best_fake_label

    def group_attack(self, received_gradients, batch_size=1):
        """同时进行多个攻击试验

        Args:
            received_gradients: 接收的梯度
            batch_size: 批量大小

        Returns:
            重建的图像和对应的标签
        """
        group_fake_x = []
        group_fake_label = []
        group_optimizer = []

        for _ in range(self.group_num):
            fake_x, fake_label, optimizer = _setup_attack(
                self.x_shape,
                self.y_shape,
                self.optimizer_class,
                self.optimize_label,
                self.pos_of_final_fc_layer,
                self.device,
                received_gradients,
                batch_size,
                **self.kwargs,
            )
            group_fake_x.append(fake_x)
            group_fake_label.append(fake_label)
            group_optimizer.append(optimizer)

        best_distance = [float("inf") for _ in range(self.group_num)]
        best_fake_x = [x_.detach().clone() for x_ in group_fake_x]
        best_fake_label = [y_.detach().clone() for y_ in group_fake_label]
        best_iteration = [0 for _ in range(self.group_num)]

        self.log_loss = [[] for _ in range(self.group_num)]
        for i in range(1, self.num_iteration + 1):
            for worker_id in range(self.group_num):
                self.reset_seed(self.group_seed[worker_id])
                closure = self._setup_closure(
                    group_optimizer[worker_id],
                    group_fake_x[worker_id],
                    group_fake_label[worker_id],
                    received_gradients,
                )
                distance = group_optimizer[worker_id].step(closure)

                if self.save_loss:
                    self.log_loss[worker_id].append(distance)

                if best_distance[worker_id] > distance:
                    best_fake_x[worker_id] = group_fake_x[worker_id].detach().clone()
                    best_fake_label[worker_id] = (
                        group_fake_label[worker_id].detach().clone()
                    )
                    best_distance[worker_id] = distance
                    best_iteration[worker_id] = i

                if self.log_interval != 0 and i % self.log_interval == 0:
                    print(
                        f"worker_id={worker_id}: iter={i}: {distance}, (best_iter={best_iteration[worker_id]}: {best_distance[worker_id]})"
                    )

        return best_fake_x, best_fake_label