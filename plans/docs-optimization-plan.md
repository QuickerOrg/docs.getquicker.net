# Quicker 文档站现状分析与全局优化方案（v2）

- **版本说明**：v2（定稿，已补齐默认状态回退顺序、契约字段范围、前置检索基线、静态回归要求与正文噪声清理）
- **基准日期**：2026-11-22
- **文档仓基线**：`main` 分支 `ada8c5f`（Quicker V2 文档已同步至 2.3.45，`data/xaction/catalog.json` 生成于 `2026-11-22 17:10:45`）
- **客户端源码基线**：`QuickerOrg/Quicker`（`dev/v2` 分支，提交 `52f4959a19`，与 `data/script-action/coverage.json` 记录的 `sourceCommit` 一致）
- **文档定位**：横跨 `docs/`、`data/`、`src/`、`plugins/`、`tools/`、`static/` 与 `.github/workflows/` 的全局治理方案，存放于独立顶层 `plans/` 目录，不进入 Docusaurus 用户文档与知识包构建。

---

## 一、现状基线与优势

### 1.1 仓库规模快照

| 目录 | 规模与构成 | 说明 |
| --- | --- | --- |
| `docs/` | 454 篇 `.md`（0 篇 `.mdx`）、836 个媒体文件（66.80 MB）、39 个 `_category_.json` | PNG 801 张（59.55 MB）、GIF 32 张（7.23 MB）、JPEG 2 张（0.02 MB）、SVG 1 张 |
| `data/` | 1,106 个文件（6.00 MB） | 176 个组合动作模块、84 页脚本动作契约（22 域 / 235 方法 / 57 类型）、16 个 Bridge 宿主、截图替换台账与审核数据、步骤渲染目录与图标包 |
| `src/` | 115 个文件（0.62 MB） | 25+ 个交互预览组件（`<ModuleParamPreview>` 共 430 处：117 处单属性 + 313 处多属性；`<XActionModuleMeta>` 176 次、`<StepProgramView>` 91 次、`<ActionEditorPreview>` 19 次、`<RelatedDocs>` 210 次、`<ShareLinkCard>` 124 次） |
| `plugins/` | 4 个自研 Docusaurus 插件（8 个文件） | `doc-gallery.js`、`prefetch-previews.js`、`dev-local-search/`、`docs-service-export/` |
| `tools/` | 35 个受版本控制工具（另有被忽略的 `tools/temp/` 116 个文件） | 组合动作/脚本/Bridge 同步与校验、截图分类与审核 API、中文加粗修复、浅克隆 Git 历史补齐 |
| `static/` | 27 个 Git 跟踪文件 + 69 张未跟踪封面图 | 图标、`files/script-action/` 下 9 个示例脚本、`_headers`、`.nojekyll`；`img/doc-gallery/`（7.68 MB）由本地生成并忽略 |

### 1.2 现有校验与构建产物基线

| 检查 / 产物项 | 当前状态 | 关键指标 / 发现 |
| --- | --- | --- |
| `npm run typecheck` | 通过 | `tsc` 0 错误 |
| `npm run docs:xaction:check` / `test` | 通过 | 176 个模块页面与 176 个模块 Key 对齐，显示条件与导出完整性测试通过 |
| `npm run docs:bridges:check` / `test` | 通过 | 16 个宿主、双向链接、元数据及反例校验通过 |
| `npm run docs:script:check` / `test` | 通过（8/8） | 84 页、235 个根/域方法、57 个类型；**中文说明缺项 341 项**（4 个类型 + 337 参数/字段） |
| `npm run docs:screenshot:check` | 通过（有告警） | 539 条决策（477 converted / 58 kept / 4 deferred），0 error，**10 warnings** |
| `node --test plugins/docs-service-export/test.js` | 通过（8/8） | 测试通过，但**未覆盖 313 处组件泄漏、枚举缺项与静态覆盖**，且未接入 `package.json` 与 CI |
| `node --test tools/ensure-git-history.test.mjs` | 通过（1/1） | 测试通过，但未接入 `package.json` 与 CI |
| `npm run docs:emphasis:check` | **失败（exit 1）** | 报告 11 个文件，实际 **10 个文件（12 处）为脚本正则误报**，仅 1 处真实缺陷 |
| `build/search-index-*.json` | 原始较大，压缩约 2.5 MB | 原始 **10.92 MB**（`bucket[4]` 含 3,702 条切片：`documents` 2.13 MB + `index` 7.53 MB）；实测 **gzip 2.74 MB / brotli (q6) 2.46 MB** |
| `build/assets/js/` | 局部较大 chunk | 共 865 个文件 16.11 MB；`qk-xaction-catalog.*.js` 为 **1,050.6 KB**（仅在使用工具箱模式 `<ActionEditorPreview>` 的页面按需加载，非全站必下） |
| `build/assets/images/` | 局部图片偏大 | 共 253 张 27.51 MB；最大单张 PNG 2.60 MB / 2.39 MB / 1.23 MB，最大 GIF 1.08 MB |
| `.cache/docs-service/` | 已生成 | `articles.json` 8,891.9 KB（452 篇）、`catalog.json` 24 KB、`diagnostics.txt` 6 KB（66 条） |

