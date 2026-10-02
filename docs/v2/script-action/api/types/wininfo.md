---
title: "WinInfo"
description: "WinInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/wininfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

窗口信息快照（可返回）。

## 构造

```csharp
WinInfo(string Title, string Process, string Path, int Pid, string ClassName, Rect Bounds, int Dpi, bool Visible, string State, bool Topmost, Win Window)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 见类型说明。 |
| `Process` | `string` | 进程名，不含 .exe（如 notepad）。 |
| `Path` | `string` | 见类型说明。 |
| `Pid` | `int` | 见类型说明。 |
| `ClassName` | `string` | 见类型说明。 |
| `Bounds` | `Rect` | 窗口外框（物理像素，GetWindowRect，含不可见的调整边框/阴影区域；与 SetBounds 同一语义）。 |
| `Dpi` | `int` | 见类型说明。 |
| `Visible` | `bool` | 见类型说明。 |
| `State` | `string` | normal&#124;minimized&#124;maximized。 |
| `Topmost` | `bool` | 见类型说明。 |
| `Window` | `Win` | 该窗口的本次运行引用，可继续交给 qk.Window（激活、排列等）；返回或写入 State 时编码为 null。 |

{/* script-api:end */}
