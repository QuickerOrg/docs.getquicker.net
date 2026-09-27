# 组合动作模块文档维护

本目录用于将 Quicker 程序导出的当前模块定义与 1.x 使用说明合并为 2.0 文档。

## 内容边界

- `data/xaction/` 保存结构化模块数据（`catalog.json`、`modules/*.json`）。**参数事实只在这里。**
- `data/xaction/modules-index.ts` 供站点组件按 `moduleKey` 异步读取单个模块 JSON（由 sync 写入）。不要静态 import 整份 `catalog.json`。
- `docs/v2/xaction/modules/` 是用户页：正文手写；参数 UI 用一行组件挂上即可：

  ```md
  ## 当前模块定义

  <XActionModuleMeta moduleKey="sys:csscript" />
  ```

- 页面不需要再维护参数表，也不需要 `xaction-metadata` 标记 / `metadataHash`。
- 参数 UI：[`src/components/XActionModuleMeta`](../../src/components/XActionModuleMeta)。
- 页面身份以 `moduleKey` 和 `quickerDocKey` 为准。

## 同步新版本

`docs:xaction:sync` 的主要作用是**刷新 `data/xaction`**（以及新建缺页、迁入旧正文）。已有页面上的组件标签不会再被「参数表」覆盖。

同步器优先读取导出包的 `catalog.json`，保留参数原文、默认值类型、控制字段和结构化显示条件；仅在旧导出包没有 JSON 时兼容 Markdown 导入。有 JSON 但存在导出错误、数量不符或未知版本时停止同步，不回退到可能不完整的 Markdown。

Quicker 导出命令为 `Tools/docs/Export-StepMetadataDocs.ps1`，现在通过主仓 `Tools/dev/build.ps1` 隔离构建输出，并在全部导出测试成功后提供 `export-dir.txt`。输入参数的 `DefaultValue` 是运行时缺省值，`NewStepDefaultValue` 是新建步骤初始值，两者分别保存。`VisibleWhen` 按明确的字段 Key 判断，优先于旧的条件列表；页面不执行 `VisibleExpression`，无法判断的条件保持可见。

已有页面的人工标题、摘要和正文保留；`metadataGeneratedAt` 保留页面原始记录，当前参数导出时间以 `data/xaction/catalog.json` 的 `generatedAt` 为准。

首页只更新 `XActionLanding` 的统计数据，已有分类摘要保留。已有模块按 Key 查找页面，分类变化不导致跳过或搬动正文；新分类和 Key 改名造成的页面冲突会在写入前报错。同一导出包重复同步不会清空上次差异报告。校验器会比对总目录与单模块 JSON 的完整内容，并报告改名后遗留的数据文件。

```powershell
node tools/xaction-docs/sync.mjs `
  --generated "D:\path\to\Quicker模块文档_yyyyMMdd_HHmmss" `
  --legacy "D:\path\to\QuickerDocs\online\markdown\help"
```

增量同步（只刷新 `data/xaction`、更新已有模块页、为缺页写 stub）可以省略 `--legacy`，此时不会覆盖概念/教程正文：

```powershell
node tools/xaction-docs/sync.mjs --generated "D:\path\to\Quicker模块文档_yyyyMMdd_HHmmss"
```

从 Quicker 仓手动触发：Actions → **Docs xaction sync**（`check` 只对照漂移，`import` 向本仓开 PR，不推 `main`）。本仓 PR 会跑 `docs:xaction:check` / `docs:xaction:test`。

若要从旧标记迁移到「仅组件」：

```powershell
npm run docs:xaction:rewrite-meta
```

然后：

```powershell
npm run docs:xaction:check
npm run docs:xaction:test
npm run build
```

## AI 维护流程

1. 参数变更：先看 `data/xaction/changes.json` 与对应 `modules/*.json`。
2. 用法/示例：只改模块页人工正文。
3. 页面上的 `<XActionModuleMeta />` 一般不用动；`moduleKey` 与 front matter 保持一致即可。

## 当前限制

- 旧版正文迁移不代表已逐项 2.0 实机验证。
- 删除/重命名模块需人工处理；工具只报告，不自动删页。
