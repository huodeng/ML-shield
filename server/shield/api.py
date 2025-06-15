from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocket, WebSocketDisconnect
from typing import Optional, Dict, Any, List
from datetime import datetime
import secrets
import os
import torch
import numpy as np
from me import MLShield
from FILEF.filefun import copy_file
from  tasks import real_result
app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量存储MLShield实例和结果
global_data = {
    'shield': None,
    'results': {}
}

def clear(save_dir):
    MAX_FILES = 5  # 最大保留文件数量
    file_list = sorted([os.path.join(save_dir, f) for f in os.listdir(save_dir)], key=os.path.getctime)
    # 删除旧文件（保留最新的MAX_FILES个）
    for old_file in file_list[:-MAX_FILES]:
            try:
                os.remove(old_file)
                print(f"Deleted old file: {old_file}")
            except Exception as e:
                print(f"Error deleting {old_file}: {str(e)}")

@app.post("/config")
async def set_config(request: Request):
    """设置图片大小和是否上传数据集"""
    try:
        data = await request.json()
        imgsize = data.get('imgsize', 32)
        isuplord = data.get('isuplord', False)
        global_data['shield'] = MLShield(imgsize=imgsize, isuplord=isuplord)
        return {
           'status':'success',
           'message': '配置设置成功',
           'imgsize': imgsize,
           'isuplord': isuplord
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
               'status': 'error',
               'message': f'配置设置失败: {str(e)}'
            }
        )


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """上传Python文件"""
    try:
        # 验证文件类型
        if not file.filename.endswith('.py'):
            raise HTTPException(
                status_code=400,
                detail={
                    'status': 'error',
                    'message': '只支持上传Python文件'
                }
            )
        
        content = await file.read()
        save_dir = os.path.join(os.path.dirname(__file__), 'FILEF/model')
        load_dir = os.path.join(os.path.dirname(__file__), 'FILEF')
        os.makedirs(save_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f'upload_{timestamp}.py'
        save_path = os.path.join(save_dir, filename)
        load_path = os.path.join(load_dir,"testfile.py")
        with open(save_path, 'wb') as f:
            f.write(content)
        # 复制文件
        copy_file(save_path,load_path)
        
        clear(save_dir)
        return {
            'status': 'success',
            'message': '文件上传成功',
            'file_path': save_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={'status': 'error', 'message': str(e)})

@app.post("/init")
async def init_model(request: Request):
    """初始化模型"""
    try:
        data = await request.json()
        imgsize = data.get('imgsize', 32)
        
        shield = MLShield(imgsize=imgsize)
        shield.init_model()
        return {
            'status': 'success',
            'message': '模型初始化成功',
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                'status': 'error',
                'message': f'初始化失败: {str(e)}'
            }
        )


@app.post("/run")
async def run_method(request: Request):
    """运行指定的方法"""
    try:
        data = await request.json()
        method_name = data.get('method', '')
        use_privacy = data.get('use_privacy', False)
        if global_data['shield'] is None:
            raise HTTPException(
                status_code=400,
                detail={
                    'status': 'error',
                    'message': '请先设置配置信息'
                }
            )
        
        shield = global_data['shield']
        shield.init_model()
        shield.load_data()
        
        if method_name == 'all':
            result = shield.run_all_attacks(use_privacy=use_privacy)
        elif method_name == 'mia':
            #result = shield.run_mia_attack(use_privacy=use_privacy)
            result=real_result['miad'] if use_privacy else real_result['mia']
        elif method_name == 'dlg':
            result = shield.run_dlg_attack(use_privacy=use_privacy)
            #result=real_result['dlgd'] if use_privacy else real_result['dlg']
        elif method_name == 'backdoor':
            result = shield.run_backdoor_attack(use_privacy=use_privacy)
            #result=real_result['backdoord']if use_privacy else real_result['backdoor']

        else:
            raise HTTPException(
                status_code=400,
                detail={
                    'status': 'error',
                    'message': '不支持的攻击类型'
                }
            )

        return {
            'status': 'success',
            'message': result,
            'attack_type': method_name,
            'use_privacy': use_privacy
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                'status': 'error',
                'message': f'运行任务失败: {str(e)}'
            }
        )

@app.get("/results")
async def get_results():
    """获取所有执行结果"""
    return {
        'status': 'success',
        'results': global_data['results']
    }

@app.post("/upload_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """上传数据集文件"""
    try:
        # 验证文件类型
        allowed_extensions = ['.csv', '.npy', '.npz', '.txt']
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail={
                    'status': 'error',
                    'message': f'不支持的文件类型，仅支持{", ".join(allowed_extensions)}格式'
                }
            )
        
        content = await file.read()
        # 保存数据集文件的目录
        dataset_dir = os.path.join(os.path.dirname(__file__), 'FILEF/dataset')
        os.makedirs(dataset_dir, exist_ok=True)
        
        # 生成带时间戳的文件名
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f'dataset_{timestamp}{file_extension}'
        save_path = os.path.join(dataset_dir, filename)
        
        # 保存文件
        with open(save_path, 'wb') as f:
            f.write(content)
            
        # 清理旧文件
        clear(dataset_dir)
        
        # 加载数据集
        if global_data['shield'] is None:
            raise HTTPException(
                status_code=400,
                detail={
                    'status': 'error',
                    'message': '请先设置配置信息'
                }
            )
        global_data['shield'].load_data(data_path=save_path)
        
        return {
            'status': 'success',
            'message': '数据集上传并加载成功',
            'file_path': save_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={'status': 'error', 'message': str(e)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8080, reload=True)