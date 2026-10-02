---
title: "OcrTableResult"
description: "OcrTableResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/ocrtableresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表格识别结果：TSV、HTML、行列数、单元格与表头行数。

## 构造

```csharp
OcrTableResult(string Tsv, string Html, int Rows, int Columns, OcrCell[] Cells, double Confidence, int HeaderRows)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Tsv` | `string` | 行以换行、单元格以 Tab 分隔的文本。 |
| `Html` | `string` | &lt;table> 文本（合并单元格用 rowspan/colspan）。 |
| `Rows` | `int` | 见类型说明。 |
| `Columns` | `int` | 见类型说明。 |
| `Cells` | `OcrCell[]` | 见类型说明。 |
| `Confidence` | `double` | 表格结构置信度 0–1。 |
| `HeaderRows` | `int` | 表头行数（Html 的 &lt;thead> 中的行；没有为 0）。 |

{/* script-api:end */}
