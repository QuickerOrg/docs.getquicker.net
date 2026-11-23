# docs.getquicker.net 全量优化验收报告

- **工作树路径**：`F:\Worktrees\docs.getquicker.net\docs-optimization-plan`
- **工作分支**：`docs/optimization-plan`（基于 `main` `ada8c5f`）
- **基线参照**：`plans/docs-optimization-plan.md`（v2）、`plans/search-eval-baseline.json`、`plans/page-disposition-ledger.md`
- **提交状态**：全部 9 个独立主题提交（`dad6e00`..`1de1dd9` 及本次复查收尾提交）经本地全量验证后合并至 `main` 并推送至 `origin/main`；主工作区既有未暂存的 `tools/xaction-docs/README.md` 未受影响。

---

## 一、全量验证结果总览

| 检查项目 | 命令 | 最终结果 |
| --- | --- | --- |
| 全仓静态检查与单测 | `npm run check:all` | **通过（exit 0）**：`tsc`、`docs:xaction:check`（176 模块）、`docs:xaction:test`、`docs:xaction:validate-json`（2 份示例）、`docs:xaction:validate-json:test`（4/4，含非 `Enum` 预设自由输入回归）、`docs:bridges:check/test`、`docs:script:check/test`（8/8）、`docs:script:stub:check`（23 域 / 57 类型）、`docs:emphasis:check/test`（3/3）、`docs:screenshot:check`（**539 条决策，0 error，0 warning**）、`docs:export:test`（15/15）、`docs:llms:check`（413 篇）、`docs:git-history:test`（1/1） |
| Docusaurus 全站构建 | `npm run build` | **通过（exit 0）**：开启 `onBrokenLinks: 'throw'` 与 `onBrokenAnchors: 'throw'` 均零错误通过；`docs-service-export` 导出 **458** 篇文章 / **41** 个分类 / **4,241** 个分段 chunk / **0 条诊断告警** |
| 固定问题集检索评测 | `node tools/search-eval/eval.mjs --compare plans/search-eval-baseline.json --strict` | **通过（exit 0）**：站内搜索 Lunr **15/24 → 24/24**（`operation` 13/13、`moduleKey` 6/6 全第 1、`noLegacyCrowding` 5/5）；知识包 Pack **16/24 → 24/24** |
| 6 链图片资产审计 | `node tools/screenshot-replace/audit-unused-images.mjs` | 扫描 `docs/` + `static/img/`（不含 gitignore 的 `static/img/doc-gallery/`）共 **851** 个图片文件：**292** 个活跃引用、**483** 个 ledger 已转换历史归档、**76** 个无任何链路引用的遗留文件（已输出清单，未误删） |
| 未复核模块指南 (`migrated-unreviewed`) | `git grep -n "migrated-unreviewed" docs/` | **7 篇 → 0 篇**：已结合 `data/xaction/modules/*.json` 与客户端只读仓库 `D:\Work\Quicker` 核对并修正 1.x 外链、代码块转义与新面板入口；按用户确认维持 `docStatus: "reviewed"` |

---

## 二、复查反馈修正与核心指标说明

### 1. 已补齐的复查问题
- **外部旧 `#锚点` 兼容与 AI 内容补全**：
  - 新增通用组件 [`HashRedirect`](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/HashRedirect/index.tsx) 与纯函数状态追踪 [`resolveHashRedirect`](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/HashRedirect/resolveHashRedirect.js)（已纳入 `docs-service-export` 展开处理，0 告警），支持 `routes`、`aliases` 及 `defaultTo` 整页/透传兼容跳转，挂载于 `screenshot/capture-pro.md`、`screenshot/recording-and-pin.md`、`ai/assistant.md`、`what's-new/ai-services-and-models.md` 和 `release-notes/index.md`；已修复“同页旧锚点重复访问被状态锁死”问题（离开旧锚点后重置状态、监听 `hashchange` 并在同页跳转时滚动定位目标标题），[`LegacyNoticeRedirect`](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/LegacyNoticeRedirect/index.tsx) 亦同步补齐重置逻辑，并纳入单元测试回归覆盖。
