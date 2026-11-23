# docs.getquicker.net 全量优化验收报告

- **工作树路径**：`F:\Worktrees\docs.getquicker.net\docs-optimization-plan`
- **工作分支**：`docs/optimization-plan`（基于 `main` `ada8c5f`）
- **基线参照**：`plans/docs-optimization-plan.md`（v2）、`plans/search-eval-baseline.json`、`plans/page-disposition-ledger.md`
- **提交状态**：全部改动按 4 个独立主题提交保留在工作树分支上，未执行 `git push`；主工作区 `D:\Work\docs.getquicker.net` 未被修改。

---

## 一、全量验证结果总览

| 检查项目 | 命令 | 最终结果 |
| --- | --- | --- |
| 全仓静态检查与单测 | `npm run check:all` | **通过（exit 0）**：`tsc`、`docs:xaction:check`（176 模块）、`docs:xaction:test`、`docs:xaction:validate-json`（2 份示例）、`docs:xaction:validate-json:test`（4/4，含非 `Enum` 预设自由输入回归）、`docs:bridges:check/test`、`docs:script:check/test`（8/8）、`docs:script:stub:check`（23 域 / 57 类型）、`docs:emphasis:check/test`（3/3）、`docs:screenshot:check`（**539 条决策，0 error，0 warning**）、`docs:export:test`（13/13）、`docs:llms:check`（409 篇）、`docs:git-history:test`（1/1） |
| Docusaurus 全站构建 | `npm run build` | **通过（exit 0）**：开启 `onBrokenLinks: 'throw'` 与 `onBrokenAnchors: 'throw'` 均零错误通过；`docs-service-export` 导出 **454** 篇文章 / **39** 个分类 / **4,221** 个分段 chunk / **0 条诊断告警** |
| 固定问题集检索评测 | `node tools/search-eval/eval.mjs --compare plans/search-eval-baseline.json --strict` | **通过（exit 0）**：站内搜索 Lunr **15/24 → 24/24**（`operation` 13/13、`moduleKey` 6/6 全第 1、`noLegacyCrowding` 5/5）；知识包 Pack **16/24 → 24/24** |
| 6 链图片资产审计 | `node tools/screenshot-replace/audit-unused-images.mjs` | 扫描 `docs/` + `static/img/`（不含 gitignore 的 `static/img/doc-gallery/`）共 **851** 个图片文件：**292** 个活跃引用、**483** 个 ledger 已转换历史归档、**76** 个无任何链路引用的遗留文件（已输出清单，未误删） |
| 未复核模块指南 (`migrated-unreviewed`) | `git grep -n "migrated-unreviewed" docs/` | **7 篇 → 0 篇**：已结合 `data/xaction/modules/*.json` 与客户端只读仓库 `D:\Work\Quicker` 核对并修正 1.x 外链、代码块转义与新面板入口；按用户确认维持 `docStatus: "reviewed"` |

---

## 二、复查反馈修正与核心指标说明

### 1. 已补齐的复查问题
- **外部旧 `#锚点` 兼容与 AI 内容补全**：
  - 新增通用组件 [`HashRedirect`](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/components/HashRedirect/index.tsx)（并纳入 `docs-service-export` 展开处理，0 告警），挂载于 `screenshot/capture-pro.md`、`ai/assistant.md` 和 `release-notes/index.md`，覆盖拆页与归档后迁出的历史锚点跳转。
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
  - 因向 176 个模块页注入可读静态参数表（含完整枚举选项），本地搜索索引从基线 `~10.92 MB` 增至 **`13,066,956 B`（gzip `3,287,562 B` / br q5 `3,022,740 B`）**。
  - [prefetchSearchIndex.ts](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/src/clientModules/prefetchSearchIndex.ts) 已对 Save-Data 和 `slow-2g`/`2g` 网络禁用空闲预下载（改为搜索框悬停/聚焦触发），但**普通宽带或 4G/5G 访客在页面空闲时仍会预下载约 3.0–3.3 MB 压缩后的搜索索引**，属于用“首屏之后的一次性索引带宽”换取“站内搜全模块参数/Key 即搜即达”的工程取舍。
- **知识包 `chunks.json` 独立与 `QuickerWeb` 消费端未验声明**：
  - `.cache/docs-service/` 已把 `chunks` 从 `articles.json` 剥离到独立 `chunks.json`，并在 `manifest.json` 注册 `chunks.json` 哈希。`articles.json` 自身不含 `chunks`，实测 **`10,027,646 B`（gzip `2,072,275 B`）**；`chunks.json` 为 **`4,959,783 B`（gzip `1,255,937 B`）**，全包零泄漏组件标签、零导出诊断。
  - 经检索客户端仓库 `D:\Work\Quicker`，未发现 `docs-service` 消费逻辑，真实消费端在服务端 `QuickerWeb`。本次对现有字段做了向后兼容保留且剥离了 `chunks`，但新增的 `contentType`、`authority`、`appliesToVersion`、`verification`、`moduleContract` 等顶层字段及 ~10 MB 级别包体尚未在本工作树环境联调 `QuickerWeb` 同步端，上线前需在 `QuickerWeb` 确认允许未知字段且不受解析内存阈值限制。

### 3. 本轮其余打包资产实测体积

| 产物文件 | 原始体积 | Gzip 体积 | Brotli (q5) 体积 |
| --- | ---: | ---: | ---: |
| `build/assets/js/main.c6919644.js` | 1,067,097 B (`1,042.1 KB`) | 275,630 B (`269.2 KB`) | 251,296 B (`245.4 KB`) |
| `build/assets/js/qk-action-editor-preview.7e9e487a.js` | 355,731 B (`347.4 KB`) | 97,784 B (`95.5 KB`) | 91,521 B (`89.4 KB`) |
| `build/assets/js/qk-heavy-preview.1b0796e6.js` | 354,912 B (`346.6 KB`) | 97,511 B (`95.2 KB`) | 91,233 B (`89.1 KB`) |
| `build/assets/js/qk-xaction-catalog.59f3a025.js` | 38,750 B (`37.8 KB`) | 8,394 B (`8.2 KB`) | 8,209 B (`8.0 KB`) |

---

## 三、需在外部仓库与运维侧跟进的事项

1. **客户端主仓 `QuickerOrg/Quicker`（本轮只读未改）**：升级 `ai-action-json-guide.md` 导出模板以区分 `$=` / `$$` / `VarKey`；并在客户端集成测试中补充动作 JSON 真机导入校验。
2. **知识包服务端消费方 `QuickerWeb`**：核对 `articles.json` 新增元数据字段的 JSON 反序列化兼容性及全量包拉取内存占用，按需接入独立 `chunks.json`。
3. **IIS 运维配置**：按 [iis-observation-and-rollout.md](file:///F:/Worktrees/docs.getquicker.net/docs-optimization-plan/plans/iis-observation-and-rollout.md) 先查服务器配置锁定情况并做预发布验证后再配置 `Cache-Control`。
