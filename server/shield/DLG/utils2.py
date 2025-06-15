import torch


def _initialize_x(x_shape, batch_size, device):
    """初始化假图像

    Args:
        x_shape: 图像的形状
        batch_size: 批量大小
        device: 设备类型

    Returns:
        随机生成的张量，形状为 (batch_size,) + x_shape
    """
    fake_x = torch.randn((batch_size,) + x_shape, requires_grad=True, device=device)
    return fake_x


def _initialize_label(y_shape, batch_size, device):
    """初始化假标签

    Args:
        y_shape: 标签的形状
        batch_size: 批量大小
        device: 设备类型

    Returns:
        随机初始化的标签
    """
    fake_label = torch.randn((batch_size, y_shape), requires_grad=True, device=device)
    fake_label = fake_label.to(device)
    return fake_label


def _estimate_label(received_gradients, batch_size, pos_of_final_fc_layer, device):
    """从接收到的梯度中估计秘密标签

    Args:
        received_gradients: 从客户端接收到的梯度
        batch_size: 计算接收到的梯度时使用的批量大小

    Returns:
        估计的标签
    """
    if batch_size == 1:
        fake_label = torch.argmin(
            torch.sum(received_gradients[pos_of_final_fc_layer], dim=1)
        )
    else:
        fake_label = torch.argsort(
            torch.min(received_gradients[pos_of_final_fc_layer], dim=-1)[0]
        )[:batch_size]
    fake_label = fake_label.reshape(batch_size)
    fake_label = fake_label.to(device)
    return fake_label


def _setup_attack(
    x_shape,
    y_shape,
    optimizer_class,
    optimize_label,
    pos_of_final_fc_layer,
    device,
    received_gradients,
    batch_size,
    init_x=None,
    labels=None,
    **kwargs
):
    """初始化图像和标签，并设置优化器

    Args:
        received_gradients: 从客户端接收到的梯度列表
        batch_size: 批量大小

    Returns:
        初始图像、标签和优化器实例
    """
    if init_x is None:
        fake_x = _initialize_x(x_shape, batch_size, device)
    else:
        fake_x = init_x

    if labels is None:
        if optimize_label:
            fake_label = _initialize_label(y_shape, batch_size, device)
        else:
            fake_label = _estimate_label(
                received_gradients,
                batch_size,
                pos_of_final_fc_layer,
                device,
            )
    else:
        fake_label = labels

    if optimize_label:
        optimizer = optimizer_class([fake_x, fake_label], **kwargs)
    else:
        optimizer = optimizer_class([fake_x], **kwargs)

    return fake_x, fake_label, optimizer


def _generate_fake_gradients(
    target_model, lossfunc, optimize_label, fake_x, fake_label
):
    """生成假梯度

    Args:
        target_model: 目标模型
        lossfunc: 损失函数
        optimize_label: 是否优化标签
        fake_x: 假图像
        fake_label: 假标签

    Returns:
        假预测值和假梯度
    """
    fake_pred = target_model(fake_x)
    if optimize_label:
        loss = lossfunc(fake_pred, fake_label.softmax(dim=-1))
    else:
        loss = lossfunc(fake_pred, fake_label)
    fake_gradients = torch.autograd.grad(
        loss,
        target_model.parameters(),
        create_graph=True,
        allow_unused=True,
    )
    return fake_pred, fake_gradients