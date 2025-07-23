<script setup lang="ts">
import { ref,provide, onBeforeUnmount } from 'vue'
import {
  NCard,
  NSpace,
  NSelect,
  NButton,
  NIcon,
  NProgress,
  useMessage,
  NCollapseTransition,
  NFormItem,
  NSlider,
  NInputNumber,
  NSwitch,
  NList,
  NListItem,
  NTag,
  NDrawer,
  NDrawerContent,
  NDescriptions,
  NDescriptionsItem,
  NThing,
  NAlert,
  useDialog
} from 'naive-ui'
import { WarningOutline, AnalyticsOutline, AlertCircleOutline, ShieldCheckmarkOutline, SettingsOutline, SearchOutline } from '@vicons/ionicons5'
// import AnalysisResult from '../components/AnalysisResult.vue' // 已移除分析结果组件
import { useStorage } from '@vueuse/core'
import FileUploader from '../components/FileUploader.vue'
import TrainingLog from '../components/TrainingLog.vue'
import { useTaskQueueStore } from '@/stores/taskQueue'
import { useRouter } from 'vue-router'

const cachedComponents = ref<string[]>(['FileUploader'])

interface AnalysisResultType {
  score: number
  categories: Array<{
    name: string
    score: number
  }>
  vulnerabilities: Array<{
    type: string
    severity: 'high' | 'medium' | 'low'
    description: string
  }>
  recommendations: string[]
}
interface realResultType {
  acc?: string
  status?: string
  message?: object
  attack_type?: string
  use_privacy?: boolean
  images?: string[]
  hasimage?: boolean
  mse_values?: number[]
  ssim_values?: number[]
  clf1?:number
  clf2?:number
  epsilon?:number
}
interface ModelFile {
  id: string
  name: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  result?: AnalysisResultType
}

const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const taskQueue = useTaskQueueStore()
const analysisType = useStorage('analysis-type', null)
const showAdvancedConfig = useStorage('show-advanced-config', false)
const advancedConfig = useStorage('advanced-config', {
  attackStrength: 0.3,
  iterations: 100,
  usePrivacy: false
})
const batchMode = useStorage('batch-mode', false)
const analyzing = ref(false)
const analysisResult = ref<AnalysisResultType | null>(null)
const modelFiles = ref<ModelFile[]>([])
const analysisProgress = ref(0)
let progressInterval: ReturnType<typeof setInterval> | null = null
let currentTaskId = ref<string | null>(null)
const realResult = ref<realResultType>({
  acc: '',
  status: '',
  message: {},
  attack_type: '',
  use_privacy: false,
  hasimage: false,
  images: [],
  mse_values:[] ,
  ssim_values:[] ,
  clf1:0,
  clf2:0,
  epsilon:0
})
provide('analysisResult', analysisResult)
provide('realResult', realResult)

const analysisOptions = [
  {
    label: '对抗攻击评估',
    value: 'all',
    description: '全面评估模型在面对对抗样本时的防御能力，包括FGSM、PGD等主流白盒攻击和迁移攻击等黑盒攻击场景。',
    principle: '通过梯度信息或启发式方法生成微扰动样本，测试模型对输入扰动的敏感性和决策边界的稳定性。',
    impact: '模型可能在微小扰动下产生误判，在安全攸关场景（如自动驾驶、医疗诊断）可能造成严重后果。',
    defense: '推荐采用对抗训练、随机化防御、特征压缩等技术增强模型鲁棒性，构建多层防御机制。'
  },
  {
    label: '后门攻击分析',
    value: 'backdoor',
    description: '深入检测模型训练数据中的潜在后门和触发器，评估数据投毒攻击的影响范围和成功率。',
    principle: '分析训练数据分布异常和模型行为特征，识别可能被植入的后门触发模式和攻击目标。',
    impact: '攻击者可通过触发特定模式操控模型行为，在特定场景下引发定向误分类，威胁系统可靠性。',
    defense: '建议结合神经元修剪、模型净化、对抗验证等技术，同时加强数据质量控制和异常检测机制。'
  },
  {
    label: '模型推断风险',
    value: 'dlg',
    description: '评估模型结构、参数和训练策略的保密性，防范模型克隆和知识产权盗取风险。',
    principle: '通过系统化的黑盒查询和输出分析，结合优化算法重建模型架构和关键参数信息。',
    impact: '可能导致核心算法泄露、商业模型被复制，并为定向攻击提供详细的目标信息。',
    defense: '推荐实施模型加密、梯度扰动、预测结果量化等技术手段，构建多层次的模型保护方案。'
  },
  {
    label: '成员推断风险',
    value: 'mia',
    description: '全面评估模型在保护训练数据隐私方面的能力，识别潜在的数据成员泄露风险。',
    principle: '利用模型对训练样本和非训练样本的预测置信度差异，推断目标数据是否参与模型训练。',
    impact: '可能泄露敏感训练数据的成员身份，在医疗、金融等领域造成严重的隐私泄露问题。',
    defense: '建议采用差分隐私训练、知识蒸馏、预测结果泛化等技术，平衡模型性能和隐私保护需求。'
  },
]
const showAttackInfo = ref(false)
const selectedAttack = ref<typeof analysisOptions[0] | null>(null)
const showHyperParams = ref(false)

