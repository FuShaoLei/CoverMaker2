<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import VueCropper from 'vue-cropperjs'

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'crop'])

const cropper = ref(null)
const aspectRatio = ref(0) // 0 表示自由比例
const selectedRatio = ref('free')

// 预设比例选项
const ratioOptions = [
  { label: '自由比例', value: 'free', ratio: 0 },
  { label: '16:9 横版', value: '16:9', ratio: 16 / 9 },
  { label: '9:16 竖版', value: '9:16', ratio: 9 / 16 },
  { label: '1:1 方形', value: '1:1', ratio: 1 },
  { label: '4:3 传统', value: '4:3', ratio: 4 / 3 },
]

const setAspectRatio = (ratio) => {
  selectedRatio.value = ratio.value
  aspectRatio.value = ratio.ratio
  if (cropper.value) {
    cropper.value.setAspectRatio(ratio.ratio)
  }
}

const cropImage = () => {
  if (cropper.value) {
    cropper.value.getCanvasData()
    const canvas = cropper.value.getCroppedCanvas({
      maxWidth: 1920,
      maxHeight: 1920,
    })
    const croppedImageData = canvas.toDataURL('image/png')
    emit('crop', croppedImageData)
    close()
  }
}

const close = () => {
  emit('update:modelValue', false)
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.image,
  (newImage) => {
    if (newImage && cropper.value) {
      cropper.value.replace(newImage)
    }
  }
)
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>裁剪图片</h2>
          <button class="close-btn" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="cropper-wrapper">
            <VueCropper
              ref="cropper"
              :src="image"
              :aspect-ratio="aspectRatio"
              :auto-crop-area="1"
              :view-mode="1"
              :background="false"
              :responsive="true"
              :check-cross-origin="false"
            />
          </div>

          <div class="ratio-options">
            <span class="ratio-label">选择比例:</span>
            <button
              v-for="option in ratioOptions"
              :key="option.value"
              class="ratio-btn"
              :class="{ active: selectedRatio === option.value }"
              @click="setAspectRatio(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">取消</button>
          <button class="btn btn-primary" @click="cropImage">确认裁剪</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #909399;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #303133;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.cropper-wrapper {
  height: 400px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.ratio-options {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ratio-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.ratio-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s;
}

.ratio-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.ratio-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-secondary {
  background: #f5f7fa;
  color: #606266;
}

.btn-secondary:hover {
  background: #e4e7ed;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #66b1ff;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

/* Cropper specific styles override */
:deep(.cropper-view-box),
:deep(.cropper-face) {
  border-radius: 0;
}

:deep(.cropper-line) {
  background-color: #409eff;
}

:deep(.cropper-point) {
  background-color: #409eff;
}

:deep(.cropper-bg) {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMhASEOJDZBECCXkE44A+gwATOKoDJ6J5gAAAAAElFTkSuQmCC');
}
</style>
