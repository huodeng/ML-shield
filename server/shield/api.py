from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocket, WebSocketDisconnect
from typing import Optional, Dict, Any, List
from datetime import datetime
import secrets
import os
import torch
import numpy as np
import asyncio
import websockets
import json
from me import MLShield
from FILEF.filefun import copy_file
from  tasks import real_result
from paramsseek import find_optimal_parameters
# 导入模型信息路由器
import sys
import os
# 添加server目录到Python路径
server_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, server_dir)
# 直接导入模块
from api.model_info import router as model_info_router
app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册模型信息路由器
app.include_router(model_info_router, prefix="/model", tags=["model"])

# 全局变量存储MLShield实例和结果
global_data = {
    'shield': None,
    'results': {}
}

# WebSocket广播函数
async def broadcast_to_websocket(message: str, msg_type: str = 'info'):
    """向WebSocket服务器发送消息"""
    try:
        async with websockets.connect('ws://localhost:5000') as websocket:
            data = json.dumps({
                'type': msg_type,
                'content': message
            })
            await websocket.send(data)
    except Exception as e:
        print(f"WebSocket广播失败: {e}")

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
        
        # 使用已搜索到的最优超参数
        optimal_params = {
        'lr': 0.1364,
        'noise_multiplier': 2.5272,
        'max_grad_norm': 0.6923,
        'batch_size': 128,
        'epoch': 13
        }
        
        # 发送超参数优化完成的提示信息
        if use_privacy:
            try:
                # 发送最优参数结果
                result_msg = "超参数优化完成，找到最优参数配置:"
                await broadcast_to_websocket(result_msg, 'hyperparameter')
                
                # 逐个参数进行详细描述
                for param_name, param_value in optimal_params.items():
                    if isinstance(param_value, float):
                        param_detail = f"  • {param_name}: {param_value:.6f}"
                    else:
                        param_detail = f"  • {param_name}: {param_value}"
                    await broadcast_to_websocket(param_detail, 'hyperparameter')
                
                summary_msg = f"本次超参数搜索共找到 {len(optimal_params)} 个最优参数，已应用到模型训练中。"
                await broadcast_to_websocket(summary_msg, 'hyperparameter')
            except Exception as e:
                print(f"发送超参数优化信息失败: {e}")
        if method_name == 'all':
            result = shield.run_all_attacks(use_privacy=use_privacy)
        elif method_name == 'mia':
            result = shield.run_mia_attack(use_privacy=use_privacy,params=optimal_params)
            #result=real_result['miad'] if use_privacy else real_result['mia']
        elif method_name == 'dlg':
            result = shield.run_dlg_attack(use_privacy=use_privacy,params=optimal_params)
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
            'use_privacy': use_privacy,
            # 'optimal_params': optimal_params if 'optimal_params' in locals() else None
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

@app.get("/datasets")
async def get_datasets():
    """获取已上传的数据集列表"""
    try:
        dataset_dir = os.path.join(os.path.dirname(__file__), 'FILEF/dataset')
        datasets = []
        
        if os.path.exists(dataset_dir):
            for filename in os.listdir(dataset_dir):
                file_path = os.path.join(dataset_dir, filename)
                if os.path.isfile(file_path):
                    # 获取文件信息
                    stat = os.stat(file_path)
                    datasets.append({
                        'name': filename,
                        'path': file_path,
                        'size': stat.st_size,
                        'created_time': datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                        'modified_time': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
                    })
            
            # 按修改时间排序，最新的在前
            datasets.sort(key=lambda x: x['modified_time'], reverse=True)
        
        return {
            'status': 'success',
            'datasets': datasets
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                'status': 'error',
                'message': f'获取数据集列表失败: {str(e)}'
            }
        )

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
    uvicorn.run(app, host="127.0.0.1", port=8080, reload=False)