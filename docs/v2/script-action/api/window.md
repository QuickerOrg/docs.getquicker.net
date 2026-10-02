---
title: "qk.Window：窗口"
description: "qk.Window：窗口的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/window
comments: false
sidebar_position: 10
---

{/* script-api:start */}

桌面上的顶层窗口本身（查找、激活、移动/缩放、置顶、关闭等）；窗口里的按钮、输入框等界面元素见 qk.Uia。Win 仅本次运行有效；子窗口只能查询，不能激活/排列/关闭；高权限窗口被拒绝。常见错误码：WINDOW_LIMIT_EXCEEDED（超出次数或枚举上限）、WINDOW_REF_STALE（窗口已关闭）、ELEVATED_TARGET_DENIED（高权限窗口）、WINDOW_UNAVAILABLE（窗口隐藏/最小化或无法校验，不能用于该操作）、WINDOW_CHANGED（操作期间窗口被移动、改变大小或遮挡）。

<a id="window-getforeground" />

## Window.GetForeground

```csharp
Win? GetForeground()
```

当前前台窗口（顶层）；取不到时回退到动作启动时的活动窗口。

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-frompoint" />

## Window.FromPoint

```csharp
Win? FromPoint(Pt? point = null, bool root = true)
```

指定点下的窗口；没有返回 null。

| 参数声明 | 说明 |
|---|---|
| `Pt? point = null` | 屏幕点；null 为当前鼠标位置。 |
| `bool root = true` | true（默认）返回顶层窗口；false 返回点下最深的子窗口/控件（如给 Edit 发 WM_SETTEXT；对顶层窗口发 WM_SETTEXT 改的是标题）。子窗口只能查询与发消息。 |

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-find" />

## Window.Find

```csharp
Win? Find(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false)
```

查找首个匹配的顶层窗口；无则返回 null。候选窗口超过枚举上限仍未确定结果时抛 WINDOW_LIMIT_EXCEEDED。

| 参数声明 | 说明 |
|---|---|
| `string title = ""` | 标题包含匹配，不区分大小写（regex 为 true 时为正则）。 |
| `string process = ""` | 进程名，完整匹配、不区分大小写，可带 .exe（notepad 或 notepad.exe）。 |
| `string className = ""` | 窗口类名（完整匹配，不区分大小写）。 |
| `bool regex = false` | 见本成员和所在域的说明。 |
| `bool hidden = false` | 包含不可见窗口。 |

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-findall" />

## Window.FindAll

```csharp
Win[] FindAll(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false, int limit = 64)
```

列出匹配的可见顶层窗口（含空标题窗口；只需标题/进程时直接读 w.Title/w.Process）；候选窗口超过枚举上限且结果不足 limit 时抛 WINDOW_LIMIT_EXCEEDED。

| 参数声明 | 说明 |
|---|---|
| `string title = ""` | 见本成员和所在域的说明。 |
| `string process = ""` | 见本成员和所在域的说明。 |
| `string className = ""` | 见本成员和所在域的说明。 |
| `bool regex = false` | 见本成员和所在域的说明。 |
| `bool hidden = false` | 包含不可见窗口（同 Find）。 |
| `int limit = 64` | 最多返回数量（1–64）。 |