### 1.3 既有基础优势（改造底线）

1. **核心元数据规范**：454 篇文档 100% 具备 `title`、`description`、`quickerDocKey`（0 重复）与 `comments`（338 篇 `true`、116 篇 `false`）。
2. **文件与外链卫生度高**：0 外部图床热链、正文 0 真实失效相对图片引用（仅 `docs/contributing.md` 示例块含演示路径 `./img/download.png`）、0 大写/空格/非 ASCII 路径文件名、0 `TODO/FIXME` 占位残留。
3. **数据驱动 + 活组件预览体系成熟**：组合动作、脚本动作与 Bridge 宿主均已形成“结构化事实源（`data/`）→ 自动同步与漂移校验（`tools/`）→ 保留人工正文”的工程闭环；前端通过 `src/theme/mdxComponentsMap.tsx`、`src/theme/lazyMdxComponent.tsx` 与 `plugins/prefetch-previews.js` 实现了按需分块与 HTML `<link rel="preload">` 优化。
4. **产品迭代跟进及时**：连续覆盖至 2.3.45 并同步维护升级与回退注意事项。

---

## 二、核心问题诊断（三视角）

### 2.1 人类用户视角：找不到、理不清、被历史打断

#### 1. 侧边栏按历史演进堆叠，新老用户动线倒置
当前侧边栏一级顺序为：`V2 重要变化`（pos 10）→ `迁移`（pos 20）→ `安装、更新与卸载`（pos 30）→ `功能使用`（pos 40）→ `组合动作`（pos 50）→ `脚本动作`（pos 55）。新用户刚进入站点要先跨过大量面向 1.x 老用户的变更对比与迁移内容，才能找到安装指南与日常功能。

#### 2. 同一主题被拆入多处，入口绕路与盲区并存
- **新面板窗口分散在 3 个目录**：`V2 重要变化 → 新面板窗口`、`迁移 → 新的面板窗口`（目录下仅 1 篇 `docs/v2/migration/new-main-win/load-action-page.md`）、`功能使用 → 动作面板 / 新面板`。
- **脚本动作双轨冲突且首页/顶栏缺位**：
  - `docs/v2/features/script-actions/`（`position: 11`，侧边栏中排在「动作面板」之前）保留了 3 篇旧跳转桩页（`index.md`、`api.md`、`security.md`），均未标记 `unlisted: true`。
  - `docs/v2/features/index.md`（L27）等 6 处站内链接仍指向 `/v2/features/script-actions/`，用户点入后需二次跳转才能到达 `/v2/script-action`。
  - 反之，顶部导航栏（`docusaurus.config.ts` L189–198）和站点首页（`docs/index.md`）均未给 84 页完整的 `docs/v2/script-action/` 体系提供直达入口。
- **10 篇触发器文档平行重复**：`docs/v2/what's-new/others/` 与 `docs/v2/features/triggers/` 存在 10 个同名文件，且 `what's-new` 侧仍保留大段功能介绍，不仅双头维护困难，也让搜索列表同时出现两篇同名长文。
- **重名区分度不足**：全站共 13 组非隐藏完全重名页面（如 10 篇触发器、`本机动作暂存区`、`远程文件`、`常见问题`）。注：不同功能域下的「常见问题」本身可以合理共存，问题不在于“重名”，而在于搜索下拉和列表缺少清晰的**面包屑、摘要与内容类型**区分。

#### 3. 局部目录排序失控与分类不一致
- `docs/v2/features/` 中末尾 **8 篇基础核心文档未设置 `sidebar_position`**（`action-history.md`、`action-recyclebin.md`、`basic-actions.md`、`context-menu.md`、`license.md`、`quick-operations.md`、`search.md`、`settings.md`），按字母序垫底；同时 `remote-files.md` 与 `screenshot/` 同时占用 `position: 45`。
- 组合动作侧边栏有 13 个模块分类（其中 `docs/v2/xaction/modules/waiting/` 仅含 1 篇 `waitwindow.md`），而落地页组件 `src/components/XActionLanding/index.tsx`（L59–132）只列出 12 张分类卡片，遗漏了「等待」分类。

#### 4. 跨文档事实冲突与重复公告维护
- **ARM64 支持事实冲突**：`docs/v2/install/windows.md`（L20）已更新为“2.3.31 起提供 **x64** 和 **ARM64** 原生安装包”，但 `docs/v2/what's-new/index.md`（L25、L42）、`docs/v2/what's-new/not-supported.md`（L27）与 `docs/v2/troubleshooting.md`（L19）仍写“正式版本仅提供 x64 / 只提供 x64”。
- **全局状态提示靠人工复制**：Preview 体验版与专业版限制提示在 6 篇以上正文头部手工粘贴，策略变化时极易漏改。

