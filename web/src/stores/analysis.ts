import { defineStore } from 'pinia'
import { ref } from 'vue'
import modelService, { ModelInfo, LayerInfo } from '@/api/modelService'

export interface AnalysisRecord {
  id: string
  date: string
  modelName: string
  result: {
    score: number
    categories: Array<{
      name: string
      score: number
    }>
    vulnerabilities: Array<{
      type: string
      severity: 'high' | 'medium' | 'low'
      description: string
    }>
    recommendations: string[]
  }
}

export const useAnalysisStore = defineStore('analysis', () => {
  const analysisHistory = ref<AnalysisRecord[]>([])

  const addAnalysisRecord = (record: AnalysisRecord) => {
    analysisHistory.value.unshift(record)
    // 只保留最近的20条记录
    if (analysisHistory.value.length > 20) {
      analysisHistory.value.pop()
    }
    // 保存到本地存储
    localStorage.setItem('analysis-history', JSON.stringify(analysisHistory.value))
  }

  const loadHistory = () => {
    const saved = localStorage.getItem('analysis-history')
    if (saved) {
      try {
        analysisHistory.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load analysis history:', e)
      }
    }
  }

  const clearHistory = () => {
    analysisHistory.value = []
    localStorage.removeItem('analysis-history')
  }

  // 初始化时加载历史记录
  loadHistory()

  // 获取模型信息
  const getModelInfo = async (): Promise<ModelInfo> => {
    return await modelService.getModelInfo()
  }

  // 获取模型层信息
  const getModelLayers = async (): Promise<LayerInfo[]> => {
    return await modelService.getModelLayers()
  }

  // 获取特征图数据
  const getFeatureMaps = async (layerId: string): Promise<Float32Array> => {
    return await modelService.getFeatureMaps(layerId)
  }

  // 获取权重数据
  const getWeights = async (layerId: string): Promise<Float32Array> => {
    return await modelService.getWeights(layerId)
  }

  // 获取激活数据
  const getActivations = async (layerId: string): Promise<Float32Array> => {
    return await modelService.getActivations(layerId)
  }

  return {
    analysisHistory,
    addAnalysisRecord,
    clearHistory,
    getModelInfo,
    getModelLayers,
    getFeatureMaps,
    getWeights,
    getActivations
  }
})
