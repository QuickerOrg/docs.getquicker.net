# 脚本动作文档维护

本仓 `docs/v2/script-action/` 是用户文档入口。API 的结构化事实在 `data/script-action/catalog.json`；参考页由代码反射事实与编辑器中文说明生成，教程、取消行为、界面说明及排障由人工维护。

## 更新流程

1. 在 Quicker 隔离工作树运行 `Tools/script-docs/export.ps1 -DocsRoot <本仓工作树>`。已持有租约时传入 `-LeaseToken`；复用当前产物时传入 `-QuickerAssembly`。工具会先验证所有文档内完整脚本，再更新 JSON 与参考页。
2. 审查 API 增删、默认值和说明变化，补充相关教程、安全说明和取消行为；不要直接手改生成区。
3. 在本仓运行：

```powershell
npm run docs:script:check
npm run docs:script:test
npm run build
```

单独导入一份已核对的导出文件：

```powershell
npm run docs:script:sync -- --catalog <导出.json>
npm run docs:script:check -- --catalog <新导出.json>
```

不带 `--catalog` 的检查验证本站快照、生成内容与报告一致；带新导出才会比较当前产品 API 契约。本站 CI 不构建 Windows 产品，不能单靠本站检查证明没有上游漂移。`--check` 不修改文件。

## 生成区与人工区

`{/* script-api:start */}` 和 `{/* script-api:end */}` 之间由工具维护；front matter、前言和标记之外的示例不会被覆盖。标记缺失或重复时同步失败。成员重载共享稳定锚点；退出目录的旧 API 页需人工决定保留、迁移或删除，工具不会自动删页。

新增域先在 `render.mjs` 登记中文名称；新增能力先登记中文能力说明。未知域/能力、重复签名、过时页面和损坏标记会让检查失败。

## 缺少说明如何处理

`coverage.json` 记录所有缺少独立中文说明的参数或字段。这不等于 API 没有说明：第一版全部根/域方法与公共类型均已有中文说明。未单列的字段会提示结合类型或域说明使用。工具不猜测空值、取消、错误码或条件授权；需要新增契约解释时优先补充产品中的中文说明，再导出。

运行限额为人工维护的 `limits.md`。修改额度时对照实现常量与域说明更新，不把反射签名当作限额来源。

## 完整示例

教程内嵌源码与 `static/files/script-action/*.cs` 下载文件必须一致，测试负责检查。`examples.mjs --out <目录>` 提取所有含 Main 的 C# 块，交给主仓导出器做受控语法、能力识别及静态编译检查；API 声明片段不当成可运行源码。实际运行、授权、外部依赖和编辑器界面仍需要人工测试。

第一版核对主仓 `fef5d1faaa616a03b7257ceca19b66fff40718b4` 的 Debug 开发产物。生成数据记录具体提交和产品版本，不据此推断正式发行版已包含全部功能。
