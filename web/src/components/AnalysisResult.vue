<script setup lang="ts">
import { NCard, NSpace, NProgress, NTag, NList, NListItem, NButton, NIcon, NCollapse, NCollapseItem, NDescriptions, NDescriptionsItem, NDivider, NImage } from 'naive-ui'
import { h, ref,inject } from 'vue'
import { useStorage } from '@vueuse/core'

const isDark = useStorage('theme-mode', false)
const activeNames = ref(['realResult'])

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
  message: {
    acc?: string
    images?: string[]
    mse_values?: number[]
    ssim_values?: number[]
    clf1?:number
    clf2?:number
    epsilon?:number
    clean_acc?: number
    asr?: number
  }
  attack_type?: string
  use_privacy?: boolean
}
const analysisResult = inject<AnalysisResultType | null>('analysisResult', null)
const realResult = inject<realResultType | null>('realResult', null)
</script>

<template>
 <div class="result-container" v-if="analysisResult || realResult" :class="{ 'dark': isDark }">
    <n-space vertical size="large">
      <n-card title="分析结果详情" class="details-card">
        <n-collapse v-model:expanded-names="activeNames">
          <n-collapse-item title="详细结果" name="realResult" v-if="realResult?.message">
            <n-descriptions bordered :column="1">
              <n-descriptions-item label="消息" class="message-item" v-if="realResult.status">
                <div class="message-box">
                  <div class="message-header">
                    <n-tag :type="realResult?.status === 'success' ? 'success' : 'error'" size="small">
                      {{ realResult?.status === 'success' ? '成功' : '失败' }}
                    </n-tag>
                    <span class="timestamp">{{ new Date().toLocaleString() }}</span>
                  </div>
                  <div class="message-content" :class="realResult?.status">
                    <!-- DLG 攻击结果 -->
                    <template v-if="realResult?.attack_type === 'dlg'">
                      <div v-if="realResult.message.images" class="attack-result">
                        <div class="image-box">
                          <div class="image-wrapper" v-for="(image, index) in realResult.message.images" :key="index">
                            <n-card size="small" class="image-card">
                              <n-image
                                :src="`data:image/png;base64,${image}`"
                                object-fit="contain"
                                class="result-image"
                                width="100px"
                              />
                              <div class="metrics" v-if="realResult.message.mse_values && realResult.message.ssim_values">
                                <div class="metric-item">
                                  <span class="metric-label">MSE:</span>
                                  <span class="metric-value">{{ realResult.message.mse_values[index].toFixed(4) }}</span>
                                </div>
                                <div class="metric-item">
                                  <span class="metric-label">SSIM:</span>
                                  <span class="metric-value">{{ realResult.message.ssim_values[index].toFixed(4) }}</span>
                                </div>
                              </div>
                            </n-card>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Backdoor 攻击结果 -->
                    <template v-else-if="realResult?.attack_type === 'backdoor'">
                      <div class="attack-result">
                        <div class="metric-item">
                          <span class="metric-label">Clean Accuracy:</span>
                          <span class="metric-value">{{ (realResult?.message?.clean_acc * 100)?.toFixed(2) }}%</span>
                        </div>
                        <div class="metric-item">
                          <span class="metric-label">Attack Success Rate:</span>
                          <span class="metric-value">{{ (realResult?.message?.asr * 100)?.toFixed(2) }}%</span>
                        </div>
                      </div>
                    </template>

                    <!-- MIA 攻击结果 -->
                    <template v-else-if="realResult?.attack_type === 'mia'">
                      <div class="attack-result">
                        <div class="metric-item">
                          <span class="metric-label">训练集准确率:</span>
                          <span class="metric-value">{{ (realResult.message?.clf1 * 100).toFixed(2) }}%</span>
                        </div>
                        <div class="metric-item">
                          <span class="metric-label">测试集准确率:</span>
                          <span class="metric-value">{{ (realResult.message?.clf2 * 100).toFixed(2) }}%</span>
                        </div>
                        <div class="metric-item">
                          <span class="metric-label">Epsilon:</span>
                          <span class="metric-value">{{ realResult.message.epsilon === 1e308 ? '∞' : realResult.message.epsilon }}</span>
                        </div>
                        <div class="metric-item">
                          <span class="metric-label">准确率:</span>
                          <span class="metric-value">{{ (Number(realResult.message.acc) * 100).toFixed(2) }}%</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </n-descriptions-item>

              <n-descriptions-item label="分析图像" class="image-item" v-if="realResult.message.images">
                  <div class="image-box">
                    <div class="image-wrapper" v-for="(image, index) in realResult.message.images" :key="index">
                      <n-card size="small" class="image-card">
                        <n-image
                          :src="`data:image/png;base64,${image}`"
                          object-fit="contain"
                          class="result-image"
                          width="100px"
                        />
                        <div class="metrics" v-if="realResult.message.mse_values && realResult.message.ssim_values">
                          <div class="metric-item">
                            <span class="metric-label">MSE:</span>
                            <span class="metric-value">{{ realResult.message.mse_values[index].toFixed(4) }}</span>
                          </div>
                          <div class="metric-item">
                            <span class="metric-label">SSIM:</span>
                            <span class="metric-value">{{ realResult.message.ssim_values[index].toFixed(4) }}</span>
                          </div>
                        </div>
                      </n-card>
                    </div>
                  </div>
                </n-descriptions-item>
            </n-descriptions>
          </n-collapse-item>

          <n-collapse-item title="安全评分" name="analysisResult" v-if="realResult?.message ">
              <div class="score-content">
                <n-progress
                  type="circle"
                  :percentage="0.88 * 100"
                  :color="0.88 * 100 > 70 ? '#34C759' : 0.88*100 > 40 ? '#FF9500' : '#FF3B30'"
                  :rail-color="isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'"
                />
              </div>
            </n-collapse-item>
        </n-collapse>
      </n-card>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.no-image {
  text-align: center;
  color: var(--text-color-secondary);
  padding: 16px;
}
.result-container {
  width: 100%;

  .score-content {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .message-item {
    :deep(.n-descriptions-item-content) {
      padding: 0;
    }
  }

  .message-box {
    background: var(--card-color);
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  
    .message-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .message-content {
      padding: 16px;
      white-space: pre-wrap;

      &.success {
        color: var(--success-color);
      }

      &.error {
        color: var(--error-color);
      }
    }
  }

  .image-box {
    display: flex; // 使用 Flexbox 布局
    justify-content: flex-start; // 水平排列
    flex-wrap: wrap; // 如果图片过多，可以换行
    gap: 10px; // 图片之间的间距
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
        }
      }
    }
  }
}
 .attack-result {
    .metric-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .metric-label {
        color: var(--text-color-secondary);
        margin-right: 16px;
      }
      
      .metric-value {
        font-family: monospace;
        font-weight: 500;
      }
    }
  }
}
</style>