// 超参数配置
const hyperParams = ref([
  {
    name: '学习率 (Learning Rate)',
    key: 'lr',
    description: '控制模型参数更新的步长大小，影响训练收敛速度和稳定性。较高的学习率可能导致训练不稳定，较低的学习率会使训练过程缓慢。当前优化值: 0.075533',
    range: '0.001 - 0.5',
    defaultValue: 0.075533,
    category: '训练参数',
    currentValue: 0.075533,
    impact: '直接影响模型收敛速度和最终性能，是训练过程中最关键的超参数之一'
  },
  {
    name: '噪声乘数 (Noise Multiplier)',
    key: 'noise_multiplier',
    description: '差分隐私训练中控制添加噪声强度的关键参数。较高的值提供更强的隐私保护但可能降低模型性能。当前优化值: 4.778214',
    range: '0.1 - 10.0',
    defaultValue: 4.778214,
    category: '隐私参数',
    currentValue: 4.778214,
    impact: '平衡隐私保护强度与模型实用性，是差分隐私机制的核心控制参数'
  },
  {
    name: '最大梯度范数 (Max Grad Norm)',
    key: 'max_grad_norm',
    description: '梯度裁剪的阈值，防止梯度爆炸问题并确保训练稳定性。通过限制梯度的L2范数来控制参数更新幅度。当前优化值: 11.113912',
    range: '0.1 - 50.0',
    defaultValue: 11.113912,
    category: '训练参数',
    currentValue: 11.113912,
    impact: '防止梯度爆炸，确保训练过程的数值稳定性，特别在深度网络中至关重要'
  },
  {
    name: '批次大小 (Batch Size)',
    key: 'batch_size',
    description: '每次前向传播处理的样本数量，影响内存使用、训练速度和模型收敛特性。较大批次提供更稳定的梯度估计。当前优化值: 64',
    range: '8 - 512',
    defaultValue: 64,
    category: '性能参数',
    currentValue: 64,
    impact: '影响训练效率、内存占用和梯度估计质量，需要根据硬件资源和数据特性调整'
  },
  {
    name: '训练轮数 (Epoch)',
    key: 'epoch',
    description: '模型在整个训练数据集上的完整训练轮数。过少可能导致欠拟合，过多可能导致过拟合。当前优化值: 7',
    range: '1 - 100',
    defaultValue: 7,
    category: '训练参数',
    currentValue: 7,
    impact: '决定模型训练的充分程度，需要结合验证集性能来确定最优停止点'
  },
])

const handleAnalysisTypeChange = (value: string) => {
  const selected = analysisOptions.find(option => option.value === value)
  if (selected) {
    selectedAttack.value = selected
    showAttackInfo.value = true
  }
}

