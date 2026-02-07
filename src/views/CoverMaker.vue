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

const exportCover = async () => {
  if (!coverStore.currentImage) {
    alert('请先上传图片')
    return
  }

  isExporting.value = true

  try {
    // 创建临时导出容器
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '1280px'
    container.style.height = '720px'
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
      textDiv.innerHTML = coverStore.text
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
        font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.4;
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
      width: 1280,
      height: 720,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    })

    // 清理临时容器
    document.body.removeChild(container)

    // 转换为 blob 并下载
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `cover-${Date.now()}.png`
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
      <h1>视频封面生成器</h1>
      <p class="subtitle">轻松创建适配各平台的视频封面</p>
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
          <button class="btn btn-export" :disabled="isExporting" @click="exportCover">
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
            {{ isExporting ? '导出中...' : '导出封面 (PNG)' }}
          </button>
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
  background: #f5f7fa;
}

.app-header {
  padding: 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  background: transparent;
}

.editor-panel::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.panel-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title svg {
  width: 20px;
  height: 20px;
  color: #409eff;
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
  background: #f5f5f5;
  border: 2px solid #e4e7ed;
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
  background: #409eff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
}

.btn-secondary {
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-secondary:hover:not(:disabled) {
  background: #e4e7ed;
  border-color: #c0c4cc;
}

.btn-danger {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.btn-danger:hover:not(:disabled) {
  background: #fde2e2;
  border-color: #f89898;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-export {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 15px;
  font-weight: 600;
  justify-content: center;
}

.btn-export:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-reset {
  width: 100%;
  padding: 12px 20px;
  background: #f5f7fa;
  color: #909399;
  justify-content: center;
}

.btn-reset:hover {
  background: #e4e7ed;
  color: #606266;
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
