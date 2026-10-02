---
title: "ProcInfo"
description: "ProcInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/procinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

进程信息。

## 构造

```csharp
ProcInfo(int Pid, string Name, string Path, DateTimeOffset? StartedAt)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Pid` | `int` | 见类型说明。 |
| `Name` | `string` | 见类型说明。 |
| `Path` | `string` | 见类型说明。 |
| `StartedAt` | `DateTimeOffset?` | 进程启动时间（带本机时区偏移）；取不到（权限不足）时为 null。 |

{/* script-api:end */}