// 获取参数类别对应的标签颜色
const getParamCategoryColor = (category: string): "error" | "default" | "success" | "warning" | "info" | "primary" => {
  const colorMap: Record<string, "error" | "default" | "success" | "warning" | "info" | "primary"> = {
    '训练参数': 'primary',
    '隐私参数': 'warning',
    '对抗攻击': 'error',
    '优化参数': 'info',
    '性能参数': 'success',
    '推断参数': 'default'
  }
  return colorMap[category] || 'default'
}
const startAnalysis = async () => {
  if (!analysisType.value) {
    message.warning('请选择分析类型')
    return
  }
  if (batchMode.value) {
    if (modelFiles.value.length === 0) {
      message.warning('请先上传模型文件')
      return
    }
  }

  // 获取分析类型的中文名称
  const analysisOption = analysisOptions.find(option => option.value === analysisType.value)
  const taskName = analysisOption ? analysisOption.label : '模型分析'
  
  // 添加任务到队列
  const taskId = taskQueue.addTask({
    name: taskName,
    type: taskName
  })
  currentTaskId.value = taskId
  
  // 启动任务
  taskQueue.startTask(taskId)

  let progressInterval: ReturnType<typeof setInterval> | null = null

  try {
    analyzing.value = true
    analysisProgress.value = 0
    
    // 模拟进度更新
    progressInterval = setInterval(() => {
      if (analysisProgress.value < 90) {
        analysisProgress.value += 10
        // 同步更新任务进度
        taskQueue.updateProgress(taskId, analysisProgress.value)
      }
    }, 1000)

    const response = await fetch('/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: analysisType.value,
        use_privacy: advancedConfig.value.usePrivacy,
      }) 
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    analysisProgress.value = 100
    taskQueue.updateProgress(taskId, 100)
    
    const result = await response.json()
    
    console.log('分析结果:', result)
    analysisResult.value = result
    realResult.value = result
    
    // 保存结果到本地存储，供详情页面使用
    localStorage.setItem('latestAnalysisResult', JSON.stringify(result))
    
    // 完成任务
    taskQueue.completeTask(taskId, result, message)
    
    // 弹出任务完成提示
    dialog.success({
      title: '分析完成',
      content: '模型安全分析已完成，点击查看详细结果。',
      positiveText: '查看结果',
      negativeText: '稍后查看',
      onPositiveClick: () => {
        router.push('/dashboard/model-analysis/result')
      }
    })
    
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    
    const errorMessage = '请先设置配置信息'
 
    
    // 标记任务失败
    taskQueue.errorTask(taskId, errorMessage, message)

  } finally {
    analyzing.value = false
    currentTaskId.value = null
  }
}
onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  analyzing.value = false
  analysisProgress.value = 0
})

// const generateReport = () => {
//   showReport.value = true
// }
</script>

