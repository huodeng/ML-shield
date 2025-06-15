<script setup lang="ts">
import { ref, onMounted, watch, computed, defineEmits } from 'vue'
import { NCard, NSpace, NSlider, NSelect, NButton, NSwitch, NTooltip, NIcon, NTabs, NTabPane } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useAnalysisStore } from '@/stores/analysis'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['layer-select'])

// 定义神经网络层的类型
interface LayerConfig {
  type: 'input' | 'conv' | 'pool' | 'fc' | 'output'
  name: string
  shape: number[]
  params?: number
  kernelSize?: number
  stride?: number
  padding?: number
  activation?: string
}

// CNN模型配置
const cnnLayers = ref<LayerConfig[]>([
  { type: 'input', name: '输入层', shape: [32, 32, 3], params: 0 },
  { 
    type: 'conv', 
    name: '卷积层1', 
    shape: [32, 32, 32], 
    params: 896, 
    kernelSize: 3, 
    stride: 1, 
    padding: 1, 
    activation: 'ReLU' 
  },
  { 
    type: 'pool', 
    name: '池化层1', 
    shape: [16, 16, 32], 
    params: 0, 
    kernelSize: 2, 
    stride: 2 
  },
  { 
    type: 'conv', 
    name: '卷积层2', 
    shape: [14, 14, 64], 
    params: 18496, 
    kernelSize: 3, 
    stride: 1, 
    padding: 0, 
    activation: 'ReLU' 
  },
  { 
    type: 'pool', 
    name: '池化层2', 
    shape: [7, 7, 64], 
    params: 0, 
    kernelSize: 2, 
    stride: 2 
  },
  { 
    type: 'fc', 
    name: '全连接层1', 
    shape: [512], 
    params: 1605632, 
    activation: 'ReLU' 
  },
  { 
    type: 'fc', 
    name: '全连接层2', 
    shape: [10], 
    params: 5130 
  }
])

// 可视化配置
const visualizationConfig = useStorage('nn-visualization-config', {
  showFeatureMaps: true,
  showWeights: false,
  showActivations: true,
  animateDataFlow: true,
  viewMode: '3d',
  highlightLayer: null,
  colorScheme: 'viridis',
  opacity: 0.8,
  scale: 1.0
})

// 当前选中的层
const selectedLayer = ref<LayerConfig | null>(null)

// 特征图数据（模拟）
const featureMaps = ref<Map<string, Float32Array>>(new Map())

// Three.js 相关变量
const container = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let layerMeshes: THREE.Group[] = []
let connectionLines: THREE.Line[] = []
let animationFrameId: number

// 颜色方案
const colorSchemes = {
  viridis: ['#440154', '#433982', '#30678D', '#218F8B', '#36B677', '#8ED542', '#FDE725'],
  plasma: ['#0D0887', '#5B02A3', '#9A179B', '#CB4678', '#EB7852', '#FBB32F', '#F0F921'],
  inferno: ['#000004', '#320A5A', '#781C6D', '#BB3654', '#EC6824', '#FBB41A', '#FCFFA4'],
  magma: ['#000004', '#2C115F', '#721F81', '#B63679', '#F1605D', '#FEAF77', '#FCFDBF']
}

// 初始化Three.js场景
const initThreeJs = () => {
  if (!container.value) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(visualizationConfig.value.viewMode === '3d' ? 0x111111 : 0xffffff)
  
  // 创建相机
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 15
  camera.position.y = 5
  camera.position.x = 5
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 15)
  scene.add(directionalLight)
  
  // 创建神经网络可视化
  createNetworkVisualization()
  
  // 开始动画循环
  animate()
  
  // 窗口大小调整处理
  window.addEventListener('resize', onWindowResize)
}

