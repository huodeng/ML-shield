import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  return {
    analysisHistory,
    addAnalysisRecord,
    clearHistory,
  }
})
