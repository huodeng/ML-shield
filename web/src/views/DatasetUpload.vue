<template>
  <div class="dataset-upload">
    <div class="cards-container">
      <!-- 基本配置卡片 -->
      <div class="card config-card" :class="{ 'dark': isDark }">
        <div class="card-header">
          <h3>基本配置</h3>
        </div>
        
        <form class="config-form" @submit.prevent>
          <!-- 图片大小设置 -->
          <div class="form-item">
            <label>图片大小</label>
            <div class="select-wrapper">
              <input
                type="number"
                :value="formData.imgsize"
                @change="e => handleImgsizeChange(Number(e.target.value))"
                class="custom-select"
                list="imgsizeList"
                placeholder="32"
                min="1"
                max="512"
              >
            </div>
          </div>

          <!-- 是否上传数据集 -->
          <div class="form-item">
            <label>上传数据集</label>
            <div class="switch-wrapper">
              <label class="switch">
                <input 
                  type="checkbox" 
                  :checked="formData.isuplord"
                  @change="e => handleIsuploadChange(e.target.checked)"
                >
                <span class="slider"></span>
                <span class="switch-text">{{ formData.isuplord ? '是' : '否' }}</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- 数据集上传卡片 -->
      <div v-if="formData.isuplord" class="card upload-card" :class="{ 'dark': isDark }">
        <div class="card-header">
          <h3>数据集上传</h3>
        </div>

        <div 
          class="upload-area"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input 
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileSelect"
          >
          <div class="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </div>
          <div class="upload-text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploadState.isUploading" class="upload-progress">
          <div class="progress-info">
            <span class="file-name">{{ uploadState.fileName }}</span>
            <span class="file-size">{{ uploadState.fileSize }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadState.progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ uploadState.progress }}%</div>
        </div>

        <!-- 状态提示 -->
        <div 
          v-if="message.show" 
          class="alert" 
          :class="message.type"
        >
          <span class="alert-icon">{{ message.type === 'success' ? '✓' : '✕' }}</span>
          <span class="alert-content">{{ message.content }}</span>
          <button class="alert-close" @click="message.show = false">×</button>
        </div>
      </div>

      <!-- 已上传数据集列表 -->
      <div v-if="formData.isuplord" class="card uploaded-datasets-card" :class="{ 'dark': isDark }">
        <div class="card-header">
          <h3>已上传数据集</h3>
          <button 
            class="refresh-btn" 
            @click="fetchUploadedDatasets"
            :disabled="isLoadingDatasets"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="{ 'spinning': isLoadingDatasets }">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            刷新
          </button>
        </div>
        
        <div v-if="isLoadingDatasets" class="loading-state">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>
        
        <div v-else-if="uploadedDatasets.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          <p>暂无已上传的数据集</p>
        </div>
        
        <div v-else class="datasets-list">
          <div 
            v-for="dataset in uploadedDatasets" 
            :key="dataset.id"
            class="dataset-list-item"
          >
            <div class="dataset-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8l6-6V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div class="dataset-info">
              <div class="dataset-name">{{ dataset.name }}</div>
              <div class="dataset-meta">
                <span class="dataset-size">{{ formatFileSize(dataset.size) }}</span>
                <span class="dataset-date">{{ new Date(dataset.uploadTime).toLocaleDateString() }}</span>
                <span class="dataset-type">{{ dataset.type }}</span>
              </div>
            </div>
            <div class="dataset-actions">
              <button 
                class="action-btn download-btn"
                @click="downloadDataset(dataset.id, dataset.name)"
                title="下载"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </button>
              <button 
                class="action-btn delete-btn"
                @click="deleteDataset(dataset.id, dataset.name)"
                title="删除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

     <!-- 默认数据集展示 -->
     <div v-else class="card default-dataset-card" :class="{ 'dark': isDark }">
        <div class="card-header">
          <h3>默认数据集</h3>
        </div>
        <div class="dataset-info">
          <div class="dataset-item" @click="() => openDatasetInfo({name: 'MNIST', description: 'MNIST 是一个手写数字的图像数据集，包含60000个训练样本和10000个测试样本。', samples: '60,000', format: '28x28 灰度图像', applications: '手写数字识别, OCR技术开发, 机器学习入门教学', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/27/MnistExamples.png'})">
            <h4>MNIST 数据集</h4>
            <p>MNIST 是一个手写数字的图像数据集，常用于图像分类任务。</p>
            
          </div>
          <div class="dataset-item" @click="() => openDatasetInfo({name: 'CIFAR-10', description: 'CIFAR-10 是一个包含10个类别的彩色图像数据集，每个类别有6000张图像。', samples: '60,000', format: '32x32 RGB图像', applications: '图像分类, 物体识别, 深度学习模型训练', imageUrl: 'https://complex-valued-neural-networks.readthedocs.io/en/latest/_images/code_examples_cifar10_6_0.png'})">
            <h4>CIFAR-10 数据集</h4>
            <p>CIFAR-10 是一个包含10个类别的彩色图像数据集，常用于图像识别任务。</p>
          
          </div>
        </div>
      </div>

      <!-- 数据集详情抽屉 -->
      <dataset-info-drawer ref="datasetDrawer" :dataset="currentDataset" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useStorage } from '@vueuse/core'
