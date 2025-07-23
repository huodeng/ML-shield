<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NIcon,
  NGrid,
  NGridItem,
  NStatistic,
  NProgress,
  NTag,
  NSteps,
  NStep,
  NAlert,
  NDivider,
  NList,
  NListItem,
  NThing,
  NAvatar
} from 'naive-ui'
import {
  AnalyticsOutline,
  CloudUploadOutline,
  ShieldCheckmarkOutline,
  BookOutline,
  PlayCircleOutline,
  CheckmarkCircleOutline,
  ArrowForwardOutline,
  BulbOutline,
  TrendingUpOutline,
  SearchOutline,
  SettingsOutline
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useTaskQueueStore } from '@/stores/taskQueue'
import { useAnalysisStore } from '@/stores/analysis'
import { useStorage } from '@vueuse/core'

const router = useRouter()
const taskQueue = useTaskQueueStore()
const analysisStore = useAnalysisStore()
const isDark = useStorage('theme-mode', false)

// 动画状态
const showWelcome = ref(false)
const showFeatures = ref(false)
const showQuickActions = ref(false)
const showGuide = ref(false)

// 统计数据
const stats = ref([
  { label: '已完成分析', value: 0, target: analysisStore.analysisHistory.length, color: '#18a058' },
  { label: '运行中任务', value: 0, target: taskQueue.getRunningTasks().length, color: '#2080f0' },
  { label: '安全评分', value: 0, target: 85, color: '#f0a020' },
  { label: '检测漏洞', value: 0, target: 12, color: '#d03050' }
])

// 功能卡片
const features = [
  {
    title: '模型分析',
    description: '对机器学习模型进行全面的安全性分析，检测潜在的隐私泄露风险',
    icon: AnalyticsOutline,
    color: '#2080f0',
    path: '/dashboard/model-analysis',
    status: 'ready'
  },
  {
    title: '超参数搜索',
    description: '智能搜索最优攻击参数，自动调优攻击强度和迭代次数，提升分析精度',
    icon: SearchOutline,
    color: '#722ed1',
    path: '/dashboard/model-analysis',
    status: 'ready'
  },
  {
    title: '数据集上传',
    description: '安全上传和管理您的训练数据集，支持多种格式',
    icon: CloudUploadOutline,
    color: '#18a058',
    path: '/dashboard/dataset-upload',
    status: 'ready'
  },
  {
    title: '神经网络可视化',
    description: '直观展示神经网络结构和训练过程，便于理解模型行为',
    icon: TrendingUpOutline,
    color: '#f0a020',
    path: '/dashboard/neural-network',
    status: 'ready'
  },
  {
    title: '安全报告',
    description: '生成详细的安全评估报告，提供专业的防护建议',
    icon: ShieldCheckmarkOutline,
    color: '#d03050',
    path: '/dashboard/model-analysis',
    status: 'ready'
  }
]

// 快速开始步骤
const quickSteps = [
  {
    title: '上传数据集',
    description: '首先上传您的训练数据集',
    icon: CloudUploadOutline,
    action: () => router.push('/dashboard/dataset-upload')
  },
  {
    title: '选择分析类型',
    description: '选择适合的安全分析方法',
    icon: AnalyticsOutline,
    action: () => router.push('/dashboard/model-analysis')
  },
  {
    title: '查看结果',
    description: '分析完成后查看详细报告',
    icon: CheckmarkCircleOutline,
    action: () => {}
  }
]

// 最近活动
const recentActivities = ref([
  {
    title: '成员推理攻击分析',
    description: '对CIFAR-10数据集进行了成员推理攻击检测',
    time: '2小时前',
    status: 'completed',
    type: 'analysis'
  },
  {
    title: '数据集上传',
    description: '成功上传了新的图像分类数据集',
    time: '1天前',
    status: 'completed',
    type: 'upload'
  },
  {
    title: '模型训练',
    description: 'ResNet-18模型训练已完成',
    time: '2天前',
    status: 'completed',
    type: 'training'
  }
])

// 动画效果
const animateStats = () => {
  stats.value.forEach((stat, index) => {
    const duration = 2000
    const steps = 60
    const increment = stat.target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.target) {
        stat.value = stat.target
        clearInterval(timer)
      } else {
        stat.value = Math.floor(current)
      }
    }, duration / steps)
  })
}

