---
title: "qk.Mouse：鼠标"
description: "qk.Mouse：鼠标的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/mouse
comments: false
sidebar_position: 10
---

{/* script-api:start */}

模拟鼠标移动、点击、拖动与滚轮（坐标为屏幕物理像素）；不靠坐标操作控件见 qk.Uia.Act。每次运行最多 100 次点击、120 格滚轮；没有按住的按钮时每次调用结束即归还输入会话。

<a id="mouse-getposition" />

## Mouse.GetPosition

```csharp
Pt GetPosition()
```

当前鼠标位置（只读，不占用输入会话）。

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-moveto" />

## Mouse.MoveTo

```csharp
Pt MoveTo(Pt to, int durationMs = 0)
```

移动到屏幕点；返回移动后的位置。

| 参数声明 | 说明 |
|---|---|
| `Pt to` | 目标屏幕点（Pt，物理像素）。 |
| `int durationMs = 0` | 移动动画时长毫秒（0–2000）。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-moveby" />

## Mouse.MoveBy

```csharp
Pt MoveBy(int dx, int dy)
```

相对当前位置移动。

| 参数声明 | 说明 |
|---|---|
| `int dx` | 见本成员和所在域的说明。 |
| `int dy` | 见本成员和所在域的说明。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-click" />

## Mouse.Click

```csharp
Pt Click(Pt? at = null, string button = "left", int count = 1)
```

点击；返回点击位置。

| 参数声明 | 说明 |
|---|---|
| `Pt? at = null` | 点击位置；null 为当前位置。 |
| `string button = "left"` | left&#124;right&#124;middle。 取值：`left`、`right`、`middle`。 |
| `int count = 1` | 连击次数（1–3，2 为双击、3 为三击；一次性连续注入）。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-down" />

## Mouse.Down

```csharp
void Down(string button = "left")
```

在当前位置按下并保持按钮（计入点击次数）；脚本结束或停止时自动松开。

| 参数声明 | 说明 |
|---|---|
| `string button = "left"` | 见本成员和所在域的说明。 取值：`left`、`right`、`middle`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-up" />

## Mouse.Up

```csharp
void Up(string button = "left")
```

松开由 Down 按下的按钮（只释放，不做提权目标检查）；停止后的 finally 中也可调用。

| 参数声明 | 说明 |
|---|---|
| `string button = "left"` | 见本成员和所在域的说明。 取值：`left`、`right`、`middle`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-scroll" />

## Mouse.Scroll

```csharp
Pt Scroll(int clicks, bool horizontal = false)
```

滚动滚轮；每次运行累计最多 120 格。

| 参数声明 | 说明 |
|---|---|
| `int clicks` | 刻度数：正数向上（horizontal 时向右）。 |
| `bool horizontal = false` | 见本成员和所在域的说明。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-dragto" />

## Mouse.DragTo

```csharp
Pt DragTo(Pt to, int durationMs = 300)
```

按住左键从当前位置拖到目标屏幕点后松开；返回拖动后的位置。

| 参数声明 | 说明 |
|---|---|
| `Pt to` | 目标屏幕点（Pt，物理像素）。 |
| `int durationMs = 300` | 拖动时长毫秒（0–2000）。 |

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-restoreposition" />

## Mouse.RestorePosition

```csharp
Pt RestorePosition()
```

回到 qk.Context.Mouse：弹出面板前的鼠标位置；没有面板（热键、调试运行）时回到运行开始时的鼠标位置；已在该处时不移动。只移动不点击，停止后的 finally 中也可调用。点击后复位推荐写 try &#123; … &#125; finally &#123; qk.Mouse.RestorePosition(); &#125;（正常结束、出错、停止都会复位）。

返回类型：`Pt`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：鼠标自动化。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="mouse-getcursor" />

## Mouse.GetCursor

```csharp
string GetCursor()
```

当前鼠标指针形状：arrow|iBeam|hand|wait|appStarting|cross|no|help|sizeAll|sizeNs|sizeWe|sizeNwse|sizeNesw|upArrow，隐藏为 "hidden"，其他为 "unknown"。只读，不需确认。

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
