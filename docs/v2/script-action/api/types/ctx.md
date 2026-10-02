---
title: "Ctx"
description: "Ctx的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/ctx
comments: false
sidebar_position: 10
---

{/* script-api:start */}

运行上下文快照。

## 构造

```csharp
Ctx(string ActionId, Guid RunId, string ActionTitle, string Trigger, DateTimeOffset StartedAt, bool Debugging, string? Text, Pt Mouse, Win? MouseWindow, Win? ActiveWindow, string? MouseProcess, int? MouseDpi, Img? Image = null, string? Input = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `ActionId` | `string` | 见类型说明。 |
| `RunId` | `Guid` | 见类型说明。 |
| `ActionTitle` | `string` | 见类型说明。 |
| `Trigger` | `string` | 触发方式（camelCase 封闭取值）：panel&#124;floatButton&#124;floatPanel&#124;dashboard&#124;editor&#124;circleMenu&#124;search&#124;searchInput&#124;searchCallback&#124;searchContextMenu&#124;hotkey（含扩展热键）&#124;hotkeyWatcher&#124;triggerKey&#124;mouse&#124;leftButtonPlus&#124;scrollOnButton&#124;advancedMouseAction&#124;gesture&#124;textCommand&#124;textToolbar&#124;screenshot&#124;contextMenu&#124;association&#124;browserContextMenu&#124;webpageButton&#124;event&#124;autoRun&#124;mobileApp&#124;androidRemote&#124;external&#124;other（未识别）。 |
| `StartedAt` | `DateTimeOffset` | 见类型说明。 |
| `Debugging` | `bool` | 见类型说明。 |
| `Text` | `string?` | 触发上下文附带的文本（如从文本工具条触发时选中的文本）；没有为 null。与 Input 不互相回退。 |
| `Mouse` | `Pt` | 弹出面板前的鼠标位置；没有面板（热键、调试运行）时为运行开始时的鼠标位置（与 qk.Mouse.RestorePosition 的目标相同）。 |
| `MouseWindow` | `Win?` | 弹出面板前鼠标下的顶层窗口（句柄；不一定是前台窗口）；没有记录、已关闭或更高权限时为 null。返回或写入 State 时编码为 null，需要信息请用 qk.Window.Info。 |
| `ActiveWindow` | `Win?` | 弹出面板前的前台窗口（句柄；即 qk.Window.RestoreForeground 的目标）；没有记录、已关闭或更高权限时为 null。返回或写入 State 时编码为 null。实时前台窗口用 qk.Window.GetForeground()。 |
| `MouseProcess` | `string?` | MouseWindow 所属进程名，不含 .exe（如 notepad，与 WinInfo.Process 一致）；没有为 null。 |
| `MouseDpi` | `int?` | 目标点所在屏幕的 DPI；未采集时为 null。 |
| `Input` | `string?` | 调用方传入的原始输入字符串（运行动作步骤、qk.Actions.Call 的 input、右键附加菜单的值、文本指令等；与 Main 的 quicker_in_param 同值）；没有为 null。与 Text 不互相回退。 |
| `Image` | `Img?` | 图片上下文参数（如从截图工具栏触发时的图片）；没有为 null。首次读取时才复制像素（计入图片限额；复制失败返回 null 并记警告）。句柄：返回或写入 State 时编码为 null。 |

{/* script-api:end */}
