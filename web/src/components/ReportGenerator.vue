<script setup lang="ts">
import { NModal, NCard, NSpace, NButton, NIcon } from 'naive-ui'
import { DocumentTextOutline } from '@vicons/ionicons5'
import html2pdf from 'html2pdf.js'
import { ref } from 'vue'

interface ReportData {
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

const props = defineProps<{
  show: boolean
  data: ReportData
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const reportRef = ref<HTMLElement>()

const handleClose = () => {
  emit('update:show', false)
}

const generatePDF = async () => {
  if (!reportRef.value) return

  const opt = {
    margin: 1,
    filename: '安全分析报告.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }

  try {
    await html2pdf().set(opt).from(reportRef.value).save()
    emit('update:show', false)
  } catch (error) {
    console.error('PDF生成失败:', error)
  }
}

const getScoreColor = (score: number) => {
  if (score > 70) return '#34C759'
  if (score > 40) return '#FF9500'
  return '#FF3B30'
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    style="width: 800px"
    title="安全分析报告"
    :mask-closable="false"
    @update:show="handleClose"
  >
    <div ref="reportRef" class="report-content">
      <div class="report-header">
        <h1>机器学习模型安全分析报告</h1>
        <p class="report-date">生成日期: {{ new Date().toLocaleDateString() }}</p>
      </div>

      <!-- 报告内容 -->
      <div class="report-body">
        <section class="report-section">
          <h2>总体评分</h2>
          <div class="score-section">
            <div class="score-value">{{ data.score }}</div>
            <div class="score-label">
              {{ data.score > 70 ? '安全性良好' : data.score > 40 ? '需要改进' : '高危风险' }}
            </div>
          </div>
        </section>

        <section class="report-section">
          <h2>安全评估详情</h2>
          <div class="categories-list">
            <div v-for="cat in data.categories" :key="cat.name" class="category-item">
              <span class="category-name">{{ cat.name }}</span>
              <div class="category-score">
                <div
                  class="score-bar"
                  :style="{ width: `${cat.score}%`, backgroundColor: getScoreColor(cat.score) }"
                ></div>
                <span class="score-value">{{ cat.score }}%</span>
              </div>
            </div>
          </div>
        </section>

        <section class="report-section">
          <h2>漏洞分析</h2>
          <div class="vulnerabilities-list">
            <div
              v-for="(vuln, index) in data.vulnerabilities"
              :key="index"
              class="vulnerability-item"
            >
              <div class="vuln-header">
                <span class="vuln-type">{{ vuln.type }}</span>
                <span :class="['vuln-severity', vuln.severity]">{{ vuln.severity }}</span>
              </div>
              <p class="vuln-description">{{ vuln.description }}</p>
            </div>
          </div>
        </section>

        <section class="report-section">
          <h2>优化建议</h2>
          <ul class="recommendations-list">
            <li v-for="(rec, index) in data.recommendations" :key="index">{{ rec }}</li>
          </ul>
        </section>
      </div>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleClose">关闭</n-button>
        <n-button type="primary" @click="generatePDF">
          <template #icon>
            <n-icon><DocumentTextOutline /></n-icon>
          </template>
          导出PDF
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
.report-content {
  padding: 20px;
  background: var(--background-light);
  color: var(--text-light);
  transition: all 0.3s ease;

  .dark & {
    background: var(--background-dark);
    color: var(--text-dark);
  }
}

.report-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: var(--text-light);

    .dark & {
      color: var(--text-dark);
    }
  }

  .report-date {
    color: var(--text-light);
    opacity: 0.7;

    .dark & {
      color: var(--text-dark);
    }
  }
}

.report-section {
  margin-bottom: 30px;

  h2 {
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color-light);
    color: var(--text-light);

    .dark & {
      color: var(--text-dark);
      border-bottom-color: var(--border-color-dark);
    }
  }
}

.score-section {
  text-align: center;

  .score-value {
    font-size: 48px;
    font-weight: bold;
    color: var(--primary-color);
  }

  .score-label {
    margin-top: 10px;
    font-size: 16px;
    color: var(--text-light);

    .dark & {
      color: var(--text-dark);
    }
  }
}

.category-item {
  margin-bottom: 15px;

  .category-name {
    display: block;
    margin-bottom: 5px;
    color: var(--text-light);

    .dark & {
      color: var(--text-dark);
    }
  }

  .category-score {
    display: flex;
    align-items: center;
    background: var(--background-light);
    border-radius: 4px;
    overflow: hidden;

    .dark & {
      background: var(--background-dark);
    }

    .score-bar {
      height: 20px;
      transition: width 0.3s ease;
    }

    .score-value {
      margin-left: 10px;
      color: var(--text-light);

      .dark & {
        color: var(--text-dark);
      }
    }
  }
}

.vulnerability-item {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background: var(--card-background-light);
  transition: all 0.3s ease;

  .dark & {
    background: var(--card-background-dark);
  }

  .vuln-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .vuln-type {
      font-weight: 500;
      color: var(--text-light);

      .dark & {
        color: var(--text-dark);
      }
    }

    .vuln-severity {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-transform: uppercase;

      &.high {
        background-color: var(--error-color);
        color: white;
      }

      &.medium {
        background-color: var(--warning-color);
        color: white;
      }

      &.low {
        background-color: var(--info-color);
        color: white;
      }
    }
  }

  .vuln-description {
    color: var(--text-light);
    font-size: 14px;
    line-height: 1.5;

    .dark & {
      color: var(--text-dark);
    }
  }
}

.recommendations-list {
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    background: var(--card-background-light);
    color: var(--text-light);
    transition: all 0.3s ease;

    .dark & {
      background: var(--card-background-dark);
      color: var(--text-dark);
    }
  }
}
</style>
