<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { NConfigProvider, NMessageProvider, NDialogProvider, darkTheme, lightTheme } from 'naive-ui'
import { useStorage } from '@vueuse/core'

// 主题状态管理
const isDark = useStorage('theme-mode', false)
const route = useRoute()

// 自定义暗色主题
const customDarkTheme = {
  ...darkTheme,
  common: {
    ...darkTheme.common,
    baseColor: '#000000',
    cardColor: '#1a1a1a',
    modalColor: '#1a1a1a',
    popoverColor: '#1a1a1a',
    primaryColor: '#007aff',
    primaryColorHover: '#0066cc',
    primaryColorPressed: '#005299',
    borderRadius: '12px',
  },
}

// 自定义亮色主题
const customLightTheme = {
  ...lightTheme,
  common: {
    ...lightTheme.common,
    primaryColor: '#007aff',
    primaryColorHover: '#0066cc',
    primaryColorPressed: '#005299',
    borderRadius: '12px',
  },
}
</script>

<template>
  <n-config-provider :theme="isDark ? customDarkTheme : customLightTheme">
    <n-message-provider>
      <n-dialog-provider>
        <div class="app-container" :class="{ 'dark-mode': isDark }">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component
                :is="Component"
                :key="route.fullPath"
              />
            </transition>
          </router-view>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
:root {
  // 主色调
  --primary-color: #007aff;
  --secondary-color: #5856d6;
  --success-color: #34c759;
  --warning-color: #ff9500;
  --error-color: #ff3b30;
  
  // 背景色
  --background-light: #ffffff;
  --background-dark: #000000;
  --card-background-light: #ffffff;
  --card-background-dark: #1a1a1a;
  
  // 文本色
  --text-light: #333333;
  --text-dark: #ffffff;
  --text-secondary: #666666;
  --text-secondary-dark: #8e8e93;
  
  // 边框色
  --border-color: rgba(0, 0, 0, 0.08);
  --border-color-dark: rgba(255, 255, 255, 0.12);
  
  // 阴影
  --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-dark: 0 4px 12px rgba(0, 0, 0, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  font-size: 16px;
}

.app-container {
  height: 100vh;
  width: 100vw;
  background-color: var(--background-light);
  color: var(--text-light);
  transition: all 0.3s ease;
  overflow: hidden;

  &.dark-mode {
    background-color: var(--background-dark);
    color: var(--text-dark);
    
    --border-color: var(--border-color-dark);
    --shadow: var(--shadow-dark);
  }
}

// 全局过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  
  .dark-mode & {
    background: rgba(255, 255, 255, 0.2);
  }
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
  
  .dark-mode & {
    background: rgba(255, 255, 255, 0.3);
  }
}

#app {
  max-width: 1280px;
  font-weight: normal;
  margin:0
}

@media (min-width: 1024px) {
  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding:0
  }
}
</style>
