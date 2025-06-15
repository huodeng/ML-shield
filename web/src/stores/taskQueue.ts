import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MessageApi } from 'naive-ui'

export interface Task {
  id: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  startTime: Date
  endTime?: Date
  result?: any
  error?: string
}

export const useTaskQueueStore = defineStore('taskQueue', () => {
  const tasks = ref<Task[]>([])

  const addTask = (task: Omit<Task, 'id' | 'startTime' | 'status' | 'progress'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      status: 'pending',
      progress: 0
    }
    tasks.value.unshift(newTask)
    return newTask.id
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const taskIndex = tasks.value.findIndex(task => task.id === id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updates }
    }
  }

  const startTask = (id: string) => {
    updateTask(id, { status: 'running', progress: 0 })
  }

  const updateProgress = (id: string, progress: number) => {
    updateTask(id, { progress })
  }

  const completeTask = (id: string, result?: any, message?: MessageApi) => {
    updateTask(id, { 
      status: 'completed', 
      progress: 100, 
      endTime: new Date(),
      result 
    })
    
    // 显示完成通知
    const task = tasks.value.find(t => t.id === id)
    if (task && message) {
      message.success(`任务 "${task.name}" 已完成`, {
        duration: 5000,
        closable: true
      })
    }
  }

  const errorTask = (id: string, error: string, message?: MessageApi) => {
    updateTask(id, { 
      status: 'error', 
      endTime: new Date(),
      error 
    })
    
    // 显示错误通知
    const task = tasks.value.find(t => t.id === id)
    if (task && message) {
      message.error(`任务 "${task.name}" 执行失败: ${error}`, {
        duration: 8000,
        closable: true
      })
    }
  }

  const removeTask = (id: string) => {
    const taskIndex = tasks.value.findIndex(task => task.id === id)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
    }
  }

  const clearCompletedTasks = () => {
    tasks.value = tasks.value.filter(task => task.status !== 'completed')
  }

  const getRunningTasks = () => {
    return tasks.value.filter(task => task.status === 'running')
  }

  const getPendingTasks = () => {
    return tasks.value.filter(task => task.status === 'pending')
  }

  return {
    tasks,
    addTask,
    updateTask,
    startTask,
    updateProgress,
    completeTask,
    errorTask,
    removeTask,
    clearCompletedTasks,
    getRunningTasks,
    getPendingTasks
  }
})