- **信息架构、内容身份与任务拆页收尾**：
  - `classifyArticle` 改为优先读取 front matter 显式声明，默认分支按物理源文件目录判定并将非兼容旧页的 `/troubleshooting`、`/faq` 排在通用 `features/ → guide` 之前（实测 `action-panel/faq` 与 `software-connections/troubleshooting` 均为 `troubleshooting / canonical / V2`）；`ai/services-and-models.md` 规范为 `/v2/features/ai/services-and-models`（原 `/v2/what's-new/ai-services-and-models` 留 `unlisted` 重定向桩），与 `upgrade-and-rollback.md`、`load-action-page.md` 均确认导出 `guide / canonical / V2`。
  - 首页 [docs/index.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/docs/index.md) 的编写方式表收拢为两层选择（先选「组合动作 / 脚本动作（C#）」，再按需使用动作内代码步骤），并在 [how-to-learn.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/docs/v2/xaction/guides/how-to-learn.md) 补充详表；「功能使用」侧边栏与 [docs/v2/features/index.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/docs/v2/features/index.md) 对齐为 5 个任务分组；组合动作子目录调整为「教程与实践 → 基础与进阶概念 → 模块参考」并移除入口页历史段落；`recording-and-pin.md` 拆为 `screen-recording.md`、`pin-window.md`、`media-history.md` 三篇任务页。
  - 对照 `main` 补回 `ai/assistant.md` 遗漏的 **`## 长期指令与记忆 {/* #memory-2327 */}`**、**“作者只读、权限撤销或来源发生变化时，不能用强制保存绕过检查”**、**“密码或密钥类设置可能向助手提供实际值及分享对话前检查”**，并在 `prompt-library-and-sessions.md` 补齐 `#session-recovery-2326` 的“多连接同名模型不猜测连接”边界。
- **CI 与链接/语法门禁加固**：
  - [docusaurus.config.ts](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/docusaurus.config.ts) 已升级为 `onBrokenLinks: 'throw'` + `onBrokenAnchors: 'throw'`。
  - [tools/generate-llms-txt.mjs](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/tools/generate-llms-txt.mjs) 修正第 8 行错误标签，拆分为站内目录链接与真实 GitHub `catalog.json` 链接，并加入 `--check` 子命令接入 `check:all`；评论组件 [QuickerComments](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/QuickerComments/index.tsx) 按确认恢复隐藏（仅在配置 `quickerCommentsBaseUrl` 时渲染）。
- **JSON 校验器与 SSR 契约完整性**：
  - [validate-action-json.mjs](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/tools/xaction-docs/validate-action-json.mjs) 仅对 `type === 'Enum'` 的参数实施封闭枚举限制，允许 `sys:everythingsearch.ext`、`sys:ai.globalUseCaseId` 等带预设下拉的 `Text` / `Number` 参数自由输入。
  - [XActionModuleMetaSsr.tsx](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/XActionModuleMeta/XActionModuleMetaSsr.tsx) 移除 `.slice(0, 8)` 截断限制，静态 `<details>` 现输出完整选项列表；实测 `build/v2/xaction/modules/stringprocess/index.html` 已包含 `html2text` 与 `HTML转纯文本`。

### 2. 检索评测、知识包兼容性与体积取舍（诚实口径）
- **24 题检索评测的性质边界**：
  - `moduleKey`（0/6 → 6/6）与反挤占（5/5）来自 SSR 静态模块元信息与兼容页命名隔离等结构性改造；但部分 `operation` 标题改写客观上更贴合该固定问题集用词（例如 `如何弹出动作面板`）。因此该 24 题套件定位为**基础回归门禁（smoke / regression）**；若需客观评价未知长尾查询召回率，应在后续另行采集不受正文改写影响的用户真实提问盲测集。
- **搜索索引膨胀与空闲预热流量权衡**：
  - 因向 176 个模块页注入可读静态参数表（含完整枚举选项），本地搜索索引从基线 `~10.92 MB` 增至 **`13,135,995 B`（gzip `3,305,042 B` / br q5 `3,038,880 B`）**。
  - [prefetchSearchIndex.ts](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/clientModules/prefetchSearchIndex.ts) 已对 Save-Data 和 `slow-2g`/`2g` 网络禁用空闲预下载（改为搜索框悬停/聚焦触发），但**普通宽带或 4G/5G 访客在页面空闲时仍会预下载约 3.0–3.3 MB 压缩后的搜索索引**，属于用“首屏之后的一次性索引带宽”换取“站内搜全模块参数/Key 即搜即达”的工程取舍。
