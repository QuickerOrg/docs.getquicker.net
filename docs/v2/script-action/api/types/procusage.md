---
title: "ProcUsage"
description: "ProcUsage的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/procusage
comments: false
sidebar_position: 10
---

{/* script-api:start */}

进程资源占用（Process.ListUsage 返回）。

## 构造

```csharp
ProcUsage(int Pid, string Name, double CpuPercent, long MemoryBytes)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Pid` | `int` | 进程 Id。 |
| `Name` | `string` | 进程名（不含 .exe）。 |
| `CpuPercent` | `double` | 约 0.5 秒采样区间内占整机全部逻辑处理器的百分比（0–100，已按处理器数归一，1 位小数）。 |
| `MemoryBytes` | `long` | 工作集（物理内存占用），字节。 |

{/* script-api:end */}
