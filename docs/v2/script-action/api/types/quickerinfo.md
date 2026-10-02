---
title: "QuickerInfo"
description: "QuickerInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/quickerinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Quicker 信息。

## 构造

```csharp
QuickerInfo(string Version, bool IsPro, string? UnionId, bool Paused, string Theme, long UptimeMs)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Version` | `string` | 版本号，如 "2.0.1.0"。 |
| `IsPro` | `bool` | 当前是否为专业版。 |
| `UnionId` | `string?` | 标识当前 Quicker 用户的不透明字符串，与组合动作“获取 Quicker 信息”的 UnionId 相同；不是账号 Id，不能用来登录或反查账号；未登录为 null。 |
| `Paused` | `bool` | Quicker 是否处于暂停状态。 |
| `Theme` | `string` | light&#124;dark&#124;autoLight&#124;autoDark。 |
| `UptimeMs` | `long` | Quicker 已运行毫秒数。 |

{/* script-api:end */}
