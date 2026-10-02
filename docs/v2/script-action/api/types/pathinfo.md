---
title: "PathInfo"
description: "PathInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/pathinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

文件或目录的基本信息；Length 对目录为 null。

## 构造

```csharp
PathInfo(string Path, string Name, bool IsDirectory, long? Length, DateTimeOffset ModifiedAt)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Path` | `string` | 见类型说明。 |
| `Name` | `string` | 见类型说明。 |
| `IsDirectory` | `bool` | 见类型说明。 |
| `Length` | `long?` | 见类型说明。 |
| `ModifiedAt` | `DateTimeOffset` | 见类型说明。 |

{/* script-api:end */}
