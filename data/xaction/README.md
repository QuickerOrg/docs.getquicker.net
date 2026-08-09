# 组合动作模块机器数据

这里保存 Quicker 2.0 组合动作模块的结构化事实，供文档同步器、校验器和 AI 使用。

- `catalog.json`：完整目录，包含分类、模块、输入、输出、选项值和旧版映射状态。
- `changes.json`：本次同步相对上一份 catalog 的模块、参数和选项变化，供 AI 确定维护范围。
- `modules/`：按 `StepRunnerKey` 拆分的单模块 JSON，便于 AI 只读取当前任务需要的上下文。
- `ai-action-json-guide.md`：程序导出的 V2 动作 JSON 基础约束。

这些文件由 `tools/xaction-docs/sync.mjs` 生成，不应手工维护。用户可见的模块参数表位于 `docs/v2/xaction/modules/` 的受保护生成区，使用说明位于同一页面的人工正文区。

更新流程与 AI 维护边界见 [`tools/xaction-docs/README.md`](../../tools/xaction-docs/README.md)。
