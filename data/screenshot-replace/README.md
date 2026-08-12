# 截图转组件决策账本

`decisions.json` 以原图的仓库相对路径为稳定键，记录已经处理过的截图，避免后续扫描重复劳动。

- `converted`：Markdown 图片引用已由实时 MDX 组件替换；原图可以保留用于审核。
- `kept`：已审核，原图包含标注、动效、外部软件界面或概念示意等组件不应丢失的信息。
- `deferred`：已审核，但当前缺少合适组件或可靠数据；仍属于后续任务。
- `pending` 不写入账本：当前仍被文档引用且没有决策记录的图片会自动进入待处理队列。

每条决策必须填写 `page`、`image`、`status`、`reason` 和 `updatedAt`；可补充 OCR `kind`、替代组件和证据来源。

## OCR 跨环境

分类脚本会自动探测本机 `qk-ocr-lite`；不可用时读 `ocr/` 缓存；仍无缓存则返回 `source: vision-needed`，由 agent 用 Read 看图后再 `--record`。

详见 [ocr/README.md](./ocr/README.md)。

```powershell
npm run docs:ocr-probe
npm run docs:ocr-classify -- --from-md docs/v2/xaction/modules/files/statestorage.md
npm run docs:ocr-cache -- --from-md docs/v2/xaction/modules/files/statestorage.md
npm run docs:screenshot:tasks
npm run docs:screenshot:check
node tools/screenshot-replace/task-ledger.mjs --dir docs/v2/xaction/modules --status pending
```

默认队列范围是 `docs/v2/xaction`；需要扫描站内其它文档时显式传入 `--dir docs`。

每批替换完成后，同时更新 `decisions.json`。`kept` / `deferred` 必须写清不转换的理由，不能只写“跳过”。
