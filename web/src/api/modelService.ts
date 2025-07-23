import axios from 'axios'

// 模型信息接口定义
export interface ModelInfo {
  name: string
  totalParams: number
  accuracy: number
  inputShape: number[]
  outputShape: number[]
  description: string
}

// 神经网络层信息接口定义
export interface LayerInfo {
  name: string
  type: string
  shape: number[]
  params?: number
  kernelSize?: number
  stride?: number
  padding?: number
  activation?: string
}

// 模型服务类
class ModelService {
  // 获取模型信息
  async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await axios.get('/api/model/info')
      const data = response.data
      // 将snake_case转换为camelCase
      return {
        name: data.name,
        totalParams: data.total_params,
        accuracy: data.accuracy,
        inputShape: data.input_shape,
        outputShape: data.output_shape,
        description: data.description
      }
    } catch (error) {
      console.error('获取模型信息失败:', error)
      // 返回默认模型信息
      return {
        name: '卷积神经网络模型',
        totalParams: 1630154,
        accuracy: 0.92,
        inputShape: [32, 32, 3],
        outputShape: [10],
        description: '这是一个用于图像分类的CNN模型，包含2个卷积层、2个池化层和2个全连接层。'
      }
    }
  }

  // 获取模型层信息
  async getModelLayers(): Promise<LayerInfo[]> {
    try {
      const response = await axios.get('/api/model/layers')
      const data = response.data
      // 将snake_case转换为camelCase
      return data.map((layer: any) => ({
        name: layer.name,
        type: layer.type,
        shape: layer.shape,
        params: layer.params,
        kernelSize: layer.kernel_size,
        stride: layer.stride,
        padding: layer.padding,
        activation: layer.activation
      }))
    } catch (error) {
      console.error('获取模型层信息失败:', error)
      // 返回默认模型层信息
      return [
        { type: 'input', name: '输入层', shape: [32, 32, 3], params: 0 },
        { 
          type: 'conv', 
          name: '卷积层1', 
          shape: [32, 32, 32], 
          params: 896, 
          kernelSize: 3, 
          stride: 1, 
          padding: 1, 
          activation: 'ReLU' 
        },
        { 
          type: 'pool', 
          name: '池化层1', 
          shape: [16, 16, 32], 
          params: 0, 
          kernelSize: 2, 
          stride: 2 
        },
        { 
          type: 'conv', 
          name: '卷积层2', 
          shape: [14, 14, 64], 
          params: 18496, 
          kernelSize: 3, 
          stride: 1, 
          padding: 0, 
          activation: 'ReLU' 
        },
        { 
          type: 'pool', 
          name: '池化层2', 
          shape: [7, 7, 64], 
          params: 0, 
          kernelSize: 2, 
          stride: 2 
        },
        { 
          type: 'fc', 
          name: '全连接层1', 
          shape: [512], 
          params: 1605632, 
          activation: 'ReLU' 
        },
        { 
          type: 'fc', 
          name: '全连接层2', 
          shape: [10], 
          params: 5130 
        }
      ]
    }
  }

  // 获取特征图数据
  async getFeatureMaps(layerId: string): Promise<Float32Array> {
    try {
      const response = await axios.get(`/api/model/feature-maps/${layerId}`)
      return new Float32Array(response.data)
    } catch (error) {
      console.error('获取特征图数据失败:', error)
      // 返回模拟数据
      return new Float32Array(32 * 32).map(() => Math.random())
    }
  }

  // 获取权重数据
  async getWeights(layerId: string): Promise<Float32Array> {
    try {
      const response = await axios.get(`/api/model/weights/${layerId}`)
      return new Float32Array(response.data)
    } catch (error) {
      console.error('获取权重数据失败:', error)
      // 返回模拟数据
      return new Float32Array(32 * 32).map(() => Math.random() * 2 - 1)
    }
  }

  // 获取激活数据
  async getActivations(layerId: string): Promise<Float32Array> {
    try {
      const response = await axios.get(`/api/model/activations/${layerId}`)
      return new Float32Array(response.data)
    } catch (error) {
      console.error('获取激活数据失败:', error)
      // 返回模拟数据
      return new Float32Array(32 * 32).map(() => Math.max(0, Math.random()))
    }
  }
}

export default new ModelService()