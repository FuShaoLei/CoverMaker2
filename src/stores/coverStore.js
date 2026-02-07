import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCoverStore = defineStore('cover', () => {
  // 原始上传的图片
  const originalImage = ref(null)

  // 裁剪后的图片（用于显示和导出）
  const croppedImage = ref(null)

  // 当前使用的图片（可能是原图或裁剪后的）
  const currentImage = computed(() => croppedImage.value || originalImage.value)

  // 文字内容（支持 HTML）
  const text = ref('')

  // 自定义 CSS 样式
  const customCSS = ref('')

  // 字体大小
  const fontSize = ref(22)

  // 字体颜色
  const textColor = ref('#ffffff')

  // 字体粗细
  const fontWeight = ref('normal')

  // 字体阴影
  const textShadow = ref('none')

  // 行高
  const lineHeight = ref(1)

  // 字间距
  const letterSpacing = ref('0.016em')

  // 裁剪对话框显示状态
  const showCropper = ref(false)

  // 设置原始图片
  function setOriginalImage(imageData) {
    originalImage.value = imageData
    // 如果没有裁剪过的图片，使用原图
    if (!croppedImage.value) {
      croppedImage.value = imageData
    }
  }

  // 设置裁剪后的图片
  function setCroppedImage(imageData) {
    croppedImage.value = imageData
  }

  // 重置图片状态
  function resetImages() {
    originalImage.value = null
    croppedImage.value = null
  }

  // 更新文字
  function setText(value) {
    text.value = value
  }

  // 更新自定义 CSS
  function setCustomCSS(value) {
    customCSS.value = value
  }

  // 更新字体大小
  function setFontSize(value) {
    fontSize.value = value
  }

  // 更新字体颜色
  function setTextColor(value) {
    textColor.value = value
  }

  // 更新字体粗细
  function setFontWeight(value) {
    fontWeight.value = value
  }

  // 更新文字阴影
  function setTextShadow(value) {
    textShadow.value = value
  }

  // 更新行高
  function setLineHeight(value) {
    lineHeight.value = value
  }

  // 更新字间距
  function setLetterSpacing(value) {
    letterSpacing.value = value
  }

  // 打开裁剪对话框
  function openCropper() {
    showCropper.value = true
  }

  // 关闭裁剪对话框
  function closeCropper() {
    showCropper.value = false
  }

  // 生成应用了所有样式的 CSS
  function getAppliedStyles() {
    return `
      font-size: ${fontSize.value}px;
      color: ${textColor.value};
      font-weight: ${fontWeight.value};
      text-shadow: ${textShadow.value};
      line-height: ${lineHeight.value};
      letter-spacing: ${letterSpacing.value};
      ${customCSS.value}
    `
  }

  // 生成应用了所有样式的对象（用于 :style 绑定）
  function getAppliedStylesObject() {
    return {
      fontSize: `${fontSize.value}px`,
      color: textColor.value,
      fontWeight: fontWeight.value,
      textShadow: textShadow.value,
      lineHeight: lineHeight.value,
      letterSpacing: letterSpacing.value,
    }
  }

  // 重置所有状态
  function reset() {
    resetImages()
    text.value = ''
    customCSS.value = ''
    fontSize.value = 22
    textColor.value = '#ffffff'
    fontWeight.value = 'normal'
    textShadow.value = 'none'
    lineHeight.value = 1
    letterSpacing.value = '0.016em'
  }

  return {
    originalImage,
    croppedImage,
    currentImage,
    text,
    customCSS,
    fontSize,
    textColor,
    fontWeight,
    textShadow,
    lineHeight,
    letterSpacing,
    showCropper,
    setOriginalImage,
    setCroppedImage,
    resetImages,
    setText,
    setCustomCSS,
    setFontSize,
    setTextColor,
    setFontWeight,
    setTextShadow,
    setLineHeight,
    setLetterSpacing,
    openCropper,
    closeCropper,
    getAppliedStyles,
    getAppliedStylesObject,
    reset,
  }
})
