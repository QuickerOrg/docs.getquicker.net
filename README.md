# docs.getquicker.net

Quicker 文档站，使用 [Docusaurus](https://docusaurus.io/) 生成静态网站。

## 安装

```powershell
npm ci
```

## 本地开发

```powershell
npm run start
```

本地开发服务器默认运行在 `http://localhost:3000/`。

## 构建

```powershell
npm run build
```

构建产物输出到 `build/`。

## 发布

生产站通过 Cloudflare Pages 托管：

- GitHub 仓库：`QuickerOrg/docs.getquicker.net`
- 生产分支：`main`
- 构建命令：`npm run build`
- 构建输出目录：`build`
- 正式地址：`https://docs.getquicker.net`

推送到 `main` 后，Cloudflare Pages 会自动构建并发布；其他分支的构建用于预览。

## 目录

- `docs/`: Markdown/MDX 文档内容。
- `src/`: Docusaurus 站点代码、主题覆盖和 React 组件。
- `static/`: 原样复制到构建输出的图片、下载文件等静态资源。
- `data/xaction/`: 组合动作模块的机器可读元数据，供同步器、校验器和 AI 使用。
- `tools/xaction-docs/`: 从 Quicker 导出结果同步和校验模块文档的工具。

组合动作文档更新后，除完整构建外还应运行：

```powershell
npm run docs:xaction:check
```

## 评论接入

每篇文档可在 frontmatter 中声明稳定的评论标识：

```md
---
quickerDocKey: v2/install/windows
comments: true
---
```

后续 QuickerWeb 提供评论挂载页后，在 `docusaurus.config.ts` 的 `customFields.quickerCommentsBaseUrl` 中填写评论页地址。
