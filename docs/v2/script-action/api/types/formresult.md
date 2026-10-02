---
title: "FormResult"
description: "FormResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/formresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表单结果：各字段值、点击的按钮值与当前分组。

## 构造

```csharp
FormResult(IReadOnlyDictionary<string, object?> Values, string Button, string? Group)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Values` | `IReadOnlyDictionary<string, object?>` | 见类型说明。 |
| `Button` | `string` | 见类型说明。 |
| `Group` | `string?` | 见类型说明。 |

{/* script-api:end */}
