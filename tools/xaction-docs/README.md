# 组合动作模块文档维护

本目录用于将 Quicker 程序导出的当前模块定义与 1.x 使用说明合并为 2.0 文档。

## 内容边界

- `data/xaction/` 保存面向 AI 和校验器的结构化模块数据。
- `docs/v2/xaction/modules/` 保存用户可见的模块页面。
- 模块页中 `{/* xaction-metadata:start/end */}` 之间的内容由程序元数据生成，不应手工修改。
- 标记之外的使用说明、示例、限制和排障内容可以由人工或 AI 编辑。
- 页面身份以 `moduleKey` 和 `quickerDocKey` 为准，不依赖中文标题或分类目录。

## 同步新版本

先在目标 Quicker 版本中生成模块文档，然后执行：

```powershell
npm run docs:xaction:sync -- `
  --generated "D:\path\to\Quicker模块文档_yyyyMMdd_HHmmss" `
  --legacy "D:\path\to\QuickerDocs\online\markdown\help"
```

同步命令会：

1. 解析当前模块 Key、输入、输出、枚举、条件和默认值。
2. 按帮助链接将模块映射到旧版正文。
3. 新模块自动创建页面；已有页面只更新受保护的元数据区。
4. 生成 `data/xaction/catalog.json` 和单模块 JSON。
5. 将相对上一份 catalog 的模块和参数变化写入 `data/xaction/changes.json`。
6. 保留人工正文，不自动删除当前版本中消失的页面。

同步后运行：

```powershell
npm run docs:xaction:check
npm run docs:xaction:test
npm run build
```

## AI 维护流程

1. 先查看 `data/xaction/changes.json`，只打开发生变化的单模块 JSON 和页面。
2. 参数事实以 catalog 和受保护元数据区为准，不根据旧截图猜测。
3. 只修改受影响模块的人工正文；不要批量润色无关页面。
4. 新增或修改示例时核对模块 Key、参数 Key、枚举值和输出变量。
5. 复杂模块还应核对当前代码、真实界面和实际运行路径。
6. 经人工或实际版本验证后，将页面的 `docStatus` 从 `migrated-unreviewed` 更新为 `reviewed` 或 `verified`。

## 当前限制

- 旧版正文迁移只保证结构、图片和已知文档链接可用，不代表内容已逐项通过 2.0 实机验证。
- Quicker 当前导出的顶层 `catalog.json` 可能只有模块摘要；本工具会从单模块 Markdown 重建完整的文档 catalog。
- 删除或重命名模块属于需要人工判断的兼容性变化，工具只报告，不自动删除旧页面。
