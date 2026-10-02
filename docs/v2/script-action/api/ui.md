---
title: "qk.Ui：对话框与界面"
description: "qk.Ui：对话框与界面的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/ui
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Quicker 自己弹出的对话框、通知与窗口；操作其他程序窗口里的界面元素见 qk.Uia。用户取消返回 null（Confirm 返回 false）；每次运行最多 100 个对话框（OpenText/ShowMenu/OpenProgress/ShowImage/Pin 各计 1 次，ProgressWin 更新不计）、100 条通知（另限每秒 5 条）。各窗口的 operations 按钮（Select/ShowText/OpenText/OpenProgress）点击即关闭该窗口并返回 Operation，不执行任何操作。

<a id="ui-select" />

## Ui.Select

```csharp
SelectResult? Select(IEnumerable<object> items, string? note = null, string? selected = null, string[]? operations = null, bool quick = false, bool? filter = null, string? filterText = null, UiOptions? options = null)
```

显示选择列表（单选）；取消返回 null。支持全部 UiOptions 选项。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<object> items` | 字符串 "[fa:icon]标题&#124;值" 或 Item，可混用。字符串项只有开头的 [fa:…] 是图标，其他 [..] 保留为标题；在第一个未转义的 &#124; 处切分标题与值，\&#124; 表示字面 &#124;，其他反斜杠原样保留（路径可直接用；C# 中写 @"a\&#124;b&#124;值"）。任意文本请用 Item（原样使用）。 |
| `string? note = null` | 列表上方的提示文字。 |
| `string? selected = null` | 初始选中项的值（按值精确匹配；对不上任何项时不预选，数字不会被当作序号）。 |
| `string[]? operations = null` | 右键/全局菜单项 "[fa:icon]标题&#124;值"（值不能为空）；选中即关闭，值写入 SelectResult.Operation（未选列表项时 SelectResult.Index 为 -1、Item 为 null）。 |
| `bool quick = false` | 启用快速确认（同“选择”步骤的 enableQuickConfirm）。 |
| `bool? filter = null` | 是否显示筛选框；null 为自动（多于 10 项时显示）。 |
| `string? filterText = null` | 初始筛选文字（给出时强制显示筛选框）。 |
| `UiOptions? options = null` | 窗口选项（标题、位置等）。 |

返回类型：`SelectResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-selectmany" />

## Ui.SelectMany

```csharp
SelectManyResult? SelectMany(IEnumerable<object> items, string? note = null, IEnumerable<string>? selected = null, string[]? operations = null, bool allowEmpty = false, bool? filter = null, string? filterText = null, UiOptions? options = null)
```

显示选择列表（多选）；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<object> items` | 字符串 "[fa:icon]标题&#124;值" 或 Item，可混用；解析与转义同 Select（只有开头的 [fa:…] 是图标，\&#124; 为字面 &#124;，其他反斜杠原样保留）。 |
| `string? note = null` | 见本成员和所在域的说明。 |
| `IEnumerable<string>? selected = null` | 初始勾选项的值。 |
| `string[]? operations = null` | 见本成员和所在域的说明。 |
| `bool allowEmpty = false` | 是否允许不选任何项就确定。 |
| `bool? filter = null` | 见本成员和所在域的说明。 |
| `string? filterText = null` | 见本成员和所在域的说明。 |
| `UiOptions? options = null` | 窗口选项（标题、位置等）。 |

返回类型：`SelectManyResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-prompt" />

## Ui.Prompt

```csharp
string? Prompt(string message, string value = "", bool multiline = false, bool required = false, string? pattern = null, string? tools = null, bool enterSubmit = true, UiOptions? options = null)
```

输入文本；取消返回 null。UiOptions 支持 Title/Help/Position/Topmost/RestoreFocus/CloseOnBlur/Font/FontSize/Ime，Bounds 与 Position=last 降级为 mouse。

