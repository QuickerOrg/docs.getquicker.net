---
title: "qk.Uia：界面自动化"
description: "qk.Uia：界面自动化的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/uia
comments: false
sidebar_position: 10
---

{/* script-api:start */}

其他程序窗口里的界面元素（查找/读取/操作）；Quicker 自己的对话框见 qk.Ui，窗口本身见 qk.Window。window 为 null 表示前台窗口。El 仅本次运行有效；Find 找不到返回 null，元素消失或所在窗口关闭后使用 El 报 UIA_REF_STALE；高权限窗口报 ELEVATED_TARGET_DENIED；Quicker 自身窗口不能读取也不能操作，报 UIA_TARGET_DENIED；无法确定所在窗口的元素按找不到处理。常见错误码：UIA_PATTERN_UNSUPPORTED（元素不支持该操作）、UIA_NOT_FOUND（菜单项/对话框）、UIA_TIMEOUT（程序无响应，单次 10 秒）、UIA_LIMIT_EXCEEDED（每次运行读取 400 次、操作 100 次、El 1024 个、累计 120 秒）。读取需要“读取界面元素”能力，操作需要“操作界面元素”能力。

<a id="uia-find" />

## Uia.Find

```csharp
El? Find(Win? window = null, string? name = null, string? controlType = null, string? automationId = null, string? className = null, string? xpath = null, int timeoutMs = 0)
```

查找第一个匹配的界面元素；没有返回 null。

