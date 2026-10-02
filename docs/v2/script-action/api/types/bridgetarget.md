---
title: "BridgeTarget"
description: "BridgeTarget的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/bridgetarget
comments: false
sidebar_position: 10
---

{/* script-api:start */}

软件连接的一个已连接实例。

## 构造

```csharp
BridgeTarget(string Id, int? Pid, string Title, string Document, string HostVersion, string BridgeVersion, string? Kind, DateTimeOffset? ConnectedAt)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Id` | `string` | 会话 Id（没有时为实例 Id）。 |
| `Pid` | `int?` | 进程 Id；Adobe 系软件不提供，为 null。 |
| `Title` | `string` | 当前文档标题。 |
| `Document` | `string` | 当前文档路径；未保存为空串。 |
| `HostVersion` | `string` | 软件版本。 |
| `BridgeVersion` | `string` | 连接插件版本。 |
| `Kind` | `string?` | 子组件（WPS：wps&#124;et&#124;wpp），其余为 null。 |
| `ConnectedAt` | `DateTimeOffset?` | 连接时间。 |

{/* script-api:end */}
