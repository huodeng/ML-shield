from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
import numpy as np
import json
import os

# 创建路由器
router = APIRouter()

# 模型信息数据结构
class ModelInfo:
    def __init__(self, name: str, total_params: int, accuracy: float, 
                 input_shape: List[int], output_shape: List[int], description: str):
        self.name = name
        self.total_params = total_params
        self.accuracy = accuracy
        self.input_shape = input_shape
        self.output_shape = output_shape
        self.description = description

# 层信息数据结构
class LayerInfo:
    def __init__(self, name: str, type: str, shape: List[int], params: Optional[int] = None,
                 kernel_size: Optional[int] = None, stride: Optional[int] = None,
                 padding: Optional[int] = None, activation: Optional[str] = None):
        self.name = name
        self.type = type
        self.shape = shape
        self.params = params
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        self.activation = activation

# 模拟数据 - 在实际应用中，这些数据应该从模型文件或数据库中获取
default_model_info = ModelInfo(
    name="卷积神经网络模型",
    total_params=1630154,
    accuracy=0.92,
    input_shape=[32, 32, 3],
    output_shape=[10],
    description="这是一个用于图像分类的CNN模型，包含2个卷积层、2个池化层和2个全连接层。"
)

default_layers = [
    LayerInfo(type="input", name="输入层", shape=[32, 32, 3], params=0),
    LayerInfo(
        type="conv", 
        name="卷积层1", 
        shape=[32, 32, 32], 
        params=896, 
        kernel_size=3, 
        stride=1, 
        padding=1, 
        activation="ReLU"
    ),
    LayerInfo(
        type="pool", 
        name="池化层1", 
        shape=[16, 16, 32], 
        params=0, 
        kernel_size=2, 
        stride=2
    ),
    LayerInfo(
        type="conv", 
        name="卷积层2", 
        shape=[14, 14, 64], 
        params=18496, 
        kernel_size=3, 
        stride=1, 
        padding=0, 
        activation="ReLU"
    ),
    LayerInfo(
        type="pool", 
        name="池化层2", 
        shape=[7, 7, 64], 
        params=0, 
        kernel_size=2, 
        stride=2
    ),
    LayerInfo(
        type="fc", 
        name="全连接层1", 
        shape=[512], 
        params=1605632, 
        activation="ReLU"
    ),
    LayerInfo(
        type="fc", 
        name="全连接层2", 
        shape=[10], 
        params=5130
    )
]

# 辅助函数 - 将对象转换为字典
def obj_to_dict(obj):
    return {k: v for k, v in obj.__dict__.items()}

# 获取模型信息的API端点
@router.get("/info")
async def get_model_info():
    # 在实际应用中，这里应该从模型文件或数据库中获取信息
    # 这里使用模拟数据
    return obj_to_dict(default_model_info)

# 获取模型层信息的API端点
@router.get("/layers")
async def get_model_layers():
    # 在实际应用中，这里应该从模型文件或数据库中获取信息
    # 这里使用模拟数据
    return [obj_to_dict(layer) for layer in default_layers]

# 获取特征图数据的API端点
@router.get("/feature-maps/{layer_id}")
async def get_feature_maps(layer_id: str):
    # 在实际应用中，这里应该从模型中获取特定层的特征图
    # 这里生成随机数据作为示例
    try:
        # 根据层ID找到对应的层
        layer_index = int(layer_id)
        if layer_index < 0 or layer_index >= len(default_layers):
            raise HTTPException(status_code=404, detail="Layer not found")
            
        layer = default_layers[layer_index]
        # 生成与层形状匹配的随机数据
        shape = layer.shape
        size = np.prod(shape)
        data = np.random.random(size).tolist()
        return data
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid layer ID")

# 获取权重数据的API端点
@router.get("/weights/{layer_id}")
async def get_weights(layer_id: str):
    # 在实际应用中，这里应该从模型中获取特定层的权重
    # 这里生成随机数据作为示例
    try:
        # 根据层ID找到对应的层
        layer_index = int(layer_id)
        if layer_index < 0 or layer_index >= len(default_layers):
            raise HTTPException(status_code=404, detail="Layer not found")
            
        layer = default_layers[layer_index]
        # 只有卷积层和全连接层有权重
        if layer.type not in ["conv", "fc"]:
            return []
            
        # 生成随机权重数据
        if layer.type == "conv":
            # 卷积层权重形状：[kernel_size, kernel_size, input_channels, output_channels]
            if layer_index == 1:  # 第一个卷积层
                shape = [3, 3, 3, 32]  # 3x3卷积核，3输入通道，32输出通道
            else:  # 第二个卷积层
                shape = [3, 3, 32, 64]  # 3x3卷积核，32输入通道，64输出通道
        else:  # 全连接层
            if layer_index == 5:  # 第一个全连接层
                shape = [7*7*64, 512]  # 输入是7x7x64，输出是512
            else:  # 第二个全连接层
                shape = [512, 10]  # 输入是512，输出是10
                
        size = np.prod(shape)
        data = (np.random.random(size) * 2 - 1).tolist()  # 生成-1到1之间的随机数
        return data
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid layer ID")

# 获取激活数据的API端点
@router.get("/activations/{layer_id}")
async def get_activations(layer_id: str):
    # 在实际应用中，这里应该从模型中获取特定层的激活
    # 这里生成随机数据作为示例
    try:
        # 根据层ID找到对应的层
        layer_index = int(layer_id)
        if layer_index < 0 or layer_index >= len(default_layers):
            raise HTTPException(status_code=404, detail="Layer not found")
            
        layer = default_layers[layer_index]
        # 生成与层形状匹配的随机激活数据
        shape = layer.shape
        size = np.prod(shape)
        # ReLU激活函数的输出是非负的
        if layer.activation == "ReLU":
            data = np.maximum(0, np.random.random(size) * 2 - 0.5).tolist()
        else:
            data = np.random.random(size).tolist()
        return data
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid layer ID")