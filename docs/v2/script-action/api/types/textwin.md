---
title: "TextWin"
description: "TextWin的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/textwin
comments: false
sidebar_position: 10
---

{/* script-api:start */}

非等待文本窗口句柄（qk.Ui.OpenText 返回）：仅本次运行有效，不能返回或写入 State；窗口本身在运行结束后保留，由用户关闭。窗口关闭后 Append/SetText/Activate/Close 不做任何事（用 Closed 判断）。停止后的 finally 中仍可对它调用 Close/Append/SetText（清理阶段合计最多 64K 字符）；读取 Closed 不需要能力，任何时候都可用。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Closed` | `bool` | 窗口是否已关闭（用户关闭、点 operations 按钮、调用 Close、被同 Key 窗口替换）。 |

<a id="textwin-append" />

## TextWin.Append

```csharp
void Append(string text)
```

在末尾追加文本（光标移到末尾）；窗口内容最多 4M 字符。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="textwin-settext" />

## TextWin.SetText

```csharp
void SetText(string text)
```

替换全部文本（光标移到开头）。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="textwin-activate" />

## TextWin.Activate

```csharp
void Activate()
```

显示并激活窗口（最小化时还原）。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="textwin-waitforclose" />

## TextWin.WaitForClose

```csharp
TextResult? WaitForClose()
```

等待用户关闭窗口（点 X、Esc、失焦关闭或点击 operations 按钮——点击 operations 按钮即关闭窗口），返回关闭时的文本、选中内容、光标与 Operation（点击的 operations 值，否则 null）；被 Close 关闭、被同 options.Key 的 OpenText 替换或运行结束时返回 null；运行被停止时中断等待。

返回类型：`TextResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

<a id="textwin-close" />

## TextWin.Close

```csharp
void Close()
```

关闭窗口（之后 WaitForClose 返回 null）；已关闭时无操作。

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../../security.md)。

{/* script-api:end */}
