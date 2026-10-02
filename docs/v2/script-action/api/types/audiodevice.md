---
title: "AudioDevice"
description: "AudioDevice的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/audiodevice
comments: false
sidebar_position: 10
---

{/* script-api:start */}

音频设备（ListAudioDevices 返回）。

## 构造

```csharp
AudioDevice(string Id, string Name, bool IsDefault)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Id` | `string` | 系统设备 Id，可传给 SetDefaultAudioDevice。 |
| `Name` | `string` | 设备名称，如“扬声器 (Realtek(R) Audio)”。 |
| `IsDefault` | `bool` | 是否为当前默认设备（多媒体）。 |

{/* script-api:end */}
