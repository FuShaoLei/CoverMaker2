import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
})

/**
 * 渲染 Markdown 为 HTML
 * @param {string} markdown - Markdown 文本
 * @returns {string} HTML 字符串
 */
export function renderMarkdown(markdown) {
  if (!markdown) return ''

  // 转换 ==高亮== 为 <mark>高亮</mark>
  let processed = markdown.replace(/==([^=]+)==/g, '<mark>$1</mark>')

  // 渲染 Markdown
  return md.render(processed)
}

/**
 * 检测文本是否包含 Markdown 语法
 * @param {string} text - 要检测的文本
 * @returns {boolean} 是否包含 Markdown 语法
 */
export function hasMarkdownSyntax(text) {
  if (!text) return false
  const markdownPatterns = [
    /\*\*.+?\*\*/,  // **粗体**
    /__.+?__/,      // __粗体__
    /\*.+?\*/,      // *斜体*
    /_.+?_/,        // _斜体_
    /==.+?==/,      // ==高亮==
    /^#+\s/,        // 标题
    /^\s*[-*+]\s/,  // 列表
  ]
  return markdownPatterns.some(pattern => pattern.test(text))
}