| 参数声明 | 说明 |
|---|---|
| `string message` | 提示文字。 |
| `string value = ""` | 初始文本。 |
| `bool multiline = false` | 见本成员和所在域的说明。 |
| `bool required = false` | 见本成员和所在域的说明。 |
| `string? pattern = null` | 对输入文本的正则校验（部分匹配即通过，需整串匹配请加 ^…$；匹配超过 1 秒视为不符合）。 |
| `string? tools = null` | 文本工具，逗号分隔，只支持 EditInCodeWindow/SelectSingleFile/SelectMultiFile/SelectSingleFolder/SelectSavePath/ColorPicker/ColorPickerArgb/SelectFontFamily。 |
| `bool enterSubmit = true` | 是否按 Enter 确定。 |
| `UiOptions? options = null` | 窗口选项（标题、位置等）。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-promptnumber" />

## Ui.PromptNumber

```csharp
double? PromptNumber(string message, double? value = null, string? pattern = null, UiOptions? options = null)
```

输入数字；取消返回 null（确认时不允许空输入）。UiOptions 同 Prompt。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `double? value = null` | 见本成员和所在域的说明。 |
| `string? pattern = null` | 对输入文本的正则校验（部分匹配即通过，需整串匹配请加 ^…$）；通过后再按数字解析。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`double?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-promptdate" />

## Ui.PromptDate

```csharp
DateTimeOffset? PromptDate(string message, DateTimeOffset? value = null, UiOptions? options = null)
```

选择日期时间，返回带本机时区偏移的 DateTimeOffset；取消返回 null。UiOptions 支持 Title/Help/Position/Topmost/RestoreFocus/CloseOnBlur，Bounds 与 Position=last 降级为 mouse。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `DateTimeOffset? value = null` | 初值；null 为当前时间（按本地时间显示）。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`DateTimeOffset?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-alert" />

## Ui.Alert

```csharp
void Alert(string message, string icon = "info", UiOptions? options = null)
```

显示消息并等待关闭；消息按纯文本显示（不支持 md:）。UiOptions 只使用 Title 与 RestoreFocus。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `string icon = "info"` | none&#124;info&#124;question&#124;warn&#124;error。 取值：`none`、`info`、`question`、`warn`、`error`。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-confirm" />

## Ui.Confirm

```csharp
bool Confirm(string message, bool yesNo = false, string icon = "question", UiOptions? options = null)
```

确认对话框：确认返回 true，否认或关闭返回 false；消息按纯文本显示（不支持 md:）。UiOptions 只使用 Title 与 RestoreFocus。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `bool yesNo = false` | 按钮为“是/否”（否则“确定/取消”）。 |
| `string icon = "question"` | none&#124;info&#124;question&#124;warn&#124;error。 取值：`none`、`info`、`question`、`warn`、`error`。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-ask" />

## Ui.Ask

```csharp
string? Ask(string message, IEnumerable<string> buttons, string? defaultValue = null, string icon = "question", UiOptions? options = null)
```

显示自定义按钮并返回所点按钮的值；取消返回 null。消息按纯文本显示（不支持 md:）；UiOptions 只使用 Title 与 RestoreFocus。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `IEnumerable<string> buttons` | 按钮 "[fa:icon]标题(_K)&#124;值"（值不能为空：空值与取消无法区分）；图标只支持 fa:。 |
| `string? defaultValue = null` | 默认按钮的值。 |
| `string icon = "question"` | none&#124;info&#124;question&#124;warn&#124;error 或 fa: 图标。 取值：`none`、`info`、`question`、`warn`、`error`。也接受其他值，详见成员说明。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-form" />

## Ui.Form

```csharp
FormResult? Form(IEnumerable<Field> fields, IDictionary<string, object?>? values = null, string? note = null, string[]? buttons = null, string? group = null, bool enterSubmit = true, int width = 0, int labelWidth = 0, UiOptions? options = null)
```

显示表单并返回字段值（不改写动作变量）；取消返回 null。UiOptions 支持 Title/Help/Position/Bounds/Topmost/RestoreFocus，Position=last 降级为 mouse。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<Field> fields` | 字段列表（Field）。 |
| `IDictionary<string, object?>? values = null` | 初值，覆盖 Field.Value。 |
| `string? note = null` | 表单上方提示。 |
| `string[]? buttons = null` | 按钮 "标题(_K)&#124;值"，首个为确认（缺省确认值 "ok"）；不支持图标，值不能含 &#124;。 |
| `string? group = null` | 初始分组。 |
| `bool enterSubmit = true` | 见本成员和所在域的说明。 |
| `int width = 0` | 窗口宽度；0 为 500。 |
| `int labelWidth = 0` | 标签宽度；0 为 100。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`FormResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-showtext" />