#### 5. 正文混杂纯历史演进，且部分超长页面不利于任务查找
- 排除 `docs/release-notes/` 和 `docs/v2/migration/upgrade-and-rollback.md` 后，全站有 161 篇正文出现 732 处 `2.x.x 起 / 版本 / 新增` 表述，重灾区包括 `docs/v2/features/screenshot/capture-pro.md`（1,026 行 / 87.6 KB，110 处）、`docs/v2/features/ai/assistant.md`（694 行 / 72.0 KB / 43 个 H2，67 处）与 `docs/v2/features/action-panel/usage.md`（421 行 / 31.7 KB，40 处）。
- **需注意区分合法保留与冗余**：多设备混用、旧动作兼容、数据覆盖风险以及必要最低版本限制，往往直接影响用户当前的操作决策，属于应**紧邻操作保留**的有用信息；真正干扰阅读的是**纯历史演进与已退役旧入口**穿插在功能主流程中。此外，`chromecontrol.md`（1,373 行）、`release-notes/index.md`（77.0 KB）与 `upgrade-and-rollback.md`（62.0 KB）篇幅仍在增长，需要按恰当维度拆分。
- **正文残留编辑过程备注**：全站 34 篇组合动作模块页共残留 **82 处「旧稿未写」** 编辑注记（多紧跟在参数行为说明之后），直接干扰阅读。

#### 6. 站内检索对模块标识与参数存在盲区
以“索引文本是否收录标识符”口径统计 `build/search-index-*.json` 中 176 个组合动作模块：
- 模块 Key（如 `sys:notify`）：**0 / 176（0.0%）** 收录；
- 输入参数 Key（如 `placement`）：**47 / 1,943（2.4%）** 收录；
- 输入参数中文名：**1,145 / 1,943（58.9%）** 收录（15 个模块页 0 个输入参数名收录）；
- 输出变量中文名：**630 / 816（77.2%）** 收录。

根因是 `<XActionModuleMeta>` 采用纯客户端懒渲染且 `docusaurus.config.ts` 排除了 `.qk-docs-preview`。需要注意：上述数字反映的是**索引文本收录率，而非真实查询的召回率和排名**，实际改进效果须通过固定问题集查询脚本验证。

#### 7. 四类自动化选型引导不足
Quicker V2 现有 4 种自动化实现方式（组合动作、脚本动作 C#、组合动作中“运行 C# 代码 / C# 文件应用”步骤、组合动作中“自动化脚本 (JS)”步骤），目前首页与 `docs/v2/getting-started.md` 缺少一张直观的选型决策表。

---

### 2.2 AI 使用视角：静态抓空、知识包失真与生成契约缺口

#### 链路 A：外部 AI 与搜索引擎抓取
1. **核心模块与交互教程静态 HTML 空壳化**：`build/v2/xaction/modules/notify/index.html` 在构建产物中包含 5 个空的 `qk-docs-preview-fallback` 占位 div，无参数表、无参数 Key、无示例配置；`build/v2/xaction/guides/helloworld/index.html` 含 6 个空占位符。不执行客户端 JS 的外部爬虫或 AI 抓取器看不到真实参数契约。
2. **机器入口与抓取礼仪的边界**：目前缺少公开静态正文/Markdown 或 `llms.txt` 导航索引，但 **`llms.txt` 仍属社区提案（`llmstxt.org`），且在页面本身还包含空预览 div 时提前上 `llms.txt` 无法补齐事实**；另 `robots.txt` 与内容索引是两回事，依据 RFC 9309，缺少 `robots.txt` 本身并不代表禁止抓取。

#### 链路 B：内置知识包（`plugins/docs-service-export/index.js` → `.cache/docs-service/`）
1. **组件展开逻辑既泄漏又制造重复**：
   - 全站 `<ModuleParamPreview>` 共 430 处：**117 处单属性调用 + 313 处多属性调用**。
   - 现有 `expandModules()`（L61）只匹配单属性 `<ModuleParamPreview moduleKey="..." />`，把这 117 处直接展开成**整张完整模块参数表**——在模块页和指南里把完整参数表复制了一遍，反而制造结构化事实重复。
   - 同时跳过带 `focusKeys`、`values`、`caption` 的 **313 处多属性调用**，且 L369 把 `ModuleParamPreview` 排除在诊断告警之外，导致静默泄漏且 `diagnostics.txt` 全无察觉。加上 `PreviewMarks`（35）、`ContextMenuPreview`（24）、`ActionEditorPreview`（19）、`VariableDefPreview`（10）等，452 篇中有 132 篇（29.2%）残留原始 JSX。