// 页面加载动画
onMounted(() => {
  setTimeout(() => showWelcome.value = true, 100)
  setTimeout(() => showFeatures.value = true, 300)
  setTimeout(() => showQuickActions.value = true, 500)
  setTimeout(() => showGuide.value = true, 700)
  setTimeout(() => animateStats(), 1000)
})

const navigateToFeature = (feature: any) => {
  if (feature.status === 'ready') {
    router.push(feature.path)
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'running': return 'info'
    case 'error': return 'error'
    default: return 'default'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'analysis': return AnalyticsOutline
    case 'upload': return CloudUploadOutline
    case 'training': return TrendingUpOutline
    default: return BulbOutline
  }
}
</script>

<template>
  <div class="dashboard-home">
    <!-- 欢迎区域 -->
    <div class="welcome-section" :class="{ 'animate-in': showWelcome }">
      <n-card class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">
              <n-icon size="32" class="welcome-icon">
                <ShieldCheckmarkOutline />
              </n-icon>
              欢迎使用 ML-Shield
            </h1>
            <p class="welcome-subtitle">您的机器学习模型安全防护专家</p>
            <n-alert type="info" class="welcome-tip">
              <template #icon>
                <n-icon><BulbOutline /></n-icon>
              </template>
              开始您的第一次安全分析，保护您的AI模型免受隐私泄露威胁
            </n-alert>
          </div>
          <div class="welcome-stats">
            <n-grid :cols="4" :x-gap="16">
              <n-grid-item v-for="stat in stats" :key="stat.label">
                <n-statistic
                  :value="stat.value"
                  :label="stat.label"
                  :value-style="{ color: stat.color, fontSize: '1.8rem', fontWeight: 'bold' }"
                />
              </n-grid-item>
            </n-grid>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 功能卡片区域 -->
    <div class="features-section" :class="{ 'animate-in': showFeatures }">
      <h2 class="section-title">核心功能</h2>
      <n-grid :cols="3" :x-gap="20" :y-gap="20">
        <n-grid-item v-for="feature in features" :key="feature.title">
          <n-card 
            class="feature-card" 
            :class="{ 'clickable': feature.status === 'ready', 'disabled': feature.status === 'coming-soon' }"
            @click="navigateToFeature(feature)"
            hoverable
          >
            <div class="feature-content">
              <div class="feature-header">
                <n-icon size="28" :color="feature.color" class="feature-icon">
                  <component :is="feature.icon" />
                </n-icon>
                <div class="feature-info">
                  <h3 class="feature-title">{{ feature.title }}</h3>
                  <n-tag 
                    v-if="feature.status === 'coming-soon'" 
                    type="warning" 
                    size="small"
                  >
                    即将推出
                  </n-tag>
                  <n-tag 
                    v-else 
                    type="success" 
                    size="small"
                  >
                    可用
                  </n-tag>
                </div>
              </div>
              <p class="feature-description">{{ feature.description }}</p>
              <div class="feature-action" v-if="feature.status === 'ready'">
                <n-button text type="primary">
                  开始使用
                  <template #icon>
                    <n-icon><ArrowForwardOutline /></n-icon>
                  </template>
                </n-button>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions-section" :class="{ 'animate-in': showQuickActions }">
      <n-grid :cols="2" :x-gap="20">
        <n-grid-item>
          <n-card title="快速开始" class="quick-start-card">
            <template #header-extra>
              <n-icon><PlayCircleOutline /></n-icon>
            </template>
            <n-steps vertical :current="1" size="small">
              <n-step 
                v-for="(step, index) in quickSteps" 
                :key="index"
                :title="step.title"
                :description="step.description"
              >
                <template #icon>
                  <n-icon><component :is="step.icon" /></n-icon>
                </template>
              </n-step>
            </n-steps>
            <n-divider />
            <n-space>
              <n-button 
                type="primary" 
                @click="router.push('/dashboard/dataset-upload')"
              >
                立即开始
              </n-button>
              <n-button 
                quaternary 
                @click="router.push('/dashboard/model-analysis')"
              >
                查看示例
              </n-button>
            </n-space>
          </n-card>
        </n-grid-item>
        
        <n-grid-item>
          <n-card title="最近活动" class="recent-activity-card">
            <template #header-extra>
              <n-icon><TimeOutline /></n-icon>
            </template>
            <n-list>
              <n-list-item v-for="activity in recentActivities" :key="activity.title">
                <n-thing>
                  <template #avatar>
                    <n-avatar>
                      <n-icon><component :is="getActivityIcon(activity.type)" /></n-icon>
                    </n-avatar>
                  </template>
                  <template #header>
                    <div class="activity-header">
                      <span>{{ activity.title }}</span>
                      <n-tag :type="getStatusColor(activity.status)" size="small">
                        {{ activity.status === 'completed' ? '已完成' : activity.status }}
                      </n-tag>
                    </div>
                  </template>
                  <template #description>
                    {{ activity.description }}
                  </template>
                  <template #footer>
                    <span class="activity-time">{{ activity.time }}</span>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 使用指南区域 -->
    <div class="guide-section" :class="{ 'animate-in': showGuide }">
      <n-card title="使用指南" class="guide-card">
        <template #header-extra>
          <a href="https://huodeng.github.io/shield-ml/" target="_blank" class="guide-link">
            <n-icon size="20" class="guide-icon"><BookOutline /></n-icon>
          </a>
        </template>
        <n-grid :cols="3" :x-gap="16">
          <n-grid-item>
            <div class="guide-item">
              <n-icon size="24" color="#2080f0"><AnalyticsOutline /></n-icon>
              <h4>模型分析</h4>
              <p>学习如何对您的机器学习模型进行全面的安全性评估</p>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="guide-item">
              <n-icon size="24" color="#18a058"><CloudUploadOutline /></n-icon>
              <h4>数据管理</h4>
              <p>了解如何安全地上传和管理您的训练数据集</p>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="guide-item">
              <n-icon size="24" color="#f0a020"><ShieldCheckmarkOutline /></n-icon>
              <h4>安全防护</h4>
              <p>掌握各种防护技术，提升模型的安全性和隐私保护</p>
            </div>
          </n-grid-item>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-home {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color-1);
  }
}

