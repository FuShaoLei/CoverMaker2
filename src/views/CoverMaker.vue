<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import ImageUploader from '@/components/ImageUploader.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import TextEditor from '@/components/TextEditor.vue'
import StyleEditor from '@/components/StyleEditor.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import { useCoverStore } from '@/stores/coverStore'
import '@/assets/styles/cover.css'

const coverStore = useCoverStore()
const uploaderRef = ref(null)

// 导出元素引用
const exportContainer = ref(null)
const isExporting = ref(false)

const handleImageUpload = (imageData) => {
  coverStore.setOriginalImage(imageData)
  // 上传后询问是否裁剪
  coverStore.openCropper()
}

const handleCrop = (croppedImageData) => {
  coverStore.setCroppedImage(croppedImageData)
}

const triggerUpload = () => {
  uploaderRef.value?.triggerFileInput()
}

const recropImage = () => {
  coverStore.openCropper()
}

const removeImage = () => {
  if (confirm('确定要移除当前图片吗？')) {
    coverStore.resetImages()
  }
}

const resetAll = () => {
  if (confirm('确定要重置所有内容吗？这将清除图片和文字。')) {
    coverStore.reset()
  }
}

// 导出单个尺寸的封面
const exportSingleCover = async (width, height) => {
  // 创建临时导出容器
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = width + 'px'
  container.style.height = height + 'px'
  container.style.background = '#000'
  container.style.overflow = 'hidden'

  // 创建图片
  const img = document.createElement('img')
  img.src = coverStore.currentImage
  img.style.width = '100%'
  img.style.height = '100%'
  img.style.objectFit = 'cover'
  img.style.position = 'absolute'
  img.style.top = '0'
  img.style.left = '0'

  // 创建文字容器
  if (coverStore.text) {
    const textDiv = document.createElement('div')
    const isHTML = /<[^>]*>/.test(coverStore.text)
    if (isHTML) {
      textDiv.innerHTML = coverStore.text
    } else {
      textDiv.innerText = coverStore.text
    }
    textDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 90%;
      max-width: 90%;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      line-height: 1.4;
      white-space: pre-wrap;
      ${coverStore.getAppliedStyles()}
    `
    container.appendChild(textDiv)
  }

  container.appendChild(img)
  document.body.appendChild(container)

  // 等待图片加载
  await new Promise((resolve) => {
    if (img.complete) {
      resolve()
    } else {
      img.onload = resolve
    }
  })

  // 使用 html2canvas 导出
  const canvas = await html2canvas(container, {
    width: width,
    height: height,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  })

  // 清理临时容器
  document.body.removeChild(container)

  return canvas
}

const exportCover = async () => {
  if (!coverStore.currentImage) {
    alert('请先上传图片')
    return
  }

  isExporting.value = true

  try {
    // 导出横版 16:9 (1280x720)
    const canvas169 = await exportSingleCover(1280, 720)
    canvas169.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `cover-16x9-${Date.now()}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')

    // 短暂延迟后导出竖版 9:16 (720x1280)
    await new Promise(resolve => setTimeout(resolve, 500))
    const canvas916 = await exportSingleCover(720, 1280)
    canvas916.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `cover-9x16-${Date.now()}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      isExporting.value = false
    }, 'image/png')
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请重试')
    isExporting.value = false
  }
}
</script>

<template>
  <div class="cover-maker">
    <header class="app-header">
      <div class="header-left">
        <h1>视频封面生成器</h1>
        <p class="subtitle">轻松创建适配各平台的视频封面</p>
      </div>
      <button class="header-export-btn" :disabled="isExporting" @click="exportCover">
        <svg v-if="!isExporting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <svg v-else class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        {{ isExporting ? '导出中...' : '导出封面' }}
      </button>
    </header>

    <div class="main-content">
      <!-- 左侧编辑区 -->
      <div class="editor-panel">
        <!-- 图片上传区 -->
        <div class="panel-section">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            图片设置
          </h2>

          <div v-if="!coverStore.currentImage" class="upload-area">
            <ImageUploader ref="uploaderRef" @upload="handleImageUpload" />
          </div>

          <div v-else class="image-controls">
            <div class="image-preview-small">
              <img :src="coverStore.currentImage" alt="当前图片" />
            </div>
            <div class="control-buttons">
              <button class="btn btn-primary" @click="recropImage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
                  <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
                </svg>
                重新裁剪
              </button>
              <button class="btn btn-secondary" @click="triggerUpload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                更换图片
              </button>
              <button class="btn btn-danger" @click="removeImage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                移除
              </button>
            </div>
          </div>
        </div>

        <!-- 文字编辑区 -->
        <div class="panel-section">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            文字编辑
          </h2>
          <TextEditor />
        </div>

        <!-- 样式编辑区 -->
        <div class="panel-section">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.74 5.88-5.74 5.88-5.74-5.88z"></path>
              <path d="M5 19.5h14"></path>
              <path d="M5 12h14"></path>
            </svg>
            样式设置
          </h2>
          <StyleEditor />
        </div>

        <!-- 操作按钮 -->
        <div class="panel-section action-buttons">
          <button class="btn btn-reset" @click="resetAll">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            重置所有
          </button>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-area">
        <PreviewPanel />
      </div>
    </div>

    <!-- 裁剪对话框 -->
    <ImageCropper
      v-model="coverStore.showCropper"
      :image="coverStore.originalImage"
      @crop="handleCrop"
    />
  </div>
</template>

<style scoped>
.cover-maker {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a2e;
}

.app-header {
  padding: 20px 30px;
  background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%);
  color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.header-export-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.4);
  transition: all 0.3s;
  white-space: nowrap;
}

.header-export-btn:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 184, 148, 0.5);
}

.header-export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.header-export-btn svg {
  width: 18px;
  height: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.editor-panel {
  width: 420px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
}

.editor-panel::-webkit-scrollbar {
  width: 6px;
}

.editor-panel::-webkit-scrollbar-track {
  background: #16213e;
}

.editor-panel::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.editor-panel::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

.panel-section {
  background: #16213e;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title svg {
  width: 20px;
  height: 20px;
  color: #9f7aea;
}

.upload-area {
  margin-top: 8px;
}

.image-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-preview-small {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #0f3460;
  border: 2px solid #2d3748;
}

.image-preview-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.control-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn svg {
  width: 16px;
  height: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #2d3748;
  color: #e2e8f0;
  border: 1px solid #4a5568;
}

.btn-secondary:hover:not(:disabled) {
  background: #4a5568;
  border-color: #718096;
}

.btn-danger {
  background: #742a2a;
  color: #fc8181;
  border: 1px solid #9b2c2c;
}

.btn-danger:hover:not(:disabled) {
  background: #9b2c2c;
  border-color: #c53030;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-reset {
  width: 100%;
  padding: 12px 20px;
  background: #2d3748;
  color: #a0aec0;
  justify-content: center;
}

.btn-reset:hover {
  background: #4a5568;
  color: #e2e8f0;
}

.preview-area {
  flex: 1;
  min-width: 0;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-export-btn {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    flex-direction: column;
    overflow-y: auto;
  }

  .editor-panel {
    width: 100%;
    flex-shrink: 0;
    overflow: visible;
  }

  .preview-area {
    min-height: 500px;
  }
}
</style>
