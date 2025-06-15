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
  emit('view-details')
  showModal.value = false
}

const hasAnalysisResult = computed(() => {
  return props.task?.result && 
         props.task.status === 'completed' && 
         (props.task.result.score !== undefined || 
          props.task.result.categories || 
          props.task.result.vulnerabilities)
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
    <div v-if="task" class="task-result-content">
      <!-- 基本信息 -->
      <n-descriptions 
        label-placement="left" 
        :column="1" 
        bordered
        class="task-descriptions"
      >
        <n-descriptions-item label="任务名称">
          {{ task.name }}
        </n-descriptions-item>
        
        <n-descriptions-item label="任务类型">
          {{ task.type }}
        </n-descriptions-item>
        
        <n-descriptions-item label="状态">
          <n-tag :type="getStatusColor(task.status)">
            <template #icon>
              <n-icon>
                <component :is="getStatusIcon(task.status)" />
              </n-icon>
            </template>
            {{ getStatusText(task.status) }}
          </n-tag>
        </n-descriptions-item>
        
        <n-descriptions-item label="开始时间">
          {{ formatTime(task.startTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item v-if="task.endTime" label="结束时间">
          {{ formatTime(task.endTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item label="执行时长">
          {{ formatDuration(task.startTime, task.endTime) }}
        </n-descriptions-item>
        
        <n-descriptions-item v-if="task.status === 'running' || task.status === 'pending'" label="进度">
          <n-progress 
            :percentage="task.progress" 
            :status="task.status === 'running' ? 'default' : 'info'"
          />
        </n-descriptions-item>
      </n-descriptions>

      <!-- 错误信息 -->
      <div v-if="task.error" class="error-section">
        <n-divider title-placement="left">
          <n-icon>
            <CloseCircleOutline />
          </n-icon>
          错误信息
        </n-divider>
        <div class="error-content">
          {{ task.error }}
        </div>
      </div>

      <!-- 分析结果摘要 -->
      <div v-if="hasAnalysisResult" class="result-section">
        <n-divider title-placement="left">
          <n-icon>
            <AnalyticsOutline />
          </n-icon>
          分析结果摘要
        </n-divider>
        
        <n-descriptions label-placement="left" :column="2" bordered>
          <n-descriptions-item v-if="task.result.score !== undefined" label="安全评分">
            <n-tag 
              :type="task.result.score >= 80 ? 'success' : task.result.score >= 60 ? 'warning' : 'error'"
              size="large"
            >
              {{ task.result.score }}分
            </n-tag>
          </n-descriptions-item>
          
          <n-descriptions-item v-if="task.result.acc" label="准确率">
            {{ task.result.acc }}
          </n-descriptions-item>
          
          <n-descriptions-item v-if="task.result.attack_type" label="攻击类型">
            {{ task.result.attack_type }}
          </n-descriptions-item>
          
          <n-descriptions-item v-if="task.result.use_privacy !== undefined" label="隐私保护">
            <n-tag :type="task.result.use_privacy ? 'success' : 'default'">
              {{ task.result.use_privacy ? '已启用' : '未启用' }}
            </n-tag>
          </n-descriptions-item>
        </n-descriptions>

        <!-- 漏洞列表 -->
        <div v-if="task.result.vulnerabilities && task.result.vulnerabilities.length > 0" class="vulnerabilities-section">
          <h4>发现的漏洞</h4>
          <n-list>
            <n-list-item v-for="(vuln, index) in task.result.vulnerabilities" :key="index">
              <div class="vulnerability-item">
                <n-tag 
                  :type="vuln.severity === 'high' ? 'error' : vuln.severity === 'medium' ? 'warning' : 'default'"
                  size="small"
                >
                  {{ vuln.severity === 'high' ? '高危' : vuln.severity === 'medium' ? '中危' : '低危' }}
                </n-tag>
                <span class="vulnerability-type">{{ vuln.type }}</span>
                <p class="vulnerability-description">{{ vuln.description }}</p>
              </div>
            </n-list-item>
          </n-list>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <n-space justify="end">
          <n-button 
            v-if="task.status === 'completed' && hasAnalysisResult"
            type="primary"
            @click="viewDetails"
          >
            <template #icon>
              <n-icon>
                <DocumentTextOutline />
              </n-icon>
            </template>
            查看完整报告
          </n-button>
          
          <n-button @click="showModal = false">
            关闭
          </n-button>
        </n-space>
      </div>
    </div>
    
    <n-empty v-else description="无任务信息" />
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