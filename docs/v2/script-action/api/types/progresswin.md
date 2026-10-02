---
title: "ProgressWin"
description: "ProgressWin的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/progresswin
comments: false
sidebar_position: 10
---

{/* script-api:start */}

进度窗口句柄（qk.Ui.OpenProgress 返回）：仅本次运行有效，不能返回或写入 State；本次运行新建的窗口在运行结束（含停止、超时）时自动关闭。停止后的 finally 中仍可调用 Close；读取 Closed/Operation 不需要能力，任何时候都可用。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Closed` | `bool` | 窗口是否已关闭：用户关闭（点 X 或 operations 按钮）、调用 Close，也包括运行被停止、子程序“关闭等待窗口”、自动关闭（这些情况下 Operation 为 null）。 |
| `Operation` | `string?` | 关闭窗口的附加按钮（operations）的值——点击 operations 按钮即关闭窗口、不停止运行；点 X、脚本 Close 或尚未关闭为 null。 |

<a id="progresswin-update" />

## ProgressWin.Update

```csharp
void Update(string? text = null, double? percent = null, string? title = null)
```

更新文字、进度或标题；为 null 的参数保持不变；立即返回（窗口显示最新值，循环里每次调用无需节流）；窗口已关闭时无操作。

| 参数声明 | 说明 |
|---|---|
| `string? text = null` | 见本成员和所在域的说明。 |
| `double? percent = null` | 进度 0–100。 |
| `string? title = null` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="progresswin-waitforclose" />

## ProgressWin.WaitForClose

```csharp
string? WaitForClose()
```

等待窗口关闭，返回 Operation（点 X 等其它方式关闭为 null）；运行被停止时中断等待，运行结束时返回 null；bar 进度条不支持（INVALID_ARGUMENT）。

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="progresswin-close" />

## ProgressWin.Close

```csharp
void Close()
```

关闭窗口；已关闭时无操作。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

{/* script-api:end */}
