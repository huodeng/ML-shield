import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import lazy from './directives/lazy'

const app = createApp(App)

// 注册全局懒加载指令
app.directive('lazy', lazy)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
