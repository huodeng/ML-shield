<script setup lang="ts">
import { NCard, NButton, NSpace, NGradientText, NDivider, NStatistic, NIcon, NTimeline, NTimelineItem } from 'naive-ui'
import { useRouter } from 'vue-router'
import { h, ref, onMounted, onBeforeUnmount } from 'vue'
import { ShieldCheckmarkOutline, AnalyticsOutline, LockClosedOutline, FlashOutline, ServerOutline, CodeSlashOutline } from '@vicons/ionicons5'

const router = useRouter()

const navigateToAnalysis = () => {
  router.push('/dashboard')
}

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const features = [
  {
    title: '模型安全评估',
    description: '支持多种攻击模拟，包括对抗攻击、数据投毒等安全风险评估',
    icon: renderIcon(ShieldCheckmarkOutline),
    color: '#007AFF'
  },
  {
    title: '隐私保护分析',
    description: '全面的隐私风险评估，包括模型推断和成员推断分析',
    icon: renderIcon(LockClosedOutline),
    color: '#5856D6'
  },
  {
    title: '安全优化建议',
    description: '提供模型训练优化建议，如对抗训练、差分隐私等防护措施',
    icon: renderIcon(FlashOutline),
    color: '#FF9500'
  },
]

const statistics = [
  {
    value: '99.8%',
    label: '攻击检测率',
    color: '#007AFF'
  },
  {
    value: '1000+',
    label: '模型分析案例',
    color: '#5856D6'
  },
  {
    value: '50+',
    label: '防御策略',
    color: '#FF9500'
  },
]

const securitySteps = [
  {
    title: '上传模型',
    content: '支持多种格式的机器学习模型上传',
    type: 'success'
  },
  {
    title: '安全扫描',
    content: '全面检测模型潜在安全漏洞',
    type: 'info'
  },
  {
    title: '风险评估',
    content: '量化分析模型面临的安全与隐私风险',
    type: 'warning'
  },
  {
    title: '优化建议',
    content: '提供针对性的安全加固方案',
    type: 'success'
  },
]

const activeSection = ref('hero')
const sections = ['hero', 'features', 'statistics', 'workflow']
const sectionTitles = ['概览', '核心功能', '平台数据', '工作流程']

const handleScroll = () => {
  const container = document.querySelector('.home-container')
  if (!container) return

  const scrollTop = container.scrollTop
  const containerHeight = container.clientHeight

  let currentSection = sections[0]
  let minDistance = Infinity

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      const sectionTop = rect.top - container.getBoundingClientRect().top
      const distance = Math.abs(sectionTop - containerHeight * 0.4)
      if (distance < minDistance) {
        minDistance = distance
        currentSection = section
      }
    }
  }

  activeSection.value = currentSection
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  const container = document.querySelector('.home-container')
  if (container) {
    container.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})

