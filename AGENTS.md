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
- Agent Skills 权威目录为 **`.agents/skills/`**（Cursor / Codex 均可发现）。`.cursor/skills/` 仅保留兼容桩，勿在桩里维护正文。单篇文档改写入口见 `.agents/skills/docs-page-rewrite/`（**正文 + 换图 + 示例动作**；无图也要跑 `body-rewrite`）。截图→组件流程见 `.agents/skills/docs-img-to-component/`（含 `focusKeys`、**尽量还原场景**；OCR 自动探测，不可用则读 `data/screenshot-replace/ocr/` 或 agent 看图）。分享动作链接→步骤定义见 `.agents/skills/docs-example-action/`。从 Quicker 主仓抽 UI/样式到文档预览见 `.agents/skills/docs-port-quicker-ui/`。改写默认一次一篇，做完后问用户指定下一篇。（注：`.agents/` 与 `.cursor/` 已列入 `.gitignore`，仅在本地环境维护，不随仓库分发。）

## 信息架构与内容组织

- 顶层职责清晰分流：区分「入门与安装」（`docs/v2/install/`、`docs/v2/getting-started.md`）、「日常功能使用」（`docs/v2/features/`）、「动作编写」（组合动作 `docs/v2/xaction/` 与脚本动作 `docs/v2/script-action/`）、「从 1.x 升级」（`docs/v2/migration/` 与 `docs/v2/what's-new/`）和「更新记录」（`docs/release-notes/`），不在日常主教程里大段混写 1.x 历史对比或版本号流水账。
- 入口页与侧边栏保持一致：「功能使用」入口页（`docs/v2/features/index.md`）与侧边栏（`docusaurus.config.ts` 的 `sidebarItemsGenerator`）统一按 5 个用户任务分组（`运行动作与整理入口`、`管理与保护动作`、`日常工具`、`AI 与外部连接`、`账号与设置`）；「组合动作」子目录顺序固定为 **教程与实践 → 基础与进阶概念 → 模块参考**。
- 按用户任务拆页，入口保持常青：大专题按用户实际查找的任务拆分为独立页面（例如截图、OCR、桌面录屏、贴图窗口、采集历史各自成页）；首页、功能入口页和 `v2/xaction` 首页只放导览定位，不堆积“近期新增步骤”等历史列表（版本增量归入 `docs/release-notes/`，回退/降级风险集中到 `docs/v2/migration/upgrade-and-rollback.md`）。
- 概念分层与术语统一：动作编写选型采用两层表达（先区分动作类型「组合动作」与「脚本动作（C#）」，再在组合动作内部按需介绍运行 C# / 自动化脚本 JS 步骤）；全站统一使用当前正式名称（如「Quicker 截图」、步骤名称「交互截图」），及时清理已取消的早期内部实验特性（如网页版 AI、网页动作设计器）。

## 文档编写

- 所有文档页仅显示当前更新时间，由 Docusaurus 读取该文件的 Git 最后提交时间，随发布自动更新；不要手写 `last_update.date`。`legacyContentUpdatedAt` 仅作为迁移历史元数据保留，不在页面显示。正式构建使用 `npm run build`，其 `prebuild` 会在浅克隆环境补齐 Git 历史；开发预览中的日期由 Docusaurus 模拟，准确日期以生产构建为准。
- 用户文档优先写在 `docs/` 下，按产品功能和用户任务组织目录。
- 文档面向最终用户，说明可见行为、操作步骤、限制、风险和排障方式；不要写成内部代码 diff。
- 使用指南采用「当前功能正文 + 页末简短历史变化」结构：正文以当前已发布、可核实的版本为准，按用户任务说明完整操作，不混入尚未发布的开发行为，不要求读者通过历次更新拼出当前规则。更新记录、迁移指南等历史专题不受此结构限制。
- 正文不按版本组织标题，不反复使用「某版本起新增」「原先……现在……」或穿插已修复问题。更新功能时，直接修订对应操作、入口和限制，并合并重复说明；不能只删除版本号而保留零散的补丁式叙述。确实影响读者能否使用功能的最低版本要求，可在相关位置简短注明。
- 有相关历史变化的功能使用页，在文档末尾设置 `## 历史版本相关变化`，按版本从新到旧简列与本页直接相关、对用户仍有查阅价值的重要变化；每项采用「版本号：一句话说明变化」并尽量链接对应更新记录。只保留重要能力、入口或行为变化，不搬入完整更新日志、内部实现细节和已无使用影响的修复流水账；条目过多时合并同一版本或同一主题的变化，更早详情链接更新记录，无相关记录时不建空章节。
- 页末历史列表仅用于追溯，不承载当前操作步骤；历史条目应明确描述当时发生的变化，避免用户或 AI 将旧行为当作当前规则。版本号与变化必须有现有更新记录、代码或实际发布证据，不凭推测补写。发布新功能时同步维护当前正文和全站更新记录，仅在有查阅价值时补充页末摘要。
- 必要时结合对应项目源码核实信息：当现有文档、更新记录或截图不足以确认，或彼此冲突时，核查相关界面、配置默认值、行为逻辑和测试；涉及历史变化时，结合对应发布版本的标签或提交记录确认。源码中的开发改动不等于已发布功能，须核对发布范围；无法确认的信息应明确标记待核实，不写成确定事实。跨仓库核查前遵循路径参考及目标仓库的 `AGENTS.md`。
- 当前操作涉及删除、覆盖、同步或不可逆修改的风险，必须保留在操作附近，不得随历史说明移走。旧客户端混用、降级或重新迁移的详细兼容风险集中到迁移指南，使用正文只在相关操作旁保留必要提醒和链接；迁出或合并章节仍须按下述规则保留旧锚点兼容。
- 新增文档 front matter 建议包含：
  - `title`：页面标题。
  - `description`：搜索和分享摘要。
  - `quickerDocKey`：稳定的评论/外部映射键，尽量不要随文件路径变化。
  - `comments`：是否启用评论。