// 窗口大小调整处理函数
const onWindowResize = () => {
  if (!container.value) return
  
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

// 创建神经网络可视化
const createNetworkVisualization = () => {
  // 清除现有的可视化
  layerMeshes.forEach(mesh => scene.remove(mesh))
  connectionLines.forEach(line => scene.remove(line))
  layerMeshes = []
  connectionLines = []
  
  // 计算总宽度以便居中
  const totalWidth = cnnLayers.value.length * 4
  const startX = -totalWidth / 2 + 2
  
  // 创建每一层的可视化
  cnnLayers.value.forEach((layer, index) => {
    const layerGroup = new THREE.Group()
    layerGroup.userData = { layerIndex: index, layerConfig: layer }
    
    // 根据层类型创建不同的可视化
    switch (layer.type) {
      case 'input':
        createInputLayer(layerGroup, layer)
        break
      case 'conv':
        createConvLayer(layerGroup, layer)
        break
      case 'pool':
        createPoolLayer(layerGroup, layer)
        break
      case 'fc':
        createFcLayer(layerGroup, layer)
        break
      case 'output':
        createOutputLayer(layerGroup, layer)
        break
    }
    
    // 设置层的位置
    layerGroup.position.x = startX + index * 4
    
    // 添加到场景
    scene.add(layerGroup)
    layerMeshes.push(layerGroup)
    
    // 如果不是第一层，创建与前一层的连接
    if (index > 0) {
      createLayerConnection(layerMeshes[index - 1], layerGroup)
    }
  })
  
  // 生成模拟的特征图数据
  generateMockFeatureMaps()
}

// 创建输入层可视化
const createInputLayer = (group: THREE.Group, layer: LayerConfig) => {
  const [height, width, channels] = layer.shape
  const scale = visualizationConfig.value.scale
  
  // 创建一个表示输入图像的立方体
  const geometry = new THREE.BoxGeometry(width * 0.03 * scale, height * 0.03 * scale, channels * 0.1 * scale)
  const material = new THREE.MeshPhongMaterial({
    color: getLayerColor(0),
    transparent: true,
    opacity: visualizationConfig.value.opacity,
    side: THREE.DoubleSide
  })
  
  const cube = new THREE.Mesh(geometry, material)
  group.add(cube)
  
  // 添加层名称标签
  addLayerLabel(group, layer.name, 0, -2)
}

// 创建卷积层可视化
const createConvLayer = (group: THREE.Group, layer: LayerConfig) => {
  const [height, width, filters] = layer.shape
  const scale = visualizationConfig.value.scale
  
  // 创建多个小立方体表示卷积核
  const kernelSize = layer.kernelSize || 3
  const kernelGeometry = new THREE.BoxGeometry(
    kernelSize * 0.1 * scale,
    kernelSize * 0.1 * scale,
    kernelSize * 0.1 * scale
  )
  
  // 创建表示特征图的平面
  const featureMapGeometry = new THREE.PlaneGeometry(width * 0.03 * scale, height * 0.03 * scale)
  
  // 为每个过滤器创建一个特征图平面
  for (let i = 0; i < Math.min(filters, 8); i++) {
    const material = new THREE.MeshPhongMaterial({
      color: getLayerColor(1),
      transparent: true,
      opacity: visualizationConfig.value.opacity,
      side: THREE.DoubleSide
    })
    
    const plane = new THREE.Mesh(featureMapGeometry, material)
    plane.position.z = i * 0.2 - (Math.min(filters, 8) * 0.2) / 2
    group.add(plane)
  }
  
  // 添加卷积核可视化
  if (visualizationConfig.value.showWeights) {
    const kernelMaterial = new THREE.MeshPhongMaterial({
      color: 0xff5733,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    })
    
    const kernel = new THREE.Mesh(kernelGeometry, kernelMaterial)
    kernel.position.x = -1
    kernel.position.y = 1
    group.add(kernel)
  }
  
  // 添加层名称和参数信息
  addLayerLabel(group, layer.name, 0, -2)
  addLayerLabel(group, `参数: ${layer.params?.toLocaleString()}`, 0, -2.5, 0.6)
  if (layer.activation) {
    addLayerLabel(group, `激活: ${layer.activation}`, 0, -3, 0.6)
  }
}

// 创建池化层可视化
const createPoolLayer = (group: THREE.Group, layer: LayerConfig) => {
  const [height, width, channels] = layer.shape
  const scale = visualizationConfig.value.scale
  
  // 创建表示池化后特征图的平面
  const geometry = new THREE.PlaneGeometry(width * 0.03 * scale, height * 0.03 * scale)
  
  // 为每个通道创建一个特征图平面
  for (let i = 0; i < Math.min(channels, 8); i++) {
    const material = new THREE.MeshPhongMaterial({
      color: getLayerColor(2),
      transparent: true,
      opacity: visualizationConfig.value.opacity,
      side: THREE.DoubleSide
    })
    
    const plane = new THREE.Mesh(geometry, material)
    plane.position.z = i * 0.2 - (Math.min(channels, 8) * 0.2) / 2
    group.add(plane)
  }
  
  // 添加池化窗口可视化
  if (visualizationConfig.value.showWeights) {
    const poolWindowGeometry = new THREE.PlaneGeometry(
      (layer.kernelSize || 2) * 0.1 * scale,
      (layer.kernelSize || 2) * 0.1 * scale
    )
    const poolWindowMaterial = new THREE.MeshBasicMaterial({
      color: 0x33ff57,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
      side: THREE.DoubleSide
    })
    
    const poolWindow = new THREE.Mesh(poolWindowGeometry, poolWindowMaterial)
    poolWindow.position.x = -1
    poolWindow.position.y = 1
    group.add(poolWindow)
  }
  
  // 添加层名称和信息
  addLayerLabel(group, layer.name, 0, -2)
  addLayerLabel(group, `窗口: ${layer.kernelSize}x${layer.kernelSize}`, 0, -2.5, 0.6)
}

// 创建全连接层可视化
const createFcLayer = (group: THREE.Group, layer: LayerConfig) => {
  const [neurons] = layer.shape
  const scale = visualizationConfig.value.scale
  
  // 计算要显示的神经元数量（最多显示一定数量）
  const visibleNeurons = Math.min(neurons, 20)
  const neuronRadius = 0.15 * scale
  
  // 创建神经元球体
  const geometry = new THREE.SphereGeometry(neuronRadius, 16, 16)
  
  // 计算神经元排列的高度
  const totalHeight = visibleNeurons * neuronRadius * 2.5
  const startY = totalHeight / 2 - neuronRadius
  
  // 创建神经元
  for (let i = 0; i < visibleNeurons; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: getLayerColor(3),
      transparent: true,
      opacity: visualizationConfig.value.opacity
    })
    
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.y = startY - i * neuronRadius * 2.5
    group.add(sphere)
  }
  
  // 如果神经元太多，添加省略号
  if (neurons > visibleNeurons) {
    const dotGeometry = new THREE.SphereGeometry(neuronRadius * 0.5, 8, 8)
    const dotMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc })
    
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial)
      dot.position.y = startY - visibleNeurons * neuronRadius * 2.5 - i * neuronRadius
      group.add(dot)
    }
  }
  
  // 添加层名称和参数信息
  addLayerLabel(group, layer.name, 0, -totalHeight / 2 - 1.5)
  addLayerLabel(group, `神经元: ${neurons}`, 0, -totalHeight / 2 - 2, 0.6)
  addLayerLabel(group, `参数: ${layer.params?.toLocaleString()}`, 0, -totalHeight / 2 - 2.5, 0.6)
  if (layer.activation) {
    addLayerLabel(group, `激活: ${layer.activation}`, 0, -totalHeight / 2 - 3, 0.6)
  }
}

