# docs.getquicker.net Codex 工作规则

本文适用于本仓库及其子目录。更深层目录若存在自己的 `AGENTS.md`，以更深层规则为准。系统、开发者和用户当轮明确指令优先级更高。

## 基本沟通

- 默认使用中文沟通，新增文档也默认使用中文。
- 修改前先看当前文件、项目配置和 `git status --short`，不要只凭历史记忆或外部工具说明判断。
- 保持变更范围小而可验证，不做无关格式化、无关重构或顺手清理。
- 最终回复简洁说明：改了什么、涉及哪些文件、做了什么验证、还有什么未验证或风险。

## 项目结构

- 这是 Quicker 文档站，基于 Docusaurus 3、TypeScript 和 npm。
- `docs/` 保存用户可见的 Markdown/MDX 文档内容。
- `src/` 保存站点代码、主题覆盖、组件和全局样式，不放普通文档正文。
- `static/` 保存需要按原路径复制到站点根目录的图片、附件、下载文件等静态资源。
- `docusaurus.config.ts` 是站点主配置，`sidebars.ts` 是文档侧边栏配置。
- 当前文档路由使用 `routeBasePath: '/'`，让 `docs.getquicker.net` 根路径直接显示文档。不要为了兼容编辑器或工具擅自改成 `/docs`，除非用户明确同意。

## 文档编写

- 用户文档优先写在 `docs/` 下，按产品功能和用户任务组织目录。
- 文档面向最终用户，说明可见行为、操作步骤、限制、风险和排障方式；不要写成内部代码 diff。
- 新增文档 front matter 建议包含：
  - `title`：页面标题。
  - `description`：搜索和分享摘要。
  - `quickerDocKey`：稳定的评论/外部映射键，尽量不要随文件路径变化。
  - `comments`：是否启用评论。
- 移动或重命名文档时，要考虑链接、侧边栏、评论映射和搜索索引的稳定性。
- 图片优先就近存放：放在文档同级的 `img/` 目录，用相对路径 `./img/xxx.png` 引用，便于和文档一起移动、删除并在构建时校验。多篇共用的图或全局示意图才放 `static/img/`（绝对路径 `/img/...`）；附件或下载文件放 `static/files/` 或 `static/downloads/`。一律使用清晰、稳定的小写英文文件名。

## 站点代码与样式

- 全局样式优先修改 `src/css/custom.css`。
- Docusaurus 配置优先修改 `docusaurus.config.ts`，侧边栏优先修改 `sidebars.ts`。
- 自定义 React 组件或主题覆盖放在 `src/` 下，保持 TypeScript 类型检查通过。
- `QuickerComments` 当前是评论接入占位组件，依赖 `siteConfig.customFields.quickerCommentsBaseUrl`。不要假设后端接口已经存在；接入真实评论系统前要先确认接口、鉴权、跨域、垃圾评论和数据映射方案。
- 不要把临时脚本、抓取结果、构建产物或编辑器缓存混入文档源码目录。

## 编辑器与预览

- 常规编辑优先使用本地 Markdown/MDX 编辑器加 Docusaurus 预览。
- 本地预览命令：

```powershell
npm run start -- --host 127.0.0.1 --port 3000 --no-open
```

## 依赖与功能选型

- 当前项目使用 npm 和 `package-lock.json`，不要混用 Yarn 或 pnpm，除非用户明确要求。
- 新增搜索、评论、CMS、可视化编辑器或部署相关依赖前，先说明方案、成本、数据归属和维护风险，再修改。
- 外部服务密钥、上传口令、评论系统凭据等敏感信息不得写入源码、文档示例或提交历史。

## 部署与发布

- 生产站托管在 Cloudflare Pages，项目名为 `docs-getquicker-net`。
- 正式地址为 `https://docs.getquicker.net`，默认 Pages 地址为 `https://docs-getquicker-net.pages.dev`。
- Cloudflare Pages 连接 GitHub 仓库 `QuickerOrg/docs.getquicker.net`，生产分支为 `main`；推送到 `main` 会触发生产部署，其他分支用于预览部署。
- Cloudflare Pages 使用 Docusaurus 预设，构建命令为 `npm run build`，构建输出目录为 `build`，根目录为空，目前不需要额外环境变量。
- 本项目不使用 `npm run deploy` 发布生产站，也不需要 GitHub Pages 的 `static/CNAME`。
- 未提交或未推送的本地修改不会进入生产站。未经用户明确要求，不要为触发部署而提交或推送。
- 部署成功后至少验证首页、一个深层文档页面、更新记录页面和 404 页面。

## 验证

- 只改少量文字且不影响链接、路由、侧边栏、front matter 时，可以不跑完整构建，但最终要说明未验证。
- 改动 `docs/` 中的路径、链接、front matter、MDX 语法或 `sidebars.ts` 后，优先运行：

```powershell
npm run build
```

- 改动 `src/`、`docusaurus.config.ts`、TypeScript、依赖或主题覆盖后，运行：

```powershell
npm run typecheck
npm run build
```

- 如果构建失败，要区分本次改动、既有仓库状态、依赖安装问题和环境问题。

## Git 规则

- 不要在用户未明确要求时自动提交或推送。
- 提交前先查看：

```powershell
git status --short
git diff --cached --stat
git diff --cached --check
```

- 不要提交 `.docusaurus/`、`build/`、`node_modules/` 等生成或依赖目录。
- commit message 使用中文，并说明业务意图，不只写“修改文档”或“更新代码”。
