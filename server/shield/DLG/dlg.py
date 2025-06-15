import torch
import torchvision
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms
import numpy as np
from matplotlib import pyplot as plt
import torch.nn.functional as F
import websockets
import asyncio
import sys
from DLG.fedavgd import FedAVGAPId, FedAVGClientd, FedAVGServerd
from DLG.fedavgs import FedAVGAPI, FedAVGClient, FedAVGServer
from torch.utils.data import DataLoader, TensorDataset
from DLG.inversion import GradientInversionAttackServerManager
from torch.utils.data.dataset import Dataset
from opacus import *
from FILEF.testfile import model
from skimage.metrics import structural_similarity as ssim
import os
class WebSocketPrinter:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        
    async def _send_message(self, message):
        try:
            async with websockets.connect(self.ws_url) as websocket:
                await websocket.send(message)
        except Exception as e:
            print(f"WebSocket error: {e}", file=sys.stderr)
            
    def print(self, *args, **kwargs):
        message = " ".join(str(arg) for arg in args)
        self.loop.run_until_complete(self._send_message(message))
        
ws_printer = WebSocketPrinter("ws://localhost:5000")
def dlg(net,isuplord,dataset,imgsize):
    device = torch.device("cpu") 
    channelnum=net.conv1.in_channels
    class NumpyDataset(Dataset):

        def __init__(self, x, y=None, transform=None, return_idx=False):
            self.x = x
            self.y = y
            self.transform = transform
            self.return_idx = return_idx

        def __getitem__(self, index):
            x = self.x[index]
            if self.y is not None:
                y = self.y[index]

            if self.transform is not None:
                x = self.transform(x)

            if not self.return_idx:
                if self.y is not None:
                    return x, y
                else:
                    return x
            else:
                if self.y is not None:
                    return index, x, y
                else:
                    return index, x

        def __len__(self):
            """get the number of rows of self.x"""
            return len(self.x)

    def prepare_dataloader1(path=None, batch_size=64, shuffle=True):
        if path is None:
            path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        at_t_dataset_train = torchvision.datasets.MNIST(
            root=path, train=True, download=True
        )

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))]
        )

        dataset = NumpyDataset(
            at_t_dataset_train.train_data.numpy(),
            at_t_dataset_train.train_labels.numpy(),
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader2(path=None, batch_size=64, shuffle=True):
        # 使用CIFAR-10数据集
        if path is None:
            path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        at_t_dataset_train = torchvision.datasets.CIFAR10(
            root=path, train=True, download=True
        )

        # CIFAR-10的归一化参数
        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
        )

        # 直接使用at_t_dataset_train.data和at_t_dataset_train.targets，它们已经是numpy.ndarray类型
        dataset = NumpyDataset(
            at_t_dataset_train.data,
            at_t_dataset_train.targets,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader3(batch_size=64, shuffle=True,imgsize=imgsize):
       

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))]
        )
        X_train = np.array(dataset['X_train'], dtype=np.float32) 
        y_train = np.array(dataset['y_train'], dtype=np.int64)
        X_train = X_train.reshape(-1, imgsize, imgsize)

        dataset1 = NumpyDataset(
            X_train,
            y_train,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset1, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader4(batch_size=64, shuffle=True,imgsize=imgsize):
       

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,),(0.5,))]
        )
        X_train = np.array(dataset['X_train'], dtype=np.float32).reshape(-1, imgsize, imgsize, 3)
        y_train = np.array(dataset['y_train'], dtype=np.int64)

        dataset1 = NumpyDataset(
            X_train,
            y_train,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset1, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    torch.manual_seed(7777)
    if not isuplord:
        if channelnum==1:
           
            dataloader = prepare_dataloader1()
        elif channelnum==3:
            
            dataloader = prepare_dataloader2()
    elif isuplord:
        if channelnum==1:
            
            dataloader = prepare_dataloader3()
        elif channelnum==3:
            
            dataloader = prepare_dataloader4()

    ws_printer.print("梯度反演攻击：尝试复原数据集中前三张图片")
    ws_printer.print("未使用隐私保护")

    device = torch.device("cuda:0") if torch.cuda.is_available() else "cpu"
    
    criterion = nn.CrossEntropyLoss()
    all_generated_images = []
    i = 0

    for data in dataloader:
        if i == 3:
            break
        xs, ys = data[0], data[1]
        x = xs.to(device)


        if not isuplord:
            if channelnum==1:
                manager = GradientInversionAttackServerManager(
                    (1, 28, 28),
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
            elif channelnum==3:
                manager = GradientInversionAttackServerManager(
                    (3, 32, 32),  # CIFAR-10 是 3 通道的 32x32 图像
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
        elif issubclass:
            if channelnum==1:
                manager = GradientInversionAttackServerManager(
                    (1, imgsize, imgsize),
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
            elif channelnum==3:
                manager = GradientInversionAttackServerManager(
                    (3, imgsize, imgsize),  
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )


        DLGFedAVGServer = manager.attach(FedAVGServer)
        net=model().to(device)

        local_dataloaders = DataLoader(TensorDataset(x[i:i+1], ys[i:i+1]))
        local_optimizers = optim.SGD(net.parameters(), lr=1.0)


        local_optimizers=local_optimizers
        client = FedAVGClient(
            net,
            lr=1.0,
            device=device,
        )
        server = DLGFedAVGServer(
            [client],
            model().to(device),
            lr=1.0,
            device=device,
        )

        

        local_optimizers=[local_optimizers]
        local_dataloaders=[local_dataloaders]
        
               
        api = FedAVGAPI(
            server,
            [client],
            criterion,
            local_optimizers,
            local_dataloaders,
            num_communication=1,
            local_epoch=1,
            use_gradients=True,
            device=device,
        )

        api.run()
        all_generated_images.extend(server.attack_results[0])
        i += 1
        
    mse_values = []
    ssim_values = []

    for idx,result in enumerate(all_generated_images):
    # 计算 MSE
        true_image = x[0]
        generated_image = result[0].cpu().detach().numpy().squeeze()
        mse = F.mse_loss(result[0], true_image)  # 这里假设 gt_data 是对应的真实图像
        mse_values.append(mse.item())
        # 计算 SSIM
        ssim_value = ssim(true_image.cpu().detach().numpy().squeeze(), generated_image, data_range=generated_image.max() - generated_image.min(),win_size=3)
        ssim_values.append(ssim_value)
        ws_printer.print(f"Generated Image {idx + 1} MSE: {mse:.6f}, SSIM:{ssim_value:.6f}")

    # 图像预处理和压缩
    import base64
    import io
    from PIL import Image
    
    processed_images = []
    base64_images = []
    for result in all_generated_images:
        img = result[0].cpu().detach().numpy()[0][0]
        # 归一化到0-255范围
        img = ((img - img.min()) * 255 / (img.max() - img.min())).astype(np.uint8)
        processed_images.append(img)
        
        # 转换为base64
        img_pil = Image.fromarray(img)
        buffer = io.BytesIO()
        img_pil.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        base64_images.append(img_str)

    # 显示图片（可选）
    fig = plt.figure(figsize=(10, 5))
    for s, img in enumerate(processed_images):
        ax = fig.add_subplot(1, len(processed_images), s + 1)
        ax.imshow(img, cmap="gray")
        ax.axis("off")
    plt.tight_layout()

    # 返回优化后的结果与图片
    results = {
        'mse_values': mse_values,
        'ssim_values': ssim_values,
        'images': base64_images,  # 现在返回base64字符串
    }   
    return results

def dlgd(net,isuplord,dataset,imgsize,params):
    device = torch.device("cpu") 
    channelnum=net.conv1.in_channels
    class NumpyDataset(Dataset):

        def __init__(self, x, y=None, transform=None, return_idx=False):
            self.x = x
            self.y = y
            self.transform = transform
            self.return_idx = return_idx

        def __getitem__(self, index):
            x = self.x[index]
            if self.y is not None:
                y = self.y[index]

            if self.transform is not None:
                x = self.transform(x)

            if not self.return_idx:
                if self.y is not None:
                    return x, y
                else:
                    return x
            else:
                if self.y is not None:
                    return index, x, y
                else:
                    return index, x

        def __len__(self):
            return len(self.x)

    def prepare_dataloader1(path=None, batch_size=params['batch_size'], shuffle=True):
        if path is None:
            path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        at_t_dataset_train = torchvision.datasets.MNIST(
            root=path, train=True, download=True
        )

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))]
        )

        dataset = NumpyDataset(
            at_t_dataset_train.train_data.numpy(),
            at_t_dataset_train.train_labels.numpy(),
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader2(path=None, batch_size=params['batch_size'], shuffle=True):
        # 使用CIFAR-10数据集
        if path is None:
            path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
        at_t_dataset_train = torchvision.datasets.CIFAR10(
            root=path, train=True, download=True
        )

        # CIFAR-10的归一化参数
        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
        )

        # 直接使用at_t_dataset_train.data和at_t_dataset_train.targets，它们已经是numpy.ndarray类型
        dataset = NumpyDataset(
            at_t_dataset_train.data,
            at_t_dataset_train.targets,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader3(batch_size=params['batch_size'], shuffle=True):
       

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))]
        )
        X_train = np.array(dataset['X_train'], dtype=np.float32) 
        y_train = np.array(dataset['y_train'], dtype=np.int64)
        X_train = X_train.reshape(-1, 28, 28)

        dataset1 = NumpyDataset(
            X_train,
            y_train,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset1, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    def prepare_dataloader4(batch_size=params['batch_size'], shuffle=True,imgsize=imgsize):
       

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,),(0.5,))]
        )
        X_train = np.array(dataset['X_train'], dtype=np.float32).reshape(-1, imgsize, imgsize, 3)
        y_train = np.array(dataset['y_train'], dtype=np.int64)

        dataset1 = NumpyDataset(
            X_train,
            y_train,
            transform=transform,
        )

        dataloader = torch.utils.data.DataLoader(
            dataset1, batch_size=batch_size, shuffle=shuffle, num_workers=0
        )
        return dataloader
    torch.manual_seed(7777)
    if not isuplord:
        if channelnum==1:
           
            dataloader = prepare_dataloader1()
        elif channelnum==3:
            
            dataloader = prepare_dataloader2()
    elif isuplord:
        if channelnum==1:
            
            dataloader = prepare_dataloader3()
        elif channelnum==3:
            
            dataloader = prepare_dataloader4()

    ws_printer.print("梯度反演攻击：尝试复原数据集中前三张图片")
    ws_printer.print(" 使用隐私保护")

    device = torch.device("cuda:0") if torch.cuda.is_available() else "cpu"
    
    criterion = nn.CrossEntropyLoss()
    all_generated_images = []
    i = 0

    for data in dataloader:
        if i == 3:
            break
        xs, ys = data[0], data[1]
        x = xs.to(device)


        if not isuplord:
            if channelnum==1:
                manager = GradientInversionAttackServerManager(
                    (1, 28, 28),
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
            elif channelnum==3:
                manager = GradientInversionAttackServerManager(
                    (3, 32, 32),  # CIFAR-10 是 3 通道的 32x32 图像
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
        elif issubclass:
            if channelnum==1:
                manager = GradientInversionAttackServerManager(
                    (1, imgsize, imgsize),
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
            elif channelnum==3:
                manager = GradientInversionAttackServerManager(
                    (3, imgsize, imgsize),  
                    num_trial_per_communication=5,
                    log_interval=0,
                    num_iteration=300,
                    distancename="l2",
                    device=device,
                    lr=1.0,
                )
        DLGFedAVGServer = manager.attach(FedAVGServerd)
        net=model().to(device)

        local_dataloaders = DataLoader(TensorDataset(x[i:i+1], ys[i:i+1]))
        local_optimizers = optim.SGD(net.parameters(), lr=1.0)
        privacy_engine = PrivacyEngine()
        net, local_optimizers, local_dataloaders = privacy_engine.make_private(
             module=net,
             optimizer=local_optimizers,
             data_loader=local_dataloaders,
             noise_multiplier=params['noise_multiplier'],
             max_grad_norm=params['max_grad_norm'],
        )


        local_optimizers=[local_optimizers]
        client = FedAVGClientd(
            net,
            lr=1.0,
            device=device,
        )
        server = DLGFedAVGServer(
            [client],
            model().to(device),
            lr=1.0,
            device=device,
        )

        

        local_optimizers=local_optimizers
        local_dataloaders=[local_dataloaders]
        api = FedAVGAPId(
            server,
            [client],
            criterion,
            local_optimizers,
            local_dataloaders,
            num_communication=1,
            local_epoch=1,
            use_gradients=True,
            device=device,
        )

        api.run()
        all_generated_images.extend(server.attack_results[0])
        i += 1
        
    epsilon = privacy_engine.accountant.get_epsilon(delta=1e-5)
    ws_printer.print("epsilon:",epsilon)
    mse_values = []
    ssim_values = []

    for idx,result in enumerate(all_generated_images):
        # 计算 MSE
        true_image = x[0]
        generated_image = result[0].cpu().detach().numpy().squeeze()
        mse = F.mse_loss(result[0], true_image)  # 这里假设 gt_data 是对应的真实图像
        mse_values.append(mse.item())
        # 计算 SSIM
        ssim_value = ssim(true_image.cpu().detach().numpy().squeeze(), generated_image, data_range=generated_image.max() - generated_image.min(),win_size=3)
        ssim_values.append(ssim_value)
        ws_printer.print(f"Generated Image {idx + 1} MSE: {mse:.6f}, SSIM:{ssim_value:.6f}")

    # fig = plt.figure(figsize=(10, 5))
    # for s, result in enumerate(all_generated_images):
    #     ax = fig.add_subplot(1, len(all_generated_images), s + 1)
    #     ax.imshow(result[0].cpu().detach().numpy()[0][0], cmap="gray")
    #     ax.axis("off")
    # plt.tight_layout()
    # plt.show()
    import base64
    import io
    from PIL import Image
    
    processed_images = []
    base64_images = []
    for result in all_generated_images:
        img = result[0].cpu().detach().numpy()[0][0]
        # 归一化到0-255范围
        img = ((img - img.min()) * 255 / (img.max() - img.min())).astype(np.uint8)
        processed_images.append(img)
        
        # 转换为base64
        img_pil = Image.fromarray(img)
        buffer = io.BytesIO()
        img_pil.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        base64_images.append(img_str)

    # 显示图片（可选）
    fig = plt.figure(figsize=(10, 5))
    for s, img in enumerate(processed_images):
        ax = fig.add_subplot(1, len(processed_images), s + 1)
        ax.imshow(img, cmap="gray")
        ax.axis("off")
    plt.tight_layout()
    plt.show()
    #返回结果与图片
    results = {
       'mse_values': mse_values,
       'ssim_values': ssim_values,
        'images': base64_images,  # 现在返回base64字符串列表
        'epsilon':epsilon
    }
    return results