2. **模块完整契约缺失关键约束**：`moduleMarkdown()`（L42–58）仅输出了基础列与 `defaultValue`，未导出 `selections`（枚举合法值列表）、`visibleWhen` / `condition`（参数生效与显示条件）、`variableMode`、`newStepDefaultValue`（新建步骤初始值，与 `defaultValue` 混一）以及 `validForList` / `invalidForList` 等现有约束，导致下游 AI 易编造枚举值、混淆默认值或忽略前置开关条件。
3. **切片策略在末级长节处失效**：
   - 必须纠正一个常见误解：`splitSections()`（L203–235）**已经按一至六级标题（`#{1,6}`）切分**，并非未切到三级标题。实测包含三级标题的长正文依然会留下 5,000+ 字符大块（全库 4,089 块中有 44 块超过 4,000 字符，最大为 `chromecontrol` 的 22,053 字符）。
   - 真正缺少的是**标题切分后的结构感知二次分块**（在保持代码块和表格完整的前提下，结合目标检索/embedding 模型的 token 预算切分，并保留父级标题链、文章身份与原文锚点）；另有 244 个不足 50 字符的极短碎片（含旧跳转桩）。
4. **缺少正交元数据与覆盖率事实认知**：
   - 导出文章缺少拆分清楚的正交字段（内容类型、权威主页面关系、适用版本、核验状态与依据），导致旧跳转桩、平行页和含过时信息页面以相同权重进入召回。同时需明确：**Git 最后更新时间只能反映提交时间，不能替代产品行为核验**；在 454 篇文档中，除了 `docs/v2/xaction/` 下已标记为 `migrated-unreviewed` 的 7 篇（另有 201 篇 `reviewed`、6 篇 `generated`）外，全站仍有 **240 篇文档未标 `docStatus`**（`features/` 67、`script-action/` 109、`what's-new/` 44 等）。
5. **关键词噪音**：`searchKeywords()`（L248–262）提取结果包含 `'一条'`、`'自己'`、`'不用'` 等停用词噪音，对模块 Key 与核心英文参数 Key 的收录也不够稳定。

#### 链路 C：AI 辅助编写动作（组合动作 JSON 与 C# 脚本）
1. **动作 JSON 语法定位与生成源头错位**：
   - 动作参数绑定存在三种明确语义，不可混淆：**`$=` 为表达式**、**`$$` 为文本插值（内部可引用 `{变量名}`）**、**`VarKey` 为直接绑定动作变量**。
   - `data/xaction/ai-action-json-guide.md`（57 行）由 `tools/xaction-docs/sync.mjs`（L1143–1145）直接从 Quicker 导出目录覆盖写入；仅修改文档仓内的该文件会在下次同步时丢失，**必须从客户端主仓（`QuickerOrg/Quicker`）的导出源或生成流程修改，或另立独立补充文件**。
   - **校验层次**：JSON Schema 只能校验语法结构，模块 Key 是否存在、参数名/类型/枚举是否合法、变量引用与条件依赖等需要**语义校验**，更可靠的是补齐**真实导入验证**。
   - 此外，1.42 MB 的 `data/xaction/catalog.json` 不适合直接装入 Agent 上下文，缺少两阶段查找用的轻量目录索引。
2. **脚本动作参考缺口**：`data/script-action/coverage.json` 仍有 341 项缺失中文说明（4 个类型 + 337 参数/字段），且跨多域编写脚本时缺少单文件紧凑 API 签名概览。

---

### 2.3 工程质量、CI 与运行性能

#### 1. `tools/fix-cjk-emphasis.mjs` 存在高危正则 Bug
`tools/fix-cjk-emphasis.mjs`（L59）使用 `/\*\*([^*\n]+?)\*\*(?=\S)/g`，未追踪行内 `**` 的开闭状态，同行多段加粗且前一段后有空格时会跨段错配。当前 `docs:emphasis:check` 失败的 11 个文件中，**10 个文件（12 处）均为误报**，仅 `docs/v2/migration/from-v1.md` 第 17 行是真实问题。全库当前 0 处历史破坏，但若不先修复脚本就运行 `--apply`，会直接写坏 10 篇正常文档。

#### 2. CI 门禁覆盖残缺与断链配置偏松
- `.github/workflows/` 仅有两个局部路径触发的检查（`xaction-check.yml` 用 Node 20、`script-docs-check.yml` 用 Node 22），修改普通 `docs/`、`src/`、`plugins/` 或全局配置时无通用 PR/`main` CI 跑 `typecheck` 和 `build`；`plugins/docs-service-export/test.js`、`tools/ensure-git-history.test.mjs`、`docs:emphasis:check`、`docs:screenshot:check` 也均未入 CI。
- `docusaurus.config.ts` 未将 `onBrokenAnchors` 和 `markdown.hooks.onBrokenMarkdownLinks` 设为 `'throw'`。

