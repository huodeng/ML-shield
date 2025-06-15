# ML-Shield

一个全面的机器学习模型安全性与隐私风险评估平台

## 🚀 项目简介

ML-Shield 是一个专业的机器学习模型安全评估平台，旨在帮助开发者和研究人员全面评估AI模型的安全性和隐私风险。平台提供多种攻击检测、防御验证和可视化分析功能，确保模型部署的安全性与可靠性。

## ✨ 主要功能

### 🛡️ 对抗鲁棒性评估
- 支持 FGSM、PGD、C&W 等主流对抗攻击方法
- 全面评估模型的安全性能
- 提供攻击成功率和鲁棒性指标

### 🔒 隐私风险评估
- 成员推理攻击检测
- 属性推断攻击分析
- 模型反演攻击评估
- 数据泄露风险量化

### 🛠️ 防御措施验证
- 差分隐私机制验证
- 对抗训练效果评估
- 模型蒸馏防御测试
- 防御策略有效性分析

### 📊 可视化分析
- 多维度攻击效果展示
- 防御效果可视化
- 神经网络结构可视化
- 实时任务进度监控

## 🏗️ 项目结构

```
ML-shield/
├── web/                    # 前端应用
│   ├── src/
│   │   ├── components/     # Vue组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # 状态管理
│   │   └── layouts/        # 布局组件
│   └── package.json
├── server/                 # 后端服务
│   └── shield/
│       ├── api.py          # API接口
│       ├── tasks.py        # 任务处理
│       ├── BACKDOOR/       # 后门攻击模块
│       ├── DLG/            # 深度泄露梯度
│       ├── FILEF/          # 文件攻击
│       └── MIA/            # 成员推理攻击
└── docs/                   # 文档
    └── guide/              # 使用指南
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Python >= 3.8
- npm 或 pnpm

### 前端安装

```bash
cd web
npm install
# 或
pnpm install
```

### 后端安装

```bash
cd server
pip install -r requirements.txt
```

### 启动开发服务器

#### 前端开发服务器
```bash
cd web
npm run dev
```

#### 后端服务器
```bash
cd server/shield
python api.py
```

### 访问应用

- 前端应用: http://localhost:5173
- 后端API: http://localhost:8000

## 📖 使用指南

### 1. 数据集上传
- 支持多种格式的数据集上传
- 自动数据预处理和验证
- 安全的数据存储管理

### 2. 模型分析
- 上传训练好的模型文件
- 选择分析类型和参数
- 查看详细的分析报告

### 3. 神经网络可视化
- 3D网络结构展示
- 层级信息详细显示
- 交互式网络探索

## 🔧 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Naive UI** - 现代化UI组件库
- **Vite** - 快速构建工具
- **Pinia** - 状态管理
- **Three.js** - 3D可视化

### 后端
- **Python** - 主要编程语言
- **FastAPI** - 现代化API框架
- **PyTorch** - 深度学习框架
- **NumPy** - 数值计算
- **WebSocket** - 实时通信

## 📚 文档

详细文档请访问：[ML-Shield 使用指南](https://huodeng.github.io/shield-ml/)

- [快速开始](docs/guide/quick-start.md)
- [模型分析](docs/guide/model-analysis.md)
- [数据集上传](docs/guide/dataset-upload.md)
- [安全评估](docs/guide/security-assessment.md)
- [常见问题](docs/guide/faq.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和研究人员。

## 📞 联系我们

如有任何问题或建议，请通过以下方式联系我们：

- 项目主页：[ML-Shield](https://huodeng.github.io/shield-ml/)
- 问题反馈：[GitHub Issues](https://github.com/your-username/ML-shield/issues)

---

**ML-Shield** - 保护您的AI资产，预防安全漏洞，确保模型部署的安全性与可靠性。