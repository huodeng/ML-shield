from MIA.base_attack import BaseAttacker
from MIA.utils1 import AttackerModel, ShadowModels


class ShadowMembershipInferenceAttack(BaseAttacker):
    def __init__(
        self,
        target_model,
        shadow_models,
        attack_models,
    ):
        """实现会员推理攻击的类

        Args:
            target_model: 目标模型
            shadow_models: 影子模型
            attack_models: 攻击模型
        """
        super().__init__(target_model)
        self.sm = ShadowModels(shadow_models)
        self.am = AttackerModel(attack_models)
        self.shadow_result = None

    def fit(self, X, y):
        """训练影子模型和攻击模型

        Args:
            X: 影子模型的训练数据
            y: 影子模型的训练标签
        """
        self.train_shadow(X, y)
        self.train_attacker()

    def train_shadow(self, X, y):
        """训练影子模型

        Args:
            X: 影子模型的训练数据
            y: 影子模型的训练标签
        """
        self.shadow_result = self.sm.fit_transform(X, y)

    def train_attacker(self):
        """训练攻击模型"""
        self.am.fit(self.shadow_result)

    def attack(self, x, y, proba=False):
        """对目标模型进行攻击

        Args:
            x: 待攻击的数据
            y: 待攻击数据的真实标签
            proba: 输出概率还是二进制标签

        Returns:
            预测结果
        """
        prediction_of_taregt_model = self.target_model.predict_proba(x)
        if proba:
            return self.predict_proba(prediction_of_taregt_model, y)
        else:
            return self.predict(prediction_of_taregt_model, y)

    def predict(self, pred, label):
        """预测给定预测是否来自训练数据

        Args:
            pred: 目标模型的预测概率
            label: 数据的真实标签

        Returns:
            二进制预测标签
        """
        return self.am.predict(pred, label)

    def predict_proba(self, pred, label):
        """预测给定预测是否来自训练数据的概率

        Args:
            pred: 目标模型的预测概率
            label: 数据的真实标签

        Returns:
            预测概率
        """
        return self.am.predict_proba(pred, label)