// 动画效果
.animate-in {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 欢迎区域
.welcome-section {
  margin-bottom: 32px;
  
  .welcome-card {
    :deep(.n-card__content) {
      padding: 32px;
    }
  }
  
  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }
  
  .welcome-text {
    flex: 1;
  }
  
  .welcome-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  .welcome-subtitle {
    font-size: 1.2rem;
    margin: 0 0 20px 0;
    opacity: 0.9;
  }
  
  .welcome-tip {
    max-width: 400px;
  }
  
  .welcome-stats {
    flex: 1;
  }
}

// 功能卡片
.features-section {
  margin-bottom: 32px;
  
  .feature-card {
    height: 100%;
    transition: all 0.3s ease;
    
    &.clickable {
      cursor: pointer;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }
    
    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .feature-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .feature-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .feature-info {
    flex: 1;
    
    .feature-title {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 600;
    }
  }
  
  .feature-description {
    color: var(--text-color-2);
    line-height: 1.6;
    margin-bottom: 16px;
    flex: 1;
  }
  
  .feature-action {
    margin-top: auto;
  }
}

// 快速操作
.quick-actions-section {
  margin-bottom: 32px;
  
  .quick-start-card,
  .recent-activity-card {
    height: 100%;
  }
  
  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .activity-time {
    color: var(--text-color-3);
    font-size: 0.9rem;
  }
}

// 使用指南
.guide-section {
  .guide-link {
    color: inherit;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--hover-color);
      transform: scale(1.1);
      
      .guide-icon {
        color: var(--primary-color);
      }
    }
  }
  
  .guide-icon {
    transition: all 0.3s ease;
  }
  
  .guide-item {
    text-align: center;
    padding: 16px;
    
    h4 {
      margin: 12px 0 8px 0;
      font-weight: 600;
    }
    
    p {
      color: var(--text-color-2);
      line-height: 1.5;
      margin: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-home {
    padding: 16px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .features-section :deep(.n-grid) {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-section :deep(.n-grid) {
    grid-template-columns: 1fr;
  }
  
  .guide-section :deep(.n-grid) {
    grid-template-columns: 1fr;
  }
}
</style>