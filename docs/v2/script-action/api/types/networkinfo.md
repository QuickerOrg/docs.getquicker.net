---
title: "NetworkInfo"
description: "NetworkInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/networkinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

本机网络状态（Sys.GetNetwork 返回）。

## 构造

```csharp
NetworkInfo(bool Online, NetworkAdapterInfo[] Adapters)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Online` | `bool` | 系统认为至少有一个可用的网络连接。 |
| `Adapters` | `NetworkAdapterInfo[]` | 已连接（Up）的适配器，不含回环与隧道。 |

{/* script-api:end */}
