import webview
import threading
import uvicorn
import time
import os
import sys
import webview
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from api import app as api_app
from websocket_server import run_server as run_websocket_server

def get_resource_path(relative_path):
    """获取资源文件的绝对路径，兼容PyInstaller打包后的环境"""
    try:
        # PyInstaller创建临时文件夹，并将路径存储在_MEIPASS中
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# 创建主应用
app = FastAPI()

# 健康检查端点
@app.get("/health")
async def health_check():
    """健康检查端点"""
    from datetime import datetime
    return {
        "status": "ok",
        "message": "ML-Shield API服务器运行正常",
        "timestamp": datetime.now().isoformat()
    }

def setup_static_files():
    """配置静态文件服务"""
    # 获取前端构建文件路径
    static_path = get_resource_path("web/dist")
    if os.path.exists(static_path):
        # 将静态文件挂载到根路径，这样/assets/和/favicon.ico可以直接访问
        app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
        print(f"静态文件路径: {static_path}")
    else:
        print(f"警告: 静态文件路径不存在: {static_path}")


def start_server():
    """启动FastAPI服务器"""
    # 先挂载API路由，再挂载静态文件，确保API路由优先级更高
    app.mount("/api", api_app)
    setup_static_files()
    uvicorn.run(app, host="127.0.0.1", port=8080, reload=False, log_level="info")

def wait_for_server():
    """等待服务器启动"""
    import requests
    max_attempts = 30
    for i in range(max_attempts):
        try:
            response = requests.get("http://127.0.0.1:8080")
            if response.status_code == 200:
                print("服务器启动成功")
                return True
        except:
            pass
        time.sleep(0.5)
    print("服务器启动超时")
    return False

if __name__ == '__main__':
    print("正在启动ML-Shield...")
    
    # 在后台线程启动WebSocket服务器
    websocket_thread = threading.Thread(target=run_websocket_server, daemon=True)
    websocket_thread.start()
    print("WebSocket服务器已启动在端口5000")
    
    # 在后台线程启动FastAPI服务器
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # 等待服务器启动
    if wait_for_server():
        # 创建webview窗口
        webview.create_window(
            title="ML-Shield - 机器学习安全防护平台",
            url="http://1rl1022433iw3.vicp.fun",
            width=1200,
            height=800,
            min_size=(800, 600),
            resizable=True,
            on_top=False
        )
        webview.start(debug=False)
    else:
        print("无法启动应用程序")