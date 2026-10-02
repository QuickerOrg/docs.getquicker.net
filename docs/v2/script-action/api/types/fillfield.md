---
title: "FillField"
description: "FillField的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/fillfield
comments: false
sidebar_position: 10
---

{/* script-api:start */}

表单填写的逐字段结果。

## 构造

```csharp
FillField(string Key, string Label, bool Required, string Status, string? Code, string? Message)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Key` | `string` | 字段 key。 |
| `Label` | `string` | 字段标签。 |
| `Required` | `bool` | 是否必填。 |
| `Status` | `string` | filled&#124;unchanged&#124;matched（dryRun 预检通过）&#124;failed&#124;skipped。 |
| `Code` | `string?` | 扩展给出的失败码（成功为 null）。 |
| `Message` | `string?` | 失败或跳过的说明（成功为 null）。 |

{/* script-api:end */}
