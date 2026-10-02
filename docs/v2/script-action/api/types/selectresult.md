---
title: "SelectResult"
description: "SelectResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/selectresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

单选结果。

## 构造

```csharp
SelectResult(string? Value, int Index, string Title, object? Item, string? Operation, string Filter)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Value` | `string?` | 选中项的值；只选了操作（没有高亮项）时为 null。 |
| `Index` | `int` | 选中项的序号；点了操作（Operation）时为当时高亮的项（右键点中的项，或用键盘/selected 选中的项），没有高亮项时为 -1。 |
| `Title` | `string` | 见类型说明。 |
| `Item` | `object?` | 原始项（字符串或 Item）；只选了操作时为 null。 |
| `Operation` | `string?` | 选中的右键/全局操作值；直接选择时为 null。 |
| `Filter` | `string` | 关闭时的筛选文字。 |

{/* script-api:end */}
