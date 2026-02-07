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

const lineHeight = computed({
  get: () => coverStore.lineHeight,
  set: (value) => coverStore.setLineHeight(value),
})

const letterSpacing = computed({
  get: () => coverStore.letterSpacing,
  set: (value) => coverStore.setLetterSpacing(value),
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
  { label: '常规', value: 'normal' },
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

const insertMarkdown = (markdown) => {
  text.value += markdown
}

const insertBold = () => {
  insertMarkdown('****粗体文字****')
}

const insertItalic = () => {
  insertMarkdown('**斜体文字**')
}

const insertHighlight = () => {
  insertMarkdown('==高亮文字==')
}
</script>

<template>
  <div class="text-editor">
    <div class="editor-section">
      <h3 class="section-title">文字内容</h3>
      <div class="markdown-toolbar">
        <button class="tool-btn" @click="insertBold" title="粗体">
          <strong>B</strong>
        </button>
        <button class="tool-btn" @click="insertItalic" title="斜体">
          <em>I</em>
        </button>
        <button class="tool-btn" @click="insertHighlight" title="高亮">
          <span style="background: yellow; color: black; padding: 0 4px;">H</span>
        </button>
      </div>
      <textarea
        v-model="text"
        class="text-input"
        placeholder="输入文字内容... 支持 Markdown 语法

**粗体文字**
==高亮文字--
直接换行即可换行"
        rows="5"
      ></textarea>
      <p class="hint">支持 Markdown 语法，例如: **粗体**、==高亮==、直接换行换行</p>
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

      <div class="style-row">
        <label class="style-label">行高</label>
        <div class="style-control">
          <input
            v-model.number="lineHeight"
            type="range"
            min="0"
            max="3"
            step="0.1"
            class="range-input"
          />
          <input
            v-model.number="lineHeight"
            type="number"
            min="0"
            max="3"
            step="0.1"
            class="number-input"
          />
        </div>
      </div>

      <div class="style-row">
        <label class="style-label">字间距</label>
        <div class="style-control">
          <select v-model="letterSpacing" class="select-input">
            <option value="0">默认</option>
            <option value="0.005em">0.5%</option>
            <option value="0.01em">1%</option>
            <option value="0.016em">1.6% (FCP)</option>
            <option value="0.02em">2%</option>
            <option value="0.05em">5%</option>
            <option value="0.1em">10%</option>
          </select>
          <input v-model="letterSpacing" type="text" class="text-input-small" placeholder="如: 0.016em" />
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
  color: #e2e8f0;
}

.markdown-toolbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #4a5568;
  background: #2d3748;
  color: #e2e8f0;
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
  border-color: #9f7aea;
  color: #9f7aea;
}

.tool-btn svg {
  width: 16px;
  height: 16px;
}

.text-input,
.css-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #4a5568;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  resize: vertical;
  transition: border-color 0.3s;
  background: #1a202c;
  color: #e2e8f0;
}

.text-input:focus,
.css-input:focus {
  outline: none;
  border-color: #9f7aea;
}

.css-input {
  background: #1a202c;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #a0aec0;
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
  color: #cbd5e0;
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
  border: 1px solid #4a5568;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  background: #1a202c;
  color: #e2e8f0;
}

.unit {
  font-size: 13px;
  color: #a0aec0;
}

.color-input {
  width: 40px;
  height: 32px;
  border: 1px solid #4a5568;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
  background: #1a202c;
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
  border-color: #9f7aea;
}

.text-input-small {
  width: 100px;
  padding: 6px 8px;
  border: 1px solid #4a5568;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
  background: #1a202c;
  color: #e2e8f0;
}

.select-input {
  padding: 7px 12px;
  border: 1px solid #4a5568;
  border-radius: 4px;
  font-size: 14px;
  background: #2d3748;
  color: #e2e8f0;
  cursor: pointer;
  min-width: 150px;
}

.select-input:focus {
  outline: none;
  border-color: #9f7aea;
}
</style>