#### 3. 性能与资产体积评估口径需实测修正
- **搜索索引**：`build/search-index-*.json` 原始 10.92 MB 不等于实际传输量，**gzip 为 2.74 MB、brotli (q6) 为 2.46 MB**。问题重点在于 `src/clientModules/prefetchSearchIndex.ts` 在所有生产页面空闲时无弱网/省流守卫即自动下载、缺少加载时机控制与首次搜索延迟实测，且第 20 行直接 `import('@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js')` 耦合第三方包内部路径。
- **目录 chunk**：`build/assets/js/qk-xaction-catalog.*.js`（1,050.6 KB）并非每页加载，仅在渲染工具箱模式 `<ActionEditorPreview>`（全站 19 处）时按需触发，但该组件仅需 `key / name / description / category` 4 个字段，完全没必要拉取全量 `data/xaction/catalog.json`（1.42 MB）。
- **图片体积**：`build/assets/images/` 中保留图片最高达 2.60 MB（PNG）与 1.08 MB（GIF），存在无损/轻量压缩空间。

#### 4. IIS 部署需先观测再决策（严防 500.19）
- `static/_headers` 仅对 Cloudflare Pages 生效，仓库 `static/` 中未见 IIS `web.config`（却保留了 GitHub Pages 的 `static/.nojekyll`）。
- **但仓库没有 `web.config` 不代表生产 IIS 没有配置缓存或压缩**：IIS 往往在服务器/站点的全局配置层配置了压缩与缓存，且某些配置节在全局锁定；如果未经调查直接在仓库新增 `static/web.config` 覆盖锁定配置节，反而会导致正式站直接报错 **HTTP 500.19**。必须先查生产环境响应头、IIS 继承配置、已安装模块与 MSDeploy 行为再做决策。

#### 5. 截图替换与资产清理收尾未闭环
- `docs/` 中跟踪的 836 张图里，有 **545 张（38.13 MB）** 不再被任何 Markdown 正文引用（主要因 `/lab/screenshot-review` 对比而保留；注：`docs/v2/what's-new/actions/assets/img/image.png` 实际通过 MDX `require(...)` 被引用，属于在用图片）。需注意：删除任何旧图前，不仅要查 Markdown 正文，还必须核查 **MDX `require(...)`、React 组件源码、审核工具数据（`data/screenshot-review/`）、替换台账（`tools/screenshot-replace/`）和知识包导出插件引用**。
- `data/screenshot-replace/decisions.json` 含 10 条 `kept` 告警（原图片已不再被正文引用）和 4 条 `deferred`（`managelist-003/004` 缺 `ManageListPreview`、`custompanel-018/019` 缺重型折叠/拖窗动画组件，属于合理暂缓，不应强行清零）。另有 2 处确认的孤立残留：`docs/v2/install/img/example-placeholder.svg` 与主仓空目录 `docs/assets/`。

#### 6. 协作文档漂移
- `AGENTS.md` 声明 `.agents/skills/` 为权威目录，但 `.gitignore` 忽略了 `.agents` 与 `.cursor`；`CLAUDE.md`（L22）仍写“本站没有测试套件”。

---

## 三、分阶段改进方案（调整后优先级）

> **执行原则**：先修硬伤与阻塞入口 → 用单主题试点立规矩再铺开 → 修好知识包事实与检索闭环 → 最后做独立工程优化与资产清理；**基础 CI 与测试保障贯穿并行**。

### 并行基础轨：CI 与工程守卫（随时并行推进）

| 任务项 | 涉及文件 | 具体改动方案 | 验收标准 |
| --- | --- | --- | --- |
| P.1 修复加粗脚本与真实缺陷 | `tools/fix-cjk-emphasis.mjs`、`docs/v2/migration/from-v1.md`（L17）、新增单元测试 | 改写 `fixEmphasisChunk` 为逐行配对开闭 `**` 的扫描器（跳过围栏代码块与行内代码），补充“同行多段加粗 + CJK 标点”单测用例；手工修复 `from-v1.md` L17 唯一真实缺陷 | 新增单测通过；`npm run docs:emphasis:check` 在 0 误报前提下返回 EXIT 0 |
| P.2 建立统一 CI 门禁 | `.github/workflows/ci.yml`（新增）、`.github/workflows/xaction-check.yml`、`package.json`、`docusaurus.config.ts` | 新增覆盖 PR 与 `main` 的统一 CI（统一 Node 22），执行 `typecheck`、全量 `check`/`test`（将 `plugins/docs-service-export/test.js`、`tools/ensure-git-history.test.mjs`、`emphasis:check`、`screenshot:check` 汇总入 `package.json`）及 `npm run build`；渐进将 `onBrokenAnchors` 与 `markdown.hooks.onBrokenMarkdownLinks` 升为 `'throw'` | 所有 PR 强制跑通 `typecheck`、单测、一致性校验与完整构建 |
| P.3 对齐协作说明 | `AGENTS.md`、`CLAUDE.md`（L22） | 明确 `.agents/skills/` 的本地私有来源或受控方式；更新 `CLAUDE.md` 补充现有校验与单测体系 | 协作说明与仓库实际结构 100% 一致 |