// 创建输出层可视化
const createOutputLayer = (group: THREE.Group, layer: LayerConfig) => {
  createFcLayer(group, layer) // 输出层可以复用全连接层的可视化
}

// 创建层之间的连接
const createLayerConnection = (fromLayer: THREE.Group, toLayer: THREE.Group) => {
  // 创建连接线的材质
  const material = new THREE.LineBasicMaterial({
    color: 0x4080ff,
    transparent: true,
    opacity: 0.3
  })
  
  // 根据层类型确定连接点
  const fromPoints = getLayerConnectionPoints(fromLayer)
  const toPoints = getLayerConnectionPoints(toLayer, true)
  
  // 为每对连接点创建线条
  const maxConnections = Math.min(fromPoints.length, toPoints.length, 20) // 限制连接数量
  
  for (let i = 0; i < maxConnections; i++) {
    const fromPoint = fromPoints[i % fromPoints.length]
    const toPoint = toPoints[i % toPoints.length]
    
    const geometry = new THREE.BufferGeometry().setFromPoints([fromPoint, toPoint])
    const line = new THREE.Line(geometry, material)
    
    scene.add(line)
    connectionLines.push(line)
  }
}

// 获取层的连接点
const getLayerConnectionPoints = (layerGroup: THREE.Group, isInput = false) => {
  const points: THREE.Vector3[] = []
  const layer = layerGroup.userData.layerConfig as LayerConfig
  const worldPosition = new THREE.Vector3()
  layerGroup.getWorldPosition(worldPosition)
  
  // 根据层类型生成不同的连接点
  switch (layer.type) {
    case 'input':
    case 'conv':
    case 'pool': {
      // 为卷积层和池化层，在平面上生成连接点
      const [height, width] = layer.shape
      const scale = 0.03 * visualizationConfig.value.scale
      const xOffset = isInput ? 0.5 : -0.5 // 连接点在层的前面或后面
      
      // 在特征图上生成网格点
      const gridSize = 3 // 3x3网格
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const xPos = worldPosition.x + xOffset
          const yPos = worldPosition.y + (y - gridSize / 2) * height * scale
          const zPos = worldPosition.z + (x - gridSize / 2) * width * scale
          
          points.push(new THREE.Vector3(xPos, yPos, zPos))
        }
      }
      break
    }
    case 'fc':
    case 'output': {
      // 为全连接层，使用神经元位置作为连接点
      const [neurons] = layer.shape
      const visibleNeurons = Math.min(neurons, 20)
      const neuronRadius = 0.15 * visualizationConfig.value.scale
      
      // 计算神经元排列的高度
      const totalHeight = visibleNeurons * neuronRadius * 2.5
      const startY = totalHeight / 2 - neuronRadius
      const xOffset = isInput ? 0.5 : -0.5 // 连接点在层的前面或后面
      
      for (let i = 0; i < visibleNeurons; i++) {
        const xPos = worldPosition.x + xOffset
        const yPos = worldPosition.y + startY - i * neuronRadius * 2.5
        const zPos = worldPosition.z
        
        points.push(new THREE.Vector3(xPos, yPos, zPos))
      }
      break
    }
  }
  
  return points
}

