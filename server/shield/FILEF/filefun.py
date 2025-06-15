import shutil
import os
import re

# 获取当前脚本的目录
def copy_file(file1,file2):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    source_file_path = os.path.join(current_dir, file1)
    destination_file_path = os.path.join(current_dir, file2)

    # 复制文件内容
    shutil.copyfile(source_file_path, destination_file_path)


    def replace_class_with_model(file_path):
        # 读取文件内容
        with open(file_path, 'r',encoding='utf-8') as file:
            content = file.read()

        # 使用正则表达式找到第一个'class'后面的单词，并替换为'model'
        # 这个正则表达式会匹配'class'关键字后面的空白字符，然后是单词字符（字母、数字或下划线），捕获这个单词
        new_content = re.sub(r'\bclass\s+\w+\b', 'class model', content, count=1)
        new_content = re.sub(r'\bsuper\(\s*\w+\b', 'super(model', new_content, count=1)

        with open(file_path, 'w') as file:
            file.write(new_content)

    # 调用函数，替换文件中的内容
    replace_class_with_model(destination_file_path)