---

### 阶段 1：立即止血（事实矛盾、绕路入口与编辑残留）

| 任务项 | 涉及文件 | 具体改动方案 | 验收标准 |
| --- | --- | --- | --- |
| 1.1 消除 ARM64 跨文档矛盾 | `docs/v2/what's-new/index.md`（L25, L42）、`docs/v2/what's-new/not-supported.md`（L27）、`docs/v2/troubleshooting.md`（L19） | 统一更新为“提供 x64 与 Windows ARM64 原生安装包，不再支持 32 位（x86）Windows”，与 `docs/v2/install/windows.md` 对齐 | 仅保留特定能力（如在线表格识别首版）的 x64 限制，架构总述无矛盾 |
| 1.2 收拢脚本动作绕路入口并补首页/顶栏入口 | `docs/v2/features/script-actions/{index,api,security}.md`、`docs/v2/features/index.md`（L27）等 6 处入链、`docs/index.md`、`docusaurus.config.ts`（L189–198） | 为 `features/script-actions/` 3 篇旧跳转桩添加 `unlisted: true`；将站内 6 处入链改指 `/v2/script-action`；在顶栏与首页增补「脚本动作」入口 | 旧 URL 保持兼容可访，侧边栏/搜索不再重复出现，首页和顶栏一跳直达 84 页脚本动作 |
| 1.3 清理正文过程备注并抽离共享公告 | 含「旧稿未写」的 34 篇文档（如 `docs/v2/xaction/modules/clipboard/*.md`）、含重复 Preview 公告的页面 | **删除全站 34 篇文档中的 82 处「旧稿未写」编辑过程备注，完整保留其前面的参数行为说明**；将多次复制粘贴的 Preview 公告抽为共享局部组件/片段 | 全仓「旧稿未写」清零且无行为说明误删；Preview 公告实现单处维护 |
| 1.4 清理确认无引用的孤立资源残留 | `docs/v2/install/img/example-placeholder.svg`、主仓空目录 `docs/assets/` | 在全链路确认（Markdown + MDX `require` + 组件 + 导出插件 + 台账）无引用后清理孤立残留与空目录 | 孤立残留清理干净，构建无影响 |

---

### 阶段 2：建立检索基线 + 单主题试点与逐篇处置清单

| 任务项 | 涉及文件 | 具体改动方案 | 验收标准 |
| --- | --- | --- | --- |
| 2.0 建立固定问题集与检索基线 | 新增固定问题集与可复跑查询脚本、`tools/` 或测试目录 | 在修改导航、合并和拆分页面之前，先行固化典型问题集并保存当前本地搜索（lunr）与知识包检索基线结果，以便后续每批改动逐批比较 | 具备可复跑基准脚本与对照快照；明确目标：**操作问题主说明进入前 3；模块 Key 查询目标页排第 1；询问当前功能时，旧兼容入口不挤占主结果** |
| 2.1 选一个主题完成试点整理 | 首选「截图与录屏」（`capture-pro.md` 等）或「AI 助手」（`assistant.md` 等） | ① **先做逐篇处置清单**（为每篇标记 `保留 / 改写 / 合并 / 兼容入口 / 归档`，写明主页面、合并去向、必须保留的独有信息、旧锚点处理方案）；② 执行写作规范：**正文描述当前支持的行为、配置分支（含非默认选项）和必要版本要求；纯历史演进移出正文；仍影响操作决策的兼容、多设备与数据覆盖风险紧邻对应操作保留**；③ **按用户任务拆分超长功能页**（发布记录继续按版本拆） | 形成可复用的逐篇处置模板、锚点映射规范与单页拆分粒度基准；试点主题无内容丢失、无断链 |
| 2.2 全站推广内容与目录重组 | `docs/v2/*/_category_.json`、`docs/v2/features/*.md`、`docs/v2/what's-new/` 平行重叠页、`docs/v2/migration/new-main-win/`、`src/components/XActionLanding/index.tsx`、`docs/index.md`、`docs/v2/getting-started.md` | 按试点模板先行输出全站重叠区逐篇处置清单，再实施：① 侧边栏按用户旅程调整为 `安装与入门 → 功能使用 → 组合动作 → 脚本动作 → 从 1.x 迁移与 V2 变化 → 更新记录`；② 补齐 `docs/v2/features/` 8 篇缺失 `sidebar_position` 与 `45` 冲突；③ 收拢 `migration/new-main-win/` 单页目录；④ 精简 `what's-new/` 平行长文为差异速览+主文档链接；⑤ 补齐 `XActionLanding`「等待」分类与侧边栏对齐；⑥ 首页与入门页增加 4 种自动化方式选型矩阵；⑦ 拆分 `chromecontrol.md`、`release-notes/index.md`（按次版本段）、`upgrade-and-rollback.md` | 每处合并都有完整处置台账与旧锚点兼容验证；搜索结果可通过**面包屑、摘要与内容类型**清楚区分（不强求机械 0 重名） |

