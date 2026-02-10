# 字体文件目录

请将自定义字体文件放在此目录下。

支持的字体格式：
- .woff2 (推荐，文件最小)
- .woff
- .ttf
- .otf

## 使用方法

1. 将字体文件放入此目录
2. 在 `src/assets/styles/cover.css` 中更新 `@font-face` 声明
3. 引用字体文件名

例如：
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/your-font-file.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```
