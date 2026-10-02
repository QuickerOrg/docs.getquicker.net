---
title: "TextResult"
description: "TextResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/textresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

文本窗口结果：最终文本、选中文本、光标位置与点击的操作值。

## 构造

```csharp
TextResult(string Text, string SelectedText, int Caret, string? Operation)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Text` | `string` | 见类型说明。 |
| `SelectedText` | `string` | 见类型说明。 |
| `Caret` | `int` | 见类型说明。 |
| `Operation` | `string?` | 见类型说明。 |

{/* script-api:end */}
