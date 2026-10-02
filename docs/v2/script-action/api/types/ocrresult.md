---
title: "OcrResult"
description: "OcrResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/ocrresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

OCR 结果：全文、各行与智能排版文本。

## 构造

```csharp
OcrResult(string Text, OcrLine[] Lines, string LayoutText)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Text` | `string` | 各行按阅读顺序以换行连接（段落之间多一个空行）。 |
| `Lines` | `OcrLine[]` | 见类型说明。 |
| `LayoutText` | `string` | 智能排版文本：段内折行拼接、双栏按阅读顺序；旧版 OCR Agent 不提供时与 Text 相同。 |

{/* script-api:end */}