---

### 阶段 3：知识包纠偏、静态可读性与检索闭环验收

| 任务项 | 涉及文件 | 具体改动方案 | 验收标准 |
| --- | --- | --- | --- |
| 3.1 修复 `docs-service-export` 组件展开与去重 | `plugins/docs-service-export/index.js`、`plugins/docs-service-export/test.js`（对齐 `src/components/ModuleParamPreview/StepParamFormPreview.tsx` L124） | ① **完整契约（`<XActionModuleMeta>`）**：除 `selections` 与 `visibleWhen`/`condition` 外，补充涵盖 `variableMode`、两种默认值区分（`newStepDefaultValue` 新建步骤初始值 / `defaultValue` 运行时缺省值）、`validForList`/`invalidForList` 等已有约束；无法静态判断的表达式条件显式标注“未求值”（不得推断为始终显示或隐藏）；明确界定哪些字段直接入正文、哪些通过结构化数据关联获取，不强行全部展成巨表；② **示例去重与默认状态保留（`<ModuleParamPreview>`）**：针对 117 处仅传 `moduleKey` 与 313 处多属性调用，统一按真实回退顺序 **`显式 values → newStepDefaultValue → defaultValue → 空字符串`** 生成必要的示例状态摘要（附 `focusKeys`、变量绑定及关联的完整契约引用），避免去重后丢失默认配置或混淆两种默认值；③ 移除 L369 诊断豁免，补充高频组件静态展开 | 彻底消除 313 处静默 JSX 泄漏、117 处完整参数表重复与隐含默认状态丢失；测试集覆盖默认回退顺序、契约字段边界与“未求值”标注 |
| 3.2 结构感知二次分块与正交元信息拆分 | `plugins/docs-service-export/index.js` | ① 保留 `splitSections()` 的 `#{1,6}` 标题切分，在其后增加**结构感知二次分块**（按目标检索模型 token 预算与段落结构切分，保持代码块和表格完整，继承父级标题链、文章身份与原文锚点）；② 元数据拆分为正交维度：**内容类型**、**权威主页面关系**（是否主页面 / 指向主页面 ID）、**适用版本**、**核验状态与依据**（明确 Git 时间不替代产品核验）；③ 过滤停用词并将模块 Key、参数 Key 注入 `keywords` | 不再产生被强行截断的巨型片段或失去上下文的孤立切片；消费端可准确按正交维度过滤/加权 |
| 3.3 消费端兼容性与固定问题集对照验收 | `plugins/docs-service-export/`、阶段 2.0 固定问题集查询脚本 | ① 建立消费端验收清单：正文拆分/合并后的旧文章 ID 与锚点映射兼容性、增量更新 `revision` 校验、兼容入口过滤行为；② 复跑阶段 2.0 固定问题集脚本，同时针对本地搜索（lunr）与知识包对比基线验收召回与排名 | 不再使用“文本收录率”冒充效果；满足阶段 2.0 量化排名标准（主说明进前 3、模块 Key 排第 1、旧兼容入口不挤占主结果） |
| 3.4 提升模块页静态 HTML 可读性与搜索索引 | `src/components/XActionModuleMeta/`、`src/theme/lazyMdxComponent.tsx`、`tools/xaction-docs/sync.mjs`（可选） | ① 评估在 SSR 阶段为 176 个 `<XActionModuleMeta>` 输出轻量静态语义摘要/表格（或构建期注入标准可读文本至 HTML 与本地搜索索引），使不执行 JS 的爬虫及站内搜索都能读到模块 Key、参数名/Key 与选项值；② 待静态正文或公开 Markdown 出口就绪后，评估生成 `static/llms.txt`（注明提案属性，仅做导航索引）；`static/robots.txt` 按需配置且与内容索引解耦；③ 若本阶段触及 `sync.mjs`，可顺手生成精简模块索引（~30–40 KB）供 AI 与 `ActionEditorPreview` 共用 | 静态 HTML 含完整模块参数语义，且满足三项回归要求：**① SSR 与客户端首次渲染一致（无 hydration 错误）；② 交互加载后不重复显示两份参数表；③ 新增静态内容确认进入搜索索引，不再被 `.qk-docs-preview` 规则过滤** |

---

### 阶段 4：独立工程优化与长尾内容收尾

