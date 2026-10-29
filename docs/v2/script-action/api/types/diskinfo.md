---
title: "DiskInfo"
description: "DiskInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/diskinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

磁盘/驱动器（Sys.ListDisks 返回）。

## 构造

```csharp
DiskInfo(string Name, string? Label, string DriveType, string? Format, long? TotalBytes, long? FreeBytes, bool IsReady)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Name` | `string` | 盘符根，如 "C:\"。 |
| `Label` | `string?` | 卷标；驱动器未就绪为 null。 |
| `DriveType` | `string` | fixed &#124; removable &#124; network &#124; cdrom &#124; ram &#124; noRootDirectory &#124; unknown。 |
| `Format` | `string?` | 文件系统，如 NTFS；未就绪为 null。 |
| `TotalBytes` | `long?` | 总容量（字节）；未就绪为 null。 |
| `FreeBytes` | `long?` | 当前用户可用的剩余空间（字节，受配额限制）；未就绪为 null。 |
| `IsReady` | `bool` | 驱动器是否就绪（光驱无盘、断开的网络盘、约 0.5 秒内没有响应的网络盘为 false）。 |

{/* script-api:end */}