## Ui.ShowText

```csharp
TextResult ShowText(string text, string[]? operations = null, string? language = null, bool wrap = true, bool lineNumbers = false, int caret = -1, string? saveKey = null, UiOptions? options = null)
```

显示文本并等待关闭（含失焦关闭），返回关闭时的文本、选中内容与光标（永不返回 null：直接关闭时 Operation 为 null）；点工具栏按钮关闭时 Operation 为其值。关闭后不恢复原前台窗口，之后要粘贴/输入先调用 qk.Window.RestoreForeground()。UiOptions 支持 Title/Position/Bounds/Topmost/CloseOnBlur/Font/FontSize/Key，Position=last 降级为 mouse。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string[]? operations = null` | 工具栏按钮 "[fa:icon]标题&#124;值"（值不能为空）；点击即关闭并写入 TextResult.Operation。不支持 call: 子程序按钮与 &#124;= 分隔符。 |
| `string? language = null` | 语法高亮名。 |
| `bool wrap = true` | 见本成员和所在域的说明。 |
| `bool lineNumbers = false` | 见本成员和所在域的说明。 |
| `int caret = -1` | 初始光标：-1 末尾，0 开头。 |
| `string? saveKey = null` | 窗口关闭后把最终文本写入该动作状态键（同 qk.State.SetText：键 1–256 字符、1 MiB 上限、未保存动作仅本次运行内存）；运行被停止时不写入。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`TextResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-notify" />

## Ui.Notify

```csharp
void Notify(string message, string kind = "info", string? title = null, int durationMs = 0, string position = "bottomCenter", string? key = null, string duplicate = "replace", string? click = null)
```

显示通知（不等待）。

| 参数声明 | 说明 |
|---|---|
| `string message` | 见本成员和所在域的说明。 |
| `string kind = "info"` | info&#124;success&#124;warn&#124;error&#124;toast（toast 为 Windows 通知，不支持 durationMs/position/key/duplicate 与按钮）。 取值：`info`、`success`、`warn`、`error`、`toast`。 |
| `string? title = null` | 标题；缺省为动作标题，"-" 不显示。 |
| `int durationMs = 0` | 显示时长毫秒：0 默认，-1 常驻，或 2000–30000。 |
| `string position = "bottomCenter"` | bottomCenter&#124;bottomLeft&#124;bottomRight&#124;topCenter&#124;topLeft&#124;topRight。 取值：`bottomCenter`、`bottomLeft`、`bottomRight`、`topCenter`、`topLeft`、`topRight`。 |
| `string? key = null` | 通知标识（按动作隔离，不能含冒号）；同 key 的通知仍在显示时按 duplicate 处理。 |
| `string duplicate = "replace"` | 同 key 的通知仍在显示时：replace（替换，默认）&#124;count（合并计数）&#124;ignore（忽略新通知）；需要同时给出 key。 取值：`replace`、`count`、`ignore`。 |
| `string? click = null` | 点击操作（同“通知”步骤语法）；需要进程能力。@button/@buttons 按钮只允许 run/open/copy/none 操作。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pin" />

## Ui.Pin

```csharp
void Pin(object content, Pt? at = null, string kind = "auto")
```

贴图：把图片或文本像 Quicker 贴图一样置顶钉在屏幕上（不等待；脚本结束后保留）；看图窗口见 qk.Ui.ShowImage。计入每次运行的对话框限额；Img 会被复制，之后释放不影响贴图。例：qk.Ui.Pin(img, new Pt(shot.Area.X, shot.Area.Y)) 贴回原截取位置。

| 参数声明 | 说明 |
|---|---|
| `object content` | Img，或字符串（按 kind 显示）；其他类型报 INVALID_ARGUMENT。 |
| `Pt? at = null` | 内容左上角的屏幕点（Pt，物理像素），与 CaptureResult.Area、Screen.Capture(area) 同坐标，按像素 1:1 显示。null 时在鼠标所在屏幕居中（过大时缩小）。 |
| `string kind = "auto"` | auto（Img，或按“贴图”步骤自动识别 HTML/公式/纯文本；不把字符串当图片路径）&#124;text&#124;html（禁脚本、不加载外部资源，只显示内联内容与 data: 图片）&#124;latex（KaTeX 公式）。 取值：`auto`、`image`、`text`、`html`、`latex`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickfile" />

