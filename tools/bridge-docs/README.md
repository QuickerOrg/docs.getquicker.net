# 软件连接文档维护

本目录检查用户指南、XAction 参数事实和产品源码之间的关系。公开正文在 `docs/v2/features/software-connections/`；执行记录见 [实施验证记录](./verification.md)。

## 数据职责

- `data/bridges/catalog.json`：只保存连接 ID、安装组件 ID、模块 Key、软件名和指南 slug。WPS 的 `componentId` 为 `null`，由官方网页管理；不复制在线 Catalog 版本、下载地址或发布状态。
- `data/bridges/examples.json`：16 个最小 `bridge.ping` 配置，用当前模块数据检查参数名、枚举和输出。它是步骤配置清单，不是可导入的 ActionItem2 或分享动作 JSON。
- `data/bridges/source.json`：本轮源提交、导出时间、路由核验位置与源文件 SHA-256。哈希用于发现未提交代码漂移，不包含签名密钥、包哈希或连接凭据。
- `data/xaction/`：仍是唯一参数事实源。不要为了让示例通过而手改参数数据。

## 更新步骤

1. 阅读 Quicker 与 QuickerInstaller 当前规则、状态、Execute、Adapter、打包兼容范围、检测与安装逻辑、实施验证记录。
2. 从当前 Quicker 构建执行 `Tools/docs/Export-StepMetadataDocs.ps1`。若需要遵守隔离构建输出约定，使用相同的 `ExportStepMetadataDocuments` 测试、相同环境变量及 `export-dir.txt` 协议，传入绝对 `--artifacts-path`。引用主项目时同时传入 `-p:RestoreLPAgentWithQuicker=true`。
3. 导入前断言 `catalog.json` 映射的全部模块 Key 出现在原始导出中，再执行 `npm run docs:xaction:sync -- --generated <目录>`。同步器排除 Debug 专用 `sys:test`；不触发云端 workflow。
4. 检查 `data/xaction/changes.json`。完整导出可能包含其他模块参数更新；保留一致的数据集，但去除无关页面的纯时间戳及人工摘要覆盖。不要回退用户既有改动。
5. 人工更新正文和示例。软件指南讲安装差异、能力与目标限制，参数枚举仍留在模块组件中。AutoCAD、Rhino 保留原 slug、moduleKey、quickerDocKey 和兼容通道解释。
6. 重新核验路由后更新 `source.json` 的源提交、时间和源码证据，不能只刷新哈希而不检查行为。新增软件也必须同步指南、模块正文、最小示例、总览矩阵与首页可发现性。
7. 更新 [验证记录](./verification.md)。区分源码核验、历史真机记录与本次实际运行；WPS 正式管理页闭环无新证据时保持预览状态。

```powershell
npm run docs:bridges:check
npm run docs:bridges:test
node tools/bridge-docs/check-sources.mjs D:/Work/Quicker D:/Work/QuickerInstaller
npm run docs:xaction:check
npm run docs:xaction:test
npm run typecheck
npm run build
```

前两项可在没有产品源码的 CI 环境运行。`check-sources.mjs` 需要两个本地仓库，检查提交与文件哈希、Adapter 标识、安装映射和路由指纹；它不能替代宿主多实例运行测试。

截图应来自真实产品界面，放在对应用户文档同级 `img/`。不要用原型图、重新绘制的界面或过时截图冒充当前运行结果。拍摄前避免私人文档、会话标识等信息进入画面；不为截图安装/卸载用户插件或修改设计文件。
