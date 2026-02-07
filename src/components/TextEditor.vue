<script setup>
import { computed } from 'vue'
import { useCoverStore } from '@/stores/coverStore'

const coverStore = useCoverStore()

const text = computed({
  get: () => coverStore.text,
  set: (value) => coverStore.setText(value),
})

const fontSize = computed({
  get: () => coverStore.fontSize,
  set: (value) => coverStore.setFontSize(value),
})

const textColor = computed({
  get: () => coverStore.textColor,
  set: (value) => coverStore.setTextColor(value),
})

const fontWeight = computed({
  get: () => coverStore.fontWeight,
  set: (value) => coverStore.setFontWeight(value),
})

const textShadow = computed({
  get: () => coverStore.textShadow,
  set: (value) => coverStore.setTextShadow(value),
})

const customCSS = computed({
  get: () => coverStore.customCSS,
  set: (value) => coverStore.setCustomCSS(value),
})

const presetColors = [
  '#ffffff',
  '#000000',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
]

const weightOptions = [
  { label: '细体', value: '300' },
  { label: '常规', value: '400' },
  { label: '中等', value: '500' },
  { label: '粗体', value: 'bold' },
  { label: '特粗', value: '800' },
]

const shadowPresets = [
  { label: '无阴影', value: 'none' },
  { label: '默认阴影', value: '2px 2px 4px rgba(0,0,0,0.8)' },
  { label: '重阴影', value: '3px 3px 6px rgba(0,0,0,0.9)' },
  { label: '发光', value: '0 0 10px rgba(255,255,255,0.8)' },
]

const insertHTML = (html) => {
  text.value += html
}

const insertTag = (tag, content = '') => {
  insertHTML(`<${tag}>${content || '文本'}</${tag}>`)
}

const insertBreak = () => {
  insertHTML('<br>')
}
</script>

<template>
  <div class="text-editor">
    <div class="editor-section">
      <h3 class="section-title">文字内容</h3>
      <div class="html-toolbar">
        <button class="tool-btn" @click="() => insertTag('b')" title="粗体">
          <strong>B</strong>
        </button>
        <button class="tool-btn" @click="() => insertTag('i')" title="斜体">
          <em>I</em>
        </button>
        <button class="tool-btn" @click="() => insertTag('u')" title="下划线">
          <u>U</u>
        </button>
        <button class="tool-btn" @click="insertBreak" title="换行">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
        <button class="tool-btn" @click="() => insertTag('span', '自定义文字')" title="自定义样式">
          &lt;span&gt;
        </button>
      </div>
      <textarea
        v-model="text"
        class="text-input"
        placeholder="输入文字内容... 支持 HTML 标签如 &lt;b&gt;粗体&lt;/b&gt;、&lt;br&gt;换行等"
        rows="5"
      ></textarea>
      <p class="hint">支持 HTML 标签，例如: &lt;b&gt;粗体&lt;/b&gt;、&lt;i&gt;斜体&lt;/i&gt;、&lt;br&gt;换行</p>
    </div>

    <div class="editor-section">
      <h3 class="section-title">样式设置</h3>

      <div class="style-row">
        <label class="style-label">字体大小</label>
        <div class="style-control">
          <input
            v-model.number="fontSize"
            type="range"
            min="12"
            max="120"
            step="1"
            class="range-input"
          />
          <input
            v-model.number="fontSize"
            type="number"
            min="12"
            max="120"
            class="number-input"
          />
          <span class="unit">px</span>
        </div>
      </div>

      <div class="style-row">
        <label class="style-label">字体颜色</label>
        <div class="style-control">
          <input v-model="textColor" type="color" class="color-input" />
          <div class="preset-colors">
            <button
              v-for="color in presetColors"
              :key="color"
              class="color-preset"
              :style="{ backgroundColor: color }"
              :class="{ active: textColor === color }"
              @click="textColor = color"
            ></button>
          </div>
          <input v-model="textColor" type="text" class="text-input-small" />
        </div>
      </div>

      <div class="style-row">
        <label class="style-label">字体粗细</label>
        <div class="style-control">
          <select v-model="fontWeight" class="select-input">
            <option v-for="option in weightOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="style-row">
        <label class="style-label">文字阴影</label>
        <div class="style-control">
          <select v-model="textShadow" class="select-input">
            <option v-for="option in shadowPresets" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="editor-section">
      <h3 class="section-title">自定义 CSS</h3>
      <textarea
        v-model="customCSS"
        class="css-input"
        placeholder="输入自定义 CSS 样式..."
        rows="4"
      ></textarea>
      <p class="hint">可添加额外样式，如: letter-spacing: 2px; text-transform: uppercase;</p>
    </div>
  </div>
</template>

<style scoped>
.text-editor {
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
  color: #303133;
}

.html-toolbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
}

.tool-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.tool-btn svg {
  width: 16px;
  height: 16px;
}

.text-input,
.css-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  resize: vertical;
  transition: border-color 0.3s;
}

.text-input:focus,
.css-input:focus {
  outline: none;
  border-color: #409eff;
}

.css-input {
  background: #f5f7fa;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.style-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.style-label {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

.style-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.range-input {
  flex: 1;
  min-width: 120px;
}

.number-input {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.unit {
  font-size: 13px;
  color: #909399;
}

.color-input {
  width: 40px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}

.preset-colors {
  display: flex;
  gap: 6px;
}

.color-preset {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-preset:hover {
  transform: scale(1.1);
}

.color-preset.active {
  border-color: #409eff;
}

.text-input-small {
  width: 100px;
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
}

.select-input {
  padding: 7px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.select-input:focus {
  outline: none;
  border-color: #409eff;
}
</style>
