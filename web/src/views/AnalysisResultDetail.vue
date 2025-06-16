<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NSpace,
  NButton,
  NIcon,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NStatistic,
  NProgress,
  NList,
  NListItem,
  NThing,
  NImage,
  NGrid,
  NGridItem,
  NAlert,
  NTimeline,
  NTimelineItem,
  NTable,
  NTabs,
  NTabPane,
  NSpin,
  useMessage
} from 'naive-ui'
import {
  ArrowBackOutline,
  ShieldCheckmarkOutline,
  WarningOutline,
  InformationCircleOutline,
  AnalyticsOutline,
  ImageOutline,
  DocumentTextOutline
} from '@vicons/ionicons5'

interface AnalysisResultType {
  score?: number
  categories?: Array<{
    name: string
    score: number
  }>
  vulnerabilities?: Array<{
    type: string
    severity: 'high' | 'medium' | 'low'
    description: string
  }>
  recommendations?: string[]
  acc?: string
  status?: string
  message?: {
    acc?: string
    images?: string[]
    mse_values?: number[]
    ssim_values?: number[]
    clf1?: number
    clf2?: number
    epsilon?: number
    clean_acc?: number
    asr?: number
  }
  attack_type?: string
  use_privacy?: boolean
  images?: string[]
  hasimage?: boolean
  mse_values?: number[]
  ssim_values?: number[]
  clf1?: number
  clf2?: number
  epsilon?: number
}

const route = useRoute()
const router = useRouter()
const message = useMessage()

const analysisResult = ref<AnalysisResultType | null>(null)
const loading = ref(true)
const activeTab = ref('overview')
const showImagePreview = ref(false)
const previewImageSrc = ref('')

// 计算属性
const hasImages = computed(() => {
  return analysisResult.value?.hasimage || 
         (analysisResult.value?.images && analysisResult.value.images.length > 0) ||
         (analysisResult.value?.message?.images && analysisResult.value.message.images.length > 0)
})

const imageList = computed(() => {
  // 优先使用 message 中的图像数据
  if (analysisResult.value?.message?.images && analysisResult.value.message.images.length > 0) {
    return analysisResult.value.message.images
  }
  // 其次使用根级别的图像数据
  if (analysisResult.value?.images && analysisResult.value.images.length > 0) {
    return analysisResult.value.images
  }
  return []
})

// 从路由参数或本地存储获取分析结果
const loadAnalysisResult = () => {
  try {
    // 尝试从路由状态获取数据
    if (route.params.resultData) {
      analysisResult.value = JSON.parse(route.params.resultData as string)
    } else {
      // 从本地存储获取分析结果（优先使用TaskResultModal传递的数据）
      const storedResult = localStorage.getItem('analysisResult') || localStorage.getItem('latestAnalysisResult')
      if (storedResult) {
        analysisResult.value = JSON.parse(storedResult)
      } else {
        message.warning('未找到分析结果数据')
        router.push('/dashboard/model-analysis')
        return
      }
    }
    loading.value = false
  } catch (error) {
    console.error('加载分析结果失败:', error)
    message.error('加载分析结果失败')
    router.push('/dashboard/model-analysis')
  }
}

// 计算安全等级
const securityLevel = computed(() => {
  if (!analysisResult.value?.acc) return { level: '未知', color: 'default' }
  
  const acc = parseFloat(analysisResult.value.acc)
  if (acc >= 0.9) return { level: '高安全', color: 'success' }
  if (acc >= 0.7) return { level: '中等安全', color: 'warning' }
  return { level: '低安全', color: 'error' }
})

// 格式化攻击类型
const formatAttackType = (type: string) => {
  const typeMap: Record<string, string> = {
    'all': '对抗攻击评估',
    'backdoor': '数据投毒分析',
    'dlg': '模型推断风险',
    'mia': '成员推断风险'
  }
  return typeMap[type] || type
}

// 返回上一页
const goBack = () => {
  router.push('/dashboard/model-analysis')
}

// 生成报告
const generateReport = () => {
  message.info('报告生成功能开发中...')
}