## Ui.PickFile

```csharp
string? PickFile(string? filter = null, string? directory = null, UiOptions? options = null)
```

选择一个文件；取消返回 null。UiOptions 只使用 Title 与 Topmost；停止与确认几乎同时发生时按取消处理。

| 参数声明 | 说明 |
|---|---|
| `string? filter = null` | 筛选器，如 "图片&#124;*.png;*.jpg"（可多组，"&#124;" 分隔）。 |
| `string? directory = null` | 初始目录；不支持 UNC 与设备路径（\\server\share、\\?\）。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickfiles" />

## Ui.PickFiles

```csharp
string[]? PickFiles(string? filter = null, string? directory = null, UiOptions? options = null)
```

选择多个文件；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `string? filter = null` | 见本成员和所在域的说明。 |
| `string? directory = null` | 见本成员和所在域的说明。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`string[]?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-picksavefile" />

## Ui.PickSaveFile

```csharp
string? PickSaveFile(string? filter = null, string? fileName = null, string? directory = null, UiOptions? options = null)
```

选择保存路径（另存为对话框，只返回路径，不写文件）；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `string? filter = null` | 见本成员和所在域的说明。 |
| `string? fileName = null` | 默认文件名（不含目录）。 |
| `string? directory = null` | 见本成员和所在域的说明。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickfolder" />

## Ui.PickFolder

```csharp
string? PickFolder(string? directory = null, UiOptions? options = null)
```

选择文件夹；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `string? directory = null` | 见本成员和所在域的说明。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-opentext" />

## Ui.OpenText

```csharp
TextWin OpenText(string text, string[]? operations = null, string? language = null, UiOptions? options = null)
```

打开可编辑的文本窗口（不等待），立即返回 TextWin 句柄；同 options.Key 先关闭已打开的同 Key 窗口并沿用其位置；光标在末尾。窗口在运行结束后保留。UiOptions 支持 Title/Position/Bounds/Topmost/CloseOnBlur/Font/FontSize/Key。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string[]? operations = null` | 工具栏按钮 "[fa:icon]标题&#124;值"（不支持 call:，值不能为空）；点击即关闭窗口，值作为 TextWin.WaitForClose() 结果的 Operation。 |
| `string? language = null` | 语法高亮名称（如 C#、JavaScript、XML）。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`TextWin`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-showmenu" />

## Ui.ShowMenu

```csharp
string? ShowMenu(IEnumerable<object> items, bool focus = false, int fontSize = 0, int iconSize = 0)
```

在鼠标处弹出菜单并等待选择，返回所选项的值；点空白返回 null（Esc 只在 focus 为 true 时可用）。只返回值，不执行任何操作。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<object> items` | 同 Select：字符串 "[fa:icon]标题&#124;值" 或 Item；Item.Children 为子菜单（含子项的项不可选），"-" 为分隔线；最多 200 项、5 层。 |
| `bool focus = false` | 菜单获得键盘焦点（方向键、回车或空格选择），关闭后还原前台窗口。 |
| `int fontSize = 0` | 文字大小，0 为 12（6–72）。 |
| `int iconSize = 0` | 图标大小，0 为 16（8–64）。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-openprogress" />

## Ui.OpenProgress

```csharp
ProgressWin OpenProgress(string text, string? title = null, double? percent = null, string[]? operations = null, bool stopOnClose = true, bool bar = false, UiOptions? options = null)
```

显示进度窗口（不等待、不抢焦点），返回 ProgressWin 句柄。每次运行一个窗口：窗口仍打开时再次调用只更新文字/进度/标题并返回同一句柄（operations、stopOnClose、options 以首次为准，不计对话框限额）。运行结束（含停止、超时）时自动关闭。UiOptions（窗口模式）使用 Title/Help/Position/FontSize（按钮文字）；位置：options 为 null 或 Position 为 null/空串时右下角，但 new UiOptions(...) 的 Position 缺省为 mouse，要右下角请写 Position: "bottomRight"；支持 last，不支持 Bounds。根运行里子程序已显示“等待窗口”时改为接管它：只替换标题/文字/进度，保留其默认按钮，operations 为 null 时保留其附加按钮，沿用该步骤的“关闭时停止动作”设置（stopOnClose 不生效），运行结束时不关闭它。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string? title = null` | 窗口标题；null 为 Ui.Title 或动作标题。 |
| `double? percent = null` | 进度 0–100；null 不显示进度条。 |
| `string[]? operations = null` | 附加按钮 "标题&#124;值"（值不能为空；"----" 在这里是普通按钮，不是分隔线）；点击即关闭窗口并写入 ProgressWin.Operation（不停止运行，不支持 call:）。 |
| `bool stopOnClose = true` | 用户点 X（或 Esc）关闭脚本新建的窗口时停止本次运行（默认）；false 时只置 Closed。点 operations 按钮、Close、运行停止、子程序关闭等待窗口都不算用户关闭。不应停止运行的进度窗（如“正在压缩…”、靠 Closed 结束的循环）请设为 false：默认 true 时用户点 X 就是停止，之后 finally 只能做有限清理。 |
| `bool bar = false` | 改用 Quicker 共享进度列表中的一项（轻量；不支持 operations 与 WaitForClose；stopOnClose 时显示取消按钮，点取消停止本次运行）。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`ProgressWin`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-showimage" />

