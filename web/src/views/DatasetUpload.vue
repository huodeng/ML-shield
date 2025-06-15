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
import { ref, reactive } from 'vue'
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
  // 可以在这里处理上传进度
}

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
  } catch (error) {
    handleUploadError(error.response?.data?.detail || error)
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
</style>