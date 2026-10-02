---
title: "OcrCell"
description: "OcrCell的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/ocrcell
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表格单元格。

## 构造

```csharp
OcrCell(int Row, int Column, int RowSpan, int ColumnSpan, string Text, Rect Bounds, double Confidence, Pt[] Polygon)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Row` | `int` | 起始行（0 起）。 |
| `Column` | `int` | 起始列（0 起）。 |
| `RowSpan` | `int` | 合并的行数（≥ 1）。 |
| `ColumnSpan` | `int` | 合并的列数（≥ 1）。 |
| `Text` | `string` | 见类型说明。 |
| `Bounds` | `Rect` | 单元格外接矩形，坐标空间同 OcrLine.Bounds；Agent 未给出时为 Rect(0, 0, 0, 0)。 |
| `Confidence` | `double` | 文字置信度 0–1。 |
| `Polygon` | `Pt[]` | 单元格四点框，坐标空间同 Bounds；Agent 未给出时为空数组。 |

{/* script-api:end */}
