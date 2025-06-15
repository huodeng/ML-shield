<script setup lang="ts">
import { NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem, NIcon, NImage } from 'naive-ui'
import { DocumentTextOutline, ImageOutline, StatsChartOutline } from '@vicons/ionicons5'
import { ref, defineProps, defineExpose } from 'vue'
import { useStorage } from '@vueuse/core'

interface DatasetInfo {
  name: string
  description: string
  samples: string
  format: string
  applications: string
  imageUrl: string
}

const props = defineProps<{
  dataset: DatasetInfo
}>()

const isDark = useStorage('theme-mode', false)
const showDatasetInfo = ref(false)

const open = () => {
  showDatasetInfo.value = true
}

const close = () => {
  showDatasetInfo.value = false
}

defineExpose({
  open,
  close
})
</script>

<template>
  <n-drawer v-model:show="showDatasetInfo" :width="480" placement="right">
    <n-drawer-content :title="dataset.name + ' - 详细信息'" class="dataset-info-drawer" :native-scrollbar="false">
      <n-descriptions label-placement="left" :column="1" class="dataset-descriptions">
        <n-descriptions-item label="数据集描述" :label-style="{ 'font-weight': 'bold', color: isDark ? 'var(--primary-color-dark)' : 'var(--primary-color)' }">
          <div class="description-content">
            <n-icon size="20" class="description-icon">
              <DocumentTextOutline />
            </n-icon>
            {{ dataset.description }}
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="样本数量" :label-style="{ 'font-weight': 'bold', color: isDark ? 'var(--primary-color-dark)' : 'var(--primary-color)' }">
          <div class="description-content">
            <n-icon size="20" class="description-icon">
              <StatsChartOutline />
            </n-icon>
            {{ dataset.samples }}
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="数据格式" :label-style="{ 'font-weight': 'bold', color: isDark ? 'var(--primary-color-dark)' : 'var(--primary-color)' }">
          <div class="description-content">
            <n-icon size="20" class="description-icon">
              <ImageOutline />
            </n-icon>
            {{ dataset.format }}
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="应用场景" :label-style="{ 'font-weight': 'bold', color: isDark ? 'var(--primary-color-dark)' : 'var(--primary-color)' }">
          <div class="description-content">
            <n-icon size="20" class="description-icon">
              <DocumentTextOutline />
            </n-icon>
            {{ dataset.applications }}
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="示例图片">
          <n-image :src="dataset.imageUrl" width="100%" />
        </n-descriptions-item>
      </n-descriptions>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
.dataset-info-drawer {
  .n-descriptions {
    margin-top: 16px;
  }

  .description-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-color);
  }

  :deep(.n-drawer-content) {
    background: var(--card-color);
  }

  :deep(.n-drawer-header__title) {
    color: var(--text-color);
  }

  :deep(.n-descriptions-item-label) {
    color: var(--text-color-secondary);
  }

  :deep(.n-descriptions-item-content) {
    color: var(--text-color);
  }

  .description-icon {
    color: var(--primary-color);
  }
}
</style>