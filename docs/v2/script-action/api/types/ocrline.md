---
title: "OcrLine"
description: "OcrLine的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/ocrline
comments: false
sidebar_position: 10
---

{/* script-api:start */}

OCR 行。

## 构造

```csharp
OcrLine(string Text, Rect Bounds, double Confidence, Pt[] Polygon, int LineIndex, int ParagraphIndex, int ColumnIndex)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Text` | `string` | 见类型说明。 |
| `Bounds` | `Rect` | 行的外接矩形；source 为 Rect/null 时为屏幕物理像素，为 Img 时为图内像素。 |
| `Confidence` | `double` | 识别置信度 0–1。 |
| `Polygon` | `Pt[]` | 四点框（左上、右上、右下、左下），坐标空间同 Bounds；倾斜文字时与 Bounds 不同。 |
| `LineIndex` | `int` | 阅读顺序中的视觉行序号（0 起；全部显示器时在有版面信息的显示器之间接续）。 |
| `ParagraphIndex` | `int` | 阅读顺序中的段落序号（0 起；全部显示器时在有版面信息的显示器之间接续）。 |
| `ColumnIndex` | `int` | 分栏序号（0 起；跨栏的标题/页脚为 -1；全部显示器时按显示器各自编号）。 |

{/* script-api:end */}
