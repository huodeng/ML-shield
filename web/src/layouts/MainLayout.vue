<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NButton, NIcon, NMenu, NGradientText } from 'naive-ui'
import { Sunny as Sun, Moon, HomeOutline, AnalyticsOutline, MenuOutline, CloudUploadOutline, BookOutline } from '@vicons/ionicons5'
import { useStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { ref, h, computed } from 'vue'
import type { Component } from 'vue'
import TaskQueue from '@/components/TaskQueue.vue'

const router = useRouter()
const route = useRoute()
const isDark = useStorage('theme-mode', false)
const collapsed = useStorage('sidebar-collapsed', false)
const showLogo = computed(() => !collapsed.value)

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const navigateHome = () => {
  router.push('/')
}

const menuOptions = [
  {
    label: '数据集上传',
    key: 'dataset-upload',
    icon: renderIcon(CloudUploadOutline),
    path: '/dashboard/dataset-upload',
  },
  {
    label: '模型分析',
    key: 'model-analysis',
    icon: renderIcon(AnalyticsOutline),
    path: '/dashboard/model-analysis',
  },
  {
    label: '神经网络可视化',
    key: 'neural-network',
    icon: renderIcon(AnalyticsOutline),
    path: '/dashboard/neural-network',
  },
]

const currentMenuKey = computed(() => {
  return route.name?.toString() || null
})

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>

<template>
  <n-layout class="main-layout" has-sider position="absolute">
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      :inverted="isDark"
      class="sider"
      :class="{ 'dark': isDark }"
      v-model:collapsed="collapsed"
    >
      <!-- Logo区域 -->
      <div class="logo" :class="{ 'dark': isDark }">
        <div class="logo-content" @click="navigateHome" :class="{ 'hidden': collapsed }">
          <n-gradient-text
            v-if="showLogo"
            :size="20"
            gradient="linear-gradient(90deg, #007AFF 0%, #5856D6 100%)"
          >
            ML Security
          </n-gradient-text>
          <n-gradient-text
            v-else
            :size="20"
            gradient="linear-gradient(90deg, #007AFF 0%, #5856D6 100%)"
          >
            ML
          </n-gradient-text>
        </div>
        <n-button quaternary circle class="collapse-button" @click="toggleCollapsed" :class="{ 'centered': collapsed }">
          <n-icon size="18">
            <MenuOutline />
          </n-icon>
        </n-button>
      </div>

      <!-- 导航菜单 -->
      <n-menu
        :value="currentMenuKey"
        :options="menuOptions"
        :collapsed="collapsed"
        :inverted="isDark"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :indent="18"
        @update:value="
          (key) => router.push(menuOptions.find((item) => item.key === key)?.path || '/')
        "
      />
    </n-layout-sider>

    <!-- 内容区域 -->
    <n-layout class="content-layout" :class="{ 'collapsed': collapsed }">
      <!-- 顶部导航 -->
      <n-layout-header class="header" :class="{ 'dark': isDark }" bordered>
        <div class="header-content">
          <div class="header-left">

          </div>

          <div class="header-right">
            <TaskQueue />
            <n-button quaternary circle @click="toggleTheme" class="theme-button">
              <n-icon size="18">
                <Sun v-if="isDark" />
                <Moon v-else />
              </n-icon>
            </n-button>
          </div>
        </div>
      </n-layout-header>

      <!-- 主内容区 -->
      <n-layout-content
        class="content"
        :class="{ 'dark': isDark }"
        :native-scrollbar="false"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.sider {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  border-right: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--background-light);

  &.dark {
    background: var(--card-background-dark);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-right-color: var(--border-color-dark);
  }
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  position: relative;

  &.dark {
    border-bottom-color: var(--border-color-dark);
  }

  .logo-content {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;

    &.hidden {
      opacity: 0;
      width: 0;
    }
  }

  .collapse-button {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: absolute;
    right: 16px;

    &.centered {
      right: 50%;
      transform: translateX(50%);
    }
  }
}

.content-layout {
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  height: 100vh;
  overflow: hidden;

  &.collapsed {
    margin-left: 64px;
  }
}

.header {
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 90;
  background: var(--background-light);
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &.dark {
    background: rgba(31, 31, 35, 0.8);
    border-bottom-color: var(--border-color-dark);
  }
}

.header-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .dark & {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.theme-button {
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(30deg);
  }
}

.content {
  padding: 24px;
  background: var(--background-light);
  height: calc(100vh - 64px);
  transition: all 0.3s ease;
  overflow-y: auto;

  &.dark {
    background: var(--background-dark);
  }
}

@media (max-width: 768px) {
  .sider {
    transform: translateX(-100%);
    z-index: 1000;

    &:not(.n-layout-sider--collapsed) {
      transform: translateX(0);
    }
  }

  .content-layout {
    margin-left: 0 !important;

    &.collapsed {
      margin-left: 0 !important;
    }
  }

  .header-content {
    padding: 0 16px;
  }

  .content {
    padding: 16px;
  }
}
</style>