返回类型：`Win[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-findallinfo" />

## Window.FindAllInfo

```csharp
WinInfo[] FindAllInfo(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false, int limit = 64)
```

与 FindAll 相同的匹配与上限，但一次返回各窗口的信息快照（含 Bounds/State 与可继续操作的 Window 引用）；整次只计 1 次窗口观察，适合“列出后按位置/状态筛选”。

| 参数声明 | 说明 |
|---|---|
| `string title = ""` | 见本成员和所在域的说明。 |
| `string process = ""` | 见本成员和所在域的说明。 |
| `string className = ""` | 见本成员和所在域的说明。 |
| `bool regex = false` | 见本成员和所在域的说明。 |
| `bool hidden = false` | 包含不可见窗口（同 Find）。 |
| `int limit = 64` | 最多返回数量（1–64）。 |

返回类型：`WinInfo[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-listchildren" />

## Window.ListChildren

```csharp
Win[] ListChildren(Win window, string title = "", string className = "")
```

列出后代子窗口（最多 64 个）；子窗口只可查询，不能激活/排列/关闭。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `string title = ""` | 见本成员和所在域的说明。 |
| `string className = ""` | 见本成员和所在域的说明。 |

返回类型：`Win[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-info" />

## Window.Info

```csharp
WinInfo Info(Win window)
```

重新验证窗口并读取最新信息（可返回）。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |

返回类型：`WinInfo`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-activate" />

## Window.Activate

```csharp
void Activate(Win window)
```

激活顶层窗口（切换为前台；最小化的窗口会先还原）；无返回值，需要最新状态时调用 Info。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：激活窗口。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-activateprocess" />

## Window.ActivateProcess

```csharp
Win? ActivateProcess(string process, string? path = null, string? title = null, string? className = null, bool regex = false, string? hotkey = null, bool launch = true)
```

进程已运行则激活其主窗口，否则按 path 以普通权限启动并等待窗口；未运行且不启动时返回 null。提权窗口在激活前被拒绝。

| 参数声明 | 说明 |
|---|---|
| `string process` | 进程名。 |
| `string? path = null` | 未运行时启动的目标：exe/.lnk（普通权限），或网址、shell:AppsFolder\…、其他文件（系统 Shell 打开）。 |
| `string? title = null` | 窗口标题：包含匹配、不区分大小写（regex 为 true 时为正则，无效正则报 INVALID_ARGUMENT）。 |
| `string? className = null` | 窗口类名：完整匹配、不区分大小写（regex 为 true 时为正则）。 |
| `bool regex = false` | title/className 按 .NET 正则匹配。 |
| `string? hotkey = null` | 唤出窗口的快捷键（如托盘程序的唤醒键），只接受单个组合键如 "Ctrl+Alt+Q"；经输入会话发送，需要键盘能力。 |
| `bool launch = true` | 未运行时是否启动。 |

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息；激活窗口；启动程序或打开文件/网址。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-restoreforeground" />

## Window.RestoreForeground

```csharp
void RestoreForeground()
```

回到弹出面板前的前台窗口；没有记录时不操作。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：激活窗口。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-setbounds" />

## Window.SetBounds

```csharp
void SetBounds(Win window, Rect bounds)
```

设置顶层窗口位置和大小（物理像素）。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `Rect bounds` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-setstate" />

## Window.SetState

```csharp
void SetState(Win window, string state)
```

设置顶层窗口状态（普通/最小化/最大化）。隐藏/显示用 SetVisible，置于其他窗口之下用 SendToBack。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `string state` | normal&#124;minimized&#124;maximized。 取值：`normal`、`minimized`、`maximized`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-setvisible" />

## Window.SetVisible

```csharp
void SetVisible(Win window, bool visible)
```

隐藏或显示顶层窗口（不激活）；异步投递，不等待目标窗口处理。隐藏后可用 FindAll(hidden: true) 找回。不能隐藏任务栏、桌面等外壳窗口（INVALID_ARGUMENT）。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool visible` | false 隐藏，true 显示。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-sendtoback" />

## Window.SendToBack

```csharp
void SendToBack(Win window)
```

把顶层窗口置于其他窗口之下（先取消置顶）；异步投递，不等待目标窗口处理。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-settopmost" />

## Window.SetTopmost

```csharp
bool SetTopmost(Win window, bool topmost = true)
```

设置或取消置顶；返回调用后的实际置顶状态。需要切换时写 SetTopmost(w, !qk.Window.Info(w).Topmost)。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool topmost = true` | true 置顶，false 取消。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-setopacity" />

## Window.SetOpacity

```csharp
void SetOpacity(Win window, int alpha)
```

设置窗口不透明度。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `int alpha` | 0–255（0 全透明，255 不透明）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-close" />

## Window.Close

```csharp
void Close(Win window, bool kill = false)
```

发送关闭请求（程序可能询问保存）；不能关闭 Quicker 自身的窗口。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool kill = false` | 未及时关闭时强制结束窗口所属程序（可能丢失未保存数据）；需要“强制结束程序”能力，不能用于资源管理器/桌面与 Quicker 及其辅助进程。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-waitfor" />

## Window.WaitFor

```csharp
Win? WaitFor(string title = "", string process = "", string className = "", string state = "exists", int timeoutMs = 10000)
```

等待窗口达到状态；满足时返回窗口，超时返回 null。等待窗口关闭用 WaitForClose。

| 参数声明 | 说明 |
|---|---|
| `string title = ""` | 见本成员和所在域的说明。 |
| `string process = ""` | 见本成员和所在域的说明。 |
| `string className = ""` | 见本成员和所在域的说明。 |
| `string state = "exists"` | exists&#124;visible&#124;foreground。 取值：`exists`、`visible`、`foreground`。 |
| `int timeoutMs = 10000` | 超时毫秒（最长 1 小时）；同时受动作超时约束（默认 30 秒墙钟），长等待需在编辑器调大动作超时。 |

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-waitforclose" />

## Window.WaitForClose

```csharp
bool WaitForClose(string title = "", string process = "", string className = "", int timeoutMs = 10000)
```

等待匹配的窗口全部关闭（含不可见窗口；本来就没有也算关闭）：关闭返回 true，超时返回 false（超时不抛错）。

| 参数声明 | 说明 |
|---|---|
| `string title = ""` | 见本成员和所在域的说明。 |
| `string process = ""` | 见本成员和所在域的说明。 |
| `string className = ""` | 见本成员和所在域的说明。 |
| `int timeoutMs = 10000` | 超时毫秒（最长 1 小时）；同时受动作超时约束。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-toscreen" />

## Window.ToScreen

```csharp
Pt ToScreen(Win window, Pt offset, string anchor = "topLeft")
```

窗口内相对坐标转屏幕坐标：可见边界（DWM 扩展边框，不含阴影，与“鼠标”步骤一致）的锚点加 offset，返回屏幕物理像素。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `Pt offset` | 相对锚点的偏移（Pt，窗口相对的物理像素）。 |
| `string anchor = "topLeft"` | topLeft&#124;topRight&#124;bottomLeft&#124;bottomRight&#124;center；右/下边界为可见外沿，向内偏移用负数。 取值：`topLeft`、`topRight`、`bottomLeft`、`bottomRight`、`center`。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-sendmessage" />

## Window.SendMessage

```csharp
long SendMessage(Win window, int message, long wParam = 0, object? lParam = null, bool post = false, int timeoutMs = 5000)
```

【高风险】向窗口（可为子控件）发送窗口消息并返回结果；需要“发送窗口消息”能力。拒绝 Quicker 自身窗口与提权窗口；计 1 次排列操作。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `int message` | 见本成员和所在域的说明。 |
| `long wParam = 0` | 见本成员和所在域的说明。 |
| `object? lParam = null` | null/整数；string 只允许 WM_SETTEXT(0x000C) 与 WM_COPYDATA(0x004A，宿主封装 COPYDATASTRUCT，dwData 取 wParam)，不能 post；其他消息带 string 报 INVALID_ARGUMENT。系统按指针封送的消息（WM_GETTEXT、EM_GETLINE 等）只接受 0。 |
| `bool post = false` | true：PostMessage（不等待，返回 0）。 |
| `int timeoutMs = 5000` | 同步发送的超时 1–60000 毫秒；目标无响应报 WINDOW_MESSAGE_TIMEOUT。 |

返回类型：`long`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：发送任意窗口消息（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-closesimilar" />

## Window.CloseSimilar

```csharp
int CloseSimilar(Win window, bool keepCurrent = false)
```

向同一程序（可执行文件路径相同；资源管理器只限文件夹窗口）的顶层窗口发送关闭请求（程序可能询问保存或拒绝关闭），返回已发出的请求数（不等于实际关闭数）；部分失败时返回成功数；共享宿主进程或不适用的窗口报 WINDOW_ARRANGE_FAILED；计 1 次排列操作。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool keepCurrent = false` | 保留 window 本身（只关闭其他类似窗口）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-minimizesimilar" />

## Window.MinimizeSimilar

```csharp
int MinimizeSimilar(Win window)
```

最小化同一程序的顶层窗口（不抢焦点），返回受影响的窗口数（已最小化的不计）；其余规则同 CloseSimilar。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-restoresimilar" />

## Window.RestoreSimilar

```csharp
int RestoreSimilar(Win window)
```

还原同一程序中已最小化的顶层窗口（不抢焦点），返回还原的窗口数；其余规则同 CloseSimilar。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-activatesimilar" />

## Window.ActivateSimilar

```csharp
Win? ActivateSimilar(Win window, bool previous = false)
```

切换到同一程序的下一个（previous 为 true 时上一个）窗口并激活，返回该窗口；没有其他窗口返回 null。计 1 次激活操作。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool previous = false` | 见本成员和所在域的说明。 |

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：激活窗口。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="window-setedgehide" />

## Window.SetEdgeHide

```csharp
bool SetEdgeHide(Win window, bool enabled = true, string edge = "auto")
```

贴边隐藏（由 Quicker 托管，脚本结束或停止后继续生效，需要撤销时显式 SetEdgeHide(window, false)）：enabled 为 true 启用、false 停用；返回调用后的实际状态（是否启用）。启用时窗口置顶；停用时停在贴边处的可见位置并取消置顶（不还原原位置）。计 1 次排列操作。

| 参数声明 | 说明 |
|---|---|
| `Win window` | 见本成员和所在域的说明。 |
| `bool enabled = true` | 见本成员和所在域的说明。 |
| `string edge = "auto"` | auto&#124;left&#124;top&#124;right&#124;bottom；已启用时再次启用不改变贴靠的边。 取值：`auto`、`left`、`top`、`right`、`bottom`。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：改变窗口状态或位置。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
