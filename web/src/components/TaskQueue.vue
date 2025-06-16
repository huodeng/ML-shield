<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  NPopover, 
  NBadge, 
  NButton, 
  NIcon, 
  NList, 
  NListItem, 
  NProgress, 
  NTag, 
  NSpace, 
  NEmpty,
  NTooltip,
  NPopconfirm
} from 'naive-ui'
import { 
  ListOutline, 
  CheckmarkCircleOutline, 
  CloseCircleOutline, 
  TimeOutline,
  TrashOutline,
  EyeOutline
} from '@vicons/ionicons5'
import { useTaskQueueStore } from '@/stores/taskQueue'
import { useRouter } from 'vue-router'
import TaskResultModal from './TaskResultModal.vue'
import type { Task } from '@/stores/taskQueue'

const taskQueue = useTaskQueueStore()
const router = useRouter()
const showPopover = ref(false)
const showResultModal = ref(false)
const selectedTask = ref<Task | null>(null)

const runningTasksCount = computed(() => {
  return taskQueue.getRunningTasks().length
})

const pendingTasksCount = computed(() => {
  return taskQueue.getPendingTasks().length
})

const totalActiveTasksCount = computed(() => {
  return runningTasksCount.value + pendingTasksCount.value
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

const viewTaskResult = (task: Task) => {
  selectedTask.value = task
  showResultModal.value = true
}

const viewTaskDetails = (task: Task) => {
  // 检查任务是否存在
  if (!task) {
    console.error('Task is undefined')
    return
  }
  
  // 保存任务结果到本地存储，供结果页面使用
  if (task.result) {
    localStorage.setItem('latestAnalysisResult', JSON.stringify(task.result))
  }
  // 跳转到结果页面查看完整结果
  router.push('/dashboard/model-analysis/result')
  showResultModal.value = false
  showPopover.value = false
}

const removeTask = (taskId: string) => {
  taskQueue.removeTask(taskId)
}

const clearCompleted = () => {
  taskQueue.clearCompletedTasks()
}
</script>

<template>
  <n-popover 
    v-model:show="showPopover" 
    trigger="click" 
    placement="bottom-end"
    :width="400"
    :show-arrow="false"
  >
    <template #trigger>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <n-badge 
            :value="totalActiveTasksCount" 
            :max="99"
            :show="totalActiveTasksCount > 0"
            type="warning"
          >
            <n-button quaternary circle class="task-queue-button">
              <n-icon size="18">
                <ListOutline />
              </n-icon>
            </n-button>
          </n-badge>
        </template>
        <span>任务队列 ({{ totalActiveTasksCount }}个活跃任务)</span>
      </n-tooltip>
    </template>

    <div class="task-queue-content">
      <div class="task-queue-header">
        <h4>任务队列</h4>
        <n-space>
          <n-button 
            v-if="taskQueue.tasks.filter(t => t.status === 'completed').length > 0"
            size="small" 
            type="tertiary"
            @click="clearCompleted"
          >
            清除已完成
          </n-button>
        </n-space>
      </div>

      <div class="task-list">
        <n-empty 
          v-if="taskQueue.tasks.length === 0" 
          description="暂无任务"
          size="small"
        />
        
        <n-list v-else>
          <n-list-item 
            v-for="task in taskQueue.tasks" 
            :key="task.id"
            class="task-item"
          >
            <div class="task-content">
              <div class="task-header">
                <div class="task-info">
                  <span class="task-name">{{ task.name }}</span>
                  <n-tag 
                    :type="getStatusColor(task.status)" 
                    size="small"
                    class="task-status"
                  >
                    <template #icon>
                      <n-icon>
                        <component :is="getStatusIcon(task.status)" />
                      </n-icon>
                    </template>
                    {{ 
                      task.status === 'pending' ? '等待中' :
                      task.status === 'running' ? '运行中' :
                      task.status === 'completed' ? '已完成' : '失败'
                    }}
                  </n-tag>
                </div>
                
                <div class="task-actions">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button 
                        size="small" 
                        quaternary 
                        circle
                        @click="viewTaskResult(task)"
                      >
                        <n-icon size="14">
                          <EyeOutline />
                        </n-icon>
                      </n-button>
                    </template>
                    <span>查看详情</span>
                  </n-tooltip>
                  
                  <n-popconfirm 
                    v-if="task.status !== 'running'"
                    @positive-click="removeTask(task.id)"
                  >
                    <template #trigger>
                      <n-button size="small" quaternary circle type="error">
                        <n-icon size="14">
                          <TrashOutline />
                        </n-icon>
                      </n-button>
                    </template>
                    确定要删除这个任务吗？
                  </n-popconfirm>
                </div>
              </div>

              <div class="task-details">
                <div class="task-type">{{ task.type }}</div>
                <div class="task-time">
                  {{ formatDuration(task.startTime, task.endTime) }}
                </div>
              </div>

              <n-progress 
                v-if="task.status === 'running' || task.status === 'pending'"
                :percentage="task.progress"
                :status="task.status === 'running' ? 'default' : 'info'"
                :show-indicator="false"
                class="task-progress"
              />

              <div v-if="task.error" class="task-error">
                {{ task.error }}
              </div>
            </div>
          </n-list-item>
        </n-list>
      </div>
    </div>
  </n-popover>

  <!-- 任务结果详情弹窗 -->
  <TaskResultModal 
    v-model:show="showResultModal"
    :task="selectedTask"
    @view-details="() => viewTaskDetails(selectedTask)"
  />
</template>

<style lang="scss" scoped>
.task-queue-button {
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.task-queue-content {
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.task-queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
  
  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.task-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.task-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
}

.task-content {
  width: 100%;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
  word-break: break-word;
}

.task-status {
  margin-right: 8px;
}

.task-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.task-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--text-color-3);
}

.task-type {
  background: var(--tag-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.task-progress {
  margin-top: 8px;
}

.task-error {
  margin-top: 8px;
  padding: 8px;
  background: var(--error-color-suppl);
  border-radius: 4px;
  font-size: 12px;
  color: var(--error-color);
  word-break: break-word;
}

:deep(.n-list .n-list-item) {
  padding: 0;
}

:deep(.n-badge-sup) {
  transform: translate(50%, -50%);
}
</style>