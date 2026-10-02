---
title: "ClassifyResult"
description: "ClassifyResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/classifyresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

AI 分类结果。

## 构造

```csharp
ClassifyResult(string Key, string Reason, bool UsedDefault)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Key` | `string` | 见类型说明。 |
| `Reason` | `string` | 见类型说明。 |
| `UsedDefault` | `bool` | 模型给出未知类别、改用 defaultValue 时为 true。 |

{/* script-api:end */}