- **知识包 v1 协议兼容、`chunks.json` 独立与 `QuickerWeb` 消费端未验声明**：
  - `.cache/docs-service/` 已把 `chunks` 从 `articles.json` 剥离到独立 `chunks.json`，在 `manifest.json` 注册 `chunks.json` 哈希，并修复了之前把 `chunkBytes` 混入 `revision` 的问题：`schemaVersion: 1` 下 **`revision` 严格保持 v1 协议的 `sha256(catalogBytes + articleBytes)` 计算方式**（实测与 `manifest.json` 校验一致，`chunks.json` 作为向后兼容的扩展条目供新消费端按需读取，已补充 `buildManifest` 单测与 [README.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/plugins/docs-service-export/README.md) 说明）。`articles.json` 自身不含 `chunks`，实测 **`10,073,061 B`（gzip `2,075,014 B`）**；`chunks.json` 为 **`4,980,528 B`（gzip `1,263,889 B`）**；`catalog.json` 为 **`24,668 B`（gzip `4,904 B`）**，全包零泄漏组件标签、零导出诊断。
  - 经检索客户端仓库 `D:\Work\Quicker`，未发现 `docs-service` 消费逻辑，真实消费端在服务端 `QuickerWeb`。本次对现有字段与 v1 `revision` 算法做了向后兼容保留且剥离了 `chunks`，但新增的 `contentType`、`authority`、`appliesToVersion`、`verification`、`moduleContract` 等顶层字段及 ~10 MB 级别包体尚未在本工作树环境联调 `QuickerWeb` 同步端，上线前需在 `QuickerWeb` 确认允许未知字段且不受解析内存阈值限制。

### 3. 本轮其余打包资产实测体积

| 产物文件 | 原始体积 | Gzip 体积 | Brotli (q5) 体积 |
| --- | ---: | ---: | ---: |
| `build/assets/js/main.bd4b17bc.js` | 1,076,209 B (`1,051.0 KB`) | 277,470 B (`271.0 KB`) | 253,059 B (`247.1 KB`) |
| `build/assets/js/qk-action-editor-preview.b6081339.js` | 355,739 B (`347.4 KB`) | 97,788 B (`95.5 KB`) | 91,526 B (`89.4 KB`) |
| `build/assets/js/qk-heavy-preview.ad9953c0.js` | 354,920 B (`346.6 KB`) | 97,516 B (`95.2 KB`) | 91,232 B (`89.1 KB`) |
| `build/assets/js/qk-xaction-catalog.59f3a025.js` | 38,750 B (`37.8 KB`) | 8,394 B (`8.2 KB`) | 8,209 B (`8.0 KB`) |

---

## 三、需在外部仓库与运维侧跟进的事项

1. **客户端主仓 `QuickerOrg/Quicker`（本轮只读未改）**：
   - 将 `QuickerPc/Quicker/Domain/FeatureDocumentation.cs` 第 66 行的 `AiServices` 由 `"/v2/what's-new/ai-services-and-models/"` 更新为 `"/v2/features/ai/services-and-models/"`（保留末尾斜杠以通过 `AppHelperNavigationTests.SettingsHelp_UsesOriginalFeatureBeforeWindowPageRedirect`）；文档站同时保留旧路径 `unlisted` 重定向桩兼容尚未升级的客户端。
   - 升级 `ai-action-json-guide.md` 导出模板以区分 `$=` / `$$` / `VarKey`；并在客户端集成测试中补充动作 JSON 真机导入校验。
2. **知识包服务端消费方 `QuickerWeb`**：核对 `articles.json` 新增元数据字段的 JSON 反序列化兼容性及全量包拉取内存占用，按需接入独立 `chunks.json`。
3. **IIS 运维配置**：按 [iis-observation-and-rollout.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/plans/iis-observation-and-rollout.md) 先查服务器配置锁定情况并做预发布验证后再配置 `Cache-Control`。
