---
title: 脚本动作 API 参考
description: 脚本动作中 qk 对象各域成员、数据类型、运行限额与错误码说明。以编辑器补全与当前 Quicker 行为为准。
sidebar_position: 3
quickerDocKey: v2/features/script-actions/api
comments: true
---

# 脚本动作 API 参考

> 本文列出脚本中可用的 `qk` 成员，按功能域组织。签名与中文说明以当前 Quicker 编辑器补全为准；`qk` API 随版本演进时，编辑器的「检查」会指出旧写法并给出新写法。
>
> 相关文档：[脚本动作入门](./)、[脚本动作安全与授权](./security)。

## 阅读说明

- **能力**：需要授权确认的能力（仅对导入/安装来源的动作确认，见 [安全与授权](./security)）。写“无”表示不需要确认。
- **写法**：请直接写 `qk.域.方法(...)`，不要把 `qk` 或 `qk.Files` 等赋给变量再调用，否则 Quicker 无法识别所需能力。
- **通用约定**：
  - 时长、超时一律为**毫秒**（参数名以 `Ms` 结尾）；`timeoutMs = 0` 表示不单独限时，但任何调用都受动作总超时约束。
  - 屏幕坐标为**物理像素**，主显示器左上为 (0, 0)，其他显示器可以是负坐标；图片内坐标以图片左上为原点；界面尺寸（如表单宽度）为逻辑像素。
  - **用户取消返回 `null`**（`Confirm` 返回 `false`）；**查询无结果返回 `null` 或空数组**；失败抛 `ActionApiException`，按错误码判断（见[错误码表](#错误码表)）。
  - 所有失败都可能出现 `INVALID_ARGUMENT`（参数不合法）、`CAPABILITY_DENIED`（未获授权或在停止后的清理阶段调用）、`LIMIT_EXCEEDED`（超出限额），下文不再逐条列出。
  - “持久”表示效果在脚本运行结束后仍然保留。

## 目录

- [入口：Main、ActionParameter、ActionMenu](#入口)
- [根成员：Log、Wait、Context](#根成员)
- [Selection](#qkselection选区)、[State](#qkstate动作状态)、[Actions](#qkactions动作)、[Ui](#qkui对话框与界面)、[Window](#qkwindow窗口)、[Keyboard](#qkkeyboard键盘)、[Mouse](#qkmouse鼠标)、[Clipboard](#qkclipboard剪贴板)、[Files](#qkfiles文件)、[Process](#qkprocess进程)、[Image 与 Img](#qkimage-与-img图片)、[Text](#qktext文本工具)、[Http](#qkhttp网络)、[Screen](#qkscreen截屏)、[Vision](#qkvision找图找字与-ocr)、[Browser](#qkbrowser浏览器)、[Apps](#qkapps外部程序)、[Ai](#qkaiai-与翻译)、[Uia](#qkuia界面自动化)、[Quicker](#qkquickerquicker-服务)、[Sys](#qksys系统)、[Steps](#qksteps组合动作步骤)
- [数据类型](#数据类型)、[每次运行的限额](#每次运行的限额)、[错误码表](#错误码表)、[字符串取值表](#字符串取值表)

---

## 入口

| 项 | 说明 |
|---|---|
| `Main(...)` | 唯一入口，不能重载，不能带修饰符或泛型。参数即输入，返回值即输出（`void` 无输出）。参数类型：`string`、`string?`、`bool`、`int`、`long`、`double`、`decimal`、`int?`、`bool?`、`string[]`、`int[]`、`object`、`DateTimeOffset`、`TimeSpan`；最多 64 个 |
| 必填推断 | 非可空且无默认值 = 必填；可空（`?`）或有默认值 = 可选 |
| `[ActionParameter("标题", Description, Options, MultiLine, Required, Ask)]` | 修饰 `Main` 参数。`Options` 每行“标题\|值”，只用于 `string`；`Ask = true` 表示交互运行时总是弹出表单确认 |
| `string quicker_in_param = ""` | 接收动作的原始输入文本；始终可选，不触发表单，不能标 `Ask`；不声明时可用 `qk.Context.Input` 读取 |
| `[ActionMenu("组/项", Description, Icon)]` | 修饰无参、返回 `void` 的方法，生成固定右键菜单项；点击只运行该方法、不运行 `Main` |
| 返回值 | 单值最多 1 MiB、10,000 项、32 层；`Win`/`Img`/`El` 等句柄不能返回（`CODEC_UNSUPPORTED`） |
| 运行超时 | 默认 30 秒，可设 0.1 秒–24 小时或不限制；等待对话框和按键的时间也计入 |

## 根成员

| 签名 | 说明 | 能力 |
|---|---|---|
| `void qk.Log(string message, string level = "info")` | 写运行日志；`level`：`debug`、`info`、`warn`、`error`；单条最多 4096 字符。停止后的 `finally` 中可用 | 无 |
| `void qk.Wait(int durationMs)` | 等待指定毫秒，可被停止打断 | 无 |
| `Ctx qk.Context { get; }` | 本次运行的只读上下文快照（动作信息、触发方式、触发时的窗口与鼠标、传入的文本/图片等；首次读取时生成，运行内不变）；要保存的数据见 `qk.State` | 无 |

`Ctx` 的字段：

| 字段 | 说明 |
|---|---|
| `string ActionId`、`string ActionTitle` | 当前动作的 Id 与标题 |
| `Guid RunId` | 本次运行的 Id |
| `string Trigger` | 触发方式，如 `panel`、`hotkey`、`contextMenu`、`editor`，完整取值见[字符串取值表](#字符串取值表) |
| `DateTimeOffset StartedAt` | 运行开始时间 |
| `bool Debugging` | 是否为调试运行 |
| `string? Input` | 调用方传入的原始输入（与 `quicker_in_param` 同值）；没有为 `null` |
| `string? Text` | 触发时附带的上下文文本（如文本工具栏）；没有为 `null`；与 `Input` 互不代替 |
| `Pt Mouse` | 弹出面板前的鼠标位置；没有面板时为运行开始时的位置 |
| `Win? MouseWindow` | 弹出面板前鼠标下的顶层窗口；没有记录、已关闭或属于管理员程序时为 `null` |
| `Win? ActiveWindow` | 弹出面板前的前台窗口（`qk.Window.RestoreForeground()` 的目标） |
| `string? MouseProcess`、`int? MouseDpi` | `MouseWindow` 的进程名（不含 `.exe`）与所在屏幕 DPI |
| `Img? Image` | 触发时附带的图片（如从截图工具栏触发）；首次读取时才复制像素 |

---

## qk.Selection（选区）

前台程序中用户当前选中的内容（选中文本、资源管理器/桌面中选中的文件）；读写剪贴板见 `qk.Clipboard`，资源管理器当前文件夹见 `qk.Files.GetExplorerPath/SetExplorerPath`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `string? GetText(int timeoutMs = 500, string format = "text")` | 模拟复制读取当前选中的内容；`format`：`text`、`html`、`rtf`、`csv`；无选中返回 `null`。会临时占用剪贴板，完成后恢复 | 读取选中文本 / `SELECTION_UNAVAILABLE`、`SELECTION_FAILED` |
| `string[] GetFiles()` | 资源管理器或桌面中选中的文件/文件夹完整路径；不在资源管理器中返回空数组 | 读取资源管理器选中路径 |
只支持 Windows 资源管理器与桌面。读取/切换资源管理器当前文件夹见 `qk.Files.GetExplorerPath/SetExplorerPath`。

## qk.State（动作状态）

当前动作自己的状态存储（本机，与图形动作共用）；跨设备存储见 `qk.Quicker.GetCloud`。

状态属于当前动作，与组合动作的“状态存储”互通；未保存的动作只在本次运行内保留。键为 1–256 个字符，单值最多 1 MiB。全部方法在停止后的 `finally` 中可用。能力：无。

| 签名 | 说明 |
|---|---|
| `T? Get<T>(string key, T? defaultValue = default)` | 读取 JSON 状态；不存在返回 `defaultValue`。类型不符报 `CODEC_VALUE_INVALID` |
| `void Set(string key, object? value)` | 写入 JSON 状态（不能写 `Win`、`Img` 等句柄） |
| `string? GetText(string key)` | 读取原始文本状态（与组合动作的文本状态互通） |
| `void SetText(string key, string value)` | 写入原始文本状态；`"*NULL*"` 是保留值，不能写入 |
| `void Remove(string key)` | 删除；不存在时无操作 |
| `T? GetGlobal<T>(string key, T? defaultValue = default)` / `void SetGlobal(string key, object? value)` | 跨动作共享的全局状态（JSON），慎用 |
| `string? GetGlobalText(string key)` / `void SetGlobalText(string key, string value)` | 全局状态的原始文本 |
| `void RemoveGlobal(string key)` | 删除全局状态键 |

不要用 `Get<T>` 读取 `SetText` 写入的普通文本。常见错误码：`STATE_UNAVAILABLE`、`CODEC_VALUE_INVALID`。

## qk.Actions（动作）

调用和管理 Quicker 动作（同步调用本机动作或公共子程序、查询/停止运行中的动作、设置当前动作的角标与右键菜单）；启动外部程序见 `qk.Process`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `object? Call(string action, string? input = null)` | 同步调用本机动作（Id 或名称），`input` 为原始输入字符串；返回被调动作的结果 | 调用动作 / `CALL_FAILED`（被调方错误码在 `e.Detail`）、`CALL_DEPTH_LIMIT_EXCEEDED` |
| `ActionInfo? Info(string action)` | 读取动作信息，找不到返回 `null`；安装来源的脚本只能读自身 | 无 / `ACCESS_DENIED` |
| `int GetRunningCount(string? action = null)` | 动作正在运行的实例数（含本次）；`null` 为当前动作 | 无 / `ACCESS_DENIED` |
| `IReadOnlyDictionary<string, object?> CallSubprogram(string name, IDictionary<string, object?>? inputs = null)` | 调用本机公共子程序，返回输出参数 | 调用动作 / `SUBPROGRAM_NOT_FOUND`、`CALL_FAILED` |
| `int Stop(string action)` | 停止指定动作正在运行的实例（不含本次），返回停止的实例数 | 调用动作 |
| `void StopOthers()` | 停止当前动作的其他运行实例 | 无 |
| `void SetBadge(string? text, string? color = null, string? textColor = null)` | 设置当前动作按钮的角标（持久），`null` 清除；停止后的 `finally` 中只能清除 | 无 |
| `void SetOverlay(string? icon, string? tooltip = null)` | 设置按钮角落的覆盖图标（`fa:` 图标，持久），`null` 清除 | 无 |
| `void SetContextMenu(string? menu)` | 设置当前动作的附加右键菜单（持久），每行“[fa:图标]标题\|值”，`"[+]组名"` 后接 `"[-]标题\|值"` 为子菜单，`"----"` 为分隔线，最多 100 行；点击后以该值为输入重新运行 `Main` | 无 |
| `void ShowContextMenu(string? action = null, bool customOnly = true)` | 在鼠标处弹出动作的右键菜单后立即返回 | 调用动作 / `ACCESS_DENIED` |

被调用的动作或子程序被用户取消时，本脚本也随之停止。

## qk.Ui（对话框与界面）

Quicker 自己弹出的对话框、通知与窗口；操作其他程序窗口里的界面元素见 `qk.Uia`。

所有方法能力均为“无”（`Notify` 带 `click` 时另需启动程序）。`options` 为共享界面选项（见 [UiOptions](#数据类型)）。取消返回 `null`。列表最多 200 项。常见错误码：`DIALOG_LIMIT_EXCEEDED`、`NOTIFY_LIMIT_EXCEEDED`、`UI_UNAVAILABLE`。

| 签名 | 说明 |
|---|---|
| `SelectResult? Select(IEnumerable<object> items, string? note = null, string? selected = null, string[]? operations = null, bool quick = false, bool? filter = null, string? filterText = null, UiOptions? options = null)` | 单选。`items` 为 `"[fa:图标]标题\|值"` 字符串或 `Item`；`operations` 为附加操作菜单“标题\|值”，选中后写入 `SelectResult.Operation`；`filter` 为 `null` 时超过 10 项自动显示筛选框 |
| `SelectManyResult? SelectMany(IEnumerable<object> items, string? note = null, IEnumerable<string>? selected = null, string[]? operations = null, bool allowEmpty = false, bool? filter = null, string? filterText = null, UiOptions? options = null)` | 多选 |
| `string? Prompt(string message, string value = "", bool multiline = false, bool required = false, string? pattern = null, string? tools = null, bool enterSubmit = true, UiOptions? options = null)` | 输入文本；`pattern` 为正则校验 |
| `double? PromptNumber(string message, double? value = null, string? pattern = null, UiOptions? options = null)` | 输入数字；`null` 只表示取消 |
| `DateTimeOffset? PromptDate(string message, DateTimeOffset? value = null, UiOptions? options = null)` | 选择日期时间（本地时区） |
| `void Alert(string message, string icon = "info", UiOptions? options = null)` | 消息框；`icon`：`none`、`info`、`question`、`warn`、`error` |
| `bool Confirm(string message, bool yesNo = false, string icon = "question", UiOptions? options = null)` | 确认返回 `true`，否认或关闭返回 `false` |
| `string? Ask(string message, IEnumerable<string> buttons, string? defaultValue = null, string icon = "question", UiOptions? options = null)` | 自定义按钮“[图标]标题(_K)\|值”，返回所点按钮的值 |
| `FormResult? Form(IEnumerable<Field> fields, IDictionary<string, object?>? values = null, string? note = null, string[]? buttons = null, string? group = null, bool enterSubmit = true, int width = 0, int labelWidth = 0, UiOptions? options = null)` | 表单，返回 `Values`（字段键 → 值）、`Button`、`Group`。字段类型见 [Field](#数据类型) |
| `TextResult ShowText(string text, string[]? operations = null, string? language = null, bool wrap = true, bool lineNumbers = false, int caret = -1, string? saveKey = null, UiOptions? options = null)` | 显示文本并等待关闭，返回最终文本；**永不返回 `null`**。关闭后不恢复原前台窗口 |
| `void Notify(string message, string kind = "info", string? title = null, int durationMs = 0, string position = "bottomCenter", string? key = null, string duplicate = "replace", string? click = null)` | 通知，不等待。`kind`：`info`、`success`、`warn`、`error`、`toast`；`durationMs`：0 默认、-1 常驻或 2000–30000；`duplicate`：`replace`、`count`、`ignore`（需给 `key`） |
| `string? PickFile(string? filter = null, string? directory = null, UiOptions? options = null)` | 选择文件；`filter` 如 `"图片\|*.png;*.jpg"` |
| `string[]? PickFiles(string? filter = null, string? directory = null, UiOptions? options = null)` | 选择多个文件；取消为 `null`，确认空结果为空数组 |
| `string? PickSaveFile(string? filter = null, string? fileName = null, string? directory = null, UiOptions? options = null)` | 另存为对话框：选择保存路径（只返回路径，不写文件） |
| `string? PickFolder(string? directory = null, UiOptions? options = null)` | 选择文件夹 |
| `void Pin(object content, Pt? at = null, string kind = "auto")` | 贴图（持久，由用户关闭）。`content` 为 `Img` 或字符串；`kind`：`auto`、`image`、`text`、`html`、`latex`。HTML 在隔离环境中显示，不加载外部资源；置顶钉在屏幕上（看图窗口见 `ShowImage`） |
| `TextWin OpenText(string text, string[]? operations = null, string? language = null, UiOptions? options = null)` | 打开可编辑文本窗口（不等待），返回 `TextWin` 句柄；窗口在运行结束后保留 |
| `string? ShowMenu(IEnumerable<object> items, bool focus = false, int fontSize = 0, int iconSize = 0)` | 在鼠标处弹出菜单，返回所选值；`Item.Children` 为子菜单，`"-"` 为分隔线 |
| `ProgressWin OpenProgress(string text, string? title = null, double? percent = null, string[]? operations = null, bool stopOnClose = true, bool bar = false, UiOptions? options = null)` | 进度窗口（不等待）。`stopOnClose` 默认 `true`：用户点 X 即**停止本次运行**；不希望停止时传 `false`。运行结束时自动关闭 |
| `void ShowImage(Img image, double scale = 1, bool wait = false, double opacity = 1, bool noActivate = false, UiOptions? options = null)` | 看图窗口：显示图片的普通窗口（要置顶钉在屏幕上见 `Pin`） |
| `Pt? PickPoint()` | 用户在屏幕上点选一个点 / `CAPTURE_BUSY` |
| `Rect? PickArea(bool detect = true)` | 用户框选区域（只返回坐标；需要截图用 `qk.Screen.PickCapture`） |
| `Win? PickWindow()` | 用户点选窗口 / `ELEVATED_TARGET_DENIED` |
| `string? PickColor(string? initialColor = null, bool fromScreen = false, bool alpha = false)` | 选色，返回 `#RRGGBB`（`alpha` 时 `#AARRGGBB`） |
| `List<string>? EditList(IEnumerable<string> items, string? note = null, bool allowAdd = true, bool allowEdit = true, bool allowDelete = true, int width = 0, int height = 0, UiOptions? options = null)` | 列表编辑窗，确认返回新列表 |
| `List<Dictionary<string, object?>>? EditTable(IEnumerable<IDictionary<string, object?>> rows, string[]? columns = null, bool readOnly = false, int width = 0, int height = 0, UiOptions? options = null)` | 表格查看/编辑窗；确认返回的值一律为字符串 |
| `object? React(string source, object? input = null, int width = 0, int height = 0, UiOptions? options = null)` | 显示单文件 TSX 界面并等待，返回页面 `close(result)` 的值；页面不能联网 / `UI_REACT_FAILED` |

`TextWin` 句柄：`bool Closed`、`void Append(string text)`、`void SetText(string text)`、`void Activate()`、`TextResult? WaitForClose()`、`void Close()`。

`ProgressWin` 句柄：`bool Closed`、`string? Operation`（点击的附加按钮值）、`void Update(string? text = null, double? percent = null, string? title = null)`、`string? WaitForClose()`、`void Close()`。

## qk.Window（窗口）

桌面上的顶层窗口本身（查找、激活、移动/缩放、置顶、关闭等）；窗口里的按钮、输入框等界面元素见 `qk.Uia`。

`Win` 是本次运行内有效的窗口引用，只有 `Title`、`Process`（进程名，不含 `.exe`）两个只读属性，不能返回或写入状态。管理员权限的窗口会被拒绝（`ELEVATED_TARGET_DENIED`）。常见错误码：`WINDOW_REF_STALE`（窗口已关闭）、`WINDOW_LIMIT_EXCEEDED`、`WINDOW_UNAVAILABLE`、`WINDOW_CHANGED`。

匹配规则（`Find`/`FindAll`/`FindAllInfo`/`WaitFor`/`WaitForClose`）：`title` 包含匹配、`process` 与 `className` 完整匹配，均不区分大小写；`regex: true` 时 `title` 为正则。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `Win? GetForeground()` | 当前前台窗口 | 读取窗口 |
| `Win? FromPoint(Pt? point = null, bool root = true)` | 点下的窗口；`null` 为鼠标位置；`root: false` 返回最深的子窗口 | 读取窗口 |
| `Win? Find(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false)` | 第一个匹配的窗口，没有为 `null` | 读取窗口 |
| `Win[] FindAll(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false, int limit = 64)` | 全部匹配（1–64 个） | 读取窗口 |
| `WinInfo[] FindAllInfo(string title = "", string process = "", string className = "", bool regex = false, bool hidden = false, int limit = 64)` | 同 `FindAll`，一次返回各窗口信息，整次只计 1 次观察 | 读取窗口 |
| `Win[] ListChildren(Win window, string title = "", string className = "")` | 子窗口，最多 64 个 | 读取窗口 |
| `WinInfo Info(Win window)` | 读取最新窗口信息（可返回） | 读取窗口 |
| `void Activate(Win window)` | 激活窗口（最小化时先还原） | 激活窗口 / `WINDOW_ACTIVATION_FAILED` |
| `Win? ActivateProcess(string process, string? path = null, string? title = null, string? className = null, bool regex = false, string? hotkey = null, bool launch = true)` | 程序已运行则激活其主窗口，否则按 `path` 启动；`hotkey` 为单个组合键 | 读取+激活窗口、启动程序（`hotkey` 另需键盘） |
| `void RestoreForeground()` | 回到弹出面板前的前台窗口 | 激活窗口 |
| `void SetBounds(Win window, Rect bounds)` | 设置位置大小 | 调整窗口 |
| `void SetState(Win window, string state)` | `normal`、`minimized`、`maximized` | 调整窗口 |
| `void SetVisible(Win window, bool visible)` | 隐藏或显示窗口 | 调整窗口 |
| `void SendToBack(Win window)` | 置于其他窗口之下 | 调整窗口 |
| `bool SetTopmost(Win window, bool topmost = true)` | 设置/取消置顶，返回调用后的实际状态 | 调整窗口 |
| `void SetOpacity(Win window, int alpha)` | 不透明度 0–255 | 调整窗口 |
| `void Close(Win window, bool kill = false)` | 请求关闭；`kill: true` 时未及时关闭则**强制结束程序** | 调整窗口（`kill` 另需强制结束程序） |
| `Win? WaitFor(string title = "", string process = "", string className = "", string state = "exists", int timeoutMs = 10000)` | 等待窗口出现；`state`：`exists`、`visible`、`foreground`；超时返回 `null` | 读取窗口 |
| `bool WaitForClose(string title = "", string process = "", string className = "", int timeoutMs = 10000)` | 等待匹配窗口全部关闭；超时返回 `false` | 读取窗口 |
| `Pt ToScreen(Win window, Pt offset, string anchor = "topLeft")` | 窗口内偏移转屏幕坐标；`anchor`：`topLeft`、`topRight`、`bottomLeft`、`bottomRight`、`center` | 读取窗口 |
| `long SendMessage(Win window, int message, long wParam = 0, object? lParam = null, bool post = false, int timeoutMs = 5000)` | 向窗口发送消息；字符串 `lParam` 只允许 `WM_SETTEXT`、`WM_COPYDATA` | 【高风险】窗口消息 / `WINDOW_MESSAGE_TIMEOUT`、`WINDOW_MESSAGE_FAILED` |
| `int CloseSimilar(Win window, bool keepCurrent = false)` | 关闭同一程序的顶层窗口，返回已发出的关闭请求数 | 调整窗口 / `WINDOW_ARRANGE_FAILED` |
| `int MinimizeSimilar(Win window)` / `int RestoreSimilar(Win window)` | 最小化 / 还原同一程序的窗口 | 调整窗口 |
| `Win? ActivateSimilar(Win window, bool previous = false)` | 激活同一程序的下一个（或上一个）窗口 | 激活窗口 |
| `bool SetEdgeHide(Win window, bool enabled = true, string edge = "auto")` | 贴边自动隐藏（持久，直到关闭或 Quicker 退出）；`edge`：`auto`、`left`、`top`、`right`、`bottom` | 调整窗口 / `WINDOW_EDGE_HIDE_FAILED` |

子窗口只能查询，不能激活、排列或关闭；Quicker 自身的窗口不能排列或关闭。

## qk.Keyboard（键盘）

向前台窗口模拟键盘输入（按键、组合键、输入文本、粘贴）；读写剪贴板见 `qk.Clipboard`。

能力：键盘（`Paste` 另需读写剪贴板；`WaitForKey` 为键盘监听）。键盘与鼠标共用每次运行的输入限额；运行结束或停止时自动松开本次按下的键。常见错误码：`INPUT_LIMIT_EXCEEDED`、`INPUT_USER_ACTIVE`、`INPUT_UNAVAILABLE`、`INPUT_FAILED`。

| 签名 | 说明 |
|---|---|
| `void Press(string keys, int repeat = 1, int holdMs = 0)` | 按键或组合键，如 `"Ctrl+Shift+S"`、`"Enter"`、`"Ctrl+/"`；键名见表下说明 |
| `void Down(string key)` / `void Up(string key)` | 按下保持 / 松开（最多同时 8 个键）；`Up` 可在停止后的 `finally` 中调用 |
| `bool IsDown(string key, bool toggled = false)` | 读取按键状态；`toggled` 读 CapsLock 等切换状态 |
| `int Type(string text, int intervalMs = 0)` | 逐字输入，返回输入的字符数；每次运行累计最多 2000 字符 |
| `void Paste(string text, bool restore = true, int restoreDelayMs = 400)` | 经剪贴板粘贴，默认粘贴后恢复原剪贴板 |
| `void SendKeys(string keys)` | SendKeys 语法：`+` Shift、`^` Ctrl、`%` Alt、`~` Enter、`{KEY}` |
| `string? WaitForKey(string? keys = null, int timeoutMs = 0, bool swallow = false)` | 等待用户的物理按键，返回键名；超时 `null`；`swallow` 拦截该次按键 |
| `bool GetIme()` / `void SetIme(bool chinese)` | 读取 / 设置前台窗口输入法中英文状态 |

键名（不区分大小写）：字母、数字、`F1`–`F24`、`Enter`/`Tab`/`Space`/`Esc`/方向键等功能键、小键盘键（`Numpad0`、`NumpadAdd`…）、修饰键 `Ctrl`/`Shift`/`Alt`/`Win`；单个标点 `,` `.` `/` `;` `-` `=` `[` `]` `\` `'` 与反引号（按美式键位，`+` 请写 `"Shift+="`）；媒体与音量键 `MediaPlayPause`、`MediaNextTrack`、`MediaPreviousTrack`、`MediaStop`、`VolumeUp`、`VolumeDown`、`VolumeMute`；浏览器键 `BrowserBack`、`BrowserForward`、`BrowserRefresh`、`BrowserHome`；其他 Windows 键名（如 `OemPeriod`）或 `0x` 虚拟键码。`SendKeys` 的 `{KEY}` 使用同一键名，修饰键也可作用于上述标点（如 `^/`）。键名写错报 `INVALID_ARGUMENT`。

## qk.Mouse（鼠标）

模拟鼠标移动、点击、拖动与滚轮（坐标为屏幕物理像素）；不靠坐标操作控件见 `qk.Uia.Act`。

能力：鼠标。坐标为屏幕物理像素。

| 签名 | 说明 |
|---|---|
| `Pt GetPosition()` | 当前鼠标位置 |
| `Pt MoveTo(Pt to, int durationMs = 0)` | 移动到指定点，返回移动后位置 |
| `Pt MoveBy(int dx, int dy)` | 相对移动 |
| `Pt Click(Pt? at = null, string button = "left", int count = 1)` | 点击；`at` 为 `null` 时点当前位置；`button`：`left`、`right`、`middle`；`count` 1–3 |
| `void Down(string button = "left")` / `void Up(string button = "left")` | 按下保持 / 松开；`Up` 可在停止后的 `finally` 中调用 |
| `Pt Scroll(int clicks, bool horizontal = false)` | 滚轮，正数向上（水平时向右） |
| `Pt DragTo(Pt to, int durationMs = 300)` | 从当前位置拖动到目标 |
| `Pt RestorePosition()` | 回到 `qk.Context.Mouse`（弹出面板前或运行开始时的位置）；停止后的 `finally` 中可用 |
| `string GetCursor()` | 当前指针形状，如 `arrow`、`iBeam`、`hand`、`wait`；能力：无 |

## qk.Clipboard（剪贴板）

系统剪贴板的读写（文本、HTML、图片、文件列表）；读取前台选中内容见 `qk.Selection`。

能力：读取剪贴板 / 写入剪贴板。读写方法（`WaitForChange` 除外）在停止后的 `finally` 中可用，便于恢复剪贴板。常见错误码：`CLIPBOARD_UNAVAILABLE`、`CLIPBOARD_LIMIT_EXCEEDED`。

| 签名 | 说明 |
|---|---|
| `string? GetText()` / `string? GetHtml()` | 文本 / HTML 片段；没有返回 `null`（有文本格式但为空返回 `""`） |
| `string? Get(string format)` | `format` 取 `rtf`、`csv` 或自定义格式名，按文本返回；`text`/`html` 不接受（报 `INVALID_ARGUMENT`），请用 `GetText`/`GetHtml` |
| `string[] GetFiles()` | 文件路径列表；没有返回空数组 |
| `Img? GetImage()` | 剪贴板图片；没有返回 `null` |
| `void SetText(string text, bool noHistory = false)` | 写入文本；`noHistory` 不进剪贴板历史；`SetText("")` 等于清空剪贴板 |
| `void SetHtml(string html, string? text = null)` | 写入 HTML，`text` 为纯文本备用格式 |
| `void SetFiles(IEnumerable<string> paths, bool cut = false)` | 写入文件列表（路径须存在）；`cut` 为剪切（另需修改文件能力） |
| `void Set(string format, object data)` | 写入指定格式；`format` 取 `text`、`html`、`rtf`、`csv` 或自定义格式名，自定义格式可写 `string` 或 `byte[]` |
| `void SetImage(Img image)` | 写入图片 |
| `void Clear(bool history = false)` | 清空；`history: true` 同时清除系统剪贴板历史 |
| `bool WaitForChange(int timeoutMs = 5000)` | 等待内容变化，超时返回 `false`；最长 1 小时 |

## qk.Files（文件）

本机文件与文件夹（读写、复制、压缩、搜索）以及资源管理器当前文件夹；用关联程序打开文件见 `qk.Process.Open`。

能力：读取文件 / 修改文件（写入隐含读取）；`GetExplorerPath`/`SetExplorerPath` 例外，按“读取资源管理器选中路径”（`SetExplorerPath` 另需激活窗口）。文本默认**严格 UTF-8**；写入、复制、移动默认**不覆盖**；删除默认**不经过回收站**；单次读写最多 16 MiB。建议使用绝对路径。常见错误码：`FILE_NOT_FOUND`、`ACCESS_DENIED`、`FILE_FAILED`。

| 签名 | 说明 |
|---|---|
| `string GetFullPath(string path)` | 转为绝对路径 |
| `string GetRunTempDirectory()` | 本次运行专属的临时文件夹，运行结束后自动删除；取目录不需能力 |
| `bool Exists(string path)` | 文件或文件夹是否存在 |
| `PathInfo? Info(string path)` | 路径信息（是否文件夹、大小、修改时间），不存在为 `null` |
| `byte[] ReadBytes(string path)` | 读取字节 |
| `string ReadText(string path, string encoding = "utf-8")` | 读取文本；其他编码显式传入，如 `"gbk"` |
| `void WriteBytes(string path, byte[] bytes, bool overwrite = false)` | 写入字节 |
| `void WriteText(string path, string text, bool overwrite = false, string encoding = "utf-8")` | 写入文本（不写 BOM） |
| `void AppendText(string path, string text, string encoding = "utf-8")` | 追加文本（不存在则创建） |
| `string[] ListFiles(string directory, string pattern = "*", bool recursive = false)` | 列出文件 |
| `string[] ListDirectories(string directory, string pattern = "*", bool recursive = false)` | 列出子文件夹 |
| `string CreateDirectory(string path)` | 创建文件夹（含上级），已存在直接返回 |
| `void Copy(string source, string destination, bool overwrite = false)` | 复制文件；目标文件夹须已存在 |
| `void Move(string source, string destination, bool overwrite = false)` | 移动或重命名文件/文件夹 |
| `void Delete(string path, bool recursive = false, bool recycle = false)` | 删除；非空文件夹须 `recursive: true`；`recycle: true` 移到回收站（不能进回收站时报错且不删除） |
| `void Zip(string source, string zipPath, bool overwrite = false)` | 压缩文件或文件夹内容 / `ZIP_FAILED` |
| `void Unzip(string zipPath, string directory, bool overwrite = false)` | 解压（全有或全无，拒绝越出目标文件夹的条目） / `ZIP_FAILED` |
| `string GetKnownFolder(string name)` | 已知文件夹路径，如 `desktop`、`documents`、`downloads`、`temp` |
| `void Reveal(params string[] paths)` | 在资源管理器中打开并选中（同一文件夹内 1–100 个） |
| `string? GetExplorerPath()` | 当前资源管理器窗口的文件夹；不在资源管理器中返回 `null`（只支持 Windows 资源管理器与桌面） |
| `void SetExplorerPath(string directory, Win? window = null)` | 让资源管理器窗口转到指定文件夹；`window` 为 `null` 时作用于前台窗口；打开/另存为对话框见 `qk.Uia.SetDialogPath` / `FILE_NOT_FOUND`、`EXPLORER_NOT_FOUND` |
| `string Hash(string path, string algorithm = "sha256", string output = "hex")` | 文件哈希（流式，不受 16 MiB 限制） |
| `string[] Search(string query, int limit = 100, bool regex = false, string? sort = null, bool descending = false)` | 用 Everything 搜索（须已运行）/ `EVERYTHING_UNAVAILABLE`、`EVERYTHING_FAILED` |

## qk.Process（进程）

启动程序、用关联程序打开文件/网址、运行命令行并读取输出、列出进程；在已打开的程序内部执行代码见 `qk.Apps`。

以普通（非管理员）权限启动；参数以数组传入，无需自己拼引号。常见错误码：`PROCESS_FAILED`、`PROCESS_TIMEOUT`。

| 签名 | 说明 | 能力 |
|---|---|---|
| `int Start(string executable, string[]? arguments = null, string workingDirectory = "")` | 启动程序并返回进程 Id，不等待 | 启动程序 |
| `void Open(string target)` | 用系统关联程序打开文件、文件夹或网址 | 启动程序 |
| `ProcResult Run(string executable, string[]? arguments = null, string workingDirectory = "", string encoding = "utf-8", int timeoutMs = 0)` | 隐藏窗口运行并等待退出，返回退出码与输出；非零退出码不算失败；中文控制台程序通常要传 `"gbk"`。超时或停止时尽力结束进程树（含其子进程） | 启动程序 |
| `ProcInfo[] List(string? name = null)` | 当前会话的进程列表 | 读取窗口与进程 |
| `int Kill(int pid)` / `int Kill(string name)` | 结束进程（不含子进程），返回结束的进程数（没有在运行为 0）；只能结束当前登录会话中的进程，按名称时结束当前会话中所有同名进程。不能结束 Quicker 自身、资源管理器与系统关键进程（`INVALID_ARGUMENT`）；无权限报 `PROCESS_FAILED` | 强制结束程序 |

## qk.Image 与 Img（图片）

`Img` 图片的读取、生成二维码、处理与保存为文件；截屏见 `qk.Screen`，找图/OCR/识别二维码见 `qk.Vision`。

`Img` 是本次运行内有效的图片句柄：不能直接返回或写入状态，需要带出时用 `ToBase64()`、`ToBytes()` 或保存为文件。变换方法返回**新图**。常见错误码：`IMAGE_DECODE_FAILED`、`IMAGE_ENCODE_FAILED`、`IMAGE_REF_DISPOSED`、`IMAGE_REF_INVALID`。

| 签名 | 说明 | 能力 |
|---|---|---|
| `Img qk.Image.Load(object source)` | 从文件路径、`http(s)` 网址、`byte[]`、Base64 或 `data:` URI 加载；支持 png/jpg/gif/bmp/tif/ico（不支持 webp） | 文件需读取文件，网址需网络 |
| `string qk.Image.Save(Img image, string path, int quality = 90, bool overwrite = false)` | 按扩展名保存，返回完整路径 | 修改文件 |
| `Img qk.Image.CreateQr(string text, int size = 256, Img? icon = null, string darkColor = "#000000", string lightColor = "#FFFFFF", bool quietZone = true)` | 生成二维码（识别见 `qk.Vision.ReadQr`） | 无 |
| `int img.Width` / `int img.Height` | 像素尺寸 | |
| `Img img.Crop(Rect area)` | 裁剪（图内坐标） | |
| `Img img.Resize(int width, int height = 0)` / `Img img.Scale(double factor)` | 缩放（`height` 为 0 按宽等比） | |
| `Img img.Rotate(int degrees)` | 顺时针旋转 90 的倍数 | |
| `Img img.Grayscale()` / `Img img.Invert()` | 灰度 / 反色 | |
| `byte[] img.ToBytes(string format = "png", int quality = 90)` | 编码为字节；`format`：`png`、`jpg`、`bmp` | |
| `string img.ToBase64(bool dataUri = false, string format = "png", int quality = 90)` | 编码为 Base64 | |
| `void img.Dispose()` | 提前释放像素（循环中大量取图时使用），可重复调用 | |

## qk.Text（文本工具）

纯计算的文本工具（哈希、拼音、HTML 解析）；显示文本见 `qk.Ui.ShowText`。

能力：无。

| 签名 | 说明 |
|---|---|
| `string Hash(object data, string algorithm = "sha256", string? hmacKey = null, string output = "hex")` | 字符串（UTF-8）或 `byte[]` 的哈希/HMAC；`algorithm`：`md5`、`sha1`、`sha256`、`sha384`、`sha512`；`output`：`hex`、`base64` |
| `string ToPinyin(string text, bool initials = false, bool allReadings = false, string? separator = null)` | 汉字转拼音（无声调、小写） |
| `bool MatchPinyin(string text, string query)` | 与 Quicker 搜索相同的拼音匹配规则 |
| `string HtmlToText(string html)` | HTML 转纯文本（不联网） |
| `string[] QueryHtml(string html, string xpath, string? attribute = null, string output = "text")` | 用 XPath 1.0 查询 HTML 片段；`output`：`text`、`innerHtml`、`outerHtml` |

---

## qk.Http（网络）

直接发送 HTTP 请求与下载文件（不经浏览器）；操作网页见 `qk.Browser`。

能力：访问网络（`Download` 另需修改文件）。只支持 `http`/`https`，使用 Quicker 的代理设置，不自动重试。常见错误码：`HTTP_FAILED`（网络失败）、`HTTP_STATUS_FAILED`（非 2xx）、`HTTP_TIMEOUT`（请求已取消，但服务端可能已处理）。

| 签名 | 说明 |
|---|---|
| `HttpResult Send(string url, string method = "GET", string? body = null, string contentType = "application/json", IDictionary<string, string>? headers = null, IDictionary<string, string>? form = null, IDictionary<string, string>? files = null, int timeoutMs = 60000)` | 通用请求；**非 2xx 仍返回结果**（看 `StatusCode`）；不自动跟随重定向；`form`/`files` 用于 multipart 上传（`files` 另需读取文件） |
| `string GetText(string url, int timeoutMs = 60000)` | GET 并返回文本；非 2xx 抛 `HTTP_STATUS_FAILED` |
| `string PostJson(string url, string json, int timeoutMs = 60000)` | POST 已序列化的 JSON，返回响应文本 |
| `string Download(string url, string path, bool overwrite = false, IDictionary<string, string>? headers = null, int timeoutMs = 0)` | 下载到文件并返回完整路径；最多 512 MiB；失败不留残缺文件 |

## qk.Screen（截屏）

获取屏幕图像：截屏、截窗口、框选截图、截图 Pro、取色与显示器信息；只要坐标不要图像见 `qk.Ui.PickArea`。

屏幕物理像素；UAC、锁屏等安全桌面报 `SECURE_DESKTOP`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `Img Capture(Rect? area = null, string screen = "all")` | 截屏；`screen`：`all`、`primary`、`mouse` | 截屏 / `SCREEN_CAPTURE_FAILED` |
| `Img CaptureWindow(Win window, bool background = false)` | 截窗口；`background: true` 被遮挡也能截（部分程序为黑图） | 截屏 / `WINDOW_CAPTURE_FAILED` |
| `CaptureResult? PickCapture(bool detect = true, int delayMs = 0)` | 用户框选截图，取消返回 `null` | 截图 Pro / `CAPTURE_BUSY` |
| `CaptureResult? CapturePro(string mode = "capture")` | 打开截图 Pro；`mode` 见[字符串取值表](#字符串取值表)；部分模式另需剪贴板、文件或网络能力 | 截图 Pro / `CAPTURE_PRO_FAILED`、`CAPTURE_BUSY` |
| `string GetPixel(Pt point)` | 屏幕点颜色 `#RRGGBB`（不计截图次数，适合轮询） | 截屏 |
| `ScreenInfo[] List()` | 全部显示器信息（主屏在前）；`Id` 可传给 `qk.Sys.GetBrightness/SetBrightness` 的 `screen` | 无 |

## qk.Vision（找图、找字与 OCR）

在屏幕或图片中识别内容（找图、找色、找字、OCR、识别二维码）；截图本身见 `qk.Screen`，生成二维码见 `qk.Image.CreateQr`。

结果为屏幕坐标（传入 `Img` 时为图内坐标）；没找到返回空数组。找图/找色/找字的 `timeoutMs > 0` 时每 300 毫秒重试一轮（每轮计 1 次截图）。能力：截屏（找字与 OCR 另需本机 OCR）。

文字识别只用 **本机 OCR**（不联网、不自动下载模型）。`model` 为 `small`（默认，更准）或 `tiny`（更快），`detectOrientation` 为 `true` 时同时识别旋转/倒置的文字（较慢）；两者只影响本次调用，不改 Quicker 的 OCR 设置。`Ocr`/`OcrTable` 的 `timeoutMs` 默认 30000、最大 90000（0 为不另设，只受动作超时约束）；单次识别请求另有约 90 秒上限，超出报 `OCR_FAILED`；`timeoutMs` 只能缩短不能延长这一上限。返回全部识别结果，不限次数与行数；结果很大时（返回值最多 1 MiB）请在脚本中只取需要的部分。

| 签名 | 说明 | 常见错误码 |
|---|---|---|
| `Hit[] FindImage(Img template, Rect? area = null, Win? window = null, double similarity = 0.9, int limit = 1, int timeoutMs = 0)` | 找图，按相似度降序 | |
| `Pt[] FindColor(string color, Rect? area = null, Win? window = null, int tolerance = 0, int limit = 1)` | 找颜色 `#RRGGBB` | |
| `Hit[] FindText(string text, Rect? area = null, Win? window = null, int timeoutMs = 0, string model = "small", bool detectOrientation = false)` | 本机 OCR 找文字（包含、忽略大小写，每行取第一处）；命中框按文字在行内的位置**估算** | `OCR_UNAVAILABLE` |
| `OcrResult Ocr(object? source = null, string model = "small", bool detectOrientation = false, int timeoutMs = 30000)` | 识别文字；`source` 为 `Img`、`Rect` 或 `null`（全部显示器）；返回全文、各行（位置、四点框、置信度、行/段/栏序号）与智能排版文本 `LayoutText` | `OCR_UNAVAILABLE`、`OCR_TIMEOUT`、`OCR_FAILED` |
| `OcrTableResult OcrTable(object? source = null, bool detectOrientation = false, int timeoutMs = 30000)` | 本机表格识别，返回 TSV、HTML、行列数、单元格与表头行数 | 同上 |
| `string[] ReadQr(Img image)` | 识别二维码；没有返回空数组（生成见 `qk.Image.CreateQr`）；能力：无 | |

## qk.Browser（浏览器）

浏览器中的网页（标签页、元素、表单、页面脚本），经 Quicker 浏览器扩展读取和操作；单纯请求网址或下载见 `qk.Http`。

除 `Open` 外需要 Quicker 浏览器扩展已连接。`timeoutMs` 不支持 0（范围 200–300000）。常见错误码：`BROWSER_UNAVAILABLE`（没有已连接的浏览器）、`BROWSER_FAILED`（扩展返回失败，扩展错误码在 `e.Detail`）、`BROWSER_TIMEOUT`（宿主停止等待，页面上的操作可能仍在进行）。

| 签名 | 说明 | 能力 |
|---|---|---|
| `void Open(string url, string browser = "default")` | 用浏览器打开网址（不经扩展）；`browser` 见[字符串取值表](#字符串取值表) | 启动程序 |
| `string? GetUrl()` | 前台浏览器当前标签页网址；前台不是浏览器或未连接扩展时为 `null` | 操作浏览器 |
| `Tab[] ListTabs()` | 目标浏览器的全部标签页 | 操作浏览器 |
| `int OpenTab(string url, bool wait = true)` | 新标签页打开网址，返回标签页 Id | 操作浏览器 |
| `void ActivateTab(int tabId)` / `void CloseTab(int tabId)` | 激活 / 关闭标签页 | 操作浏览器 |
| `object? Eval(string script, int? tabId = null, int frameId = 0, int timeoutMs = 30000)` | 在页面中执行 JS 函数体并返回 JSON 结果 | 【高风险】外部脚本 |
| `void Act(string target, string action = "click", string? value = null, int? tabId = null, int timeoutMs = 10000)` | 操作页面元素；`target` 支持 `css=`、`text=`、`role=`、`xpath=` 前缀；`action` 见取值表 | 操作浏览器 |
| `bool WaitFor(string? target = null, string? urlPattern = null, int timeoutMs = 10000, int? tabId = null)` | 等待元素出现和/或网址匹配；超时返回 `false` | 操作浏览器 |
| `List<Dictionary<string, object?>> Extract(string template, int? tabId = null, int limit = 500, bool allowEmpty = false, int timeoutMs = 30000)` | 按扩展“列表提取”模板提取当前页的行 | 操作浏览器 |
| `FillResult Fill(string template, IDictionary<string, object?> data, int? tabId = null, bool dryRun = false, string failOn = "required", int timeoutMs = 30000)` | 按表单模板填写；`failOn`：`required`、`any`、`never` | 操作浏览器 |
| `void Upload(string target, IEnumerable<string> files, int? tabId = null, string? urlPattern = null, int timeoutMs = 30000)` | 把本机文件放入页面的文件输入框；建议给出 `urlPattern` | 操作浏览器 + 读取文件 |
| `object? Command(string command, object? arguments = null, int? tabId = null, int timeoutMs = 30000)` | 执行浏览器扩展后台命令并返回结果（如 `Command("api_tabs_query", new { active = true })`）；`arguments` 为匿名对象、字典或 JSON 对象文本，`tabId` 为 `page.*` 命令的目标标签页。读写本机文件、调试协议、删除浏览数据等命令被拒绝（`INVALID_ARGUMENT`）；Cookie 命令须在 `arguments` 给出 `url`。命令名随扩展版本可能调整 | 【高风险】外部脚本（同 `Eval`） |

## qk.Apps（外部程序）

在 Office/WPS/Adobe/CAD 等程序内部执行代码或调用插件命令；启动程序见 `qk.Process`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `string? Run(string app, string code, bool wait = true, int timeoutMs = 30000, bool launch = false)` | 在 Office/WPS（VBA）、Photoshop 等（ExtendScript）、AutoCAD、Rhino 中执行代码并返回结果文本；停止脚本后已发送的代码仍会执行完 | 【高风险】外部脚本 / `APP_UNAVAILABLE`、`APP_FAILED`、`APP_TIMEOUT` |
| `object? Bridge(string app, string command, object? arguments = null, int timeoutMs = 30000, string? target = null)` | 调用“软件连接”插件命令，返回解码后的数据；需在 设置 → 软件连接 中开启 | 【高风险】外部脚本 / `BRIDGE_*` 系列 |
| `BridgeTarget[] ListTargets(string app)` | 列出软件连接的在线实例 | 读取窗口 / `BRIDGE_DISABLED` |
| `void RunOfficeCommand(string app, string msoId, int timeoutMs = 10000)` | 在已运行的 Office/WPS 中执行功能区命令（如 `"Bold"`） | 【高风险】外部脚本 / `APP_UNAVAILABLE`、`APP_TIMEOUT` |

`app` 取值见[字符串取值表](#字符串取值表)。`Bridge` 报 `BRIDGE_FAILED` 且 `e.Detail` 为 `RESULT_INVALID` 时，命令可能已在目标软件中执行，请勿盲目重试。

## qk.Ai（AI 与翻译）

调用 AI 模型（问答、提取、分类、看图、对话）与机器翻译；纯计算的文本工具见 `qk.Text`。

能力：调用 AI 或翻译服务（会把内容发送到你配置的 AI 或 Quicker 服务器，消耗 AI 额度或 Quicker 点数）。使用你在 Quicker 中的 AI 配置。常见错误码：`AI_FAILED`、`AI_TIMEOUT`（本机已取消请求，本机已取消请求；服务端是否已计费以实际账单为准）。`timeoutMs` 默认 120000（2 分钟），0 为不单独限时；单次调用同样受动作总超时（默认 30 秒）约束，需要较长回答时请同时在编辑器中调大动作超时。

| 签名 | 说明 |
|---|---|
| `string Ask(string prompt, string? system = null, string? useCase = null, IEnumerable<ChatMessage>? history = null, double? temperature = null, int maxTokens = 0, int timeoutMs = 120000)` | 对话，返回回复文本 |
| `JsonNode? Extract(string text, string schema, string? instructions = null, string? useCase = null, int timeoutMs = 120000)` | 按 JSON Schema 从文本提取结构化数据（模型须支持结构化输出） |
| `ClassifyResult Classify(string text, IDictionary<string, string> categories, string? defaultValue = null, string? instructions = null, int timeoutMs = 120000)` | 把文本归入一个类别 |
| `string AskImage(Img image, string prompt, string? system = null, string? useCase = null, int timeoutMs = 120000)` | 看图回答（模型须支持图片输入） |
| `string Translate(string text, string targetLanguage = "zh", string? sourceLanguage = null, string? vendor = null, int timeoutMs = 120000)` | 机器翻译（经 Quicker 服务器，可能消耗点数）；语言只能是 `zh`、`en`、`ja`、`ko`（`sourceLanguage` 为 `null` 时自动检测），其他值报 `INVALID_ARGUMENT`；`TRANSLATE_FAILED`、`TRANSLATE_TIMEOUT` |
| `ChatResult? Chat(string prompt, string? conversationId = null, string? system = null, string? title = null, string? useCase = null, int maxRounds = 10, int maxTokens = 0)` | 打开交互式 AI 对话窗口，用户点“采用”返回结果，关闭返回 `null` |

## qk.Uia（界面自动化）

其他程序窗口里的界面元素（查找/读取/操作）；Quicker 自己的对话框见 `qk.Ui`，窗口本身见 `qk.Window`。`window` 为 `null` 表示前台窗口。**Quicker 自身的窗口不能读取也不能操作**（`UIA_TARGET_DENIED`）。`El` 只在本次运行内有效（只读属性 `Name`、`ControlType`），要返回或保存时用 `Info`。常见错误码：`UIA_NOT_FOUND`、`UIA_REF_STALE`、`UIA_PATTERN_UNSUPPORTED`、`UIA_TIMEOUT`、`UIA_LIMIT_EXCEEDED`、`UIA_FAILED`、`ELEVATED_TARGET_DENIED`。

| 签名 | 说明 | 能力 |
|---|---|---|
| `El? Find(Win? window = null, string? name = null, string? controlType = null, string? automationId = null, string? className = null, string? xpath = null, int timeoutMs = 0)` | 第一个匹配元素，没有为 `null` | 读取界面元素 |
| `El[] FindAll(Win? window = null, string? name = null, string? controlType = null, string? automationId = null, string? className = null, int limit = 64)` | 全部匹配 | 读取界面元素 |
| `El? FromPoint(Pt? point = null)` / `El? GetFocused()` | 屏幕点下 / 拥有焦点的元素 | 读取界面元素 |
| `ElInfo Info(El element)` | 元素信息快照（可返回） | 读取界面元素 |
| `string GetTree(Win? window = null, int depth = 6, bool interactiveOnly = true)` | 元素树 JSON（编写时查定位用；密码框不含值） | 读取界面元素 |
| `void Act(El element, string action = "invoke")` | 操作元素；`action` 见取值表（`click` 另需鼠标） | 操作界面元素 |
| `void SetValue(El element, string value)` | 设置元素的值 | 操作界面元素 |
| `void ClickMenu(string path, Win? window = null)` | 按路径点击菜单，如 `"文件/另存为"` | 操作界面元素 |
| `void SetDialogPath(string path, bool createDirectory = false, bool pressEnter = false)` | 把路径填入打开/另存为对话框（资源管理器窗口见 `qk.Files.SetExplorerPath`）；`pressEnter: true` 时**程序会立即保存或打开该文件** | 操作界面元素（`createDirectory` 另需修改文件） |

## qk.Quicker（Quicker 服务）

Quicker 自身与账号服务（信息、命令、云端数据、临时分享、账号绑定加解密）；调用其他动作见 `qk.Actions`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `QuickerInfo Info()` | Quicker 版本、专业版状态、用户标识（`UnionId`）、暂停状态、主题、运行时长 | 读取本机信息 |
| `void Command(string command, string? argument = null)` | 执行 Quicker 命令（见取值表），发出即返回 | `togglePause`/`stopAll`/`loadProfile`/`restart` 需控制 Quicker，`runLast` 需调用动作 / `QUICKER_COMMAND_FAILED` |
| `string? GetCloud(string key)` | 读取账号云端数据（所有动作、所有设备共享）；不存在为 `null` | 网络 + 云端数据 / `CLOUD_FAILED` |
| `void SetCloud(string key, string value)` | 写入云端数据；多设备同时写以最后一次为准；超时或停止后请求可能已生效 | 同上 |
| `void RemoveCloud(string key)` | 删除云端数据（不存在不报错） | 同上 |
| `string ShareTemporary(object content)` | 上传文本或 `Img` 到临时分享并返回网址（**任何人可访问**） | 网络 + 临时分享 / `TEMP_SHARE_FAILED` |
| `string ShareTemporaryFile(string path, bool randomName = false)` | 上传本机文件（最多 10 MB）到临时分享 | 网络 + 临时分享 + 读取文件 |
| `string EncryptLocal(string text)` | “自用加密”，与“加密”步骤本机模式互通；**不能用来防范攻击者** | 无 / `ACCESS_DENIED`（未登录） |
| `string DecryptLocal(string cipherText)` | 解密“自用加密”数据 | 自用解密 / `ACCESS_DENIED` |

## qk.Sys（系统）

Windows 与本机（系统信息、环境变量与注册表读取、提示音、朗读、音量与音频设备、显示器亮度、深色模式、电源操作）；Quicker 自身的信息见 `qk.Quicker`。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `SysInfo Info()` | 计算机名、用户名、系统版本、锁屏/全屏/深色模式/联网状态、局域网 IP、开机时长、电池（是否用电池、剩余电量） | 读取本机信息 |
| `void PlaySound(string sound, bool wait = false)` | 播放内置声音（见取值表）、音频文件或网址；`wait: false` 后台播放 | 无（文件需读取文件，网址需网络）/ `SOUND_FAILED` |
| `void Speak(string text, bool wait = false)` | 用 Windows 默认语音朗读 | 无 / `SOUND_FAILED` |
| `VolumeInfo GetVolume(string device = "output")` | 默认输出设备（`device: "input"` 为默认录音设备）的音量（0–100）与静音 | 无 |
| `VolumeInfo SetVolume(int? level = null, bool? muted = null, string device = "output")` | 设置音量/静音（`null` 保持不变），返回调用后状态；`device: "input"` 可让麦克风静音；停止后的 `finally` 中可用于恢复 | 无 |
| `AudioDevice[] ListAudioDevices(string device = "output")` | 已启用的播放（或录音）设备，标出当前默认设备 | 无 / `SOUND_FAILED` |
| `void SetDefaultAudioDevice(string idOrName, string device = "output")` | 切换默认音频设备；按设备 Id、完整名称或名称中的一段匹配 | 无 / `AUDIO_DEVICE_NOT_FOUND`、`SOUND_FAILED` |
| `int GetBrightness(string screen = "mouse")` | 显示器亮度 0–100；`screen`：`mouse`（鼠标所在屏）、`primary`、`all`（同 `primary`）或 `qk.Screen.List()` 的 `Id` | 无 / `BRIGHTNESS_UNSUPPORTED`、`BRIGHTNESS_FAILED` |
| `int SetBrightness(int? level = null, int delta = 0, string screen = "mouse", bool osd = false)` | 设置亮度：`level` 为目标值，或 `delta` 相对调整（二者给一个）；返回设置后的亮度；`osd: true` 显示亮度提示 | 无 / 同上 |
| `void SetDarkMode(bool dark, string scope = "all")` | 切换深色/浅色模式；`scope`：`apps`、`system`、`all` | 无 |
| `void Power(string action)` | `lock` 锁屏、`screenOff` 关闭显示器；`sleep` 睡眠、`hibernate` 休眠、`signOut` 注销、`shutdown` 关机、`restart` 重启。`screenOff` 由鼠标或按键触发时，随后的鼠标移动或松键可能立即点亮屏幕；睡眠期间停止与超时不生效，唤醒后若已超过动作超时，后续代码不再执行 | `lock`/`screenOff` 无；其余为**电源/会话（后果严重）** / `POWER_FAILED` |
| `string? GetEnv(string name)` | 读取环境变量；不存在为 `null` | 读取本机信息 |
| `object? GetRegistry(string path, string? name = null)` | 读取注册表值（只读），如 `GetRegistry(@"HKCU\Software\…", "名称")`；不存在为 `null` | 读取本机信息 / `ACCESS_DENIED` |

## qk.Steps（组合动作步骤）

用于调用**还没有对应 `qk` 方法**的组合动作（XAction）步骤，如 Windows 服务/注册表、PDF、Excel 区域、部分软件控制。有对应 `qk` 方法时请优先用 `qk`（确认更清楚、检查更完善）。步骤键、字段键随步骤演进可能调整，届时旧脚本可能在运行时报错。

| 签名 | 说明 | 能力 / 常见错误码 |
|---|---|---|
| `IReadOnlyDictionary<string, object?> Run(string key, object? inputs = null, int timeoutMs = 0)` | 执行一个步骤并返回其输出（键为输出参数 key）。`key` 如 `"sys:winservice"`（可省略 `sys:`），须写成字符串字面量；`inputs` 为匿名对象或字典，键为输入参数 key，值按字面传入（`$=`、`{变量}` 不求值）；`timeoutMs` 0 为只受动作超时约束 | 【高风险】调用组合动作步骤（按步骤逐个确认，可运行任意程序的步骤单独警示）/ `STEP_FAILED`（`e.Detail` 为步骤的错误码）、`STEP_TIMEOUT`；未经审计或不允许的步骤报 `INVALID_ARGUMENT` |

---

## 数据类型

`qk` 提供的数据类型可以直接构造（推荐具名参数，如 `new Item("甲", Value: "1")`）和读取。返回或写入状态时字段名转为小驼峰（如 `Width` → `width`）。

| 类型 | 字段 |
|---|---|
| `Pt` | `(int X, int Y)` |
| `Rect` | `(int X, int Y, int Width, int Height)` |
| `Item` | `(string Title, string? Value = null, string? Icon = null, string? Description = null, Item[]? Children = null)`；`Title`/`Value` 原样使用，任意文本（路径、网址）请用 `Item` 而不是字符串简写 |
| `UiOptions` | `(string? Title, string? Help, string Position = "mouse", Rect? Bounds, bool Topmost = true, bool RestoreFocus = true, bool CloseOnBlur, bool NoFocus, int FontSize, string? Font, string? Ime, int AutoCloseMs = 0, string? Key)`；`Position`、`Ime` 取值见取值表 |
| `Field` | `(string Key, string Label, string Kind = "text", object? Value, string? Options, bool Required, string? Help, string? Group, string? Visible, string? Pattern, double? Min, double? Max, bool ReadOnly, int Width)`；`Kind` 见取值表；`Visible` 为简单条件，如 `"kind == 'md' \|\| vip"` |
| `FormResult` | `(IReadOnlyDictionary<string, object?> Values, string Button, string? Group)`；`number`/`slider` 为 `double`，`check` 为 `bool`，`multi` 为 `List<string>`，其余多为 `string` |
| `SelectResult` | `(string? Value, int Index, string Title, object? Item, string? Operation, string Filter)` |
| `SelectManyResult` | `(string[] Values, int[] Indexes, string? Operation, string Filter)` |
| `TextResult` | `(string Text, string SelectedText, int Caret, string? Operation)` |
| `WinInfo` | `(string Title, string Process, string Path, int Pid, string ClassName, Rect Bounds, int Dpi, bool Visible, string State, bool Topmost, Win Window)`；`State` 为 `normal`/`minimized`/`maximized` |
| `PathInfo` | `(string Path, string Name, bool IsDirectory, long? Length, DateTimeOffset ModifiedAt)` |
| `ProcInfo` | `(int Pid, string Name, string Path, DateTimeOffset? StartedAt)` |
| `ProcResult` | `(int ExitCode, string StandardOutput, string StandardError)` |
| `ActionInfo` | `(string Id, string Title, string Icon, string Description, string? SharedId, int? SharedRevision)` |
| `Ctx` | 见[根成员](#根成员) |
| `Win`、`Img` | 句柄，见对应域 |
| `HttpResult` | `(int StatusCode, string Text, IReadOnlyDictionary<string, string> Headers, string[] SetCookies)`，另有 `bool IsSuccess`（2xx） |
| `CaptureResult` | `(Img? Image, Rect Area, string? Text, string? Path)` |
| `ScreenInfo` | `(Rect Bounds, Rect WorkArea, int Dpi, bool Primary, string? Id, string? Name)`：`Id` 为显示器设备标识，`Name` 为显示器名称 |
| `Hit` | `(Rect Bounds, Pt Center, double Score)` |
| `OcrResult` / `OcrLine` | `(string Text, OcrLine[] Lines, string LayoutText)` / `(string Text, Rect Bounds, double Confidence, Pt[] Polygon, int LineIndex, int ParagraphIndex, int ColumnIndex)`：`Polygon` 为四点框（左上、右上、右下、左下），序号从 0 起，`ColumnIndex` 为 -1 表示跨栏 |
| `OcrTableResult` / `OcrCell` | `(string Tsv, string Html, int Rows, int Columns, OcrCell[] Cells, double Confidence, int HeaderRows)` / `(int Row, int Column, int RowSpan, int ColumnSpan, string Text, Rect Bounds, double Confidence, Pt[] Polygon)`：行列从 0 起 |
| `Tab` | `(int Id, int WindowId, string Url, string Title, bool Active)` |
| `FillResult` / `FillField` | `(bool AllRequiredOk, int FilledCount, int FailedCount, bool NeedsCheck, string[] Warnings, FillField[] Fields)` / `(string Key, string Label, bool Required, string Status, string? Code, string? Message)` |
| `BridgeTarget` | `(string Id, int? Pid, string Title, string Document, string HostVersion, string BridgeVersion, string? Kind, DateTimeOffset? ConnectedAt)` |
| `ChatMessage` | `(string Role, string Text)`；`Role` 为 `user`/`assistant` |
| `ChatResult` | `(string Answer, string ConversationId, int Rounds)` |
| `ClassifyResult` | `(string Key, string Reason, bool UsedDefault)` |
| `ElInfo` | `(string Name, string ControlType, string AutomationId, string ClassName, string? Value, Rect Bounds, bool Enabled, bool Visible, string XPath, bool? Toggled)` |
| `QuickerInfo` | `(string Version, bool IsPro, string? UnionId, bool Paused, string Theme, long UptimeMs)`；`UnionId` 是标识当前 Quicker 用户的不透明字符串，与组合动作“获取 Quicker 信息”的 UnionId 相同；不是账号 Id，不能用来登录或反查账号；未登录为 `null` |
| `SysInfo` | `(string MachineName, string UserName, string OsVersion, bool Locked, bool Fullscreen, bool DarkMode, bool Online, string? LanIp, long UptimeMs, bool? OnBattery, int? BatteryPercent)`：没有电池时后两项为 `null` |
| `VolumeInfo` | `(int Level, bool Muted)` |
| `AudioDevice` | `(string Id, string Name, bool IsDefault)` |
| `El`、`TextWin`、`ProgressWin` | 句柄，见对应域 |

## 每次运行的限额

限额用于防止脚本失控，具体数值可能放宽。超出时一般报 `LIMIT_EXCEEDED` 或所在域的 `*_LIMIT_EXCEEDED`。

| 范围 | 限额 |
|---|---|
| 对话框 / 通知 | 对话框 100 个；通知 100 条，另限每秒 5 条 |
| 选区读取 | 16 次；`GetFiles` 最多 256 项 |
| 窗口 | 观察 64 次、激活 16 次、调整 32 次；`FindAll`/`ListChildren` 每次最多 64 个 |
| 键盘 | `Type` 累计 2000 字符、键盘调用累计 256 次；**超出后本次运行的键鼠输入全部失败** |
| 鼠标 | 点击累计 100 次，滚轮累计 120 格 |
| 剪贴板 | 64 次操作，其中 32 次写入；文本单次 1 MiB |
| 文件 | 单次读写 16 MiB；列表 10,000 项；`Reveal` 20 次 |
| 界面自动化 | 读取 400 次、操作 100 次、累计耗时 120 秒 |
| HTTP | 请求与响应正文各 4 MiB；`Download` 512 MiB |
| 进程 | `Run` 输出各 512K 字符 |
| 截图与识别 | 屏幕截图 1000 次（本机 OCR 不限次数）；交互截图 64 次；图片同时存活 32 个 |
| 声音 | `PlaySound` + `Speak` 合计 100 次；整个 Quicker 同时最多 4 个后台播放 |
| 云端数据 / 临时分享 | 云端读写 200 次、临时分享 20 次 |
| 动作调用 | 调用链 16 层 |
| 返回值 / 状态 | 1 MiB、10,000 项、32 层 |

## 错误码表

通过 `e.Code.Value`（字符串）或 `e.Code == ActionErrorCode.Xxx`（静态成员为错误码的帕斯卡写法，如 `FILE_NOT_FOUND` → `FileNotFound`）判断。`e.Detail` 为扩展码，可能为 `null`。

### 通用

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `INVALID_ARGUMENT` | 参数不合法（取值不在允许范围、格式错误、在不支持的场景调用等） | 按消息改正参数 |
| `CAPABILITY_DENIED` | 未获得该能力（用户拒绝授权、源码中无法识别该调用），或在停止后的清理阶段调用了不允许的方法 | 见[安全与授权](./security)；直接写 `qk.域.方法(...)` |
| `ACCESS_DENIED` | 无权访问（文件权限、安装来源的脚本访问其他动作、未登录等） | 检查权限或登录状态 |
| `LIMIT_EXCEEDED` | 超出大小或次数限额（截图、找图找色、OCR、二维码与图片处理的限额也报此码） | 减少调用次数或数据量 |
| `HOST_UNAVAILABLE` | 当前运行环境没有提供该服务（不是授权问题） | 在正常的 Quicker 中运行 |
| `HOST_FAILED` | Quicker 内部失败且无法归类（原内部码在 `e.Detail`） | 正常不应出现，遇到请反馈 |
| `UI_THREAD_NOT_ALLOWED` | 在不允许的线程上同步等待 | 正常不应出现，遇到请反馈 |

### 入口、返回值与状态

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `INPUT_MISSING` | 缺少必填的 `Main` 参数（OperationId 为 `input`） | 给参数加默认值，或从交互方式触发 |
| `CODEC_UNSUPPORTED` | 返回值或状态中含不能保存的数据（如 `Win`、`Img`） | 改为返回 `Info(...)`、Base64 等数据 |
| `CODEC_VALUE_INVALID` | 读回的数据与声明的类型不符 | 保持写入与读取类型一致 |
| `STATE_UNAVAILABLE` | 状态存储读写失败或不可用 | 重试；持续出现请反馈 |

### 界面

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `UI_UNAVAILABLE` | 当前环境无法显示界面 | 在交互桌面中运行 |
| `DIALOG_LIMIT_EXCEEDED` | 对话框数量超出限额 | 减少弹窗 |
| `NOTIFY_LIMIT_EXCEEDED` | 通知数量或频率超限 | 用 `key` + `duplicate` 合并通知 |
| `NOTIFY_FAILED` | 通知发布失败（`qk.Ui.Notify` 调用系统通知/Quicker 通知模块时出错） | 重试；检查系统通知设置 |
| `UI_REACT_FAILED` | React 界面编译或运行失败 | 按消息中的页面错误修改 |

### 动作调用

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `CALL_FAILED` | 被调用的动作或子程序失败；被调脚本的错误码在 `e.Detail` | 查看 `e.Detail` 与消息 |
| `SUBPROGRAM_NOT_FOUND` | 找不到公共子程序 | 检查名称或 Id |
| `CALL_DEPTH_LIMIT_EXCEEDED` | 调用链超过 16 层 | 检查是否互相递归调用 |

### 剪贴板与选区

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `CLIPBOARD_UNAVAILABLE` | 剪贴板被其他程序占用，或图片数据无法读取 | 稍后重试 |
| `CLIPBOARD_LIMIT_EXCEEDED` | 剪贴板操作次数超限 | 减少读写次数 |
| `SELECTION_UNAVAILABLE` | 前台程序不支持读取选中内容 | 改用剪贴板或其他方式 |
| `SELECTION_FAILED` | 读取选中内容失败（复制期间剪贴板被改写等，内部码在 `e.Detail`） | 重试；在编辑器中测试请用“最小化后延迟运行” |
| `EXPLORER_NOT_FOUND` | `qk.Files.SetExplorerPath` 的目标不是资源管理器 | 改用 `qk.Process.Open(directory)` 新开窗口 |

### 键盘与鼠标

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `INPUT_LIMIT_EXCEEDED` | 键鼠输入超出限额；之后本次运行的键鼠输入全部失败 | 事先计算总量；长文本用 `Paste` |
| `INPUT_USER_ACTIVE` | 用户正在操作键鼠，注入被中止 | 运行时不要同时操作键鼠 |
| `INPUT_UNAVAILABLE` | 键鼠输入当前不可用（如不在交互桌面） | — |
| `INPUT_FAILED` | 注入失败（内部码在 `e.Detail`） | 重试 |

### 窗口

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `WINDOW_NOT_FOUND` | 找不到窗口 | 检查匹配条件 |
| `WINDOW_REF_STALE` | 窗口已关闭或句柄已被复用 | 重新查找窗口 |
| `WINDOW_REF_INVALID` | `Win` 不属于本次运行 | 不要跨运行保存 `Win` |
| `WINDOW_UNAVAILABLE` | 窗口隐藏、最小化或无法校验，不能用于该操作 | 先还原或激活窗口 |
| `WINDOW_CHANGED` | 操作期间窗口被移动、改变大小或遮挡 | 重试 |
| `WINDOW_LIMIT_EXCEEDED` | 窗口操作次数或枚举数量超限 | 用 `FindAllInfo` 批量读取 |
| `WINDOW_ACTIVATION_FAILED` | Windows 拒绝了前台切换 | 重试，或先 `RestoreForeground` |
| `ELEVATED_TARGET_DENIED` | 目标是管理员权限的程序 | 普通权限下无法操作 |
| `TARGET_PERMISSION_UNKNOWN` | 无法确定目标窗口权限，按拒绝处理 | — |
| `WINDOW_ARRANGE_FAILED` | 排列或同类窗口操作失败 | — |
| `WINDOW_EDGE_HIDE_FAILED` | 窗口不适合贴边隐藏（最小化、全屏、工具窗口） | — |
| `WINDOW_MESSAGE_TIMEOUT` | 发送窗口消息超时，目标无响应 | 调大 `timeoutMs` |
| `WINDOW_MESSAGE_FAILED` | 窗口消息发送失败（窗口已关闭或被拒绝） | — |
| `WINDOW_WAIT_FAILED` | 等待窗口时出错 | — |
| `WINDOW_FAILED` | 其他窗口操作失败 | — |

### 文件

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `FILE_NOT_FOUND` | 文件或文件夹不存在 | 先 `Exists` 检查 |
| `FILE_FAILED` | 文件操作失败（目标已存在、被占用、不能进回收站等） | 需要覆盖时传 `overwrite: true` |
| `ZIP_FAILED` | 压缩/解压失败（损坏、加密、条目路径不安全） | — |
| `EVERYTHING_UNAVAILABLE` / `EVERYTHING_FAILED` | Everything 未运行 / 搜索失败 | 启动 Everything；检查查询语法 |

### 网络与进程

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `HTTP_FAILED` | 网络失败、重定向过多 | 检查网络与代理 |
| `HTTP_STATUS_FAILED` | 服务器返回非 2xx | 需要读取错误响应时改用 `Send` |
| `HTTP_TIMEOUT` | 请求超时（已取消，但服务端可能已处理） | 非幂等请求不要盲目重试 |
| `PROCESS_FAILED` | 启动程序失败 | 检查路径与参数 |
| `PROCESS_TIMEOUT` | `Process.Run` 超时，已读输出不返回；是否结束进程目前不保证 | 调大 `timeoutMs` |

### 图片、截屏与识别

| 错误码 | 含义 | 常见处理 |
|---|---|---|
| `IMAGE_DECODE_FAILED` / `IMAGE_ENCODE_FAILED` | 图片无法解码 / 编码失败 | 检查格式（不支持 webp） |
| `IMAGE_REF_DISPOSED` / `IMAGE_REF_INVALID` | 图片已释放 / 不属于本次运行 | — |
| `SECURE_DESKTOP` | 安全桌面（UAC、锁屏）无法截屏 | — |
| `SCREEN_CAPTURE_FAILED` / `SCREEN_CAPTURE_UNAVAILABLE` / `CAPTURE_UNAVAILABLE` | 屏幕截取失败 / 不可用 | 重试 |
| `WINDOW_CAPTURE_FAILED` | 截窗口失败 | 换用 `background` 另一种模式 |
| `CAPTURE_BUSY` | 另一截图或选择正在进行 | 稍后重试 |
| `CAPTURE_PRO_FAILED` | 截图 Pro 未能完成 | — |
| `OCR_UNAVAILABLE` / `OCR_TIMEOUT` / `OCR_FAILED` | 本机 OCR 未安装 / 超时（`timeoutMs`，默认 30 秒）/ 失败 | 按消息提示安装本机 OCR（截图后使用一次“文字识别”）；调大 `timeoutMs` 或缩小区域 |
| `QR_UNAVAILABLE` / `QR_FAILED` | `qk.Vision.ReadQr`：本机二维码解码组件无法加载 / 解码出错 | — |

### 界面自动化

| 错误码 | 含义 |
|---|---|
| `UIA_TARGET_DENIED` | 目标是 Quicker 自身窗口 |
| `UIA_NOT_FOUND` | 菜单项、文件对话框等目标未找到 |
| `UIA_REF_STALE` / `UIA_REF_INVALID` | 元素已消失 / 不属于本次运行 |
| `UIA_PATTERN_UNSUPPORTED` | 元素不支持该操作 |
| `UIA_TIMEOUT` | 目标程序无响应 |
| `UIA_LIMIT_EXCEEDED` | 界面自动化次数、元素数或耗时超限 |
| `UIA_FAILED` | 其他失败 |

### 浏览器、外部程序与 AI

| 错误码 | 含义 |
|---|---|
| `BROWSER_UNAVAILABLE` | 没有已连接扩展的浏览器 |
| `BROWSER_FAILED` | 扩展返回失败；扩展错误码在 `e.Detail`（如 `URL_PATTERN_MISMATCH`、`LIST_ROWS_NOT_FOUND`） |
| `BROWSER_TIMEOUT` | 扩展超时无响应（页面上的操作可能仍在进行） |
| `APP_UNAVAILABLE` / `APP_FAILED` / `APP_TIMEOUT` | 目标程序未安装或未运行 / 程序返回错误 / 超时（代码可能仍在目标程序中运行） |
| `BRIDGE_DISABLED` | 软件连接未开启 |
| `BRIDGE_TARGET_NOT_FOUND` / `BRIDGE_TARGET_AMBIGUOUS` | 指定实例不在线 / 有多个实例（用 `ListTargets` 指定 `target`） |
| `BRIDGE_TIMEOUT` / `BRIDGE_BUSY` | 超时 / 软件连接正在切换，稍后重试 |
| `BRIDGE_FAILED` | 插件返回失败；插件错误码在 `e.Detail` |
| `AI_FAILED` / `AI_TIMEOUT` | AI 未配置或模型错误 / 超时 |
| `TRANSLATE_FAILED` / `TRANSLATE_TIMEOUT` | 翻译失败 / 超时 |

### Quicker 服务与声音

| 错误码 | 含义 |
|---|---|
| `QUICKER_COMMAND_FAILED` | Quicker 命令执行失败 |
| `CLOUD_FAILED` | 云端数据读写失败（未登录、网络、每日次数用尽等） |
| `TEMP_SHARE_FAILED` | 临时分享上传失败（网络、上传间隔限制等） |
| `SOUND_FAILED` | 播放或朗读失败（无法解码、没有音频设备）；读写音量、列出或切换音频设备失败 |
| `AUDIO_DEVICE_NOT_FOUND` | `Sys.SetDefaultAudioDevice` 找不到匹配的音频设备（消息列出可用设备） |
| `BRIGHTNESS_UNSUPPORTED` | 显示器不支持调节亮度（外接显示器未开启 DDC/CI、远程桌面、虚拟显示器等） |
| `BRIGHTNESS_FAILED` | 读取或调节亮度失败（屏幕未连接等） |
| `POWER_FAILED` | `Sys.Power` 失败（如未启用休眠、系统拒绝） |

### 组合动作步骤

| 错误码 | 含义 |
|---|---|
| `STEP_FAILED` / `STEP_TIMEOUT` | `qk.Steps.Run` 调用的组合动作步骤失败 / 超时（见 [qk.Steps](#qksteps组合动作步骤)） |

## 字符串取值表

取值比较不区分大小写，文档与返回值使用下表写法。标“…”的集合还接受其他值（见说明）。

| 位置 | 取值 |
|---|---|
| `Log(level)` | `debug`、`info`、`warn`、`error` |
| `UiOptions.Position` | `mouse`、`mouse2`、`center`、`topLeft`、`topCenter`、`topRight`、`leftCenter`、`rightCenter`、`bottomLeft`、`bottomCenter`、`bottomRight`、`last` |
| `UiOptions.Ime` | `on`、`off` |
| `Ui.Notify(kind)` | `info`、`success`、`warn`、`error`、`toast` |
| `Ui.Notify(position)` | `bottomCenter`、`bottomLeft`、`bottomRight`、`topCenter`、`topLeft`、`topRight` |
| `Ui.Notify(duplicate)` | `replace`、`count`、`ignore` |
| `Ui.Alert/Confirm/Ask(icon)` | `none`、`info`、`question`、`warn`、`error` |
| `Field.Kind` | `text`、`multiline`、`number`、`slider`、`check`、`dropdown`、`combo`、`autocomplete`、`multi`、`radio`、`date`、`dateTime`、`color`、`password`、`font`、`dict`、`label`、`separator` |
| `Ui.Pin(kind)` | `auto`、`image`、`text`、`html`、`latex` |
| `Window.SetState(state)`、`WinInfo.State` | `normal`、`minimized`、`maximized` |
| `Window.WaitFor(state)` | `exists`、`visible`、`foreground` |
| `Window.ToScreen(anchor)` | `topLeft`、`topRight`、`bottomLeft`、`bottomRight`、`center` |
| `Window.SetEdgeHide(edge)` | `auto`、`left`、`top`、`right`、`bottom` |
| `Mouse.Click/Down/Up(button)` | `left`、`right`、`middle` |
| `Mouse.GetCursor()` 返回值 | `arrow`、`iBeam`、`hand`、`wait`、`appStarting`、`cross`、`no`、`help`、`sizeAll`、`sizeNs`、`sizeWe`、`sizeNwse`、`sizeNesw`、`upArrow`、`hidden`、`unknown` |
| `Selection.GetText(format)` | `text`、`html`、`rtf`、`csv` |
| `Clipboard.Get/Set(format)` | `rtf`、`csv`、`html`、`text`，或自定义格式名 |
| `Files.GetKnownFolder(name)` | `desktop`、`documents`、`pictures`、`music`、`videos`、`appData`、`localAppData`、`programData`、`userProfile`、`startup`、`downloads`、`temp`，或 .NET `Environment.SpecialFolder` 名称 |
| `Files.Search(sort)` | `name`、`path`、`size`、`extension`、`created`、`modified` |
| `Files.Hash`、`Text.Hash` 的 `algorithm` | `md5`、`sha1`、`sha256`、`sha384`、`sha512` |
| `Files.Hash`、`Text.Hash` 的 `output` | `hex`、`base64` |
| `Img.ToBytes/ToBase64(format)` | `png`、`jpg`、`bmp` |
| `Screen.Capture(screen)` | `all`、`primary`、`mouse` |
| `Screen.CapturePro(mode)` | `capture`、`captureNow`、`copy`、`pin`、`ocr`、`ocrCopy`、`table`、`formula`、`translate`、`imageTranslate`、`quickSave` |
| `Vision.Ocr(model)`、`Vision.FindText(model)` | `tiny`、`small` |
| `Browser.Open(browser)` | `default`、`edge`、`chrome`、`current`、`edgeApp`、`edgeIncognito`、`chromeApp`、`chromeIncognito`，或浏览器 exe 完整路径 |
| `Browser.Act(action)` | `click`、`fill`、`type`、`paste`、`clear`、`select`、`check`、`uncheck`、`hover`、`scroll` |
| `Browser.Fill(failOn)` | `required`、`any`、`never` |
| `FillField.Status` | `filled`、`unchanged`、`matched`、`failed`、`skipped` |
| `Apps.Run(app)` | `word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp`、`photoshop`、`illustrator`、`indesign`、`aftereffects`、`autocad`、`rhino` 等 |
| `Apps.RunOfficeCommand(app)` | `word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp` |
| `BridgeTarget.Kind` | `wps`、`et`、`wpp` |
| `Ai.Translate` 的语言 | `zh`、`en`、`ja`、`ko` 等 |
| `ChatMessage.Role` | `user`、`assistant` |
| `Uia.Act(action)` | `invoke`、`click`、`toggle`、`check`、`uncheck`、`expand`、`collapse`、`select`、`focus`、`scroll` |
| `Uia.Find(controlType)` | UIA 控件类型名，如 `Button`、`Edit`、`CheckBox`、`ComboBox`、`ListItem`、`MenuItem` |
| `Quicker.Command(command)` | `showPanel`、`showSearch`、`showCircleMenu`、`showToolbar`、`editAction`、`editSubprogram`、`runLast`、`togglePause`、`stopAll`、`loadProfile`、`restart` |
| `QuickerInfo.Theme` | `light`、`dark`、`autoLight`、`autoDark` |
| `Text.QueryHtml(output)` | `text`、`innerHtml`、`outerHtml` |
| `Sys.PlaySound(sound)` 内置音 | `info`、`snip`、`succeed`、`warning`、`wrong`、`dim`，或音频文件路径、网址 |
| `Sys.Power(action)` | `lock`、`screenOff`、`sleep`、`hibernate`、`signOut`、`shutdown`、`restart` |
| `Sys.GetBrightness/SetBrightness(screen)` | `mouse`、`primary`、`all`，或 `qk.Screen.List()` 的 `Id` |
| `Sys.GetVolume/SetVolume/ListAudioDevices/SetDefaultAudioDevice(device)` | `output`、`input` |
| `Sys.SetDarkMode(scope)` | `apps`、`system`、`all` |
| `Ctx.Trigger` | `panel`、`floatButton`、`floatPanel`、`dashboard`、`editor`、`circleMenu`、`search`、`searchInput`、`searchCallback`、`searchContextMenu`、`hotkey`、`hotkeyWatcher`、`mouse`、`leftButtonPlus`、`scrollOnButton`、`advancedMouseAction`、`mobileApp`、`external`、`androidRemote`、`event`、`screenshot`、`textToolbar`、`triggerKey`、`gesture`、`textCommand`、`autoRun`、`contextMenu`、`association`、`browserContextMenu`、`webpageButton`、`other` |


## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/features/script-actions/',
      label: '脚本动作入门',
      description: '适用场景、Main 参数、调试与常见错误',
    },
    {
      href: '/v2/features/script-actions/security',
      label: '脚本动作安全与授权',
      description: '沙箱边界、能力确认与分享规则',
    },
  ]}
/>
