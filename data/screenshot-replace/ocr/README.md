# OCR 缓存（跨环境）

本目录保存截图的 OCR / agent 读图文本，供 `tools/screenshot-replace/ocr-classify.mjs` 在 **无 qk-ocr-lite** 的环境里仍能分类。

## 结构

相对路径与文档原图对齐，扩展名改为 `.json`：

```text
docs/v2/xaction/modules/files/img/statestorage-004-32be44986d.png
→ data/screenshot-replace/ocr/docs/v2/xaction/modules/files/img/statestorage-004-32be44986d.json
```

字段：

| 字段 | 说明 |
|------|------|
| `image` | 仓库相对路径 |
| `fullText` | OCR 或 agent 读图得到的全文 |
| `blockCount` | 文本块数（无则按行估） |
| `model` | 如 `…/ppocrv6/tiny` 或 `vision/agent` |
| `source` | `ocr` / `record` |
| `kind` / `cues` | 写入时的分类快照（读取时会按当前规则重算） |

## 怎么生成

本机有 OCR（推荐 tiny / small）时，分类会自动写缓存：

```powershell
npm run docs:ocr-probe
node tools/screenshot-replace/ocr-classify.mjs --from-md docs/v2/xaction/modules/files/statestorage.md
```

无 OCR 时 agent 用 Read 看图后写入：

```powershell
node tools/screenshot-replace/ocr-classify.mjs --record docs/.../img/foo.png --full-text "第一行`n第二行"
```

只读缓存：

```powershell
node tools/screenshot-replace/ocr-classify.mjs --cache-only --from-md docs/.../page.md
```

请提交本目录，方便其它机器 / CI / 无 OCR 的 agent 使用。
