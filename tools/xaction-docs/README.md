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

```powershell
npm run docs:xaction:sync -- `
  --generated "D:\path\to\Quicker模块文档_yyyyMMdd_HHmmss" `
  --legacy "D:\path\to\QuickerDocs\online\markdown\help"
```

增量同步（只刷新 `data/xaction`、更新已有模块页、为缺页写 stub）可以省略 `--legacy`，此时不会覆盖概念/教程正文：

```powershell
npm run docs:xaction:sync -- --generated "D:\path\to\Quicker模块文档_yyyyMMdd_HHmmss"
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
