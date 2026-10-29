---
title: "NetworkAdapterInfo"
description: "NetworkAdapterInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/networkadapterinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

一个已连接的网络适配器（Sys.GetNetwork 返回）。

## 构造

```csharp
NetworkAdapterInfo(string Name, string Type, string? Ssid, int? SignalPercent, string[] Ipv4, string[] Ipv6, string[] Gateway, string[] Dns)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Name` | `string` | 适配器名称，如“WLAN”“以太网”。 |
| `Type` | `string` | wifi &#124; ethernet &#124; mobile &#124; ppp &#124; other。 |
| `Ssid` | `string?` | Wi-Fi 名称；非 Wi-Fi 适配器或系统不提供时为 null。 |
| `SignalPercent` | `int?` | Wi-Fi 信号强度 0–100（系统信号格数 × 20，只有 0/20/40/60/80/100 六档）；取不到为 null。 |
| `Ipv4` | `string[]` | IPv4 地址。 |
| `Ipv6` | `string[]` | IPv6 地址（不含链路本地地址）。 |
| `Gateway` | `string[]` | 默认网关地址。 |
| `Dns` | `string[]` | DNS 服务器地址。 |

{/* script-api:end */}