// 添加层标签
const addLayerLabel = (group: THREE.Group, text: string, x = 0, y = 0, scale = 1) => {
  // 在Three.js中添加文本标签（简化版，实际项目中可以使用CSS2DRenderer或TextGeometry）
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return
  
  canvas.width = 256
  canvas.height = 64
  
  context.fillStyle = visualizationConfig.value.viewMode === '3d' ? '#ffffff' : '#000000'
  context.font = '24px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })
  
  const geometry = new THREE.PlaneGeometry(2 * scale, 0.5 * scale)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, 0)
  group.add(mesh)
}

// 获取层的颜色
const getLayerColor = (layerTypeIndex: number) => {
  const scheme = colorSchemes[visualizationConfig.value.colorScheme as keyof typeof colorSchemes]
  const color = scheme[layerTypeIndex % scheme.length]
  return new THREE.Color(color)
}

// 生成模拟的特征图数据
const generateMockFeatureMaps = () => {
  featureMaps.value.clear()
  
  cnnLayers.value.forEach((layer, index) => {
    const [height, width, channels] = layer.type === 'fc' ? [1, 1, layer.shape[0]] : layer.shape
    const size = height * width * channels
    const data = new Float32Array(size)
    
    // 生成随机数据
    for (let i = 0; i < size; i++) {
      data[i] = Math.random()
    }
    
    featureMaps.value.set(layer.name, data)
  })
}

// 更新特征图可视化
const updateFeatureMaps = () => {
  if (!visualizationConfig.value.showFeatureMaps) return
  
  layerMeshes.forEach((layerGroup, index) => {
    const layer = cnnLayers.value[index]
    const featureMap = featureMaps.value.get(layer.name)
    
    if (!featureMap) return
    
    // 根据层类型更新可视化
    switch (layer.type) {
      case 'conv':
      case 'pool': {
        // 更新特征图平面的颜色
        layerGroup.children.forEach((child: THREE.Object3D, i: number) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            // 模拟特征图激活
            const activationLevel = Math.random() * 0.5 + 0.5 // 随机激活水平
            child.material.color.setHSL(0.6, 0.8, activationLevel)
          }
        })
        break
      }
      case 'fc': {
        // 更新神经元的颜色
        layerGroup.children.forEach((child: THREE.Object3D, i: number) => {
          if (child instanceof THREE.Mesh && 
              child.geometry instanceof THREE.SphereGeometry && 
              child.material instanceof THREE.MeshPhongMaterial) {
            // 模拟神经元激活
            const activationLevel = Math.random() * 0.5 + 0.5 // 随机激活水平
            child.material.color.setHSL(0.1, 0.8, activationLevel)
          }
        })
        break
      }
    }
  })
}

