import os
import sys
import inspect
import importlib.util
import mysql.connector
from mysql.connector import Error
import torch
import torch.nn as nn

class ModelParser:
    def __init__(self, model_file_path, db_config):
        """
        初始化模型解析器
        
        Args:
            model_file_path: 模型文件路径
            db_config: 数据库配置，包含host, user, password, database
        """
        self.model_file_path = model_file_path
        self.db_config = db_config
        self.model = None
        self.model_name = None
        self.conn = None
        self.cursor = None
        
    def connect_to_db(self):
        """
        连接到MySQL数据库
        """
        try:
            self.conn = mysql.connector.connect(
                host=self.db_config['host'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database']
            )
            
            if self.conn.is_connected():
                self.cursor = self.conn.cursor()
                print(f"成功连接到MySQL数据库: {self.db_config['database']}")
                return True
        except Error as e:
            print(f"连接数据库时出错: {e}")
            return False
        
    def create_tables(self):
        """
        创建存储模型信息的表
        """
        try:
            # 创建模型表
            self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS models (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                file_path VARCHAR(255) NOT NULL,
                total_params INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            
            # 创建层表
            self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS layers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                model_id INT,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                input_shape VARCHAR(255),
                output_shape VARCHAR(255),
                params INT,
                position INT,
                FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
            )
            """)
            
            # 创建层参数表
            self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS layer_params (
                id INT AUTO_INCREMENT PRIMARY KEY,
                layer_id INT,
                param_name VARCHAR(255) NOT NULL,
                param_value TEXT,
                FOREIGN KEY (layer_id) REFERENCES layers(id) ON DELETE CASCADE
            )
            """)
            
            self.conn.commit()
            print("成功创建数据表")
            return True
        except Error as e:
            print(f"创建表时出错: {e}")
            return False
    
    def load_model(self):
        """
        从文件加载模型
        """
        try:
            # 获取模型文件的目录
            model_dir = os.path.dirname(self.model_file_path)
            model_filename = os.path.basename(self.model_file_path)
            model_name = os.path.splitext(model_filename)[0]
            
            # 将模型目录添加到系统路径
            if model_dir not in sys.path:
                sys.path.insert(0, model_dir)
            
            # 动态导入模型模块
            spec = importlib.util.spec_from_file_location(model_name, self.model_file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # 查找模块中的模型类
            for name, obj in inspect.getmembers(module):
                if inspect.isclass(obj) and issubclass(obj, nn.Module) and obj != nn.Module:
                    self.model = obj()
                    self.model_name = name
                    print(f"成功加载模型: {name}")
                    return True
            
            print("未找到继承自nn.Module的模型类")
            return False
        except Exception as e:
            print(f"加载模型时出错: {e}")
            return False
    
    def count_parameters(self, model):
        """
        计算模型参数总数
        """
        return sum(p.numel() for p in model.parameters() if p.requires_grad)
    
    def get_layer_info(self, layer, name):
        """
        获取层的详细信息
        """
        layer_type = layer.__class__.__name__
        params = sum(p.numel() for p in layer.parameters() if p.requires_grad)
        
        # 获取层的输入输出形状（需要实际运行模型才能准确获取）
        input_shape = "未知"
        output_shape = "未知"
        
        # 获取层的特殊参数
        special_params = {}
        if isinstance(layer, nn.Conv2d):
            special_params = {
                'in_channels': layer.in_channels,
                'out_channels': layer.out_channels,
                'kernel_size': layer.kernel_size,
                'stride': layer.stride,
                'padding': layer.padding
            }
        elif isinstance(layer, nn.Linear):
            special_params = {
                'in_features': layer.in_features,
                'out_features': layer.out_features
            }
        elif isinstance(layer, nn.MaxPool2d):
            special_params = {
                'kernel_size': layer.kernel_size,
                'stride': layer.stride,
                'padding': layer.padding if hasattr(layer, 'padding') else 0
            }
        
        return {
            'name': name,
            'type': layer_type,
            'input_shape': input_shape,
            'output_shape': output_shape,
            'params': params,
            'special_params': special_params
        }
    
    def parse_model(self):
        """
        解析模型结构
        """
        if not self.model:
            print("请先加载模型")
            return False
        
        try:
            # 插入模型信息
            total_params = self.count_parameters(self.model)
            self.cursor.execute("""
            INSERT INTO models (name, file_path, total_params)
            VALUES (%s, %s, %s)
            """, (self.model_name, self.model_file_path, total_params))
            
            model_id = self.cursor.lastrowid
            
            # 解析模型的每一层
            position = 0
            for name, layer in self.model.named_children():
                layer_info = self.get_layer_info(layer, name)
                
                # 插入层信息
                self.cursor.execute("""
                INSERT INTO layers (model_id, name, type, input_shape, output_shape, params, position)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    model_id,
                    layer_info['name'],
                    layer_info['type'],
                    layer_info['input_shape'],
                    layer_info['output_shape'],
                    layer_info['params'],
                    position
                ))
                
                layer_id = self.cursor.lastrowid
                
                # 插入层的特殊参数
                for param_name, param_value in layer_info['special_params'].items():
                    self.cursor.execute("""
                    INSERT INTO layer_params (layer_id, param_name, param_value)
                    VALUES (%s, %s, %s)
                    """, (layer_id, param_name, str(param_value)))
                
                position += 1
            
            self.conn.commit()
            print(f"成功解析并存储模型 {self.model_name} 的结构")
            return True
        except Error as e:
            print(f"解析模型时出错: {e}")
            self.conn.rollback()
            return False
    
    def close_connection(self):
        """
        关闭数据库连接
        """
        if self.conn and self.conn.is_connected():
            if self.cursor:
                self.cursor.close()
            self.conn.close()
            print("数据库连接已关闭")
    
    def run(self):
        """
        运行完整的解析流程
        """
        success = self.connect_to_db()
        if not success:
            return False
        
        success = self.create_tables()
        if not success:
            self.close_connection()
            return False
        
        success = self.load_model()
        if not success:
            self.close_connection()
            return False
        
        success = self.parse_model()
        self.close_connection()
        return success

# 使用示例
if __name__ == "__main__":
    # 模型文件路径
    model_file_path = "testfile.py"
    
    # 数据库配置
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password',  # 替换为你的MySQL密码
        'database': 'ml_shield'
    }
    
    parser = ModelParser(model_file_path, db_config)
    parser.run()