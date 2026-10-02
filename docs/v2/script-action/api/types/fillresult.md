---
title: "FillResult"
description: "FillResult的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/fillresult
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表单填写结果。

## 构造

```csharp
FillResult(bool AllRequiredOk, int FilledCount, int FailedCount, bool NeedsCheck, string[] Warnings, FillField[] Fields)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `AllRequiredOk` | `bool` | 必填字段是否全部成功（dryRun 时为全部预检通过）。 |
| `FilledCount` | `int` | 已写入的字段数（dryRun 为 0）。 |
| `FailedCount` | `int` | 失败的字段数。 |
| `NeedsCheck` | `bool` | 有字段失败、被扩展跳过或使用了备用定位，需要人工检查页面。 |
| `Warnings` | `string[]` | 提示：data 中模板没有的 key、字段定位警告（“key：说明”）。 |
| `Fields` | `FillField[]` | 逐字段结果。 |

{/* script-api:end */}
