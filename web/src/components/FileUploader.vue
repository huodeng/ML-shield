<template>
  <div class="file-uploader">
    <n-upload
      ref="uploadRef"
      accept=".py"
      :custom-request="handleUpload"
      :show-file-list="false"
      @before-upload="handleBeforeUpload"
    >
      <n-upload-dragger>
        <div class="upload-content">
          <n-icon size="48" class="upload-icon">
            <cloud-upload />
          </n-icon>
          <div class="upload-text">
            <p>点击或拖拽上传Python文件</p>
            <p class="upload-hint">仅支持.py文件</p>
          </div>
        </div>
      </n-upload-dragger>
    </n-upload>

    <div v-if="currentFile" class="upload-progress">
      <div class="file-info">
        <span class="filename">{{ currentFile.name }}</span>
        <span class="status">{{ uploadStatus }}</span>
      </div>
      <n-progress
        v-if="isUploading"
        :percentage="uploadProgress"
        :processing="true"
        type="line"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NUpload, NUploadDragger, NIcon, NProgress, type UploadCustomRequestOptions, type UploadProps } from 'naive-ui';
type OnBeforeUpload = UploadProps['onBeforeUpload'];
import { CloudUpload } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import axios from 'axios';

const message = useMessage();
const uploadRef = ref();
const currentFile = ref<File | null>(null);
const uploadProgress = ref(0);
const uploadState = ref<'idle' | 'uploading' | 'success' | 'error'>('idle');

const isUploading = computed(() => uploadState.value === 'uploading');
const uploadStatus = computed(() => {
  switch (uploadState.value) {
    case 'uploading':
      return '上传中...';
    case 'success':
      return '上传成功';
    case 'error':
      return '上传失败';
    default:
      return '';
  }
});

const handleBeforeUpload: OnBeforeUpload = (data) => {
  if (!data.file.name.endsWith('.py')) {
    message.error('只能上传Python文件(.py)');
    return false;
  }
  return true;
};

const handleUpload = async (options: UploadCustomRequestOptions) => {
  try {
    currentFile.value = options.file.file as File;
    uploadState.value = 'uploading';
    uploadProgress.value = 0;

    const formData = new FormData();
    formData.append('file', options.file.file as File);
    
    //定义后端上传的地址
    const { data } = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? progressEvent.loaded)
        );
        uploadProgress.value = percent;
        options.onProgress({ percent });
      },
    });
    console.log(data);
    if (data?.status === 'success') {
      uploadState.value = 'success';
      uploadProgress.value = 100;
      message.success('文件上传成功');
      options.onFinish();
    } else {
      throw new Error(data?.message || '上传失败');
    }
  } catch (error: any) {
    uploadState.value = 'error';
    const errorMessage = error.response?.data?.message || error.message || '未知错误';
    message.error(`上传失败: ${errorMessage}`);
    options.onError();
  }
};
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-content {
  padding: 20px;
  text-align: center;
}

.upload-icon {
  margin-bottom: 8px;
  color: #2080f0;
}

.upload-text {
  margin-top: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.upload-progress {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.file-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.filename {
  font-weight: 500;
}

.status {
  color: #666;
}
</style>