import DatasetInfoDrawer from '../components/DatasetInfoDrawer.vue'

// 使用useStorage持久化表单数据
const isDark = useStorage('theme-mode', false)
const formData = useStorage('dataset-upload-form', {
  imgsize: 32,
  isuplord: true
})

// 消息提示状态
const message = reactive({
  show: false,
  content: '',
  type: 'success'
})
const datasetDrawer = ref(null)
const currentDataset = ref({})

// 上传状态
const uploadState = reactive({
  isUploading: false,
  progress: 0,
  fileName: '',
  fileSize: ''
})

// 已上传数据集列表
const uploadedDatasets = ref([])
const isLoadingDatasets = ref(false)

// 显示消息提示
const showMessage = (content, type = 'success') => {
  message.show = true
  message.content = content
  message.type = type
}
const openDatasetInfo = (dataset) => {
  currentDataset.value = dataset
  datasetDrawer.value?.open()
}

// 处理配置变更
const handleConfigChange = async () => {
  try {
    const response = await axios.post('/api/config', {
      imgsize: formData.value.imgsize,
      isuplord: formData.value.isuplord
    })
    if (response.data.status === 'success') {
      showMessage('配置更新成功')
    }
  } catch (error) {
    showMessage(error.response?.data?.detail?.message || '配置更新失败', 'error')
  }
}

// 处理图片大小变化
const handleImgsizeChange = (value) => {
  formData.value.imgsize = value
  handleConfigChange()
}

// 处理是否上传数据集变化
const handleIsuploadChange = (value) => {
  formData.value.isuplord = value
  handleConfigChange()
  // 如果开启上传功能，获取数据集列表
  if (value) {
    fetchUploadedDatasets()
  }
}

// 下载数据集
const downloadDataset = async (datasetId, datasetName) => {
  try {
    const response = await axios.get(`/api/datasets/${datasetId}/download`, {
      responseType: 'blob'
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', datasetName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    showMessage('数据集下载成功')
  } catch (error) {
    showMessage(error.response?.data?.detail?.message || '数据集下载失败', 'error')
  }
}

// 处理上传成功
const handleUploadSuccess = (response) => {
  if (response.status === 'success') {
    showMessage('数据集上传成功')
  }
}

// 处理上传错误
const handleUploadError = (error) => {
  showMessage(error.message || '数据集上传失败', 'error')
}

// 处理上传进度
const handleUploadProgress = (event) => {
  if (event.lengthComputable) {
    uploadState.progress = Math.round((event.loaded / event.total) * 100)
  }
}

// 获取已上传数据集列表
const fetchUploadedDatasets = async () => {
  isLoadingDatasets.value = true
  try {
    const response = await axios.get('/api/datasets')
    if (response.data.status === 'success') {
      uploadedDatasets.value = response.data.datasets || []
    }
  } catch (error) {
    console.error('获取数据集列表失败:', error)
  } finally {
    isLoadingDatasets.value = false
  }
}

// 删除数据集
const deleteDataset = async (datasetId, datasetName) => {
  if (!confirm(`确定要删除数据集 "${datasetName}" 吗？此操作不可撤销。`)) {
    return
  }
  
  try {
    const response = await axios.delete(`/api/datasets/${datasetId}`)
    if (response.data.status === 'success') {
      showMessage('数据集删除成功')
      await fetchUploadedDatasets() // 刷新列表
    }
  } catch (error) {
    showMessage(error.response?.data?.detail?.message || '数据集删除失败', 'error')
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组件挂载时获取数据集列表
onMounted(() => {
  if (formData.value.isuplord) {
    fetchUploadedDatasets()
  }
})

const fileInput = ref(null)

// 触发文件选择框
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件类型
  const allowedTypes = ['.csv', '.npy', '.npz', '.txt']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!allowedTypes.includes(fileExt)) {
    showMessage(`不支持的文件类型，仅支持${allowedTypes.join(', ')}格式`, 'error')
    return
  }

  await uploadFile(file)
}

// 处理文件拖放
const handleFileDrop = async (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  
  // 验证文件类型
  const allowedTypes = ['.csv', '.npy', '.npz', '.txt']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!allowedTypes.includes(fileExt)) {
    showMessage(`不支持的文件类型，仅支持${allowedTypes.join(', ')}格式`, 'error')
    return
  }

  await uploadFile(file)
}

// 上传文件
const uploadFile = async (file) => {
  // 设置上传状态
  uploadState.isUploading = true
  uploadState.progress = 0
  uploadState.fileName = file.name
  uploadState.fileSize = formatFileSize(file.size)
  
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('/api/upload_dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: handleUploadProgress
    })
    handleUploadSuccess(response.data)
    // 上传成功后刷新数据集列表
    await fetchUploadedDatasets()
  } catch (error) {
    handleUploadError(error.response?.data?.detail || error)
  } finally {
    // 重置上传状态
    uploadState.isUploading = false
    uploadState.progress = 0
    uploadState.fileName = ''
    uploadState.fileSize = ''
  }
}
</script>