## Ui.ShowImage

```csharp
void ShowImage(Img image, double scale = 1, bool wait = false, double opacity = 1, bool noActivate = false, UiOptions? options = null)
```

看图窗口：显示图片的普通窗口（可缩放、可关闭）；要置顶钉在屏幕上见 qk.Ui.Pin。显示文件或网址请先 qk.Image.Load；图片在调用时复制。不等待时窗口在运行结束后保留。UiOptions 使用 Title/Position/Bounds（按区域缩放）/Topmost/CloseOnBlur/AutoCloseMs/Key（同 Key 替换旧图片窗口），Position=last 降级为 mouse。

| 参数声明 | 说明 |
|---|---|
| `Img image` | 见本成员和所在域的说明。 |
| `double scale = 1` | 初始缩放 0.05–20，1 为 100%。 |
| `bool wait = false` | 等待用户关闭窗口（运行被停止时关闭窗口）。 |
| `double opacity = 1` | 不透明度 0.05–1。 |
| `bool noActivate = false` | 显示时不抢焦点。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickpoint" />

## Ui.PickPoint

```csharp
Pt? PickPoint()
```

让用户在屏幕上点选一个点（全屏遮罩），返回屏幕物理像素；取消返回 null；另一个截图/选择进行中报 CAPTURE_BUSY。

返回类型：`Pt?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickarea" />

## Ui.PickArea

```csharp
Rect? PickArea(bool detect = true)
```

让用户框选区域，返回 Rect（屏幕物理像素，只有坐标不截图；需要截图用 qk.Screen.PickCapture）；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `bool detect = true` | 框选时吸附窗口/控件。 |

返回类型：`Rect?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickwindow" />

## Ui.PickWindow

```csharp
Win? PickWindow()
```

让用户点选一个窗口，返回其顶层窗口的 Win（计 1 次窗口观察；提权窗口报 ELEVATED_TARGET_DENIED）；取消返回 null。

