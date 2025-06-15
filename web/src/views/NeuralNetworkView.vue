<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NButton, NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui'
import { ArrowBackOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import NeuralNetworkVisualizerView from '@/components/NeuralNetworkVisualizerView.vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <n-space vertical size="large">
    <n-breadcrumb>
      <n-breadcrumb-item @click="goBack" style="cursor: pointer">
        <n-icon>
          <arrow-back-outline />
        </n-icon>
        返回
      </n-breadcrumb-item>
      <n-breadcrumb-item>神经网络可视化</n-breadcrumb-item>
    </n-breadcrumb>
    
    <n-card title="神经网络结构可视化" class="main-card">
      <n-space vertical size="large">
        <p class="description">
          此页面展示了卷积神经网络(CNN)模型的3D可视化效果，您可以通过交互查看模型的各层结构、参数和数据流动。
          点击任意层可查看该层的详细信息，包括形状、参数量、激活函数等。
        </p>
        
        <NeuralNetworkVisualizerView />
      </n-space>
    </n-card>
  </n-space>
</template>

<style scoped>
.main-card {
  margin-bottom: 20px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}
</style>