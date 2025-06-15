import numpy as np


class ShadowModels:
    """训练用于成员推断的影子模型"""

    def __init__(self, models):
        """初始化影子模型类

        Args:
            models: 用于影子模型的 PyTorch 模型列表
        """
        self.models = models  # 保存传入的模型列表
        self.num_models = len(models)  # 记录模型数量

    def fit_transform(self, X, y):
        """训练影子模型并获取预测结果和成员标签

        Args:
            X (np.array): 输入数据
            y (np.array): 数据标签

        Returns:
            result_dict (dict): 关键值为类别标签，值为 (影子模型预测结果, 影子模型成员标签)
        """
        num_samples = X.shape[0]  # 获取样本数量
        indices = np.arange(num_samples)  # 生成样本索引
        splitted_indices = np.array_split(indices, self.num_models)  # 将索引分成多个子集，每个子集对应一个影子模型

        # 训练影子模型
        self._fit(X, y, splitted_indices)

        # 获取影子模型的预测结果和成员标签
        (
            shadow_in_preds,
            shadow_out_preds,
            shadow_in_labels,
            shadow_out_labels,
        ) = self._transform(X, y, splitted_indices)

        # 合并成员和非成员的预测结果和标签
        shadow_preds = np.concatenate([shadow_in_preds, shadow_out_preds])
        shadow_labels = np.concatenate([shadow_in_labels, shadow_out_labels])

        # 创建虚拟的成员标签（1 表示成员，0 表示非成员）
        dummy_shadow_in_labels = np.ones_like(shadow_in_labels)
        dummy_shadow_out_labels = np.zeros_like(shadow_out_labels)
        dummy_shadow_labels = np.concatenate([dummy_shadow_in_labels, dummy_shadow_out_labels])

        # 构建结果字典
        result_dict = {}
        unique_classes = np.unique(shadow_labels)  # 获取所有唯一的类别标签
        for c in unique_classes:
            idx = np.where(shadow_labels == c)  # 找到当前类别的索引
            result_dict[c] = (shadow_preds[idx], dummy_shadow_labels[idx])

        return result_dict

    def _fit(self, X, y, splitted_indices):
        """训练影子模型

        Args:
            X (np.array): 输入数据
            y (np.array): 数据标签
            splitted_indices: 数据索引的分割结果
        """
        for model_idx in range(self.num_models):
            # 使用分割后的数据训练每个影子模型
            self.models[model_idx].fit1(
                X[splitted_indices[model_idx]], y[splitted_indices[model_idx]]
            )

    def _transform(self, X, y, splitted_indices):
        """获取影子模型的预测结果和成员标签

        Args:
            X (np.array): 输入数据
            y (np.array): 数据标签
            splitted_indices: 数据索引的分割结果

        Returns:
            shadow_in_preds: 影子模型在训练数据上的预测结果
            shadow_out_preds: 影子模型在非训练数据上的预测结果
            shadow_in_labels: 影子模型在训练数据上的真实标签
            shadow_out_labels: 影子模型在非训练数据上的真实标签
        """
        shadow_in_preds = []  # 保存影子模型在训练数据上的预测结果
        shadow_out_preds = []  # 保存影子模型在非训练数据上的预测结果
        shadow_in_labels = []  # 保存影子模型在训练数据上的真实标签
        shadow_out_labels = []  # 保存影子模型在非训练数据上的真实标签

        for model_idx in range(self.num_models):
            # 获取影子模型在训练数据上的预测结果
            in_preds = self.models[model_idx].predict_proba(
                X[splitted_indices[model_idx]]
            )
            in_labels = y[splitted_indices[model_idx]]  # 获取训练数据的真实标签
            shadow_in_preds.append(in_preds)
            shadow_in_labels.append(in_labels)

            # 获取影子模型在非训练数据上的预测结果
            out_preds = self.models[model_idx].predict_proba(
                np.delete(X, splitted_indices[model_idx], axis=0)
            )
            out_labels = np.delete(y, splitted_indices[model_idx])  # 获取非训练数据的真实标签
            shadow_out_preds.append(out_preds)
            shadow_out_labels.append(out_labels)

        # 合并所有影子模型的预测结果和标签
        shadow_in_preds = np.concatenate(shadow_in_preds)
        shadow_out_preds = np.concatenate(shadow_out_preds)
        shadow_in_labels = np.concatenate(shadow_in_labels)
        shadow_out_labels = np.concatenate(shadow_out_labels)

        return shadow_in_preds, shadow_out_preds, shadow_in_labels, shadow_out_labels


class AttackerModel:
    """用于成员推断的攻击模型"""

    def __init__(self, models):
        """初始化攻击模型

        Args:
            models: 攻击模型的 PyTorch 模型列表
        """
        self.models = models  # 保存传入的模型列表

    def fit(self, shadow_result):
        """使用影子模型的结果训练攻击模型

        Args:
            shadow_result (dict): 影子模型的结果，键为类别标签，值为 (影子模型预测结果, 影子模型成员标签)
        """
        for label, (X, y) in shadow_result.items():
            # 使用影子模型的结果训练每个类别的攻击模型
            self.models[label].fit(X, y)

    def predict(self, y_pred_prob, y_labels):
        """预测给定预测结果是否来自训练数据

        Args:
            y_pred_prob (torch.Tensor): 模型的预测概率
            y_labels (torch.Tensor): 数据的真实标签

        Returns:
            in_out_pred (np.array): 预测结果，1 表示来自训练数据，0 表示非训练数据
        """
        y_pred_prob = np.array(y_pred_prob)  # 将预测概率转换为 NumPy 数组
        y_labels = np.array(y_labels)  # 将真实标签转换为 NumPy 数组
        unique_labels = np.unique(y_labels)  # 获取所有唯一的类别标签
        in_out_pred = np.zeros_like(y_labels)  # 初始化预测结果数组

        for label in unique_labels:
            idx = np.where(y_labels == label)  # 找到当前类别的索引
            # 使用对应类别的攻击模型进行预测
            in_out_pred[idx] = self.models[label].predict(y_pred_prob[idx])

        return in_out_pred

    def predict_proba(self, y_pred_prob, y_labels):
        """获取给定预测结果来自训练数据的概率

        Args:
            y_pred_prob (torch.Tensor): 模型的预测概率
            y_labels (torch.Tensor): 数据的真实标签

        Returns:
            in_out_pred (np.array): 预测结果的概率，每个元素表示来自训练数据的可能性
        """
        y_pred_prob = np.array(y_pred_prob)  # 将预测概率转换为 NumPy 数组
        y_labels = np.array(y_labels)  # 将真实标签转换为 NumPy 数组
        unique_labels = np.unique(y_labels)  # 获取所有唯一的类别标签
        in_out_pred = np.zeros((y_labels.shape[0], 2), dtype=float)  # 初始化预测结果数组

        for label in unique_labels:
            idx = np.where(y_labels == label)[0]  # 找到当前类别的索引
            # 使用对应类别的攻击模型获取概率
            in_out_pred[idx] = self.models[label].predict_proba(y_pred_prob[idx])

        return in_out_pred