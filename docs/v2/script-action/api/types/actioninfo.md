---
title: "ActionInfo"
description: "ActionInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/actioninfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

动作信息。

## 构造

```csharp
ActionInfo(string Id, string Title, string Icon, string Description, string? SharedId, int? SharedRevision)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Id` | `string` | 见类型说明。 |
| `Title` | `string` | 见类型说明。 |
| `Icon` | `string` | 图标串（fa:… 或网址）。 |
| `Description` | `string` | 见类型说明。 |
| `SharedId` | `string?` | 动作库来源 Id；本机自建动作为 null。 |
| `SharedRevision` | `int?` | 动作库来源的版本号；本机自建动作为 null（不是本地修改次数）。 |

{/* script-api:end */}