<template>
  
  <div class="analysis-container" >
    <n-space vertical size="large">
      <n-card title="模型上传" class="upload-card">
        <file-uploader />
      </n-card>
      
      <!-- 文件列表 -->
      <keep-alive :include="cachedComponents">
      <n-card v-if="batchMode && modelFiles.length > 0" title="文件列表">
        <n-list>
          <n-list-item v-for="file in modelFiles" :key="file.id">
            <n-space justify="space-between" align="center">
              <span>{{ file.name }}</span>
              <n-tag
                :type="
                  file.status === 'completed'
                    ? 'success'
                    : file.status === 'analyzing'
                      ? 'warning'
                      : 'default'
                "
              >
                {{
                  file.status === 'completed'
                    ? '已完成'
                    : file.status === 'analyzing'
                      ? '分析中'
                      : '待分析'
                }}
              </n-tag>
            </n-space>
          </n-list-item>
        </n-list>
      </n-card>
      </keep-alive>
      <n-card title="分析配置" class="config-card">
        <n-space vertical>
          <n-select
            v-model:value="analysisType"
            :options="analysisOptions"
            placeholder="选择分析类型"
            @update:value="handleAnalysisTypeChange"
          />

          <n-button text @click="showAdvancedConfig = !showAdvancedConfig">
            {{ showAdvancedConfig ? '隐藏高级配置' : '显示高级配置' }}
          </n-button>

          <n-collapse-transition :show="showAdvancedConfig">
            <div class="advanced-config">
              <n-form-item label="启用隐私保护">
                <n-switch v-model:value="advancedConfig.usePrivacy" />
              </n-form-item>
            </div>
          </n-collapse-transition>

          <n-button
            type="primary"
            block
            :loading="analyzing"
            :disabled="!analysisType"
            @click="startAnalysis"
          >
            {{ analyzing ? '分析中...' : '开始分析' }}
          </n-button>
        </n-space>
      </n-card>

      <!-- 超参数配置说明 -->
      <n-card v-if="advancedConfig.usePrivacy" title="攻击超参数配置" class="hyperparams-card">
        <template #header-extra>
          <n-button text @click="showHyperParams = !showHyperParams">
            <template #icon>
              <n-icon><SettingsOutline /></n-icon>
            </template>
            {{ showHyperParams ? '收起' : '查看详情' }}
          </n-button>
        </template>
        
        <n-alert type="info" class="hyperparams-intro">
          <template #icon>
            <n-icon><SearchOutline /></n-icon>
          </template>
          <div>
            <p><strong>🔍 智能超参搜索已启用</strong></p>
            <p>启用隐私保护后，系统会自动搜索最优的攻击参数组合，提升攻击效果和评估准确性。</p>
            <p><strong>💡 提示：</strong>超参搜索会根据您的模型特征和数据集自动调优，无需手动配置。</p>
          </div>
        </n-alert>

        <n-collapse-transition :show="showHyperParams">
          <div class="hyperparams-content">
            <n-alert type="warning" style="margin-bottom: 16px;">
              <template #icon>
                <n-icon><WarningOutline /></n-icon>
              </template>
              <div>
                <p><strong>⚠️ 重要说明</strong></p>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>以下参数值为系统自动优化结果，实际运行时会动态调整</li>
                  <li>超参搜索过程可能需要额外时间，但能显著提升攻击成功率</li>
                  <li>不同攻击类型会使用不同的参数组合策略</li>
                </ul>
              </div>
            </n-alert>
            
            <n-list>
              <n-list-item v-for="param in hyperParams" :key="param.key">
                <n-thing>
                  <template #header>
                    <div class="param-header">
                      <span class="param-name">{{ param.name }}</span>
                      <n-tag size="small" :type="getParamCategoryColor(param.category)">
                        {{ param.category }}
                      </n-tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="param-details">
                      <p class="param-description">{{ param.description }}</p>
                      <div class="param-meta">
                        <span class="param-range">取值范围: {{ param.range }}</span>
                        <span class="param-default">默认值: {{ param.defaultValue }}</span>
                        <span v-if="param.currentValue" class="param-current">当前值: {{ param.currentValue }}</span>
                      </div>
                      <div v-if="param.impact" class="param-impact">
                        <n-tag size="tiny" type="info">影响说明</n-tag>
                        <span class="impact-text">{{ param.impact }}</span>
                      </div>
                    </div>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
        </n-collapse-transition>
      </n-card>
      
      <!-- 未启用隐私保护时的提示 -->
      <n-card v-else title="超参数优化" class="hyperparams-card">
        <n-alert type="default">
          <template #icon>
            <n-icon><SettingsOutline /></n-icon>
          </template>
          <div>
            <p><strong>🔧 超参数自动优化</strong></p>
            <p>开启<strong>隐私保护</strong>功能后，系统将启用智能超参搜索，自动为您的模型找到最优的攻击参数配置。</p>
            <p><strong>优势：</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>✅ 自动调优，无需手动配置复杂参数</li>
              <li>✅ 提升攻击成功率和评估准确性</li>
              <li>✅ 适配不同模型架构和数据集特征</li>
              <li>✅ 节省调参时间，专注于安全分析结果</li>
            </ul>
          </div>
        </n-alert>
      </n-card>

