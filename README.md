# 春天住进星星里

写给春春的一封七夕情书。网站用旅行时间线、生日合照、重逢节点和未来约定，记录春春与星星从 2024 年 4 月 14 日开始的故事。

## 技术方案

- React 19 + TypeScript
- vinext / Vite
- 响应式移动端设计
- 兼容 Codex Sites 托管
- 纯前端交互，无需数据库

## 本地运行

项目需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

浏览器打开终端中显示的本地地址。

## 验证

```bash
npm run build
npm test
```

## 内容位置

- 页面和文案：`app/page.tsx`
- 视觉样式：`app/globals.css`
- 四张照片：`public/images/`
- 背景音乐：`public/audio/well-be-okay.mp3`
- Sites 配置：`.openai/hosting.json`

背景音乐使用 Michael Ramir C. 的《We'll Be Okay》。用户点击“打开我们的故事”后开始播放，也可通过左上角按钮暂停或继续。
