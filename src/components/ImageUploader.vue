<script setup>
import { ref } from 'vue'

const emit = defineEmits(['upload'])

const fileInput = ref(null)
const isDragging = ref(false)

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const processFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('upload', e.target.result)
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

defineExpose({
  triggerFileInput,
})
</script>

<template>
  <div
    class="uploader"
    :class="{ 'is-dragging': isDragging }"
    @click="triggerFileInput"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileSelect"
    />
    <div class="uploader-content">
      <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <p class="upload-text">点击或拖拽上传图片</p>
      <p class="upload-hint">支持 JPG、PNG、GIF 等格式</p>
    </div>
  </div>
</template>

<style scoped>
.uploader {
  border: 2px dashed #4a5568;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #1a202c;
}

.uploader:hover {
  border-color: #9f7aea;
  background: #2d3748;
}

.uploader.is-dragging {
  border-color: #9f7aea;
  background: #44337a;
  transform: scale(1.02);
}

.file-input {
  display: none;
}

.uploader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #a0aec0;
}

.upload-text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #e2e8f0;
}

.upload-hint {
  margin: 0;
  font-size: 13px;
  color: #a0aec0;
}
</style>
