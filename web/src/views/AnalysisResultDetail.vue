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
    'backdoor': '后门攻击分析',
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
  if (!analysisResult.value) {
    message.error('无分析结果数据，无法生成报告')
    return
  }

  const reportContent = generateReportContent()
  downloadReport(reportContent)
  message.success('报告已生成并下载')
}

// 生成报告内容
const generateReportContent = () => {
  const result = analysisResult.value!
  const attackType = result.attack_type || '未知'
  const usePrivacy = result.use_privacy ? '已启用' : '未启用'
  const currentDate = new Date().toLocaleDateString('zh-CN')
  
  let reportContent = `# 隐私评估报告

生成时间：${currentDate}\n攻击类型：${formatAttackType(attackType)}\n隐私保护：${usePrivacy}\n\n`
  
  // 根据攻击类型生成不同的报告内容
  if (attackType === 'mia') {
    reportContent += generateMIAReport(result)
  } else if (attackType === 'dlg') {
    reportContent += generateDLGReport(result)
  } else if (attackType === 'backdoor') {
    reportContent += generateBackdoorReport(result)
  }
  
  // 添加通用的改进建议
  reportContent += generateImprovementSuggestions()
  
  return reportContent
}

// 生成MIA攻击报告
const generateMIAReport = (result: AnalysisResultType) => {
  const trainAcc = result.message?.clf1 ? (result.message.clf1 * 100).toFixed(2) : '未知'
  const testAcc = result.message?.clf2 ? (result.message.clf2 * 100).toFixed(2) : '未知'
  const attackAcc = result.message?.acc || result.acc || '未知'
  const epsilon = result.message?.epsilon === 1e308 ? '∞' : (result.message?.epsilon || '未知')
  
  return `## 基于MIA攻击的安全性评估

**定义**：成员推断攻击（Membership Inference Attack，MIA）是一种针对机器学习模型的隐私攻击方法，攻击者试图通过观察模型的输入和输出，推断某个数据样本是否属于模型的训练数据集。

**评估方法**：
1. **攻击模型构建**：攻击者根据目标模型的输出（例如置信度分布）设计一个分类器，用于判断样本是否属于训练集。
2. **数据划分**：将目标模型的训练数据和未见数据分别作为 "成员" 和 "非成员" 样本。
3. **攻击过程**：攻击者通过观察目标模型的输出概率分布，推断样本的成员身份。
4. **指标计算**：基于攻击分类的准确率，计算模型在不同隐私保护设置下的隐私泄露程度。

**评估结果**：

- **训练集准确率**：${trainAcc}%
- **测试集准确率**：${testAcc}%
- **攻击准确率**：${attackAcc}%
- **隐私预算 (Epsilon)**：${epsilon}

**分析与总结**：
- **隐私泄露现象**：${result.use_privacy ? '在差分隐私保护下，模型的隐私泄露风险得到有效控制。' : '在无隐私保护的情况下，模型对训练数据的过拟合导致其输出对成员样本和非成员样本存在显著差异。'}
- **隐私保护效果**：${result.use_privacy ? '差分隐私技术通过在模型输出或训练过程中加入噪声，模糊了训练数据和非训练数据之间的差异，从根本上提高了模型的隐私安全性。' : '建议启用差分隐私保护以降低隐私泄露风险。'}

`
}

// 生成DLG攻击报告
const generateDLGReport = (result: AnalysisResultType) => {
  const mseValues = result.message?.mse_values || []
  const ssimValues = result.message?.ssim_values || []
  const avgMSE = mseValues.length > 0 ? (mseValues.reduce((a, b) => a + b, 0) / mseValues.length).toFixed(6) : '未知'
  const avgSSIM = ssimValues.length > 0 ? (ssimValues.reduce((a, b) => a + b, 0) / ssimValues.length).toFixed(6) : '未知'
  
  return `## 基于DLG攻击的安全性评估

**定义**：DLG（Deep Leakage from Gradients）攻击基于模型梯度信息，试图推测训练数据的具体特征或内容。通过分析模型训练过程中的梯度信息，攻击者可以还原训练样本或推断其敏感属性。

**评估方法**：
1. **梯度信息收集**：模拟攻击者获取目标模型在训练过程中生成的梯度信息。
2. **数据推断**：利用梯度信息构建攻击模型，推测训练数据的特征或内容。
3. **误差计算**：比较攻击推测结果与真实数据，计算 MSE 和 SSIM 值，评估模型在面临 DLG 攻击时的隐私泄露程度。

**评估结果**：

- **平均重构误差 (MSE)**：${avgMSE}
- **平均结构相似性 (SSIM)**：${avgSSIM}
- **重构图像数量**：${mseValues.length}
- **MSE 值范围**：${mseValues.length > 0 ? `${Math.min(...mseValues).toFixed(6)} - ${Math.max(...mseValues).toFixed(6)}` : '无数据'}
- **SSIM 值范围**：${ssimValues.length > 0 ? `${Math.min(...ssimValues).toFixed(6)} - ${Math.max(...ssimValues).toFixed(6)}` : '无数据'}

**分析与总结**：
- **隐私泄露现象**：${result.use_privacy ? '在差分隐私保护下，梯度中的敏感信息得到有效保护，攻击者难以准确重构原始数据。' : 'MSE值较低表明攻击者能够利用梯度信息较为准确地还原训练数据特征，存在隐私泄露风险。'}
- **隐私保护效果**：${result.use_privacy ? '差分隐私技术在梯度计算过程中引入噪声，通过模糊化敏感信息，有效增强了隐私保护效果。' : '建议启用差分隐私保护以提高梯度信息的安全性。'}

`
}