onBeforeUnmount(() => {
  const container = document.querySelector('.home-container')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="home-container">
    <!-- 顶部导航指示器 -->
    <div class="nav-indicator">
      <div 
        v-for="(title, index) in sectionTitles" 
        :key="index"
        class="indicator-item"
        :class="{ active: activeSection === sections[index] }"
        @click="scrollToSection(sections[index])"
      >
        {{ title }}
      </div>
    </div>

    <!-- 英雄区域 -->
    <div id="hero" class="hero-section">
      <div class="hero-content">
        <h1 class="title">
          <n-gradient-text :size="48" gradient="linear-gradient(90deg, #007AFF 0%, #5856D6 100%)">
            ML Security Simulator
          </n-gradient-text>
        </h1>
        <p class="subtitle">全面的机器学习模型安全性与隐私风险评估平台</p>
        <p class="description">保护您的AI资产，预防安全漏洞，确保模型部署的安全性与可靠性</p>
        
        <div class="action-section">
          <n-space>
            <n-button type="primary" size="large" @click="navigateToAnalysis" class="start-button">
              <template #icon>
                <n-icon><AnalyticsOutline /></n-icon>
              </template>
              开始分析
            </n-button>
            <n-button size="large" class="learn-button" @click="scrollToSection('features')">
              了解更多
            </n-button>
          </n-space>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="security-visual">
          <div class="security-shield">
            <div class="shield-inner"></div>
            <div class="shield-icon">🔒</div>
          </div>
          <div class="security-particles">
            <div class="particle" v-for="i in 8" :key="i"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特性区域 -->
    <div id="features" class="features-section">
      <h2 class="section-title">核心功能</h2>
      <p class="section-subtitle">全方位保障您的机器学习模型安全</p>
      
      <div class="feature-cards">
        <n-card
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          :segmented="{ content: true }"
          :bordered="false"
        >
          <div class="feature-content">
            <div class="feature-icon" :style="{backgroundColor: feature.color + '15'}">
              <n-icon :color="feature.color" size="30">
                <component :is="feature.icon().type" />
              </n-icon>
            </div>
            <h3 :style="{color: feature.color}">{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </n-card>
      </div>
    </div>

    <!-- 统计数据区域 -->
    <div id="statistics" class="statistics-section">
      <h2 class="section-title">平台数据</h2>
      <p class="section-subtitle">基于大量真实案例的安全分析</p>
      
      <div class="statistics-cards">
        <div v-for="stat in statistics" :key="stat.label" class="statistic-item">
          <n-statistic :value="stat.value" :label="stat.label" :value-style="{color: stat.color, fontSize: '2.5rem', fontWeight: 'bold'}" />
        </div>
      </div>

      <n-divider />
      
      <div class="platform-highlights">
        <div class="highlight-item">
          <n-icon size="36" color="#007AFF">
            <ServerOutline />
          </n-icon>
          <h3>高性能计算</h3>
          <p>利用分布式计算加速模型分析</p>
        </div>
        <div class="highlight-item">
          <n-icon size="36" color="#5856D6">
            <CodeSlashOutline />
          </n-icon>
          <h3>开放API</h3>
          <p>提供完整API接口，支持集成到现有工作流</p>
        </div>
      </div>
    </div>

    <!-- 工作流程区域 -->
    <div id="workflow" class="workflow-section">
      <h2 class="section-title">工作流程</h2>
      <p class="section-subtitle">简单四步，全面保障模型安全</p>
      
      <div class="timeline-container">
        <n-timeline>
          <n-timeline-item 
            v-for="step in securitySteps" 
            :key="step.title" 
            :type="step.type as 'default' | 'success' | 'info' | 'warning' | 'error'" 
            :title="step.title"
          >
            {{ step.content }}
          </n-timeline-item>
        </n-timeline>
      </div>
      
      <div class="cta-section">
        <h3>准备好保护您的AI模型了吗？</h3>
        <n-button type="primary" size="large" @click="navigateToAnalysis" class="cta-button">
          立即开始
        </n-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

.home-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  background: var(--background-light);
  color: var(--text-light);
  transition: all 0.3s ease;
  
  .dark-mode & {
    background: var(--background-dark);
    color: var(--text-dark);
  }
}

.nav-indicator {
  position: fixed;
  top: 80px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
  
  .indicator-item {
    width: 80px;
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &.active {
      background-color: rgba(0, 122, 255, 0.2);
      color: #007AFF;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8%;
  position: relative;
  overflow: hidden;
  
  .hero-content {
    width: 50%;
    z-index: 2;
    
    .title {
      margin-bottom: 20px;
      font-weight: 800;
      line-height: 1.2;
    }
    
    .subtitle {
      font-size: 1.8rem;
      color: var(--text-light);
      margin-bottom: 20px;
      font-weight: 500;
    }
    
    .description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 40px;
      max-width: 600px;
      line-height: 1.6;
    }
  }
  
  .hero-visual {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .security-visual {
      position: relative;
      width: 300px;
      height: 300px;
      
      .security-shield {
        position: absolute;
        width: 200px;
        height: 240px;
        background: linear-gradient(135deg, rgba(0, 122, 255, 0.2), rgba(88, 86, 214, 0.2));
        border-radius: 100px 100px 10px 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(90deg, #007AFF, #5856D6);
          border-radius: 100px 100px 0 0;
        }
        
        .shield-inner {
          width: 180px;
          height: 220px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 90px 90px 8px 8px;
          z-index: 1;
        }
        
        .shield-icon {
          position: absolute;
          font-size: 60px;
          z-index: 2;
        }
      }
      
      .security-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        
        .particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(90deg, #007AFF, #5856D6);
          border-radius: 50%;
          animation: float 3s infinite ease-in-out;
          
          @for $i from 1 through 8 {
            &:nth-child(#{$i}) {
              top: math.random(100) * 1%;
              left: math.random(100) * 1%;
              width: (math.random(10) + 5) * 1px;
              height: (math.random(10) + 5) * 1px;
              animation-delay: math.random(3) * 0.5s;
              animation-duration: (math.random(4) + 2) * 1s;
            }
          }
        }
      }
    }
  }
  
  .action-section {
    margin-top: 40px;
    
    .start-button {
      padding: 0 30px;
      height: 50px;
      font-size: 1.1rem;
      font-weight: 500;
      border-radius: 25px;
      background: linear-gradient(90deg, #007AFF, #5856D6);
      border: none;
      box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
      }
    }
    
    .learn-button {
      padding: 0 30px;
      height: 50px;
      font-size: 1.1rem;
      font-weight: 500;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    }
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  text-align: center;
  background: linear-gradient(90deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 50px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features-section {
  padding: 100px 8%;
  background: linear-gradient(180deg, var(--background-light) 0%, rgba(245, 247, 250, 1) 100%);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 40px auto;
  width: 100%;
  max-width: 1400px;
  justify-content: center;
}

.feature-card {
  min-width: 300px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: var(--card-background-light);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .feature-content {
    text-align: center;
    padding: 30px;
    
    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 25px;
    }
    
    h3 {
      font-size: 1.4rem;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    p {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1.05rem;
    }
  }
}

.statistics-section {
  padding: 100px 8%;
  background: linear-gradient(180deg, rgba(245, 247, 250, 1) 0%, var(--background-light) 100%);
}

.statistics-cards {
  display: flex;
  justify-content: space-around;
  margin: 50px 0;
  flex-wrap: wrap;
  gap: 30px;
}

.statistic-item {
  text-align: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }
}

.platform-highlights {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-top: 50px;
  flex-wrap: wrap;
  
  .highlight-item {
    text-align: center;
    max-width: 250px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    h3 {
      margin: 15px 0 10px;
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    p {
      color: var(--text-secondary);
      line-height: 1.5;
    }
  }
}

.workflow-section {
  padding: 100px 8%;
  background: linear-gradient(180deg, var(--background-light) 0%, rgba(245, 247, 250, 1) 100%);
}

.timeline-container {
  max-width: 700px;
  margin: 0 auto 80px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }
}

.cta-section {
  text-align: center;
  margin-top: 80px;
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 30px;
    font-weight: 600;
    background: linear-gradient(90deg, #007AFF, #5856D6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .cta-button {
    padding: 0 40px;
    height: 56px;
    font-size: 1.2rem;
    font-weight: 500;
    border-radius: 28px;
    background: linear-gradient(90deg, #007AFF, #5856D6);
    border: none;
    box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 1500px) {
  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
    max-width: 900px;
  }
  
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding-top: 80px;
    
    .hero-content {
      width: 100%;
      
      .description {
        margin-left: auto;
        margin-right: auto;
      }
    }
    
    .hero-visual {
      width: 100%;
      margin-top: 60px;
    }
  }
  
  .nav-indicator {
    display: none;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 0;
  }
  
  .hero-section {
    padding: 60px 20px;
    
    .hero-content {
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.4rem;
      }
    }
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  
  .statistics-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .platform-highlights {
    gap: 40px;
  }
  
  .features-section,
  .statistics-section,
  .workflow-section {
    padding: 80px 20px;
  }
}
</style>