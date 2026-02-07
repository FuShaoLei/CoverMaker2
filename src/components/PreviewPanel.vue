<script setup>
import { computed } from 'vue'
import { useCoverStore } from '@/stores/coverStore'

const coverStore = useCoverStore()

const currentImage = computed(() => coverStore.currentImage)
const text = computed(() => coverStore.text)
const getAppliedStyles = computed(() => coverStore.getAppliedStyles())

// 获取预览容器的样式
const getPreviewContainerStyle = (aspectRatio) => {
  const styles = {
    '16:9': { width: '100%', aspectRatio: '16 / 9' },
    '9:16': { width: '180px', aspectRatio: '9 / 16' },
  }
  return styles[aspectRatio] || styles['16:9']
}

// 检测是否包含 HTML 标签
const isHTML = computed(() => {
  return /<[^>]*>/.test(text.value)
})
</script>

<template>
  <div class="preview-panel">
    <div class="panel-header">
      <h2>多平台预览</h2>
      <p class="subtitle">实时查看封面在不同平台的效果</p>
    </div>

    <div class="preview-content">
      <!-- 横版 16:9 预览 -->
      <div class="preview-section">
        <h3 class="preview-title">
          <span class="badge horizontal">16:9</span>
          B站 / YouTube 横版
        </h3>
        <div
          class="preview-container main-preview"
          :style="getPreviewContainerStyle('16:9')"
        >
          <img v-if="currentImage" :src="currentImage" class="preview-image" alt="封面预览" />
          <div v-else class="preview-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>暂无图片</span>
          </div>
          <div
            v-if="text"
            class="cover-text"
            v-html="isHTML ? text : undefined"
            v-text="isHTML ? undefined : text"
            :style="getAppliedStyles"
          ></div>
        </div>
      </div>

      <!-- 竖版 9:16 预览 -->
      <div class="preview-section">
        <h3 class="preview-title">
          <span class="badge vertical">9:16</span>
          抖音 / 视频号 竖版
        </h3>
        <div class="preview-group">
          <div
            v-for="i in 3"
            :key="'vertical-' + i"
            class="preview-container small-preview"
            :style="getPreviewContainerStyle('9:16')"
          >
            <img v-if="currentImage" :src="currentImage" class="preview-image" alt="封面预览" />
            <div
              v-if="text"
              class="cover-text"
              v-html="isHTML ? text : undefined"
              v-text="isHTML ? undefined : text"
              :style="getAppliedStyles"
            ></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #16213e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2d3748;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #2d3748;
  background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%);
  color: white;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge.horizontal {
  background: #667eea;
}

.badge.vertical {
  background: #48bb78;
}


.preview-container {
  position: relative;
  overflow: hidden;
  background: #0f3460;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container.main-preview {
  min-height: 200px;
  border: 2px solid #2d3748;
}

.preview-container.small-preview {
  border: 1px solid #2d3748;
  height: 240px;
}

.preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #718096;
}

.preview-placeholder svg {
  width: 48px;
  height: 48px;
}

.preview-placeholder span {
  font-size: 14px;
}

.preview-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cover-text {
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
  pointer-events: none;
  z-index: 10;
  white-space: pre-wrap;
}

/* 滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: #16213e;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