// 动画数据流
const animateDataFlow = () => {
  if (!visualizationConfig.value.animateDataFlow) return
  
  // 更新连接线上的粒子动画
  connectionLines.forEach(line => {
    if (Math.random() > 0.95) { // 随机触发数据流动画
      // 在实际项目中，这里可以使用THREE.Points或自定义着色器实现更复杂的数据流动画
      const material = line.material as THREE.LineBasicMaterial
      material.color.setHSL(Math.random() * 0.1 + 0.6, 1, 0.5)
      
      // 创建一个简单的闪烁效果
      material.opacity = 0.8
      setTimeout(() => {
        material.opacity = 0.3
      }, 200)
    }
  })
}

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  
  // 更新控制器
  controls.update()
  
  // 更新特征图可视化
  if (Math.random() > 0.95) { // 不是每一帧都更新，以减少计算量
    updateFeatureMaps()
  }
  
  // 动画数据流
  animateDataFlow()
  
  // 渲染场景
  renderer.render(scene, camera)
}

// 处理层点击事件
const handleLayerClick = (event: MouseEvent) => {
  if (!container.value) return
  
  // 计算鼠标位置
  const rect = container.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / container.value.clientWidth) * 2 - 1
  const y = -((event.clientY - rect.top) / container.value.clientHeight) * 2 + 1
  
  // 创建射线
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  
  // 检测与层的交叉
  const intersects: THREE.Intersection[] = []
  layerMeshes.forEach(group => {
    raycaster.intersectObject(group, true, intersects)
  })
  
  if (intersects.length > 0) {
    // 找到最近的交叉点
    let nearestGroup = intersects[0].object
    while (nearestGroup.parent && !nearestGroup.userData.layerConfig) {
      nearestGroup = nearestGroup.parent
    }
    
    if (nearestGroup.userData.layerConfig) {
      // 设置选中的层
      const layerIndex = nearestGroup.userData.layerIndex
      selectedLayer.value = cnnLayers.value[layerIndex]
      
      // 高亮显示选中的层
      visualizationConfig.value.highlightLayer = layerIndex
      
      // 更新层的外观
      layerMeshes.forEach((group, index) => {
        group.children.forEach((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            child.material.opacity = index === layerIndex ? 1.0 : 0.3
          }
        })
      })
    }
  }
}

// 重置层高亮
const resetHighlight = () => {
  visualizationConfig.value.highlightLayer = null
  
  // 恢复所有层的外观
  layerMeshes.forEach(group => {
    group.children.forEach((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
        child.material.opacity = visualizationConfig.value.opacity
      }
    })
  })
  
  selectedLayer.value = null
}

// 切换视图模式
const toggleViewMode = () => {
  visualizationConfig.value.viewMode = visualizationConfig.value.viewMode === '3d' ? '2d' : '3d'
  
  // 更新场景背景色
  scene.background = new THREE.Color(visualizationConfig.value.viewMode === '3d' ? 0x111111 : 0xffffff)
  
  // 更新相机位置
  if (visualizationConfig.value.viewMode === '2d') {
    camera.position.set(0, 0, 20)
    camera.lookAt(0, 0, 0)
  } else {
    camera.position.set(5, 5, 15)
    camera.lookAt(0, 0, 0)
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initThreeJs()
  
  // 添加点击事件监听器
  if (container.value) {
    container.value.addEventListener('click', handleLayerClick)
  }
})

// 在组件卸载时清理资源
const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (container.value) {
    container.value.removeEventListener('click', handleLayerClick)
    if (renderer) {
      container.value.removeChild(renderer.domElement)
    }
  }
  
  window.removeEventListener('resize', onWindowResize)
}

// 监听选中层的变化，发出事件
watch(selectedLayer, (newLayer) => {
  if (newLayer) {
    emit('layer-select', newLayer)
  }
})

// 监听配置变化，更新可视化
watch(() => visualizationConfig.value, () => {
  // 重新创建可视化
  if (scene) {
    createNetworkVisualization()
  }
}, { deep: true })

// 导出组件方法
defineExpose({
  resetHighlight,
  toggleViewMode
})
</script>

<template>
  <div ref="container" class="neural-network-container">
    <!-- 3D可视化容器 -->
  </div>
  
  <!-- 控制面板 -->
  <div class="controls-overlay" v-if="false"> <!-- 默认隐藏，可通过配置显示 -->
    <n-space vertical size="small">
      <n-button size="small" @click="toggleViewMode">
        {{ visualizationConfig.viewMode === '3d' ? '2D视图' : '3D视图' }}
      </n-button>
      <n-button size="small" @click="resetHighlight" v-if="visualizationConfig.highlightLayer !== null">
        重置选择
      </n-button>
    </n-space>
  </div>
</template>

<style scoped>
.neural-network-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.controls-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 4px;
}
</style>