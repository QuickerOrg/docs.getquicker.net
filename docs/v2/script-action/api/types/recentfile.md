---
title: "RecentFile"
description: "RecentFile的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/recentfile
comments: false
sidebar_position: 10
---

{/* script-api:start */}

最近使用的文件（Files.ListRecent 返回）。

## 构造

```csharp
RecentFile(string Path, string Name, bool IsDirectory, DateTimeOffset AccessedAt)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Path` | `string` | 快捷方式解析出的目标完整路径。 |
| `Name` | `string` | 文件名。 |
| `IsDirectory` | `bool` | 目标是否文件夹（需 includeFolders: true 才会有 true）；网络目标不探测，恒为 false。 |
| `AccessedAt` | `DateTimeOffset` | 快捷方式的最近更新时间（UTC 时间点，与 PathInfo.ModifiedAt 一致），即该文件最近一次被使用的时间。 |

{/* script-api:end */}
