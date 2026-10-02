---
title: "ScreenInfo"
description: "ScreenInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/screeninfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

显示器信息（物理像素）。

## 构造

```csharp
ScreenInfo(Rect Bounds, Rect WorkArea, int Dpi, bool Primary, string? Id = null, string? Name = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Bounds` | `Rect` | 见类型说明。 |
| `WorkArea` | `Rect` | 工作区（不含任务栏）。 |
| `Dpi` | `int` | 有效 DPI（96 为 100%）。 |
| `Primary` | `bool` | 是否主显示器。 |
| `Id` | `string?` | 显示器设备标识，可传给 qk.Sys.GetBrightness/SetBrightness 的 screen；取不到为 null。 |
| `Name` | `string?` | 显示器名称（通常为型号）；取不到为 null。 |

{/* script-api:end */}
