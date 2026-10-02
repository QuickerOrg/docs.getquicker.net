---
title: "qk.Keyboard：键盘"
description: "qk.Keyboard：键盘的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/keyboard
comments: false
sidebar_position: 10
---

{/* script-api:start */}

向前台窗口模拟键盘输入（按键、组合键、输入文本、粘贴）；读写剪贴板见 qk.Clipboard。与 qk.Mouse 共用输入会话与限额；每次调用结束且没有按住的键时归还输入会话（之后的对话框操作不会中断脚本）；停止或结束时自动松开本次按下的键。每次运行最多输入 2000 个字符、256 次键盘调用；超出任一限额报 INPUT_LIMIT_EXCEEDED，且本次运行之后的键鼠输入全部失败。

<a id="keyboard-press" />

## Keyboard.Press

```csharp
void Press(string keys, int repeat = 1, int holdMs = 0)
```

按下并松开按键或组合键。

| 参数声明 | 说明 |
|---|---|
| `string keys` | 如 "Ctrl+Shift+S"、"Enter"、"Ctrl+/"；最后一段为主键。键名（不区分大小写）：字母、数字、F1–F24、Numpad0–9、Enter/Tab/Space/Esc 等功能键、Ctrl/Shift/Alt/Win、单个标点 , . / ; - = [ ] ` \ '（按美式键位；+ 请写 "Shift+="）、媒体/音量/浏览器键（MediaPlayPause、VolumeUp、BrowserBack 等）、其他 WinForms Keys 名（如 OemPeriod）或 0x 虚拟键码；不认识报 INVALID_ARGUMENT（Detail 为 KEY_NOT_SUPPORTED）。 |
| `int repeat = 1` | 重复次数（1–100）。 |
| `int holdMs = 0` | 按住时长毫秒（0–2000）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-down" />

## Keyboard.Down

```csharp
void Down(string key)
```

按下并保持一个键（最多同时 8 个）；脚本结束或停止时自动松开。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-up" />

## Keyboard.Up

```csharp
void Up(string key)
```

松开由 Down 按下的键；停止后的 finally 中也可调用（只释放：松开本次按住的全部键和按钮）。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-isdown" />

## Keyboard.IsDown

```csharp
bool IsDown(string key, bool toggled = false)
```

读取按键状态（不注入输入）；Shift/Ctrl/Alt/Win 不分左右。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `bool toggled = false` | true 时读取 CapsLock 等切换状态。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-type" />

## Keyboard.Type

```csharp
int Type(string text, int intervalMs = 0)
```

逐字输入文本并返回输入的字符数；每次运行累计最多 2000 字符（\n 输入回车）。超出时本次调用一个字也不输入并报 INPUT_LIMIT_EXCEEDED（ActionErrorCode.InputLimitExceeded，不是 LIMIT_EXCEEDED），之后本次运行的键鼠输入（Press、Paste、Selection.GetText 等）全部失败：请先统计总长度，超出时截断或提示。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `int intervalMs = 0` | 字符间隔毫秒（0–2000）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-paste" />

## Keyboard.Paste

```csharp
void Paste(string text, bool restore = true, int restoreDelayMs = 400)
```

经剪贴板粘贴（Ctrl+V），写入内容不进剪贴板历史；计入 qk.Clipboard 写入限额（粘贴 1 次，恢复再 1 次）；单次最多 1 MiB。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `bool restore = true` | 粘贴后恢复原剪贴板（仅当剪贴板仍是本次写入的内容；只恢复常见格式，快照失败时不恢复并记警告）。 |
| `int restoreDelayMs = 400` | 粘贴后到恢复剪贴板前的等待毫秒（默认 400；小于 100 按 100；最多 2000；慢程序可调大）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化；读取剪贴板；修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-sendkeys" />

## Keyboard.SendKeys

```csharp
void SendKeys(string keys)
```

按 WinForms SendKeys 语法输入（+ Shift、^ Ctrl、% Alt、~ Enter、&#123;KEY&#125;、&#123;KEY n&#125;、分组 (...)）；修饰键只作用于字母、数字、空格、标点和 &#123;KEY&#125;（如 ^/ 为 Ctrl+/），&#123;KEY&#125; 另接受 Keyboard.Press 的键名（如 &#123;MediaPlayPause&#125;）。与 WinForms 不同：^A 为 Ctrl+A（不自动加 Shift），&#123;A&#125; 输入小写 a。

| 参数声明 | 说明 |
|---|---|
| `string keys` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-waitforkey" />

## Keyboard.WaitForKey

```csharp
string? WaitForKey(string? keys = null, int timeoutMs = 0, bool swallow = false)
```

等待用户的物理按键（全局钩子，忽略模拟按键，不阻挡用户操作），返回键名（与 Keyboard.Press 相同，如 "Enter"、"A"；组合键条目带修饰键前缀，如 "Ctrl+Q"）；超时返回 null。需要“监听按键”能力；有 Keyboard.Down/Mouse.Down 按住的键时不能调用。一次调用只返回一个键，命中后不再拦截其他按键；前台为管理员权限窗口时按键被忽略（不命中、不拦截）；每次运行最多调用 1000 次（LIMIT_EXCEEDED）。

| 参数声明 | 说明 |
|---|---|
| `string? keys = null` | 等待的键，逗号分隔（"Enter,Escape"）或组合键（"Ctrl+Q"：修饰键须按下，多按的修饰键不影响）；键名同 Keyboard.Press，也接受 WinForms 键名（OemPeriod）；不支持鼠标键。null 为任意键（含单独的修饰键）。 |
| `int timeoutMs = 0` | 最长等待毫秒（最多 3600000）；0 为不限，直到按键或运行被停止。等待同样会在到达动作超时时结束（墙钟，默认 30 秒，运行被停止）；长时间等待请在编辑器中调大动作超时或设为不限制。 |
| `bool swallow = false` | 拦截命中的那次按下，不传给前台程序（修饰键不拦截）。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：监听按键。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-getime" />

## Keyboard.GetIme

```csharp
bool GetIme()
```

读取前台窗口输入法当前是否为中文（读不到状态视为 false）。只读取、不记录恢复基线，停止后的 finally 中也可调用。恢复写法：var was = qk.Keyboard.GetIme(); qk.Keyboard.SetIme(false); try &#123; … &#125; finally &#123; qk.Keyboard.SetIme(was); &#125;

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="keyboard-setime" />

## Keyboard.SetIme

```csharp
void SetIme(bool chinese)
```

设置前台窗口输入法的中/英文状态（无返回值）。已知当前已是目标状态时不发送任何按键或消息（切换热键多为按一次翻转，重复发送会切反）；否则设置中配置了输入法切换热键时经键盘输入发送该热键（异步生效），否则发送输入法消息；之后最多等待 300ms 确认（部分输入法不报告状态，不保证）。停止后的 finally 中：已是目标状态或本次运行从未调用 SetIme 时不做任何事（后者记日志）；否则只允许恢复到本次运行首次调用 SetIme 前的状态（只发输入法消息，不发按键），其他值报 CAPABILITY_DENIED。

| 参数声明 | 说明 |
|---|---|
| `bool chinese` | true 切换到中文，false 切换到英文。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：键盘自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
