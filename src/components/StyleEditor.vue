<script setup>
import { computed } from 'vue'
import { useCoverStore } from '@/stores/coverStore'

const coverStore = useCoverStore()

const customCSS = computed({
  get: () => coverStore.customCSS,
  set: (value) => coverStore.setCustomCSS(value),
})

// CSS 预设模板
const cssPresets = [
  {
    name: '默认样式',
    css: '',
  },
  {
    name: '增加字间距',
    css: 'letter-spacing: 4px;',
  },
  {
    name: '大写字母',
    css: 'text-transform: uppercase;',
  },
  {
    name: '描边效果',
    css: '-webkit-text-stroke: 2px black;',
  },
  {
    name: '渐变文字',
    css: 'background: linear-gradient(45deg, #ff6b6b, #feca57); -webkit-background-clip: text; -webkit-text-fill-color: transparent;',
  },
]

const applyPreset = (css) => {
  customCSS.value = css
}

// 默认样式说明
const defaultStyles = [
  { property: 'position', value: 'absolute' },
  { property: 'top', value: '50%' },
  { property: 'left', value: '50%' },
  { property: 'transform', value: 'translate(-50%, -50%)' },
  { property: 'text-align', value: 'center' },
  { property: 'width', value: '90%' },
  { property: 'word-wrap', value: 'break-word' },
]
</script>

<template>
  <div class="style-editor">
    <div class="editor-section">
      <h3 class="section-title">默认样式说明</h3>
      <div class="default-styles">
        <p class="hint">以下样式已自动应用，无需手动设置：</p>
        <div class="style-list">
          <div v-for="style in defaultStyles" :key="style.property" class="style-item">
            <span class="style-property">{{ style.property }}:</span>
            <span class="style-value">{{ style.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-section">
      <h3 class="section-title">快速预设</h3>
      <div class="preset-buttons">
        <button
          v-for="preset in cssPresets"
          :key="preset.name"
          class="preset-btn"
          :class="{ active: customCSS === preset.css }"
          @click="applyPreset(preset.css)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <div class="editor-section">
      <h3 class="section-title">自定义 CSS</h3>
      <textarea
        v-model="customCSS"
        class="css-input"
        placeholder="输入额外的 CSS 样式...&#10;例如:&#10;letter-spacing: 2px;&#10;text-transform: uppercase;&#10;line-height: 1.6;"
        rows="6"
      ></textarea>
      <p class="hint">
        在此输入的 CSS 会与默认样式合并使用。支持任何标准 CSS 属性。
      </p>
    </div>

    <div class="editor-section">
      <h3 class="section-title">常用 CSS 属性参考</h3>
      <div class="css-reference">
        <div class="reference-item">
          <code>letter-spacing</code>
          <span>字间距</span>
        </div>
        <div class="reference-item">
          <code>line-height</code>
          <span>行高</span>
        </div>
        <div class="reference-item">
          <code>text-transform</code>
          <span>文本大小写</span>
        </div>
        <div class="reference-item">
          <code>-webkit-text-stroke</code>
          <span>文字描边</span>
        </div>
        <div class="reference-item">
          <code>opacity</code>
          <span>透明度</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-editor {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
}

.default-styles {
  background: #1a202c;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #2d3748;
}

.style-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.style-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #cbd5e0;
}

.style-property {
  color: #9f7aea;
  min-width: 120px;
}

.style-value {
  color: #48bb78;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 8px 14px;
  border: 1px solid #4a5568;
  background: #2d3748;
  color: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.preset-btn:hover {
  border-color: #9f7aea;
  color: #9f7aea;
}

.preset-btn.active {
  background: #9f7aea;
  border-color: #9f7aea;
  color: white;
}

.css-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #4a5568;
  border-radius: 6px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  resize: vertical;
  transition: border-color 0.3s;
  background: #1a202c;
  color: #e2e8f0;
  line-height: 1.6;
}

.css-input:focus {
  outline: none;
  border-color: #9f7aea;
  background: #2d3748;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #a0aec0;
  line-height: 1.6;
}

.css-reference {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.reference-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background: #1a202c;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #2d3748;
}

.reference-item code {
  font-family: 'Consolas', 'Monaco', monospace;
  color: #9f7aea;
  font-size: 11px;
  word-break: break-all;
}

.reference-item span {
  color: #cbd5e0;
}
</style>
