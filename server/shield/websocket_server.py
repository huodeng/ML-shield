import asyncio
import websockets
import json
from typing import Set

class WebSocketServer:
    def __init__(self):
        self.clients: Set[websockets.WebSocketServerProtocol] = set()

    async def register(self, websocket: websockets.WebSocketServerProtocol):
        self.clients.add(websocket)
        try:
            await websocket.send(json.dumps({
                'type': 'system',
                'content': '已连接到服务器'
            }))
        except Exception as e:
            print(f"发送欢迎消息失败: {e}")

    async def unregister(self, websocket: websockets.WebSocketServerProtocol):
        self.clients.remove(websocket)

    async def broadcast(self, message: str, msg_type: str = 'terminal'):
        if not self.clients:
            return

        data = json.dumps({
            'type': msg_type,
            'content': message
        })

        for client in self.clients.copy():
            try:
                await client.send(data)
            except websockets.exceptions.ConnectionClosed:
                await self.unregister(client)
            except Exception as e:
                print(f"广播消息失败: {e}")
                await self.unregister(client)

    async def broadcast_json(self, data: dict):
        """直接广播JSON数据"""
        if not self.clients:
            return

        json_data = json.dumps(data)

        for client in self.clients.copy():
            try:
                await client.send(json_data)
            except websockets.exceptions.ConnectionClosed:
                await self.unregister(client)
            except Exception as e:
                print(f"广播JSON消息失败: {e}")
                await self.unregister(client)

    async def handler(self, websocket: websockets.WebSocketServerProtocol):
        await self.register(websocket)
        try:
            async for message in websocket:
                # 处理来自客户端的消息
                print(f"收到客户端消息: {message}")
                try:
                    # 尝试解析JSON消息
                    data = json.loads(message)
                    # 如果是JSON格式，直接转发给所有客户端
                    await self.broadcast_json(data)
                except json.JSONDecodeError:
                    # 如果不是JSON格式，作为普通terminal消息处理
                    await self.broadcast(message, 'terminal')
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)

async def start_websocket_server():
    server = WebSocketServer()
    async with websockets.serve(server.handler, "localhost", 5000):
        print("WebSocket服务器已启动在 ws://localhost:5000")
        await asyncio.Future()  # 运行直到被终止

def run_server():
    asyncio.run(start_websocket_server())

if __name__ == "__main__":
    run_server()