- URL 稳定性、客户端引用与锚点兼容：
  - 调整公开 URL 或高频章节标题前，先核查客户端主仓 `QuickerPc/Quicker/Domain/FeatureDocumentation.cs`、`SettingsMenuProvider.cs` 及内置模块 `HelpLink` 是否硬编码引用；若修改被客户端引用的路径，客户端单测 `AppHelperNavigationTests` 要求设置页帮助 URL 保持末尾斜杠 `/`，并需在文档站同步保留过渡兼容。
  - 拆分页面或迁出章节时，在原页挂载 `src/components/HashRedirect` 承接旧 `#锚点`；若更改整页规范 URL，在原路径保留 `unlisted: true` 的兼容重定向桩（`<HashRedirect defaultTo="..." />`）。站点构建已开启 `onBrokenLinks: 'throw'` 与 `onBrokenAnchors: 'throw'`，任何断链或缺失锚点都会阻断构建。
  - 移动、重命名或设为 `unlisted` 时，同时评估侧边栏、评论映射（`quickerDocKey`）、站内搜索和 `static/llms.txt` 的稳定性。
- 排版与媒体资源规范：
  - 中文加粗标记（`**...**`）勿将紧邻的闭合句读包含在内，修改正文后可通过 `npm run docs:emphasis:check`（或 `node tools/fix-cjk-emphasis.mjs`）检查修正。
  - 界面示例优先使用站内静态/交互预览组件（并保持 `npm run docs:screenshot:check` 零 error、零 warning）；真实桌面或第三方软件画面使用静态截图，图片优先就近存放于文档同级 `img/` 目录并用相对路径 `./img/xxx.png` 引用。多篇共用的图或全局示意图才放 `static/img/`（绝对路径 `/img/...`）；附件或下载文件放 `static/files/` 或 `static/downloads/`。一律使用清晰、稳定的小写英文文件名。
  - 短时操作演示（`.mp4`，建议 4–12 秒无声 H.264 循环短片）优先使用外部对象存储或 CDN 托管，避免大量大体积视频进入 Git 历史拖慢克隆与发布；1 分钟以上完整演示视频继续使用 `<BilibiliPlayer />`。

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

## 组合动作模块文档

- `docs/v2/xaction/modules/` 是用户可见的模块页，页面身份以 `moduleKey` 和 `quickerDocKey` 为准，不依赖中文标题或分类目录。
- 模块页中 `{/* xaction-metadata:start/end */}` 标记之间是程序元数据生成区，不要手工修改；使用说明、示例、限制和排障写在标记之外。
- `data/xaction/` 是 AI 和校验器使用的结构化事实源。参数 Key、类型、默认值、枚举和显示条件以这里的数据为准，不根据旧截图猜测。
- 同步新版本时使用 `tools/xaction-docs/` 的脚本和说明。增量同步可省略 `--legacy`（不覆盖概念/教程页）。同步后至少运行 `npm run docs:xaction:check`、`npm run docs:xaction:test` 与 `npm run build`。
- 也可在 `QuickerOrg/Quicker` 用 Actions「Docs xaction sync」手动触发：`check` 对照模块漂移，`import` 向本仓开 PR。不要推 `main`。
- 旧版正文迁入后默认标记为 `migrated-unreviewed`。只有核对当前代码、实际界面或真实运行结果后，才能改为 `reviewed` 或 `verified`。
- 新增、删除、改名或共享帮助页属于需要判断的兼容性变化。同步工具不得自动删除旧页面或覆盖人工正文。

