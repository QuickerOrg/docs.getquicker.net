# 逐篇处置清单（阶段 2）

本文档在改动结构前记录阶段 2 涉及页面的处置动作、主页面归属、独有保留内容与旧锚点映射，确保不丢失有效信息、不制造 404 死链。

| 原文件路径 | 处置动作 | 目标 / 主页面 | 独有信息保留与旧锚点处理 |
| --- | --- | --- | --- |
| `docs/v2/features/ai/assistant.md` | 改写并拆分 | 本页为主页面（保留 `/v2/features/ai-and-agent` 与原 `quickerDocKey`） | 按任务重组桌面工作台、编写与修改动作、窗口背景与权限安全；保留仍影响操作的兼容/同步风险提醒；文末保留迁出专题链接。已迁出章节的所有入站 `#anchor` 全仓同步改指新子页 |
| `docs/v2/features/ai/prompt-library-and-sessions.md` | 新建（拆分） | 本页为专题主页面 | 承接提示词库、会话历史、工作目录恢复、字号与保存回复图片及原锚点 `#prompt-library-2340`、`#conversation-history-2340`、`#workspace-recovery-2341`、`#assistant-font-2337`、`#conversation-reference-2336`、`#save-reply-image-2329`、`#session-recovery-2326` |
| `docs/v2/features/ai/mcp-and-external-agents.md` | 新建（拆分） | 本页为专题主页面 | 承接外部助手连接、MCP 自动配置与 HTTP 连接、API 授权、工具额度与 MCP 附加功能及原锚点 `#tool-budget-and-mcp-2331`、`#2313--桌面入口与-mcp-接入` |
| `docs/v2/features/ai/index.md` | 改写 | AI 使用目录索引页 | 补充两篇新拆专题页卡片入口 |
| `docs/v2/features/screenshot/capture-pro.md` | 改写并拆分 | 本页为主页面（保留原 URL 与 `quickerDocKey`） | 聚焦截图 Pro 选区、标注、工具栏、设置与快捷键；保留仍影响操作的兼容/同步提示与 `#capture-*`/`#win-alt-capture-2337`/`#toolbar-layout-2322`/`#截图-pro-设置页` 等原锚点 |
| `docs/v2/features/screenshot/ocr.md` | 新建（拆分） | 本页为 OCR 专题主页面 | 承接文字识别、在线表格识别、OCR 历史与校对及原锚点 `#hybrid-table-2336` 等 |
| `docs/v2/features/screenshot/recording-and-pin.md` | 新建（拆分） | 本页为录屏与贴图专题主页面 | 承接桌面录屏、录屏编辑与智能缩放、贴图窗口与清晰度及原锚点 `#recording-2331`、`#recording-edit-2333` 等 |
| `docs/v2/features/screenshot/index.md` | 改写 | 截图与贴图概览页 | 补充 `ocr.md` 与 `recording-and-pin.md` 导航链接，更新 `#anchor` 指向 |
| `docs/release-notes/index.md` | 改写并归档 | 本页保留近期主索引 | 保留「升级前先看」与 `2.3.x` 全量更新记录；底部链接至 `archive-2-1-2-2.md` |
| `docs/release-notes/archive-2-1-2-2.md` | 新建（归档） | 早期记录归档页 | 承接 `2.2.x` 与 `2.1.x` 历史补充记录 |
| `docs/v2/migration/new-main-win/load-action-page.md` | 移动（收拢） | `docs/v2/migration/load-action-page.md` | front matter 显式保留原 `slug: /v2/migration/new-main-win/load-action-page` 与原 `quickerDocKey`，删除多余单页子目录，更新引用路径 |
| `docs/v2/what's-new/new-main-win/usage.md` | 改写（兼容差异页） | 主说明为 `docs/v2/features/action-panel/usage.md` | 保留原 URL 与 `#双击导航栏` 锚点及 1.x→V2 面板切换差异要点，长篇日常操作引导至主文档，标题区分 `（V2 变化）` |
| `docs/v2/what's-new/new-main-win/faq.md` | 改写（兼容差异页） | 主说明为 `docs/v2/features/action-panel/faq.md` | 保留原 URL、迁移动作页 FAQ 要点，引导日常 FAQ 至主文档，标题区分 `（V2 变化）` |
| `docs/v2/what's-new/new-main-win/action-drafts.md` | 改写（兼容差异页） | 主说明为 `docs/v2/features/action-panel/action-drafts.md` | 保留原 URL 与相对 1.x 差异，正文引导至主文档，标题区分 `（V2 变化）` |
| `docs/v2/what's-new/others/*.md`（10 篇触发器） | 改写（兼容差异页） | 主说明为 `docs/v2/features/triggers/*.md` | 保留原 URL、`quickerDocKey` 与被引用锚点（如 `circle-menu.md#覆盖粘贴与跨场景剪切`），提炼相对 1.x 演进差异，标题区分 `（V2 变化）` |
| `docs/v2/features/{basic-actions,quick-operations,context-menu,action-history,action-recyclebin,search,settings,license,remote-files}.md` | 保留（补排序） | 本页为主页面 | 补齐 `sidebar_position`，消解 `position: 45` 冲突，正文与 URL 不变 |
