---
title: "qk.Actions：动作与子程序"
description: "qk.Actions：动作与子程序的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/actions
comments: false
sidebar_position: 10
---

{/* script-api:start */}

调用和管理 Quicker 动作（同步调用本机动作或公共子程序、查询/停止运行中的动作、设置当前动作的角标与右键菜单）；启动外部程序见 qk.Process。调用链最多 16 层。

<a id="actions-call" />

## Actions.Call

```csharp
object? Call(string action, string? input = null)
```

同步调用本机动作并返回其结果；子动作失败抛 CALL_FAILED（被调脚本动作的错误码在 e.Detail，原异常在 e.InnerException），取消会传播到本脚本。

| 参数声明 | 说明 |
|---|---|
| `string action` | 动作 ID 或名称。 |
| `string? input = null` | 传给子动作的原始字符串：子动作用 qk.Context.Input 读取（未传为 null，传 "" 为空串）；子动作声明了 string quicker_in_param = "" 时也绑定到它（未传时为默认值 ""）。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用或停止其他动作。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-callsubprogram" />

## Actions.CallSubprogram

```csharp
IReadOnlyDictionary<string, object?> CallSubprogram(string name, IDictionary<string, object?>? inputs = null)
```

调用本机全局公共子程序（不是动作内子程序），返回输出参数的只读字典（按输出参数名取值）；找不到抛 SUBPROGRAM_NOT_FOUND，运行失败抛 CALL_FAILED，子程序被取消时本脚本随之停止（不进 catch）。也是长尾功能的兜底入口。

| 参数声明 | 说明 |
|---|---|
| `string name` | 子程序名称或 Id。 |
| `IDictionary<string, object?>? inputs = null` | 输入参数（按子程序参数键）。 |

返回类型：`IReadOnlyDictionary<string, object?>`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用或停止其他动作。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-stop" />

## Actions.Stop

```csharp
int Stop(string action)
```

按动作 Id 或标题（精确）停止其正在运行的实例（同“运行动作”步骤的停止动作；不含本次运行），只发出停止请求、立即返回停止的实例数（0 不报错，不等待对方结束；返回值也反映该标题的动作是否在运行）。停止以 Actions.Call 等待本脚本的调用方时，本次运行也随之停止。需要“调用或停止动作”能力。

| 参数声明 | 说明 |
|---|---|
| `string action` | 动作 Id 或标题。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用或停止其他动作。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-getrunningcount" />

## Actions.GetRunningCount

```csharp
int GetRunningCount(string? action = null)
```

动作正在运行的实例数（含本次运行）。动作库安装的脚本只能查询自身，查询其他动作或找不到的名称都报 ACCESS_DENIED（不返回 0）。

| 参数声明 | 说明 |
|---|---|
| `string? action = null` | 动作 Id 或名称；null 为当前动作；找不到为 0。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-stopothers" />

## Actions.StopOthers

```csharp
void StopOthers()
```

停止当前动作的其他运行实例（不影响其他动作），立即返回；常用于切换型脚本开头。未保存的动作报 INVALID_ARGUMENT。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-info" />

## Actions.Info

```csharp
ActionInfo? Info(string action)
```

读取动作信息；找不到返回 null。动作库安装的脚本只能读取自身（其他动作或找不到都报 ACCESS_DENIED）。

| 参数声明 | 说明 |
|---|---|
| `string action` | 动作 Id、动作库 Id 或名称。 |

返回类型：`ActionInfo?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-setbadge" />

## Actions.SetBadge

```csharp
void SetBadge(string? text, string? color = null, string? textColor = null)
```

设置当前动作按钮的角标文字（只作用于当前动作，运行后保留）；null 或空串清除；最多 32 字符单行；未保存的动作报 INVALID_ARGUMENT。停止后的 finally 中只能 SetBadge(null) 清除。

| 参数声明 | 说明 |
|---|---|
| `string? text` | 见本成员和所在域的说明。 |
| `string? color = null` | 角标底色 "#RGB"/"#RRGGBB"/"#AARRGGBB"；null 为默认。 |
| `string? textColor = null` | 角标文字颜色，格式同 color；null 为默认。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-setoverlay" />

## Actions.SetOverlay

```csharp
void SetOverlay(string? icon, string? tooltip = null)
```

设置当前动作按钮角落的覆盖图标（不是主图标），只接受 fa: 图标，如 "fa:Solid_Circle:#FF0000"；null 清除；持久保存；只作用于当前动作；未保存的动作报 INVALID_ARGUMENT。停止后的 finally 中只能 SetOverlay(null) 清除。

| 参数声明 | 说明 |
|---|---|
| `string? icon` | 见本成员和所在域的说明。 |
| `string? tooltip = null` | 鼠标悬停提示（最多 500 字符）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-setcontextmenu" />

## Actions.SetContextMenu

```csharp
void SetContextMenu(string? menu)
```

固定的菜单项优先用 [ActionMenu("标题")] 标注的无参 void 方法声明（点击只运行该方法）；本方法只用于菜单项需在运行时动态生成的情况。设置当前动作按钮的附加右键菜单（持久保存；null 清除）：每行 "[fa:icon]标题|值"，"[+]组名" 后接 "[-]标题|值" 行为子菜单，"----" 为分隔线；最多 100 行，任何一行都不能以 |= 开头，值不能以 qk-script-menu: 开头。用户点击菜单项时以右键菜单触发重新运行本动作（qk.Context.Trigger 为 "contextMenu"），值经 qk.Context.Input 读取（Main 声明了 quicker_in_param 时也绑定到它，不声明不报错）。只作用于当前动作；未保存的动作报 INVALID_ARGUMENT。

| 参数声明 | 说明 |
|---|---|
| `string? menu` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="actions-showcontextmenu" />

## Actions.ShowContextMenu

```csharp
void ShowContextMenu(string? action = null, bool customOnly = true)
```

在鼠标处弹出动作的右键菜单，立即返回（不等待选择）；计入对话框限额。需要“调用本机其他动作”能力（点击自定义菜单项会运行该动作）。

| 参数声明 | 说明 |
|---|---|
| `string? action = null` | 动作 Id 或名称；null 为当前动作。本机动作找不到报 INVALID_ARGUMENT；动作库安装的脚本只能弹出自身的菜单（否则 ACCESS_DENIED）。 |
| `bool customOnly = true` | true（默认）：只显示动作自定义的菜单项（点击以该项的值作为 qk.Context.Input 运行该动作）；false：完整管理菜单（安装来源不允许）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用或停止其他动作。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
