<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { NCard } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import * as echarts from 'echarts'
import { useAnalysisStore } from '@/stores/analysis'
import type { AnalysisRecord } from '@/stores/analysis'

const isDark = useStorage('theme-mode', false)
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const analysisStore = useAnalysisStore()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const chartData = computed(() => {
  const history = analysisStore.analysisHistory
  return {
    dates: history.map((record) => formatDate(record.date)).reverse(),
    scores: history.map((record) => record.result.score).reverse(),
    categories: history[0]?.result.categories.map((cat) => cat.name) || [],
    categoryTrends:
      history[0]?.result.categories.map((cat) => ({
        name: cat.name,
        data: history
          .map((record) => record.result.categories.find((c) => c.name === cat.name)?.score || 0)
          .reverse(),
      })) || [],
  }
})

const chartOptions = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['总体评分', ...chartData.value.categories],
    textStyle: {
      color: isDark.value ? '#ffffff' : '#333333',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: chartData.value.dates,
    axisLine: {
      lineStyle: {
        color: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      },
    },
    axisLabel: {
      color: isDark.value ? '#ffffff' : '#333333',
    },
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: {
      lineStyle: {
        color: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      },
    },
    axisLabel: {
      color: isDark.value ? '#ffffff' : '#333333',
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      },
    },
  },
  series: [
    {
      name: '总体评分',
      type: 'line',
      data: chartData.value.scores,
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: '#007AFF',
      },
      itemStyle: {
        color: '#007AFF',
      },
    },
    ...chartData.value.categoryTrends.map((cat) => ({
      name: cat.name,
      type: 'line',
      data: cat.data,
      symbolSize: 6,
      lineStyle: {
        width: 2,
      },
    })),
  ],
}))

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption(chartOptions.value)
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

// 监听数据和主题变化
watch([chartData, isDark], () => {
  chart?.setOption(chartOptions.value)
})
</script>

<template>
  <n-card title="分析趋势" class="trend-card" :class="{ 'dark': isDark }">
    <div class="chart-header">
      <p class="description">历史分析结果趋势（最近20次）</p>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </n-card>
</template>

<style lang="scss" scoped>
.trend-card {
  margin-bottom: 20px;
  background: var(--card-background-light);
  transition: all 0.3s ease;

  &.dark {
    background: var(--card-background-dark);
    color: var(--text-dark);
  }

  :deep(.n-card-header) {
    font-weight: 500;
  }
}

.chart-header {
  margin-bottom: 20px;

  .description {
    color: var(--text-light);
    font-size: 0.9rem;
    transition: color 0.3s ease;

    .dark & {
      color: var(--text-dark);
    }
  }
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>
