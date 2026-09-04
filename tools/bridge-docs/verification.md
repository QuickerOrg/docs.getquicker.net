# 软件连接公开文档实施验证记录

日期：2026-09-04。状态：正文、参数数据和一致性检查完成；真实产品截图与本轮宿主运行验收有下列缺口。

## 产出

- 软件连接总览、安装管理、命令工具、排障四篇通用指南。
- 16 篇宿主差异页与16篇模块正文；14篇模块页由现有同步器创建后补写，AutoCAD、Rhino 原页面身份保持不变。
- 根首页与 V2 首页入口、自动侧边栏分类、总览矩阵、软件指南/模块双向链接。
- 16 个只读最小配置示例。AutoCAD 显式切换 `connection=bridge`；SketchUp 通过自定义命令调用 ping；WPS 明确 `targetComponent=wps`。
- 稳定映射、示例配置、源码证据，以及文档一致性检查、反例测试与可选三仓源码检查。

## 事实基线

Quicker 源提交：`883ad659cd1663868c980016543c8965b03ce1e2`。

QuickerInstaller 源提交：`3a9d9196dbf84aeefefce30df0219fe5691eb764`。

原始导出及 `data/xaction/catalog.json.generatedAt`：`2026-09-04 07:37:19`。导出前后产品仓库已有文档改动保持不变，未修改产品业务代码。安装器仓库保持干净。

使用当前 `ExportStepMetadataDocuments` 测试导出；测试通过（1/1）。原脚本缺少隔离构建参数，因此使用等价命令：

```powershell
$env:STEP_METADATA_EXPORT_DIR = '<本任务工作树>/tools/temp/bridge-export'
dotnet test QuickerPc/Tests/Quicker.StepV2Test/Quicker.StepV2Test.csproj --configuration Debug -p:Platform=x64 -p:SkipCodeSigning=true -p:RestoreLPAgentWithQuicker=true --artifacts-path T:/Compile/build/Quicker-dev-v2-dadd7429c3/bridge-docs --filter FullyQualifiedName~ExportStepMetadataDocuments --verbosity quiet
```

RAMDisk 起始可用约 31.97 GB。构建根由仓库名、分支 `dev/v2` 和规范化根路径 SHA-256 前10位派生，另加本任务 `bridge-docs` 后缀。产物仅用于验证；[Quicker 可执行文件](T:/Compile/build/Quicker-dev-v2-dadd7429c3/bridge-docs/bin/Quicker/debug_win-x64/Quicker.exe)没有启动或替换用户运行版本。

原始导出先确认16个模块均存在，再同步完整目录。Debug 导出含内部 `sys:test`，同步器新增排除规则及测试；最终为169个用户模块。相比旧 Catalog 新增14个 Bridge 模块，7个既有模块数据变化（含 AutoCAD、Rhino），无模块删除。其余5个数据更新是完整当前导出的结果，不做参数手工拼接。

已去除146篇纯时间戳变更、恢复与任务无关的找图页人工摘要及等待分类说明。导出时间完整保留于 Catalog 和本轮16篇模块页。

## 路由和安装范围核验

- 10个宿主：Execute 读取触发 HWND 对应 PID 与启动时间，Adapter 验证进程并提供对应目标。
- WPS：按触发 HWND 与文字/表格/演示组件匹配；通用命令在多组件同窗口时需要明确组件。
- Photoshop、Premiere、After Effects：前台软件类型门禁，然后要求唯一在线会话。
- Illustrator、InDesign：没有前台定位，要求唯一在线会话。
- 上述 Execute、Adapter、打包及安装器映射文件的核验路径和哈希保存在 `data/bridges/source.json`。
- AutoCAD、Revit、Maya 当前正式包是2027变体，不能用安装器的较宽检测范围承诺旧版本可安装；Rhino范围限定8.34及以上8.x，SketchUp/Cinema 4D限定2024–2026。
- 安装器2026-09-03实施记录提供15种软件的安装/连接闭环证据。本轮没有重做这些安装验收；公开正文说明“已有验证记录”，没有称所有命令或所有小版本均已测试。
- WPS 正式管理页安装、更新、卸载仍无新闭环证据；总览、通用安装、宿主页及模块页均保持预览口径。

## 已完成验证

- `npm run docs:bridges:check`：16项映射、唯一页面、旧身份、双向链接、组件、首页入口、WPS预览标识与示例通过。
- `npm run docs:bridges:test`：拒绝 AutoCAD 错用代理、无效枚举、未知输入和缺失输出的反例通过。
- 已接入现有 `xaction-check.yml` 的路径过滤与检查步骤，只修改配置，未触发云端 workflow。
- 三仓源码检查：源提交、哈希、连接标识、组件关系、路由分组通过。
- `npm run docs:xaction:check`：169个模块页、169个Key通过。
- `npm run docs:xaction:test`：通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，最终构建没有断链或锚点警告。初轮发现自定义标题锚点与本仓MDX设置不兼容，已改为标准Markdown标题及自动锚点。
- 本地生产预览：侧边栏软件连接分类与landing页、根首页入口、Blender指南→模块及展开参数、CorelDRAW UAC差异、Photoshop UXP差异、WPS预览指南→模块、模块→路由锚点可访问。

## 缺口与补拍清单

当前工具没有可用的 Windows 原生交互接口（Computer Use技能需要的 `node_repl` 未提供，CUA仅启用浏览器）。截图技能可截当前桌面，但未显示目标产品窗口。一次临时桌面捕获保存在 `T:/TEMP/codex-shot-2026-09-04_07-36-50.png`，含无关界面，未放入公开站。

尚未交付以下真实产品截图：

1. Quicker 主菜单“工具 → Quicker组件安装器”入口。
2. 安装器“软件 Bridge”总览及详情。
3. Quicker“设置 → 软件连接”的在线列表。
4. 一个命令工具的实例、命令、参数、立即调用、生成动作区域。
5. 有必要时补 Revit 信任提示、SketchUp 扩展批准、Adobe 管理/状态面板及 WPS 正式管理页（WPS须先有新的闭环证据）。

因此图片在开发/生产 base URL 下的验证未执行，也未伪造、借用原型图或重画界面作为真实截图。总览流程图是明确的流程示意，不是产品截图。

未运行真实宿主中的16个示例、多实例、首次信任、重启恢复、安装/卸载流程；最小示例已对当前导出和 Execute 核验，但不标记为本轮真机通过。没有安装/卸载用户 Bridge，也没有修改任何模型或设计文件。

仓库声明的 `.agents/skills/docs-page-rewrite`、`docs-img-to-component`、`docs-example-action` 在独立工作树及主目录均缺失；使用可用的正文编辑、截图技能与既有同步/元数据组件完成可做部分。没有新建分享动作，也没有手写可导入动作 JSON。

未经提交、推送、PR或部署；上述结果只在本任务工作树中。