| 参数声明 | 说明 |
|---|---|
| `Win? window = null` | 所在窗口；null 为前台窗口。 |
| `string? name = null` | 元素名称（精确匹配，区分大小写）。各条件同时满足。 |
| `string? controlType = null` | 控件类型名：Button、Edit、CheckBox、ComboBox、ListItem、MenuItem 等。 取值：。也接受其他值，详见成员说明。 |
| `string? automationId = null` | AutomationId。 |
| `string? className = null` | ClassName。 |
| `string? xpath = null` | 以 / 开头的定位路径（来自 GetTree 的 find.xpath 或 ElInfo.XPath，相对窗口）；只在 window 内定位，不查同一程序的其他窗口；[-1] 为倒数第一个，[Name='确定' &#124; #2] 为按名称、找不到取第 2 个；不能与其他条件同时使用。 |
| `int timeoutMs = 0` | 0–60000；大于 0 时每 200ms 重查直到找到或超时（超时返回 null）；0 只查一次。 |

返回类型：`El?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-findall" />

## Uia.FindAll

```csharp
El[] FindAll(Win? window = null, string? name = null, string? controlType = null, string? automationId = null, string? className = null, int limit = 64)
```

查找全部匹配元素；没有返回空数组。条件同 Find（不支持 xpath）。

| 参数声明 | 说明 |
|---|---|
| `Win? window = null` | 见本成员和所在域的说明。 |
| `string? name = null` | 见本成员和所在域的说明。 |
| `string? controlType = null` | 见本成员和所在域的说明。 |
| `string? automationId = null` | 见本成员和所在域的说明。 |
| `string? className = null` | 见本成员和所在域的说明。 |
| `int limit = 64` | 最多返回数 1–64。 |

返回类型：`El[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-frompoint" />

## Uia.FromPoint

```csharp
El? FromPoint(Pt? point = null)
```

屏幕点下的元素；没有返回 null。

| 参数声明 | 说明 |
|---|---|
| `Pt? point = null` | 屏幕物理像素点；null 为当前鼠标位置。 |

返回类型：`El?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-getfocused" />

## Uia.GetFocused

```csharp
El? GetFocused()
```

当前拥有键盘焦点的元素；没有返回 null。

返回类型：`El?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-info" />

## Uia.Info

```csharp
ElInfo Info(El element)
```

读取元素的最新信息快照（可返回）；XPath 相对元素自身所在的顶层窗口。

| 参数声明 | 说明 |
|---|---|
| `El element` | 见本成员和所在域的说明。 |

返回类型：`ElInfo`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-act" />

## Uia.Act

```csharp
void Act(El element, string action = "invoke")
```

对元素执行操作。

| 参数声明 | 说明 |
|---|---|
| `El element` | 见本成员和所在域的说明。 |
| `string action = "invoke"` | invoke（默认，按钮/菜单项）&#124;click（经鼠标输入真实点击元素，另需鼠标能力；元素在屏幕外时先 scroll）&#124;check / uncheck（复选框、开关按钮：设为勾选 / 不勾选，已是该状态时不操作，优先于 toggle）&#124;toggle（翻转当前状态）&#124;expand&#124;collapse（组合框、树节点、菜单）&#124;select（单选、标签页、列表项）&#124;focus&#124;scroll（滚动到可见）。元素不支持时报 UIA_PATTERN_UNSUPPORTED。 取值：`invoke`、`click`、`toggle`、`check`、`uncheck`、`expand`、`collapse`、`select`、`focus`、`scroll`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-setvalue" />

## Uia.SetValue

```csharp
void SetValue(El element, string value)
```

设置元素的值（只用 Value 模式，如输入框、组合框，整体替换）；不支持或只读时报 UIA_PATTERN_UNSUPPORTED，不回退为键入（可先 Act(element, "focus") 再 qk.Keyboard.Paste）。

| 参数声明 | 说明 |
|---|---|
| `El element` | 见本成员和所在域的说明。 |
| `string value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-gettree" />

## Uia.GetTree

```csharp
string GetTree(Win? window = null, int depth = 6, bool interactiveOnly = true)
```

窗口的界面元素树 JSON，用于编写脚本时查找名称、类型与 XPath。

| 参数声明 | 说明 |
|---|---|
| `Win? window = null` | 见本成员和所在域的说明。 |
| `int depth = 6` | 深度 0–32。 |
| `bool interactiveOnly = true` | 只保留可交互元素，每项附 find（可直接作为 Find 的 name/id/xpath 与 type 实参）；最多 512 个节点、1 MiB，截断时 isComplete 为 false。密码框（isPassword 为 true）不含 value/text。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-clickmenu" />

## Uia.ClickMenu

```csharp
void ClickMenu(string path, Win? window = null)
```

按路径点击窗口菜单，如 "文件/另存为"（名称含 / 时改用换行分隔层级）。每级先按 UIA 名称精确匹配，失败后两边都忽略访问键（(&F)、(F)、&）与末尾省略号（...、…）再比较，因此 "文件/另存为" 也能找到经典 Win32 菜单的“文件(F)”“另存为(A)...”；措辞或语言不同仍会失败。找不到某级报 UIA_NOT_FOUND，可先按 Escape 收起菜单再改用快捷键。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `Win? window = null` | 所在窗口；null 为前台窗口。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="uia-setdialogpath" />

## Uia.SetDialogPath

```csharp
void SetDialogPath(string path, bool createDirectory = false, bool pressEnter = false)
```

把路径（按 qk.Files 规则转为完整路径）填入打开/另存为对话框（前台的，否则第一个）的文件名框；没有对话框报 UIA_NOT_FOUND。让资源管理器窗口转到文件夹见 qk.Files.SetExplorerPath。

| 参数声明 | 说明 |
|---|---|
| `string path` | 文件夹或完整文件路径。以 \ 结尾表示文件夹（如 @"D:\out\v1.2\"），否则视为文件。 |
| `bool createDirectory = false` | 先创建缺少的文件夹（另需写文件能力）：以 \ 结尾时创建整个路径，否则只创建其上级文件夹（不按扩展名猜测）。 |
| `bool pressEnter = false` | false（默认）：只填写，由用户确认；true：填写后按 Enter 提交——文件夹路径使对话框跳转，文件路径会让程序立即在该路径保存或打开文件（另存为可能覆盖同名文件）。之后不要再按 Enter。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作其他程序的界面元素。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