// 分享结果
const shareResult = () => {
  message.info('分享功能开发中...')
}

const previewImage = (src: string) => {
  previewImageSrc.value = src
  showImagePreview.value = true
}

const getImageTitle = (index: number) => {
  const attackType = analysisResult.value?.attack_type
  
  if (attackType === 'dlg') {
    return `重构图像 ${index + 1}`
  } else if (attackType === 'backdoor') {
    return `后门样本 ${index + 1}`
  } else if (attackType === 'mia') {
    return `推断样本 ${index + 1}`
  } else {
    return `图像 ${index + 1}`
  }
}

onMounted(() => {
  loadAnalysisResult()
})
</script>

<template>
  <div class="result-detail-container">
    <n-space vertical size="large">
      <!-- 头部导航 -->
      <n-card class="header-card">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-button text @click="goBack">
              <template #icon>
                <n-icon><ArrowBackOutline /></n-icon>
              </template>
              返回分析
            </n-button>
            <h2 style="margin: 0;">分析结果详情</h2>
          </n-space>
          <n-space>
            <n-button @click="generateReport">
              <template #icon>
                <n-icon><DocumentTextOutline /></n-icon>
              </template>
              生成报告
            </n-button>
            <n-button type="primary" @click="shareResult">
              分享结果
            </n-button>
          </n-space>
        </n-space>
      </n-card>

      <!-- 加载状态 -->
      <n-card v-if="loading">
        <div style="text-align: center; padding: 40px;">
          <n-spin size="large" />
          <p style="margin-top: 16px;">加载分析结果中...</p>
        </div>
      </n-card>

      <!-- 结果内容 -->
      <template v-else-if="analysisResult">
        <!-- 概览卡片 -->
        <n-card title="分析概览" class="overview-card">
          <n-grid :cols="4" :x-gap="20">
            <n-grid-item>
              <n-statistic label="攻击类型" :value="formatAttackType(analysisResult.attack_type || '')" />
            </n-grid-item>

            <n-grid-item>
              <n-statistic label="安全等级">
                <template #suffix>
                  <n-tag :type="securityLevel.color">{{ securityLevel.level }}</n-tag>
                </template>
              </n-statistic>
            </n-grid-item>
            <n-grid-item>
              <n-statistic label="隐私保护" :value="analysisResult.use_privacy ? '已启用' : '未启用'" />
            </n-grid-item>
          </n-grid>
        </n-card>

        <!-- 详细结果标签页 -->
        <n-card>
          <n-tabs v-model:value="activeTab" type="line">
            <!-- 基础信息 -->
            <n-tab-pane name="overview" tab="基础信息">
              <n-space vertical size="large">
                <n-descriptions label-placement="left" :column="2">
                  <n-descriptions-item label="分析状态">
                    <n-tag :type="analysisResult.status === 'success' ? 'success' : 'error'">
                      {{ analysisResult.status === 'success' ? '成功' : '失败' }}
                    </n-tag>
                  </n-descriptions-item>
                  
                  <!-- DLG 攻击特有指标 -->
                  <template v-if="analysisResult.attack_type === 'dlg'">
                    <n-descriptions-item label="重构质量 (MSE)" v-if="analysisResult.message?.mse_values">
                      {{ analysisResult.message.mse_values.map(v => v.toFixed(4)).join(', ') }}
                    </n-descriptions-item>
                    <n-descriptions-item label="结构相似性 (SSIM)" v-if="analysisResult.message?.ssim_values">
                      {{ analysisResult.message.ssim_values.map(v => v.toFixed(4)).join(', ') }}
                    </n-descriptions-item>
                  </template>
                  
                  <!-- Backdoor 攻击特有指标 -->
                  <template v-else-if="analysisResult.attack_type === 'backdoor'">
                    <n-descriptions-item label="干净准确率" v-if="analysisResult.message?.clean_acc">
                      {{ (analysisResult.message.clean_acc * 100).toFixed(2) }}%
                    </n-descriptions-item>
                    <n-descriptions-item label="攻击成功率" v-if="analysisResult.message?.asr">
                      {{ (analysisResult.message.asr * 100).toFixed(2) }}%
                    </n-descriptions-item>
                  </template>
                  
                  <!-- MIA 攻击特有指标 -->
                  <template v-else-if="analysisResult.attack_type === 'mia'">
                    <n-descriptions-item label="训练集准确率" v-if="analysisResult.message?.clf1">
                      {{ (analysisResult.message.clf1 * 100).toFixed(2) }}%
                    </n-descriptions-item>
                    <n-descriptions-item label="测试集准确率" v-if="analysisResult.message?.clf2">
                      {{ (analysisResult.message.clf2 * 100).toFixed(2) }}%
                    </n-descriptions-item>
                    <n-descriptions-item label="攻击强度 (Epsilon)" v-if="analysisResult.message?.epsilon">
                      {{ analysisResult.message.epsilon === 1e308 ? '∞' : analysisResult.message.epsilon }}
                    </n-descriptions-item>
                    <n-descriptions-item label="推断准确率" v-if="analysisResult.message?.acc">
                      {{ (Number(analysisResult.message.acc) * 100).toFixed(2) }}%
                    </n-descriptions-item>
                  </template>
                  
                  <!-- 通用指标 -->
                  <n-descriptions-item label="总体准确率" v-if="analysisResult.acc">
                    {{ analysisResult.acc }}
                  </n-descriptions-item>
                </n-descriptions>

                <n-alert v-if="analysisResult.use_privacy" type="info">
                  <template #icon>
                    <n-icon><ShieldCheckmarkOutline /></n-icon>
                  </template>
                  本次分析启用了隐私保护机制，结果已经过差分隐私处理
                </n-alert>
              </n-space>
            </n-tab-pane>

            <!-- 性能指标 -->
            <n-tab-pane name="metrics" tab="性能指标" v-if="analysisResult.mse_values || analysisResult.ssim_values">
              <n-space vertical size="large">
                <n-card title="MSE 值" v-if="analysisResult.mse_values">
                  <n-list>
                    <n-list-item v-for="(value, index) in analysisResult.mse_values" :key="index">
                      <n-thing>
                        <template #header>样本 {{ index + 1 }}</template>
                        <template #description>
                          MSE: {{ value.toFixed(6) }}
                        </template>
                      </n-thing>
                    </n-list-item>
                  </n-list>
                </n-card>

                <n-card title="SSIM 值" v-if="analysisResult.ssim_values">
                  <n-list>
                    <n-list-item v-for="(value, index) in analysisResult.ssim_values" :key="index">
                      <n-thing>
                        <template #header>样本 {{ index + 1 }}</template>
                        <template #description>
                          SSIM: {{ value.toFixed(6) }}
                        </template>
                      </n-thing>
                    </n-list-item>
                  </n-list>
                </n-card>
              </n-space>
            </n-tab-pane>

            <!-- 图像展示 -->
            <n-tab-pane name="images" tab="图像展示" v-if="hasImages">
              <n-space vertical size="large">
                <n-alert type="info">
                  <template #icon>
                    <n-icon><ImageOutline /></n-icon>
                  </template>
                  以下是分析过程中生成的图像结果
                </n-alert>
                
                <!-- DLG 攻击结果展示 -->
                <template v-if="analysisResult.attack_type === 'dlg' && imageList && imageList.length > 0">
                  <div class="attack-result">
                    <div class="image-box">
                      <div class="image-wrapper" v-for="(image, index) in imageList" :key="index">
                        <n-card size="small" class="image-card">
                          <template #header>
                            {{ getImageTitle(index) }}
                          </template>
                          <n-image
                            :src="`data:image/png;base64,${image}`"
                            object-fit="contain"
                            class="result-image"
                            width="200px"
                            height="200px"
                            preview-disabled
                            @click="previewImage(`data:image/png;base64,${image}`)"
                            style="cursor: pointer;"
                          />
                          <div class="metrics" v-if="analysisResult.message?.mse_values && analysisResult.message?.ssim_values">
                            <div class="metric-item">
                              <span class="metric-label">MSE:</span>
                              <span class="metric-value">{{ analysisResult.message.mse_values[index]?.toFixed(4) }}</span>
                            </div>
                            <div class="metric-item">
                              <span class="metric-label">SSIM:</span>
                              <span class="metric-value">{{ analysisResult.message.ssim_values[index]?.toFixed(4) }}</span>
                            </div>
                          </div>
                        </n-card>
                      </div>
                    </div>
                  </div>
                </template>
                
                <!-- 其他攻击类型的图像展示 -->
                <template v-else>
                  <n-grid :cols="2" :x-gap="16" :y-gap="16" v-if="imageList && imageList.length > 0">
                    <n-grid-item v-for="(image, index) in imageList" :key="index">
                      <n-card>
                        <template #header>
                          {{ getImageTitle(index) }}
                        </template>
                        <n-image
                          :src="`data:image/png;base64,${image}`"
                          :alt="`分析图像 ${index + 1}`"
                          width="100%"
                          height="300"
                          object-fit="contain"
                          preview-disabled
                          @click="previewImage(`data:image/png;base64,${image}`)"
                          style="cursor: pointer;"
                        />
                      </n-card>
                    </n-grid-item>
                  </n-grid>
                </template>
                
                <n-empty v-else description="暂无图像数据" />
              </n-space>
            </n-tab-pane>

            <!-- 安全建议 -->
            <n-tab-pane name="recommendations" tab="安全建议">
              <n-space vertical size="large">
                <n-alert type="warning">
                  <template #icon>
                    <n-icon><WarningOutline /></n-icon>
                  </template>
                  基于分析结果，我们为您提供以下安全建议
                </n-alert>

                <n-timeline>
                  <n-timeline-item type="info" title="模型加固">
                    建议采用对抗训练技术，提高模型对对抗样本的鲁棒性
                  </n-timeline-item>
                  <n-timeline-item type="warning" title="隐私保护">
                    考虑使用差分隐私技术保护训练数据的隐私
                  </n-timeline-item>
                  <n-timeline-item type="success" title="监控部署">
                    在生产环境中部署异常检测机制，实时监控模型行为
                  </n-timeline-item>
                  <n-timeline-item type="error" title="定期评估">
                    建议定期进行安全评估，及时发现新的安全威胁
                  </n-timeline-item>
                </n-timeline>
              </n-space>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </template>

      <!-- 无数据状态 -->
      <n-card v-else>
        <div style="text-align: center; padding: 40px;">
          <n-icon size="48" color="#999">
            <InformationCircleOutline />
          </n-icon>
          <h3 style="margin: 16px 0 8px 0; color: #999;">暂无分析结果</h3>
          <p style="color: #666; margin-bottom: 24px;">请先进行模型分析</p>
          <n-button type="primary" @click="goBack">
            返回分析页面
          </n-button>
        </div>
      </n-card>
    </n-space>
    
    <!-- 图像预览模态框 -->
    <n-modal v-model:show="showImagePreview" preset="card" style="width: 80%; max-width: 800px;">
      <template #header>
        图像预览
      </template>
      <n-image
        :src="previewImageSrc"
        width="100%"
        object-fit="contain"
      />
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
.result-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-card {
  :deep(.n-card__content) {
    padding: 16px 24px;
  }
}

.overview-card {
  background: var(--background-light);
  
  :deep(.n-statistic) {
    text-align: center;
  }
}

:deep(.n-tabs-nav) {
  background: var(--background-light);
}

:deep(.n-image) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.n-timeline-item-content__title) {
  font-weight: 600;
}

.attack-result {
  .image-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .image-wrapper {
    .image-card {
      width: fit-content;
      
      .metrics {
        margin-top: 8px;
        font-size: 12px;

        .metric-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;

          .metric-label {
            color: var(--text-color-secondary);
            margin-right: 8px;
          }

          .metric-value {
            font-family: monospace;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.dark {
  .overview-card {
    background: var(--card-background-dark);
  }
}
</style>