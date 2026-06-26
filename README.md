# docs.getquicker.net

Quicker 文档站，使用 [Docusaurus](https://docusaurus.io/) 生成静态网站。

## Installation

```powershell
npm install
```

## Local Development

```powershell
npm run start
```

本地开发服务器默认运行在 `http://localhost:3000/`。

## Build

```powershell
npm run build
```

构建产物输出到 `build/`，可部署到 GitHub Pages、Cloudflare Pages、Vercel、Netlify 或自有静态文件服务。

## Directory

- `docs/`: Markdown/MDX 文档内容。
- `src/`: Docusaurus 站点代码、主题覆盖和 React 组件。
- `static/`: 原样复制到构建输出的图片、下载文件等静态资源。

## Comment integration

每篇文档可在 frontmatter 中声明稳定的评论标识：

```md
---
quickerDocKey: v2/install/windows
comments: true
---
```

后续 QuickerWeb 提供评论挂载页后，在 `docusaurus.config.ts` 的 `customFields.quickerCommentsBaseUrl` 中填写评论页地址。