<!--       
      <n-card title="分析进度" v-if="analyzing">
        <n-space vertical>
          <n-progress
            type="line"
            :percentage="analysisProgress"
            :height="24"
            processing
          />
          <div class="progress-text">分析进度：{{ analysisProgress }}%</div>
        </n-space>
      </n-card> -->

      <TrainingLog ref="trainingLogRef" />
      
      <!-- 分析结果组件已移除，任务完成后将弹出提示 -->

      <!-- <SecurityChart
        v-if="analysisResult"
        :data="{
          score: analysisResult.score,
          categories: analysisResult.categories,
        }"
      /> -->
<!-- 
      <AnalysisTrend v-if="analysisStore.analysisHistory.length > 0" /> -->

      <!-- <ReportGenerator v-model:show="showReport" :data="analysisResult" v-if="analysisResult" /> -->
<!-- 
      <AnalysisComparison
        v-if="batchMode && modelFiles.filter((f) => f.status === 'completed').length > 1"
        :records="
          modelFiles
            .filter((f) => f.status === 'completed' && f.result)
            .map((f) => ({
              id: f.id,
              date: new Date().toISOString(),
              modelName: f.name,
              result: f.result!,
            }))
        "
      /> -->
    </n-space>
    
   
    
    <n-drawer v-model:show="showAttackInfo" :width="480" placement="right">
      <n-drawer-content v-if="selectedAttack" :title="selectedAttack.label + ' - 详细信息'" class="attack-info-drawer">
        <n-descriptions label-placement="left" :column="1" class="attack-descriptions">
          <n-descriptions-item label="攻击描述" label-style="font-weight: bold; color: var(--primary-color);">
            <div class="description-content">
              <n-icon size="20" class="description-icon">
                <warning-outline />
              </n-icon>
              {{ selectedAttack.description }}
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="攻击原理" label-style="font-weight: bold; color: var(--primary-color);">
            <div class="description-content">
              <n-icon size="20" class="description-icon">
                <analytics-outline />
              </n-icon>
              {{ selectedAttack.principle }}
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="影响范围" label-style="font-weight: bold; color: var(--primary-color);">
            <div class="description-content">
              <n-icon size="20" class="description-icon">
                <alert-circle-outline />
              </n-icon>
              {{ selectedAttack.impact }}
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="防御建议" label-style="font-weight: bold; color: var(--primary-color);">
            <div class="description-content">
              <n-icon size="20" class="description-icon">
                <shield-checkmark-outline />
              </n-icon>
              {{ selectedAttack.defense }}
            </div>
          </n-descriptions-item>
        </n-descriptions>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="scss" scoped>
.analysis-container {
  max-width: 800px;
  margin: 0 auto;
}

.upload-card,
.config-card,
.hyperparams-card {
  background: var(--background-light);

  .dark & {
    background: var(--card--background-dark);
  }

}

.upload-trigger {
  margin-top: 8px;
  color: #999;
}

.advanced-config {
  padding: 16px;
  background: rgba(14, 224, 53, 0.02);
  border-radius: 6px;
  margin: 8px 0;

  :deep(.dark-mode) & {
    background: rgba(255, 255, 255, 0.02);
  }
}

.file-list {
  margin-top: 16px;

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }
  }
}

.batch-controls {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.hyperparams-intro {
  margin-bottom: 16px;
}

.hyperparams-content {
  margin-top: 16px;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.param-name {
  font-weight: 600;
  font-size: 14px;
}

.param-details {
  .param-description {
    margin: 0 0 8px 0;
    color: var(--text-color-2);
    line-height: 1.5;
  }
  
  .param-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--text-color-3);
    flex-wrap: wrap;
    
    .param-range {
      &::before {
        content: '📊 ';
      }
    }
    
    .param-default {
      &::before {
        content: '⚙️ ';
      }
    }
    
    .param-current {
      color: var(--primary-color);
      font-weight: 500;
      &::before {
        content: '🎯 ';
      }
    }
  }
  
  .param-impact {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(24, 160, 88, 0.05);
    border-radius: 6px;
    border-left: 3px solid var(--info-color);
    
    .impact-text {
      margin-left: 8px;
      font-size: 12px;
      color: var(--text-color-2);
      line-height: 1.4;
    }
    
    .dark & {
      background: rgba(255, 255, 255, 0.03);
    }
  }
}
</style>
