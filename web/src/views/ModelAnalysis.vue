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
} from 'naive-ui'
import { WarningOutline, AnalyticsOutline, AlertCircleOutline, ShieldCheckmarkOutline } from '@vicons/ionicons5'
import AnalysisResult from '../components/AnalysisResult.vue'
import { useStorage } from '@vueuse/core'
import FileUploader from '../components/FileUploader.vue'
import TrainingLog from '../components/TrainingLog.vue'
import { useTaskQueueStore } from '@/stores/taskQueue'

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
const showResult = ref(false)
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
    label: '数据投毒分析',
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

const handleAnalysisTypeChange = (value: string) => {
  const attack = analysisOptions.find(option => option.value === value)
  if (attack) {
    selectedAttack.value = attack
    showAttackInfo.value = true
  }
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
    showResult.value = true
    
    // 完成任务
    taskQueue.completeTask(taskId, result, message)
    
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    
    const errorMessage = '请先设置配置信息'
    message.error(`分析失败: ${errorMessage}`)
    
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
      
      <AnalysisResult
      />

      <!-- <SecurityChart
        v-if="showResult && analysisResult"
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
.config-card {
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
</style>