<style scoped>
.dataset-upload {
  padding: 20px;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}

.card.dark {
  background-color: #1d1e1f;
  color: #e5eaf3;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
}

/* 表单样式 */
.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.form-item label {
  min-width: 120px;
}

/* 选择器样式 */
.select-wrapper {
  position: relative;
  width: 200px;
}

.custom-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  
}

.dark .custom-select {
  background-color: #2b2b2b;
  border-color: #4c4d4f;
  color: #e5eaf3;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #dcdfe6;
  transition: .4s;
  border-radius: 24px;
  width: 60px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #409eff;
}

input:checked + .slider:before {
  transform: translateX(36px);
}

.switch-text {
  margin-left: 70px;
}

/* 上传区域样式 */
.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color .3s;
}

.dark .upload-area {
  border-color: #4c4d4f;
}

.upload-area:hover {
  border-color: #409eff;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  color: #909399;
}

.upload-text {
  color: #606266;
  font-size: 16px;
}

.dark .upload-text {
  color: #a3a6ad;
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

/* 提示框样式 */
.alert {
  margin-top: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.alert.error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.dark .alert.success {
  background-color: #1c2518;
}

.dark .alert.error {
  background-color: #2b1d1d;
}

.alert-icon {
  font-size: 16px;
}

.alert-content {
  flex: 1;
}

.alert-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.alert-close:hover {
  opacity: 1;
}

/* 数据集展示样式 */
.dataset-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.dataset-item {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dark .dataset-item {
  border-color: #4c4d4f;
}

.dataset-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dataset-item h4 {
  margin: 0 0 10px;
}

.dataset-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}

.dark .dataset-item p {
  color: #a3a6ad;
}

.custom-select::-webkit-calendar-picker-indicator {
  display: none;
}

.custom-select::-webkit-list-button {
  display: none;
}

.custom-select::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-select::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 数据集预览图样式 */
.dataset-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 10px;
}

.dataset-preview[lazy="loading"] {
  background: #f5f5f5;
}

.dark .dataset-preview[lazy="loading"] {
  background: #2b2b2b;
}

/* 上传进度样式 */
.upload-progress {
  margin-top: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.dark .upload-progress {
  background-color: #2b2b2b;
  border-color: #4c4d4f;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.file-name {
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .file-name {
  color: #e5eaf3;
}

.file-size {
  color: #666;
  margin-left: 12px;
}

.dark .file-size {
  color: #a3a6ad;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.dark .progress-bar {
  background-color: #4c4d4f;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.dark .progress-text {
  color: #a3a6ad;
}

/* 刷新按钮样式 */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #337ecc;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.dark .loading-state {
  color: #a3a6ad;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.dark .loading-spinner {
  border-color: #4c4d4f;
  border-top-color: #409eff;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}

.dark .empty-state {
  color: #666;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* 数据集列表样式 */
.datasets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dataset-list-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.dark .dataset-list-item {
  background: #2b2b2b;
  border-color: #4c4d4f;
}

.dataset-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dataset-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  border-radius: 8px;
  margin-right: 16px;
}

.dataset-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.dataset-info {
  flex: 1;
  min-width: 0;
}

.dataset-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .dataset-name {
  color: #e5eaf3;
}

.dataset-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.dark .dataset-meta {
  color: #a3a6ad;
}

.dataset-size,
.dataset-date,
.dataset-type {
  padding: 2px 6px;
  background: #e9ecef;
  border-radius: 4px;
}

.dark .dataset-size,
.dark .dataset-date,
.dark .dataset-type {
  background: #4c4d4f;
}

.dataset-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.download-btn {
  background: #67c23a;
  color: white;
}

.download-btn:hover {
  background: #5daf34;
  transform: translateY(-1px);
}

.delete-btn {
  background: #f56c6c;
  color: white;
}

.delete-btn:hover {
  background: #f25c5c;
  transform: translateY(-1px);
}
</style>