import torch

def total_variance(x):
    """计算输入张量的总方差"""
    dx = torch.mean(torch.abs(x[:, :, :, :-1] - x[:, :, :, 1:]))
    dy = torch.mean(torch.abs(x[:, :, :-1, :] - x[:, :, 1:, :]))
    return dx + dy

def label_matching(pred, label):
    """计算预测标签和目标标签之间的匹配损失"""
    onehot_label = torch.eye(pred.shape[-1])[label]
    onehot_label = onehot_label.to(pred.device)
    return torch.sqrt(torch.sum((pred - onehot_label) ** 2))

def group_consistency(x, group_x):
    """计算输入与一组输入之间的组一致性"""
    mean_group_x = sum(group_x) / len(group_x)
    return torch.norm(x - mean_group_x, p=2)

def bn_regularizer(feature_maps, bn_layers):
    """计算批量归一化正则化项"""
    bn_reg = 0
    for i, layer in enumerate(bn_layers):
        fm = feature_maps[i]
        if len(fm.shape) == 3:
            dim = [0, 2]
        elif len(fm.shape) == 4:
            dim = [0, 2, 3]
        elif len(fm.shape) == 5:
            dim = [0, 2, 3, 4]
        bn_reg += torch.norm(fm.mean(dim=dim) - layer.state_dict()["running_mean"], p=2)
        bn_reg += torch.norm(fm.var(dim=dim) - layer.state_dict()["running_var"], p=2)
    return bn_reg