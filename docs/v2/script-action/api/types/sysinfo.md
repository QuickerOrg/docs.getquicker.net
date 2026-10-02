---
title: "SysInfo"
description: "SysInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/sysinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

系统信息。

## 构造

```csharp
SysInfo(string MachineName, string UserName, string OsVersion, bool Locked, bool Fullscreen, bool DarkMode, bool Online, string? LanIp, long UptimeMs, bool? OnBattery = null, int? BatteryPercent = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `MachineName` | `string` | 见类型说明。 |
| `UserName` | `string` | 见类型说明。 |
| `OsVersion` | `string` | 见类型说明。 |
| `Locked` | `bool` | 工作站是否已锁定。 |
| `Fullscreen` | `bool` | 前台窗口是否全屏。 |
| `DarkMode` | `bool` | Windows 应用是否为深色模式。 |
| `Online` | `bool` | Windows 是否报告已连接互联网。 |
| `LanIp` | `string?` | 本机局域网 IPv4；取不到为 null。 |
| `UptimeMs` | `long` | Windows 开机毫秒数。 |
| `OnBattery` | `bool?` | 是否正在使用电池供电；没有电池或未知为 null。 |
| `BatteryPercent` | `int?` | 剩余电量 0–100；没有电池或未知为 null。 |

{/* script-api:end */}
