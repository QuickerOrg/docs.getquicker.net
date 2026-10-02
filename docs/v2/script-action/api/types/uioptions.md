---
title: "UiOptions"
description: "UiOptions的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/uioptions
comments: false
sidebar_position: 10
---

{/* script-api:start */}

窗口类 UI 的共享选项（标题、位置、置顶、焦点、字体、输入法、自动关闭等）；各方法只使用其支持的字段（见方法说明），其余忽略。

## 构造

```csharp
UiOptions(string? Title = null, string? Help = null, string Position = "mouse", Rect? Bounds = null, bool Topmost = true, bool RestoreFocus = true, bool CloseOnBlur = false, bool NoFocus = false, int FontSize = 0, string? Font = null, string? Ime = null, int AutoCloseMs = 0, string? Key = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string?` | 窗口标题；缺省为动作标题。 |
| `Help` | `string?` | 帮助说明（Markdown，显示在窗口的帮助入口）；不支持图片与 HTML 标签。Select/Prompt/PromptDate/Form 使用。 |
| `Position` | `string` | 窗口位置：mouse&#124;mouse2&#124;center&#124;topLeft&#124;topCenter&#124;topRight&#124;leftCenter&#124;rightCenter&#124;bottomLeft&#124;bottomCenter&#124;bottomRight&#124;last；last 仅 Select/SelectMany 支持，其余降级为 mouse；Alert/Confirm/Ask 与文件对话框忽略。 |
| `Bounds` | `Rect?` | 指定窗口矩形（物理像素），优先于 Position；Select/SelectMany/Form/ShowText 支持，Prompt/PromptNumber/PromptDate 降级为 mouse，Alert/Confirm/Ask 与文件对话框忽略。 |
| `Topmost` | `bool` | 是否置顶。 |
| `RestoreFocus` | `bool` | 关闭后是否恢复原前台窗口。 |
| `CloseOnBlur` | `bool` | 失去焦点时自动关闭：Select/Prompt/PromptDate 视为取消（返回 null）；ShowText 照常返回关闭时的结果。 |
| `NoFocus` | `bool` | 显示时不抢键盘焦点。 |
| `FontSize` | `int` | 字号；0 为默认。 |
| `Font` | `string?` | 字体名称（如 微软雅黑）；不能包含 / \ : #。 |
| `Ime` | `string?` | 输入法：on&#124;off；null 为不切换。 |
| `AutoCloseMs` | `int` | 自动关闭时长（毫秒；0 为不自动关闭；窗口按整秒计时，不足 1 秒向上取整）。仅 Select/SelectMany/ShowImage 使用。 |
| `Key` | `string?` | 窗口标识：再次显示同 Key 窗口时，关闭本动作仍打开的旧窗口并沿用其位置（仅 Select/SelectMany/ShowText 使用）；按动作隔离，位置不持久化。 |

{/* script-api:end */}