| 任务项 | 涉及文件 | 具体改动方案 | 验收标准 |
| --- | --- | --- | --- |
| 4.1 性能实测与针对性优化 | `src/components/ActionEditorPreview/index.tsx`、`src/clientModules/prefetchSearchIndex.ts`、`docs/**/img/*` | ① **先实测**：冷/热缓存加载时机、压缩传输（`2.74 MB gzip / 2.46 MB brotli`）、JSON 解析耗时与首次搜索延迟；② 按实测瓶颈优化：用精简目录替代 `ActionEditorPreview` 导入的 1.42 MB `catalog.json`（消除 1,050.6 KB chunk）、为搜索预热加 `saveData`/交互触发守卫并去除私有包路径依赖；③ 压缩 >300 KB 的保留截图与大 GIF | 有前后对比实测报告；首次搜索延迟与非工具箱/弱网首屏流量有明确改善 |
| 4.2 IIS 正式站先观测再决策 | 正式站响应头观测、IIS 继承配置、`static/web.config`（仅在确认安全且必要时） | 先检查 `https://docs.getquicker.net` 线上响应头、IIS 全局继承配置、已安装压缩模块及 MSDeploy 行为；确认不会触犯锁定配置节引发 **HTTP 500.19** 后，再决定是调整服务器层配置还是引入受控 `web.config` | IIS 与 Cloudflare Pages 各自满足明确的缓存、压缩与更新生效要求；**预发布验证无配置错误，并保留可执行回滚方案** |
| 4.3 历史旧图全链路核查与清理 | `data/screenshot-replace/decisions.json`、`data/screenshot-review/`、`docs/**/img/*` | ① 刷新 `docs:review:catalog`，排查 10 条 `kept` 告警；**4 条 `deferred`（缺对应预览组件）允许合理保留，不强求清零**；② 在核查 **Markdown + MDX `require(...)` + React 组件 + 审核工具 + 替换台账 + `docs-service-export`** 全链路均无引用且做好 Git 归档后，分批清理确认无引用的历史旧截图 | `docs:screenshot:check` 0 error 0 warning；全链路引用核查无误后安全瘦身仓库 |
| 4.4 长尾文档与 AI 生成契约补强 | `docs/v2/xaction/guides/`（7 篇）、`QuickerOrg/Quicker` 导出源、`.cs` XML 注释、页脚反馈区 | ① 逐篇核实并清理 `docs/v2/xaction/` 中已标为 `migrated-unreviewed` 的 7 篇指南（同时注意全站另有 240 篇未标 `docStatus`，按阶段 2 清单分批核验，不把未标记误作已核验）；② 从 **客户端主仓（`QuickerOrg/Quicker`）导出源** 扩充 `ai-action-json-guide.md`（区分 `$=` 表达式、`$$` 文本插值与 `VarKey` 变量绑定，补全分支/循环/子程序示例），并配套语义校验与**真实导入验证**（不局限于 JSON Schema）；③ 源头补齐脚本 API 341 项中文说明（单文件签名速查可作为非阻塞增强项）；④ 评估 `QuickerComments` 就绪前的页脚反馈过渡方案 | `migrated-unreviewed` 归零；AI 动作生成文档源头可同步、有真实导入验证闭环 |
| 4.5 暂缓 / 不阻塞项 | `docs/v2/what's-new/` 路径 | **`what's-new/` 目录改名收益极小，明确暂不做**（保留 sitemap 单引号转义补丁即可） | 不在低收益 URL 迁移上消耗重定向维护成本 |

---

## 四、兼容护栏与风险控制

1. **路由与评论键稳定**：`docusaurus.config.ts` 保持 `routeBasePath: '/'` 不变；所有已发布 URL 与 `quickerDocKey` 保持稳定；旧页面归并采用 `unlisted: true` 保留直达或配置跳转，严禁直接删页制造 404；每批合并必须附旧锚点处理方案。
2. **结构化生成区不手改**：模块页 `{/* xaction-metadata:start/end */}`、脚本 API 标记区以及 `data/xaction/ai-action-json-guide.md`、`data/xaction/modules/*.json` 等生成文件不作手工覆盖式修改，全部回到 `QuickerOrg/Quicker` 导出源或同步脚本修改。
3. **验证与发布纪律**：
   - 修改 `docs/` 后跑 `npm run build`；修改 `src/`、`plugins/`、`docusaurus.config.ts` 后跑 `npm run typecheck && npm run build`，并执行相应校验脚本与固定问题集回归测试。
   - 正式站以 Jenkins 构建并经 MSDeploy 发布到 IIS 的实际页面为准，不用 Cloudflare Pages 预览替代正式站验收；每次发布后验证首页、深层文档页、更新记录页与 404 页。
   - 未经明确要求不自动提交或推送分支；所有变更分阶段、小步验证交付。
