---
title: "TextToolInput"
description: "TextToolInput的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/texttoolinput
comments: false
sidebar_position: 10
---

{/* script-api:start */}

点击时的全文、选中文字及 UTF-16 选区；Prompt 的 FieldKey 为 null，Form 为字段键。

## 构造

```csharp
TextToolInput(string Text, string SelectedText, int SelectionStart, int SelectionLength, string? FieldKey)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Text` | `string` | 见类型说明。 |
| `SelectedText` | `string` | 见类型说明。 |
| `SelectionStart` | `int` | 见类型说明。 |
| `SelectionLength` | `int` | 见类型说明。 |
| `FieldKey` | `string?` | 见类型说明。 |

{/* script-api:end */}