## 知识包导出与 AI 检索支持

- 构建插件 `plugins/docs-service-export/index.js` 会在 `.cache/docs-service/` 生成供知识服务与 AI 检索消费的数据包（`catalog.json`、`articles.json`、`chunks.json`、`manifest.json`）。在 `schemaVersion: 1` 下，`manifest.json` 的 `revision` 必须保持仅按 `catalog.json + articles.json` 字节拼接计算的 v1 协议，`chunks.json` 作为向后兼容的扩展文件输出。
- 文章身份（`contentType`、`authority`、`appliesToVersion`）由 `classifyArticle` 生成并支持在 front matter 中显式覆盖：默认优先按物理源文件路径（而非兼容旧 `slug`）判定，且非 `what's-new` / `release-notes` 下的 `/troubleshooting`、`/faq` 优先于通用 `features/ → guide` 归为 `troubleshooting`。放在 `migration/` 等目录但实际面向 V2 日常使用的指南（如 `upgrade-and-rollback.md`、`load-action-page.md`、`services-and-models.md`），必须在 front matter 显式声明 `contentType: guide`、`authority: canonical`、`appliesToVersion: V2`。
- 组合动作模块页通过 `plugins/remark-xaction-ssr-meta.js` 与 `XActionModuleMetaSsr` 注入完整静态参数与枚举表（不得截断选项列表），以保证站内搜索与知识包完整可读。在正文中新增自定义 MDX 组件时，必须同步在 `plugins/docs-service-export/index.js` 的 `expandKnownComponents` 注册文本展开逻辑并补充单测，保持导出 `0 diagnostics`。
- 新增、拆分或变更权威公开文档 URL 后，运行 `node tools/generate-llms-txt.mjs` 更新 `static/llms.txt`（`unlisted: true`、`draft: true`、归档及 `v2/what's-new/` 兼容页会自动跳过）。
- AI 生成 V2 组合动作 JSON 的规则示例与校验见 `data/xaction/ai-action-json-examples.md` 与 `npm run docs:xaction:validate-json`：需明确区分 `$=` 表达式、`$$` 文本插值、`{ "VarKey": "..." }` 变量引用与普通字面量 `{ "Value": "..." }`，仅 `Enum` 类型按选项做封闭枚举限制，带预设下拉的 `Text` / `Number` 参数允许自由文本或表达式。

## 依赖与功能选型

- 当前项目使用 npm 和 `package-lock.json`，不要混用 Yarn 或 pnpm，除非用户明确要求。
- 新增搜索、评论、CMS、可视化编辑器或部署相关依赖前，先说明方案、成本、数据归属和维护风险，再修改。
- 外部服务密钥、上传口令、评论系统凭据等敏感信息不得写入源码、文档示例或提交历史。

## 部署与发布

- 正式域名目前由 Jenkins 任务 `docs.getquicker.net` 构建后通过 MSDeploy 发布到 IIS；Cloudflare Pages（项目名 `docs-getquicker-net`）另有独立构建，不能仅凭 Pages 部署成功认定正式站已生效。
- 正式地址为 `https://docs.getquicker.net`，默认 Pages 地址为 `https://docs-getquicker-net.pages.dev`。
- Jenkins 与 Cloudflare Pages 均连接 GitHub 仓库 `QuickerOrg/docs.getquicker.net`，正式发布分支为 `main`；推送后需检查 Jenkins 构建及正式域名的实际产物。
- Cloudflare Pages 使用 Docusaurus 预设，构建命令为 `npm run build`，构建输出目录为 `build`，根目录为空，目前不需要额外环境变量。
- 本项目不使用 `npm run deploy` 发布生产站，也不需要 GitHub Pages 的 `static/CNAME`。
- 未提交或未推送的本地修改不会进入生产站。未经用户明确要求，不要为触发部署而提交或推送。
- 部署成功后至少验证首页、一个深层文档页面、更新记录页面和 404 页面。

## 验证

- 只改少量文字且不影响链接、路由、侧边栏、front matter 时，可以不跑完整构建，但最终要说明未验证。
- 改动 `docs/` 中的路径、链接、front matter、MDX 语法、`sidebars.ts`、`src/`、`plugins/`、`docusaurus.config.ts` 或文档工具脚本后，优先运行全量静态检查与生产构建：

```powershell
npm run check:all
npm run build
```

- 改动影响目录组织、模块检索、搜索配置或知识包导出逻辑时，构建完成后继续运行 24 题检索回归基准（覆盖站内 Lunr 与知识包 Pack）：

```powershell
node tools/search-eval/eval.mjs --compare plans/search-eval-baseline.json --strict
```

- 如果构建或校验失败，要区分本次改动、既有仓库状态、依赖安装问题和环境问题。

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
