import os
import sys
from model_parser import ModelParser

def main():
    # 获取当前脚本所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 模型文件路径
    model_file_path = os.path.join(current_dir, "testfile.py")
    
    # 检查文件是否存在
    if not os.path.exists(model_file_path):
        print(f"错误: 模型文件 {model_file_path} 不存在")
        return False
    
    db_config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '666666',
        'database': 'mysql'
    }
    
    # 检查数据库是否存在，如果不存在则创建
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=db_config['user'],
            password=db_config['password']
        )
        cursor = conn.cursor()
        
        # 创建数据库（如果不存在）
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        print(f"确保数据库 {db_config['database']} 存在")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"连接数据库时出错: {e}")
        return False
    
    # 创建并运行模型解析器
    parser = ModelParser(model_file_path, db_config)
    success = parser.run()
    
    if success:
        print("\n模型解析和存储成功完成!")
        print("\n数据库中的表结构:")
        print("1. models - 存储模型基本信息")
        print("2. layers - 存储模型的每一层信息")
        print("3. layer_params - 存储每一层的详细参数")
        
        print("\n您可以使用以下SQL查询来查看存储的数据:")
        print("- 查看所有模型: SELECT * FROM models;")
        print("- 查看特定模型的所有层: SELECT * FROM layers WHERE model_id = <model_id>;")
        print("- 查看特定层的参数: SELECT * FROM layer_params WHERE layer_id = <layer_id>;")
    else:
        print("模型解析或存储过程中出现错误")

if __name__ == "__main__":
    main()