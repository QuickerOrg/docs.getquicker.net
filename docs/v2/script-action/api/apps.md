---
title: "qk.Apps：外部程序"
description: "qk.Apps：外部程序的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/apps
comments: false
sidebar_position: 10
---

{/* script-api:start */}

在 Office/WPS/Adobe/CAD 等程序内部执行代码或调用插件命令；启动程序见 qk.Process。支持 Office/WPS VBA、Adobe JS、AutoCAD 命令、Rhino 脚本与软件连接插件命令，经低权限代理执行（不在 Quicker 进程内）；高风险能力。

<a id="apps-run" />

## Apps.Run

```csharp
string? Run(string app, string code, bool wait = true, int timeoutMs = 30000, bool launch = false)
```

经低权限代理在目标程序中执行代码并返回结果文本（对象为 JSON）；高风险能力。停止脚本只中止等待，已发送的代码仍会执行完。错误码：APP_UNAVAILABLE（未安装/未运行/代理不可用）、APP_FAILED（程序返回的错误）、APP_TIMEOUT。

| 参数声明 | 说明 |
|---|---|
| `string app` | word&#124;excel&#124;ppt&#124;wps&#124;et&#124;wpp&#124;visio（VBA；wordOrWps&#124;excelOrEt&#124;pptOrWpp 按前台/运行中进程自动选 Office 或 WPS）、photoshop&#124;illustrator&#124;indesign（ExtendScript JS）、aftereffects（ExtendScript，经 AfterFX -r 运行，总是返回 null）、autocad（命令行文本）、rhino（RhinoScript 命令宏）。 取值：`word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp`、`photoshop`、`illustrator`、`autocad`、`rhino`。也接受其他值，详见成员说明。 |
| `string code` | VBA：模块文本，运行第一个 Sub/Function（或首行写 'MAIN:名称 指定），Function 的返回值为结果；不含换行的一行为已有宏名。模块代码作为临时模块加入当前活动的工作簿/文档/演示文稿（须已打开）并经 Application.Run 运行（visio 结果为 ""），需开启 Office“信任对 VBA 工程对象模型的访问”（未开启时 APP_FAILED 的消息附开启方法；宏名调用不需要）。写 VBA：非 ASCII 文本用 ChrW 拼接（VBA 编辑器按系统 ANSI 代码页保存模块文本，其他字符可能变成 ?）；VBA 字符串中的 " 写成 ""；每行少于 1000 字符（VBA 上限 1023，长字符串分段 s = s & "…"）；结果用 Function 返回（Sub 无结果）。JS：最后一个表达式的值为结果。autocad：发送到命令行，以 "\n" 或空格结尾才执行。 |
| `bool wait = true` | 等待结果；false 时不等待、返回 null。 |
| `int timeoutMs = 30000` | 等待结果的最长毫秒（1000–600000）；aftereffects 忽略 wait/timeoutMs（记警告日志）。 |
| `bool launch = false` | false（默认）：目标程序须已在运行，否则报 APP_UNAVAILABLE；true：允许代理在后台启动它（Office/Rhino 为不可见实例，执行后不会自动退出）。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：在外部程序中执行脚本或命令（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="apps-bridge" />

## Apps.Bridge

```csharp
object? Bridge(string app, string command, object? arguments = null, int timeoutMs = 30000, string? target = null)
```

调用软件连接（Bridge 插件）命令并返回解码后的结果（对象为 Dictionary、数组为 List，同 Browser.Eval；没有结果为 null）；需在 设置 → 软件连接 中开启，且目标软件的插件已连接；高风险能力。错误码：BRIDGE_DISABLED、BRIDGE_TARGET_NOT_FOUND、BRIDGE_TARGET_AMBIGUOUS（多个实例，请从目标窗口触发）、BRIDGE_TIMEOUT、BRIDGE_BUSY（软件连接正在切换，稍后重试）；插件返回失败时报 BRIDGE_FAILED，插件自己的错误码在 e.Detail；结果不是有效 JSON 或超过 1 MiB/10000 项等数据上限时报 BRIDGE_FAILED（e.Detail 为 RESULT_INVALID），此时命令可能已在目标软件中执行，请勿盲目重试。

| 参数声明 | 说明 |
|---|---|
| `string app` | 软件连接 Id：aftereffects&#124;autocad&#124;blender&#124;cinema4d&#124;coreldraw&#124;illustrator&#124;indesign&#124;mastercam&#124;maya&#124;motuyun&#124;photoshop&#124;premiere&#124;revit&#124;rhino&#124;sketchup&#124;solidworks&#124;3dsmax&#124;wps。 |
| `string command` | 命令名；先用 "command.list" 取得命令目录（命令名与参数）。 |
| `object? arguments = null` | 命令参数：匿名对象、字典或 JSON 对象文本（最多 1 MiB）。 |
| `int timeoutMs = 30000` | 100–600000 毫秒。 |
| `string? target = null` | 可选：qk.Apps.ListTargets(app) 返回的 Id，指定实例（多个实例在线时避免 BRIDGE_TARGET_AMBIGUOUS）；null 按唯一在线实例或触发窗口选择。实例已离线 BRIDGE_TARGET_NOT_FOUND；WPS 实例须与命令所属组件一致；motuyun 不支持。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：在外部程序中执行脚本或命令（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="apps-listtargets" />

## Apps.ListTargets

```csharp
BridgeTarget[] ListTargets(string app)
```

软件连接中该软件的已连接实例（含其当前文档标题与路径）；没有返回空数组（motuyun 恒为空）；Id 可传给 Bridge 的 target；软件连接未开启报 BRIDGE_DISABLED。

| 参数声明 | 说明 |
|---|---|
| `string app` | 见本成员和所在域的说明。 |

返回类型：`BridgeTarget[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取窗口信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="apps-runofficecommand" />

## Apps.RunOfficeCommand

```csharp
void RunOfficeCommand(string app, string msoId, int timeoutMs = 10000)
```

在 Office 当前文档中执行功能区命令（ExecuteMso）；程序须已运行（不会在后台启动，否则 APP_UNAVAILABLE），命令无效 APP_FAILED，弹出对话框的命令超时报 APP_TIMEOUT。

| 参数声明 | 说明 |
|---|---|
| `string app` | 见本成员和所在域的说明。 取值：`word`、`excel`、`ppt`、`wps`、`et`、`wpp`、`visio`、`wordOrWps`、`excelOrEt`、`pptOrWpp`。 |
| `string msoId` | 功能区控件 Id（idMso），如 "Bold"、"FileSave"；字母开头，1–128 个字母/数字/下划线。 |
| `int timeoutMs = 10000` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：在外部程序中执行脚本或命令（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
