import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),// 路由模式
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '首页',
      },
    },
    {
      path: '/dashboard',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('@/views/DashboardHome.vue'),
          meta: {
            title: 'Dashboard',
            keepAlive: true
          },
        },
        {
          path: 'model-analysis',
          name: 'model-analysis',
          component: () => import('@/views/ModelAnalysis.vue'),
          meta: {
            title: '模型分析',
            keepAlive: true
          },
        },
        {
          path:'dataset-upload',
          name:'dataset-upload',
          component: () => import('@/views/DatasetUpload.vue'),
          meta: {
            title: '数据集上传',
            keepAlive: true
          }
        },
        {
          path: 'neural-network',
          name: 'neural-network',
          component: () => import('../views/NeuralNetworkView.vue'),
          meta: {
            title: '神经网络可视化',
            keepAlive: true
          }
        },

      ],
    },
  ],
})

export default router
