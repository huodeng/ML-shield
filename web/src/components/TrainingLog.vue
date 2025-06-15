<script setup lang="ts">
import { ref, onMounted, onUnmounted,computed } from 'vue'
import { NCard, NSpace, NButton, NIcon, NScrollbar, NTag, NPopconfirm } from 'naive-ui'
import { TrashOutline, DownloadOutline } from '@vicons/ionicons5'
import { useStorage } from '@vueuse/core'

const isDark = useStorage('theme-mode', false)
const logs = ref<any[]>([])

// WebSocket 相关状态
const ws = ref<WebSocket | null>(null)
const isConnected = ref(false)
const messageFilter = ref('all')
const searchQuery = ref('')

// 连接 WebSocket
const connect = () => {
  if (ws.value?.readyState === WebSocket.OPEN) return

  ws.value = new WebSocket('ws://localhost:5000')
  
  ws.value.onopen = () => {
    isConnected.value = true
    addLog('WebSocket 连接已建立', 'system')
  }

  ws.value.onclose = () => {
    isConnected.value = false
    addLog('WebSocket 连接已断开', 'system')
  }

  ws.value.onerror = (error) => {
    addLog(`WebSocket 错误: ${error}`, 'error')
  }

  ws.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      addLog(data.message, data.type || 'info')
    } catch (error) {
      addLog(event.data, 'terminal')
    }
  }
}

// 断开 WebSocket 连接
const disconnect = () => {
  ws.value?.close()
  ws.value = null
}

// 添加日志
const addLog = (message: any, level: 'info' | 'warning' | 'error' | 'success' | 'system' | 'terminal' = 'info') => {
  logs.value.push({
    message,
    level,
    timestamp: new Date().toLocaleTimeString()
  })
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

// 导出日志
const exportLogs = () => {
  const logText = logs.value
    .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
    .join('\n')
  
  const blob = new Blob([logText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `training-log-${new Date().toISOString()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 获取日志标签类型
const getLogTagType = (level: string) => {
  const types = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'success',
    system: 'default',
    terminal: 'primary'
  }
  return types[level as keyof typeof types] || 'default'
}

// 过滤日志
const filteredLogs = computed(() => {

  return logs.value.filter(log => {
    const matchesFilter = messageFilter.value === 'all' || log.level === messageFilter.value
    const matchesSearch = !searchQuery.value || 
      log.message.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.level.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
})

// 组件挂载时自动连接
onMounted(() => {
  connect()
})

// 组件卸载时断开连接
onUnmounted(() => {
  disconnect()
})

// 暴露方法给父组件
defineExpose({
  addLog
})
</script>

<template>
  <n-card
    title="训练日志"
    :bordered="false"
    :class="{ 'dark': isDark }"
    class="training-log"
  >
    <template #header-extra>
      <n-space>
        <div class="connection-status">
          <div :class="['status-indicator', isConnected ? 'connected' : 'disconnected']"></div>
          <span class="status-text">{{ isConnected ? '已连接' : '未连接' }}</span>
        </div>
        <n-button
          quaternary
          :disabled="isConnected"
          @click="connect"
        >
          连接
        </n-button>
        <n-button
          quaternary
          :disabled="!isConnected"
          @click="disconnect"
        >
          断开
        </n-button>
        <n-popconfirm
          @positive-click="clearLogs"
          positive-text="确认"
          negative-text="取消"
        >
          <template #trigger>
            <n-button quaternary circle>
              <n-icon>
                <trash-outline />
              </n-icon>
            </n-button>
          </template>
          确定要清空所有日志吗？
        </n-popconfirm>
        <n-button quaternary circle @click="exportLogs">
          <n-icon>
            <download-outline />
          </n-icon>
        </n-button>
      </n-space>
    </template>

    <div class="message-filters">
      <n-space align="center">
        <n-button
          :type="messageFilter === 'all' ? 'primary' : 'default'"
          size="small"
          @click="messageFilter = 'all'"
        >
          全部
        </n-button>
        <n-button
          :type="messageFilter === 'info' ? 'primary' : 'default'"
          size="small"
          @click="messageFilter = 'info'"
        >
          信息
        </n-button>
        <n-button
          :type="messageFilter === 'warning' ? 'primary' : 'default'"
          size="small"
          @click="messageFilter = 'warning'"
        >
          警告
        </n-button>
        <n-button
          :type="messageFilter === 'error' ? 'primary' : 'default'"
          size="small"
          @click="messageFilter = 'error'"
        >
          错误
        </n-button>
        <n-button
          :type="messageFilter === 'terminal' ? 'primary' : 'default'"
          size="small"
          @click="messageFilter = 'terminal'"
        >
          终端
        </n-button>
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索日志..."
          size="small"
        />
      </n-space>
    </div>

    <n-scrollbar style="max-height: 400px" class="log-container">
      <div v-if="filteredLogs.length === 0" class="empty-logs">
        暂无日志信息
      </div>
      <div v-else class="log-list">
        <div
          v-for="(log, index) in filteredLogs"
          :key="index"
          :class="['log-item', log.level]"
        >
          <span class="log-time">[{{ log.timestamp }}]</span>
          <n-tag
            :type="getLogTagType(log.level) as 'info' | 'warning' | 'error' | 'success' | 'default' | 'primary'"
            size="small"
            class="log-level"
          >
            {{ log.level.toUpperCase() }}
          </n-tag>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </n-scrollbar>
  </n-card>
</template>

<style lang="scss" scoped>
.training-log {
  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--card-color);

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      transition: background-color 0.3s ease;

      &.connected {
        background-color: #52c41a;
        box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
      }

      &.disconnected {
        background-color: #ff4d4f;
        box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
      }
    }

    .status-text {
      font-size: 12px;
      color: var(--text-color);
    }
  }

  .message-filters {
    margin-bottom: 16px;
  }

  .log-container {
    background: var(--card-color);
    border-radius: 6px;
  }

  .empty-logs {
    text-align: center;
    padding: 20px;
    color: var(--text-color-3);
  }

  .log-list {
    .log-item {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--hover-color);
      }

      &.terminal {
        font-family: monospace;
        background-color: var(--terminal-bg);
        color: var(--terminal-text);
      }

      &.error {
        background-color: var(--error-color-1);
      }

      .log-time {
        color: var(--text-color-3);
        font-size: 12px;
        white-space: nowrap;
      }

      .log-level {
        min-width: 60px;
        text-align: center;
      }

      .log-message {
        flex: 1;
        word-break: break-word;
      }
    }
  }
}

.dark .training-log {
  --card-color: #1e1e1e;
  --text-color: #ffffff;
  --text-color-3: #999999;
  --hover-color: #2a2a2a;
  --terminal-bg: #000000;
  --terminal-text: #00ff00;
  --error-color-1: rgba(255, 77, 79, 0.1);
}
</style>