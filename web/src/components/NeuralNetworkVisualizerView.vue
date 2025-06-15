<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NCard, NSpace, NSlider, NSelect, NButton, NSwitch, NTooltip, NIcon, NTabs, NTabPane, NDivider } from 'naive-ui'
import NeuralNetworkVisualizer from './NeuralNetworkVisualizer.vue'
import { useAnalysisStore } from '@/stores/analysis'

const analysisStore = useAnalysisStore()
const activeTab = ref('3d')

interface LayerInfo {
  name: string
  type: string
  shape: number[]
  params?: number
  kernelSize?: number
  stride?: number
  padding?: number
  activation?: string
}
// 可视化配置
const visualizationConfig = ref({
  showFeatureMaps: false,
  showWeights: false,
  showActivations: false,
  animateDataFlow: false,
  colorScheme: 'viridis',
  opacity: 0.8,
  scale: 1.0
})

// 模型信息
const modelInfo = ref({
  name: '卷积神经网络模型',
  totalParams: 1630154,
  accuracy: 0.92,
  inputShape: [32, 32, 3],
  outputShape: [10],
  description: '这是一个用于图像分类的CNN模型，包含2个卷积层、2个池化层和2个全连接层。'
})

// 当前选中的层信息
const selectedLayerInfo = ref<LayerInfo | null>(null)

// 接收从可视化组件传来的选中层信息
const handleLayerSelect = (layer: any) => {
  selectedLayerInfo.value = layer
}

// 在组件挂载时加载模型信息
onMounted(() => {
  // 这里可以从API获取真实的模型信息
  // 例如：analysisStore.getModelInfo()
})
</script>

<template>
  <n-space vertical size="large">
    <n-card title="神经网络可视化" class="visualizer-card">
      <n-tabs v-model:value="activeTab" type="segment" animated>
        <n-tab-pane name="3d" tab="3D视图">
          <div class="visualizer-container">
            <NeuralNetworkVisualizer 
              @layer-select="handleLayerSelect"
              :visualization-config="visualizationConfig"
            />
          </div>
        </n-tab-pane>
        <n-tab-pane name="info" tab="模型信息">
          <n-space vertical>
            <n-card title="模型概览" size="small">
              <n-space vertical>
                <div class="info-item">
                  <span class="label">模型名称:</span>
                  <span class="value">{{ modelInfo.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">总参数量:</span>
                  <span class="value">{{ modelInfo.totalParams.toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <span class="label">准确率:</span>
                  <span class="value">{{ (modelInfo.accuracy * 100).toFixed(2) }}%</span>
                </div>
                <div class="info-item">
                  <span class="label">输入形状:</span>
                  <span class="value">{{ modelInfo.inputShape.join(' × ') }}</span>
                </div>
                <div class="info-item">
                  <span class="label">输出形状:</span>
                  <span class="value">{{ modelInfo.outputShape.join(' × ') }}</span>
                </div>
              </n-space>
            </n-card>
            
            <n-card title="模型描述" size="small">
              <p>{{ modelInfo.description }}</p>
            </n-card>
            
            <n-card v-if="selectedLayerInfo" title="选中层信息" size="small">
              <n-space vertical>
                <div class="info-item">
                  <span class="label">层名称:</span>
                  <span class="value">{{ selectedLayerInfo?.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">层类型:</span>
                  <span class="value">{{ selectedLayerInfo.type }}</span>
                </div>
                <div class="info-item">
                  <span class="label">形状:</span>
                  <span class="value">{{ selectedLayerInfo.shape.join(' × ') }}</span>
                </div>
                <div class="info-item" v-if="selectedLayerInfo.params !== undefined">
                  <span class="label">参数量:</span>
                  <span class="value">{{ selectedLayerInfo.params.toLocaleString() }}</span>
                </div>
                <div class="info-item" v-if="selectedLayerInfo.activation">
                  <span class="label">激活函数:</span>
                  <span class="value">{{ selectedLayerInfo.activation }}</span>
                </div>
                <div class="info-item" v-if="selectedLayerInfo.kernelSize">
                  <span class="label">卷积核大小:</span>
                  <span class="value">{{ selectedLayerInfo.kernelSize }}×{{ selectedLayerInfo.kernelSize }}</span>
                </div>
                <div class="info-item" v-if="selectedLayerInfo.stride">
                  <span class="label">步长:</span>
                  <span class="value">{{ selectedLayerInfo.stride }}</span>
                </div>
                <div class="info-item" v-if="selectedLayerInfo.padding !== undefined">
                  <span class="label">填充:</span>
                  <span class="value">{{ selectedLayerInfo.padding }}</span>
                </div>
              </n-space>
            </n-card>
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="settings" tab="可视化设置">
          <n-space vertical>
            <n-card title="显示设置" size="small">
              <n-space vertical>
                <div class="setting-item">
                  <span class="setting-label">显示特征图</span>
                  <n-switch v-model:value="visualizationConfig.showFeatureMaps" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">显示权重</span>
                  <n-switch v-model:value="visualizationConfig.showWeights" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">显示激活</span>
                  <n-switch v-model:value="visualizationConfig.showActivations" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">数据流动画</span>
                  <n-switch v-model:value="visualizationConfig.animateDataFlow" />
                </div>
              </n-space>
            </n-card>
            
            <n-card title="外观设置" size="small">
              <n-space vertical>
                <div class="setting-item">
                  <span class="setting-label">颜色方案</span>
                  <n-select v-model:value="visualizationConfig.colorScheme" :options="[
                    { label: 'Viridis', value: 'viridis' },
                    { label: 'Plasma', value: 'plasma' },
                    { label: 'Inferno', value: 'inferno' },
                    { label: 'Magma', value: 'magma' }
                  ]" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">不透明度</span>
                  <n-slider v-model:value="visualizationConfig.opacity" :min="0.1" :max="1" :step="0.1" />
                </div>
                <div class="setting-item">
                  <span class="setting-label">缩放比例</span>
                  <n-slider v-model:value="visualizationConfig.scale" :min="0.5" :max="2" :step="0.1" />
                </div>
              </n-space>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<style scoped>
.visualizer-card {
  margin-bottom: 20px;
}

.visualizer-container {
  height: 600px;
  width: 100%;
  position: relative;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  width: 100px;
}

.value {
  flex: 1;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.setting-label {
  font-weight: bold;
}
</style>
