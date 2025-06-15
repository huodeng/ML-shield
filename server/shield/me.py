import torch
import numpy as np
from typing import Dict, Any, Optional
from FILEF.testfile import model
from MIA.mia import mia, miad
from DLG.dlg import dlg, dlgd
from BACKDOOR.backdoor import backdoor 
from BACKDOOR.backdoord import backdoord
from BACKDOOR.custombackdoor import custombackdoor
from BACKDOOR.custombackdoord import custombackdoord
from FILEF.dataf import load_dataset, standardize_data
import os
from paramsseek import find_optimal_parameters 
class MLShield:
    def __init__(self, imgsize, isuplord):
        self.device = torch.device("cpu")
        self.imgsize = imgsize
        self.net = None
        self.dataset = None
        self.scaler = None
        self.isuplord = isuplord
        self.params = None  # 初始化为None，稍后可以设置
    def init_model(self) -> None:
        print("Debug - Initializing model...")
        self.net = model()
        print("Debug - Model initialized  successfully")

    def load_data(self, data_path: str = None) -> None:
        """加载并预处理数据集"""
        print("Debug - Starting data loading process...")
        print("Debug - isuplord:", self.isuplord)
        if self.isuplord:
            if data_path is None:
                data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'image.zip')
                print("Debug - Using default data path:", data_path)
            if not os.path.exists(data_path):
                print("Debug - Data file not found:", data_path)
                raise FileNotFoundError(f"数据文件不存在: {data_path}")
            print("Debug - Loading dataset...")
            self.dataset = load_dataset(data_path, img_size=(self.imgsize, self.imgsize))
            print("Debug - Dataset loaded, standardizing data...")
            self.dataset, self.scaler = standardize_data(self.dataset)
            npz_path = os.path.join(os.path.dirname(data_path), 'image.npz')
            print("Debug - Saving processed dataset to:", npz_path)
            np.savez(npz_path)
            print("Debug - Data loading completed successfully")
        else:
            print("Debug - Skipping data loading (isuplord=False)")
            return True

    def run_mia_attack(self, use_privacy: bool = False, params=None) -> Dict[str, Any]:
        """运行成员推理攻击"""
        try:
            # 使用传入的params或者实例的params
            attack_params = params if params is not None else self.params
            result = miad(self.net, self.isuplord, self.dataset, self.imgsize, attack_params) if use_privacy else mia(self.net, self.isuplord, self.dataset, self.imgsize)
            if isinstance(result, dict):
                # 确保所有值都是可序列化的
                return {k: float(v) if isinstance(v, (int, float)) else str(v) for k, v in result.items()}
            return {"status": "error", "message": "Invalid result format"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def run_dlg_attack(self, use_privacy: bool = False, params=None) -> Dict[str, Any]:
        """运行深度泄漏梯度攻击"""
        try:
            # 使用传入的params或者实例的params
            attack_params = params if params is not None else self.params
            result = dlgd(self.net, self.isuplord, self.dataset, self.imgsize, attack_params) if use_privacy else dlg(self.net, self.isuplord, self.dataset, self.imgsize)
            if isinstance(result, dict):
                return result
            return {"status": "error", "message": "Invalid result format"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def run_backdoor_attack(self, use_privacy: bool = False, params=None) -> Dict[str, Any]:
        """运行后门攻击"""
        try:
            # 使用传入的params或者实例的params
            attack_params = params if params is not None else self.params
            if not self.isuplord:
                result = backdoord(self.net, self.isuplord, self.dataset, attack_params) if use_privacy else backdoor(self.net, self.isuplord, self.dataset)
            else:
                result = custombackdoord(self.net, self.dataset, self.imgsize, attack_params) if use_privacy else custombackdoor(self.net, self.dataset, self.imgsize)
            if isinstance(result, dict):
                return result
            return {"status": "error", "message": "Invalid result format"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def run_all_attacks(self, use_privacy: bool = False, params=None) -> Dict[str, Any]:
        """运行所有攻击方法"""
        results = {
            'mia': self.run_mia_attack(use_privacy, params),
            'dlg': self.run_dlg_attack(use_privacy, params),
            'backdoor': self.run_backdoor_attack(use_privacy, params)
        }
        return results

if __name__ == '__main__':
    # 使用示例
    shield = MLShield(imgsize=32, isuplord=False)
    shield.init_model()
    shield.load_data()
    
    # 获取最优参数
    params = find_optimal_parameters()
    shield.params = params  # 设置参数
    
    # 运行所有攻击
    #results = shield.run_all_attacks(use_privacy=False)
    #print(results)
   
    
    # 或者单独运行某个攻击
    mia_result = shield.run_mia_attack(use_privacy=False)
    print("MIA Attack Results:", mia_result)

    # dlg_result = shield.run_dlg_attack(use_privacy=True)
    # backdoor_result = shield.run_backdoor_attack(use_privacy=True)




