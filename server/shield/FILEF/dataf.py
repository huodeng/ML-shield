import os
import zipfile
import numpy as np
from PIL import Image
from sklearn.preprocessing import LabelEncoder, StandardScaler
import warnings
warnings.filterwarnings("ignore")

def load_dataset(zip_path, img_size=(128, 128)):
    """智能处理彩色/灰度图像的统一加载函数"""
    data = {'train': {'X': [], 'y': [], 'channels': None}, 
           'test': {'X': [], 'y': [], 'channels': None}}
    label_encoder = LabelEncoder()
    temp_dir = "temp_data"
    
    # 解压文件
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(temp_dir)
    
    # 遍历数据集
    for split in ['train', 'test']:
        split_path = os.path.join(temp_dir, 'images', split)
        if not os.path.exists(split_path):
            split_path = os.path.join(temp_dir, split)
        
        for emotion in os.listdir(split_path):
            emotion_dir = os.path.join(split_path, emotion)
            if not os.path.isdir(emotion_dir):
                continue
                
            for img_file in os.listdir(emotion_dir):
                img_path = os.path.join(emotion_dir, img_file)
                try:
                    with Image.open(img_path) as img:
                        # 智能模式处理
                        original_mode = img.mode
                        
                        # 统一调整尺寸
                        img = img.resize(img_size)
                        
                        # 转换为NumPy数组并处理通道
                        if original_mode in ['L', 'LA']:  # 灰度图处理
                            img = img.convert('L')
                            img_array = np.array(img)
                            channels = 1
                        elif original_mode in ['RGB', 'RGBA']:  # 彩色图处理
                            img = img.convert('RGB')
                            img_array = np.array(img)
                            channels = 3
                        else:
                            raise ValueError(f"不支持的图像模式: {original_mode}")
                            
                        # 检查通道一致性
                        if data[split]['channels'] is None:
                            data[split]['channels'] = channels
                        elif data[split]['channels'] != channels:
                            raise ValueError(f"混合通道类型: {split}集中同时存在灰度和彩色图像")
                            
                        # 展平存储 (自动适配H*W*C)
                        data[split]['X'].append(img_array.flatten())
                        data[split]['y'].append(emotion)
                        
                except Exception as e:
                    print(f"跳过损坏文件: {img_path} ({str(e)})")
    
    # 编码标签
    all_labels = data['train']['y'] + data['test']['y']
    label_encoder.fit(all_labels)
    
    # 转换为numpy数组并验证形状
    dataset = {
        'X_train': np.array(data['train']['X'], dtype=np.float32),
        'y_train': label_encoder.transform(data['train']['y']),
        'X_test': np.array(data['test']['X'], dtype=np.float32),
        'y_test': label_encoder.transform(data['test']['y']),
        'classes': label_encoder.classes_,
        'channels': {
            'train': data['train']['channels'],
            'test': data['test']['channels']
        }
    }
    
    # 通道数验证
    if dataset['channels']['train'] != dataset['channels']['test']:
        raise ValueError("训练集和测试集通道数不一致")
    
    # 清理临时文件
    import shutil
    shutil.rmtree(temp_dir)
    
    return dataset

def standardize_data(data):
    """适配多通道的标准化"""
    scaler = StandardScaler()
    data['X_train'] = scaler.fit_transform(data['X_train'])
    data['X_test'] = scaler.transform(data['X_test'])
    return data, scaler

def save_dataset(data, save_path):
    """保存包含元数据的数据集"""
    np.savez(
        save_path,
        X_train=data['X_train'],
        y_train=data['y_train'],
        X_test=data['X_test'],
        y_test=data['y_test'],
    )

if __name__ == "__main__":
    # 使用示例
    dataset = load_dataset("data/images.zip", img_size=(32, 32))
    
    # 数据标准化
    dataset, scaler = standardize_data(dataset)
    
    # 保存数据集
    save_dataset(dataset, "data/image.npz")
    