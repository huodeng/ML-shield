<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NModal,
  NCard,
  NSpace,
  NButton,
  NIcon,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NProgress,
  NDivider,
  NList,
  NListItem,
  NEmpty
} from 'naive-ui'
import {
  CheckmarkCircleOutline,
  CloseCircleOutline,
  TimeOutline,
  AnalyticsOutline,
  DocumentTextOutline
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import type { Task } from '@/stores/taskQueue'

interface Props {
  show: boolean
  task: Task | null
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'view-details'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckmarkCircleOutline
    case 'error':
      return CloseCircleOutline
    case 'running':
    case 'pending':
    default:
      return TimeOutline
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'error':
      return 'error'
    case 'running':
      return 'warning'
    case 'pending':
    default:
      return 'default'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '等待中'
    case 'running':
      return '运行中'
    case 'completed':
      return '已完成'
    case 'error':
      return '失败'
    default:
      return '未知'
  }
}

const formatDuration = (startTime: Date, endTime?: Date) => {
  const end = endTime || new Date()
  const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000)
  
  if (duration < 60) {
    return `${duration}秒`
  } else if (duration < 3600) {
    return `${Math.floor(duration / 60)}分${duration % 60}秒`
  } else {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    return `${hours}时${minutes}分`
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const viewDetails = () => {
  // 将任务结果保存到本地存储
  const task = currentTask.value
  if (task?.result) {
    localStorage.setItem('analysisResult', JSON.stringify(task.result))
  }
  
  // 跳转到结果详情页面
  router.push('/dashboard/model-analysis/result')
  
  // 触发事件并关闭模态框
  emit('view-details')
  showModal.value = false
}

// 直接使用传入的任务数据
const currentTask = computed(() => {
  return props.task
})

const hasAnalysisResult = computed(() => {
  const task = currentTask.value
  return task?.result && 
         task.status === 'completed' && 
         (task.result.attack_type || 
          task.result.message || 
          task.result.acc !== undefined)
})


</script>

<template>
  <n-modal 
    v-model:show="showModal" 
    preset="card"
    title="任务详情"
    size="large"
    :style="{ maxWidth: '600px' }"
    :segmented="true"
  >


    <div v-if="currentTask" class="task-result-content">
      <!-- 基本信息 -->
      <n-descriptions 
        label-placement="left" 
        :column="1" 
        bordered
        class="task-descriptions"
      >
        <n-descriptions-item label="任务名称">
          {{ currentTask.name }}
        </n-descriptions-item>
        
        <n-descriptions-item label="任务类型">
          {{ currentTask.type }}
        </n-descriptions-item>
        
        <n-descriptions-item label="状态">
          <n-tag :type="getStatusColor(currentTask.status)">
            <template #icon>
              <n-icon>
                <component :is="getStatusIcon(currentTask.status)" />
              </n-icon>
            </template>
            {{ getStatusText(currentTask.status) }}
          </n-tag>
        </n-descriptions-item>
        
        <n-descriptions-item label="开始时间">
          {{ formatTime(currentTask.startTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item v-if="currentTask.endTime" label="结束时间">
          {{ formatTime(currentTask.endTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item label="执行时长">
          {{ formatDuration(currentTask.startTime, currentTask.endTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item v-if="currentTask.status === 'running' || currentTask.status === 'pending'" label="进度">
          <n-progress 
            :percentage="currentTask.progress" 
            :status="currentTask.status === 'running' ? 'default' : 'info'"
          />
        </n-descriptions-item>
      </n-descriptions>

      <!-- 分析结果摘要 -->
      <div v-if="hasAnalysisResult" class="result-section">
        <n-divider title-placement="left">
          <n-icon>
            <AnalyticsOutline />
          </n-icon>
          分析结果摘要
        </n-divider>
        
        <n-descriptions label-placement="left" :column="1" bordered>
          <n-descriptions-item label="攻击类型" v-if="currentTask.result.attack_type">
            {{ currentTask.result.attack_type }}
          </n-descriptions-item>
          
          <n-descriptions-item label="总体准确率" v-if="currentTask.result.acc">
            {{ currentTask.result.acc }}
          </n-descriptions-item>
          
          <n-descriptions-item label="隐私保护" v-if="currentTask.result.use_privacy !== undefined">
            {{ currentTask.result.use_privacy ? '已启用' : '未启用' }}
          </n-descriptions-item>
          
          <!-- 根据不同攻击类型显示特定指标 -->
          <template v-if="currentTask.result.attack_type === 'backdoor' && currentTask.result.message">
            <n-descriptions-item label="干净准确率" v-if="currentTask.result.message.clean_acc">
              {{ (currentTask.result.message.clean_acc * 100).toFixed(2) }}%
            </n-descriptions-item>
            <n-descriptions-item label="攻击成功率" v-if="currentTask.result.message.asr">
              {{ (currentTask.result.message.asr * 100).toFixed(2) }}%
            </n-descriptions-item>
          </template>
          
          <template v-else-if="currentTask.result.attack_type === 'mia' && currentTask.result.message">
            <n-descriptions-item label="训练集准确率" v-if="currentTask.result.message.clf1">
              {{ (currentTask.result.message.clf1 * 100).toFixed(2) }}%
            </n-descriptions-item>
            <n-descriptions-item label="测试集准确率" v-if="currentTask.result.message.clf2">
              {{ (currentTask.result.message.clf2 * 100).toFixed(2) }}%
            </n-descriptions-item>
          </template>
        </n-descriptions>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <n-space justify="end">
          <n-button 
            type="primary"
            @click="viewDetails"
          >
            <template #icon>
              <n-icon>
                <DocumentTextOutline />
              </n-icon>
            </template>
            查看详情
          </n-button>
          
          <n-button @click="showModal = false">
            关闭
          </n-button>
        </n-space>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.task-result-content {
  .task-descriptions {
    margin-bottom: 20px;
  }
  
  .error-section {
    margin: 20px 0;
    
    .error-content {
      padding: 12px;
      background: var(--error-color-suppl);
      border-radius: 6px;
      color: var(--error-color);
      font-family: monospace;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
  }
  
  .result-section {
    margin: 20px 0;
    
    .vulnerabilities-section {
      margin-top: 16px;
      
      h4 {
        margin: 12px 0 8px 0;
        font-size: 14px;
        font-weight: 600;
      }
      
      .vulnerability-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        
        .vulnerability-type {
          font-weight: 500;
          font-size: 14px;
        }
        
        .vulnerability-description {
          margin: 0;
          font-size: 13px;
          color: var(--text-color-3);
          line-height: 1.4;
        }
      }
    }
  }
  
  .action-section {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }
}

:deep(.n-descriptions .n-descriptions-item-label) {
  font-weight: 500;
}

:deep(.n-list .n-list-item) {
  padding: 12px 0;
}
</style>