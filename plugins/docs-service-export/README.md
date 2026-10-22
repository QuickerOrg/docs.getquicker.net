# 本地文档知识包导出

此 Docusaurus 插件为独立文档服务导出本地只读知识包，不调用 AI、业务数据库或外部检索服务，不改变文章路由和页面正文。

## 构建与验证

在仓库根目录运行：

```powershell
node --test plugins/docs-service-export/test.js
npm run typecheck
npm run build
```

构建完成后读取 `.cache/docs-service/`：

- `catalog.json`：从生成侧栏提取目录层级和文章引用。
- `articles.json`：文章、章节、规范 URL、原始 Markdown、摘要、关键词和来源哈希。
- `manifest.json`：schemaVersion 1、构建时间、两个数据文件的 SHA-256，以及按 catalog、articles 字节顺序拼接计算的 revision。
- `diagnostics.txt`：缺少稳定键、未展开组件、图片等需要审查的诊断；不属于服务运行数据。

只有 **完整构建成功后** 的知识包可用于部署。`allContentLoaded` 先生成中间包，`postBuild` 再把图片路径映射为实际构建资源并重新计算哈希；开发预览或尚未结束的构建不能替代最终产物。知识包留在 `.cache`，不自动复制到静态站的 `build` 目录，也不自动发布 API。

更新服务时使用同一次构建的三个 JSON 文件，先复制 catalog、articles，最后替换 manifest；保留旧包以便回退。每次正式提交/合并后应重建，因为文档的 Git 更新时间也进入导出元数据。revision 是内容修订号，不是产品版本号。

## 内容边界

文章 ID 优先使用 `quickerDocKey`，缺少时采用 Docusaurus doc ID 并记录诊断；重复 ID 会使构建失败。草稿与未列出页面不导出。摘要为原文短摘录，关键词由标题、摘要分词和显式术语提取，均不是 AI 撰写内容。

模块参数组件、静态示例步骤、相关链接、流程图及面板热点可展开为文字；只解析静态字面量，不执行 MDX 脚本。未知或无法静态解析的组件保留源代码并记录诊断，因此不能把导出 Markdown 视为页面全部交互信息。代码块保留，章节与原文摘要记录来源哈希。

静态文档站仍沿用现有发布流程。本插件不触发部署；但仓库 `main` 推送可能由外部 Jenkins/Pages 自动发布，必须遵循当次用户授权范围。