// 生成后门攻击报告
const generateBackdoorReport = (result: AnalysisResultType) => {
  const cleanAcc = result.message?.clean_acc ? (result.message.clean_acc * 100).toFixed(2) : '未知'
  const asr = result.message?.asr ? (result.message.asr * 100).toFixed(5) : '未知'
  
  return `## 基于后门攻击的安全性评估

**定义**：后门攻击是一种针对机器学习模型的恶意攻击方式，攻击者在训练数据中植入特定的触发器模式，使得模型在遇到包含触发器的输入时产生预定的错误输出。

**评估方法**：
1. **触发器设计**：设计特定的触发器模式并植入到部分训练样本中。
2. **模型训练**：使用包含后门样本的数据集训练模型。
3. **攻击测试**：测试模型在正常样本和包含触发器样本上的表现。
4. **指标计算**：计算干净准确率和攻击成功率，评估后门攻击的有效性。

**评估结果**：

- **干净准确率 (Clean Accuracy)**：${cleanAcc}%
- **攻击成功率 (Attack Success Rate)**：${asr}%

**分析与总结**：
- **模型性能**：干净准确率为 ${cleanAcc}%，表明模型在正常样本上${parseFloat(cleanAcc) > 90 ? '表现良好' : '表现一般'}。
- **后门风险**：攻击成功率为 ${asr}%，${parseFloat(asr) > 80 ? '表明模型存在较高的后门攻击风险' : '表明模型对后门攻击具有一定的抵抗能力'}。
- **安全建议**：${result.use_privacy ? '当前已启用隐私保护措施，建议继续加强数据质量控制和异常检测。' : '建议启用隐私保护措施并加强训练数据的安全性验证。'}

`
}

// 生成改进建议
const generateImprovementSuggestions = () => {
  return `## 改进建议

1. **提升隐私保护技术的精度与效率**：
   - 在差分隐私的实现中，优化噪声注入机制，选择适合的噪声强度和分布，兼顾隐私保护与模型性能。
   - 使用动态噪声注入方法，根据训练过程中的隐私风险实时调整噪声水平，以提高隐私保护的灵活性和效率。
   - 结合梯度裁剪和差分隐私技术，形成多层次隐私保护机制，有效抑制数据泄露风险。

2. **增强模型的泛化能力**：
   - 通过数据增强技术，扩大训练数据的多样性，提高模型在未见数据上的预测能力。
   - 引入更强的正则化手段（如权重衰减或对抗正则化），减少模型过拟合，降低隐私泄露风险。

3. **采用隐私风险评估的多样化指标**：
   - 在传统指标的基础上，引入新的隐私评估方法（如信息熵或混合攻击评估），对隐私泄露进行更全面的评估。
   - 分析不同数据集和任务场景中的隐私保护效果，优化针对性策略。

4. **改进攻击模拟与防御评估**：
   - 构建更复杂和真实的攻击模拟框架，包括联合多种攻击方法，验证模型的综合抗攻击能力。
   - 定期评估隐私保护技术的有效性，动态更新保护策略，保持领先的隐私保护水平。

## 总结

本报告基于实际的模型分析结果，全面评估了模型在隐私保护方面的表现。通过科学的评估方法和详细的数据分析，为模型的隐私安全提供了重要的参考依据。建议根据评估结果，采取相应的隐私保护措施，确保模型在实际应用中的安全性和可靠性。
`
}

// 下载报告
const downloadReport = (content: string) => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `隐私评估报告_${new Date().toISOString().slice(0, 10)}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
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

            <!-- <n-grid-item>
              <n-statistic label="安全等级">
                <template #suffix>
                  <n-tag :type="securityLevel.color">{{ securityLevel.level }}</n-tag>
                </template>
              </n-statistic>
            </n-grid-item> -->
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
                      {{ (analysisResult.message.asr * 100).toFixed(5) }}%
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
                    <n-descriptions-item label="隐私预算 (Epsilon)" v-if="analysisResult.message?.epsilon">
                      {{ analysisResult.message.epsilon === 1e308 ? '∞' : analysisResult.message.epsilon }}
                    </n-descriptions-item>
                    <n-descriptions-item label="推断准确率" v-if="analysisResult.message?.acc">
                      {{ (Number(analysisResult.message.acc) * 100).toFixed(4) }}%
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