返回类型：`Win?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-pickcolor" />

## Ui.PickColor

```csharp
string? PickColor(string? initialColor = null, bool fromScreen = false, bool alpha = false)
```

选择颜色，返回 "#RRGGBB"（alpha 时 "#AARRGGBB"）；取消返回 null。

| 参数声明 | 说明 |
|---|---|
| `string? initialColor = null` | 颜色窗口的初始颜色："#RGB"/"#RRGGBB"/"#AARRGGBB"（无效报 INVALID_ARGUMENT；fromScreen 为 true 时忽略）。 |
| `bool fromScreen = false` | true：直接在屏幕上取色；false：打开颜色选择窗口（窗口内也可屏幕取色）。 |
| `bool alpha = false` | 返回含透明度的 "#AARRGGBB"。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-editlist" />

## Ui.EditList

```csharp
List<string>? EditList(IEnumerable<string> items, string? note = null, bool allowAdd = true, bool allowEdit = true, bool allowDelete = true, int width = 0, int height = 0, UiOptions? options = null)
```

列表编辑窗口（按原文编辑，不解析图标/标题、不执行代码）：确认返回新列表（不修改传入集合），取消返回 null。最多 10000 项、单项 64K 字符；窗口尺寸用 width/height（逻辑像素），不支持 UiOptions.Bounds（传入报 INVALID_ARGUMENT）。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<string> items` | 见本成员和所在域的说明。 |
| `string? note = null` | 列表上方的说明文字。 |
| `bool allowAdd = true` | 见本成员和所在域的说明。 |
| `bool allowEdit = true` | 见本成员和所在域的说明。 |
| `bool allowDelete = true` | 见本成员和所在域的说明。 |
| `int width = 0` | 窗口宽度（DIP 逻辑像素）；0 为默认，否则 1–8000（最小按 200 显示）。 |
| `int height = 0` | 窗口高度（DIP 逻辑像素）；0 为默认，否则 1–8000（最小按 200 显示）。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`List<string>?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-edittable" />

## Ui.EditTable

```csharp
List<Dictionary<string, object?>>? EditTable(IEnumerable<IDictionary<string, object?>> rows, string[]? columns = null, bool readOnly = false, int width = 0, int height = 0, UiOptions? options = null)
```

表格查看/编辑窗口（不执行代码）：确认返回编辑后的全部行（按列顺序的新字典，值为 string；用户编辑后清空的单元格为 ""，未编辑的空单元格为 null；不修改传入数据），取消返回 null；停止脚本时直接关闭不询问保存。窗口尺寸用 width/height（逻辑像素），不支持 UiOptions.Bounds（传入报 INVALID_ARGUMENT）。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<IDictionary<string, object?>> rows` | 每行一个字典（列名 → 值）；值只能是 null/string/数字/bool/日期/Guid，显示为文本。最多 10000 行、100 列。 |
| `string[]? columns = null` | 列顺序；null 为各行键的并集（按首次出现顺序）；给出时行中不能有其他键。列名 1–128 字符、不区分大小写不重复、不能含 . / \ [ ] ( ) ^。 |
| `bool readOnly = false` | 只查看不编辑（关闭即返回原数据的副本：保留原始类型与 null，不转文本）。 |
| `int width = 0` | 窗口宽度（DIP 逻辑像素）；0 为默认，否则 1–8000。 |
| `int height = 0` | 窗口高度（DIP 逻辑像素）；0 为默认（只给 width 时高度也为默认），否则 1–8000。 |
| `UiOptions? options = null` | 见本成员和所在域的说明。 |

返回类型：`List<Dictionary<string, object?>>?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ui-react" />

## Ui.React

```csharp
object? React(string source, object? input = null, int width = 0, int height = 0, UiOptions? options = null)
```

显示 React（TSX）界面并等待：页面在沙箱中运行，不能联网、没有宿主 API，只有 input/close/cancel/notify 与按动作隔离的小容量存储；返回页面 close(result) 的值，取消/关闭返回 null；页面出错报 UI_REACT_FAILED。页面内可用 setInterval/setTimeout（在 useEffect 清理函数中清除）、行内 style 与原生 HTML 元素；QuickerUi 组件的属性见“React 界面”步骤的 api.d.ts。计入对话框限额，notify 计入通知限额。页面可仿冒任意界面，不要借它索取其他账号的密码。

| 参数声明 | 说明 |
|---|---|
| `string source` | TSX 源码（最多 128 KiB；只能 import react/QuickerUi/Quicker）。 |
| `object? input = null` | 传给页面的数据（可 JSON 序列化的值）。 |
| `int width = 0` | 窗口最大宽度（DIP）；0 为 440，否则 100–4000。窗口随页面内容收缩，至少 360、至多工作区的 92%。 |
| `int height = 0` | 窗口最大高度（DIP，含 36 的标题栏）；0 为 300，否则 100–4000。窗口随页面内容收缩，至少 220、至多工作区的 92%。 |
| `UiOptions? options = null` | 只使用 Title（缺省为动作标题）；Position/Bounds/Topmost/Font 等其余字段不生效。窗口在鼠标所在屏幕的工作区居中显示。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
