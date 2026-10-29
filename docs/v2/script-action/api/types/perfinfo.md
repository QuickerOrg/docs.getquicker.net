---
title: "PerfInfo"
description: "PerfInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/perfinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

整机性能（Sys.GetPerf 返回）。

## 构造

```csharp
PerfInfo(double CpuPercent, long MemoryUsedBytes, long MemoryTotalBytes)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `CpuPercent` | `double` | 整机 CPU 占用 0–100（约 0.5 秒采样，1 位小数）。 |
| `MemoryUsedBytes` | `long` | 已用物理内存，字节。 |
| `MemoryTotalBytes` | `long` | 物理内存总量，字节（开机时长见 Sys.Info().UptimeMs）。 |

{/* script-api:end */}
