from abc import ABCMeta, abstractmethod

class BaseAttacker(metaclass=ABCMeta):
    """攻击者类（基类）"""

    def __init__(self, target_model):
        """机器学习模型攻击者

        Args:
            target_model: 目标机器学习模型
        """
        self.target_model = target_model

    @abstractmethod
    def attack(self):
        """攻击方法（抽象方法，需要子类实现）"""
        pass