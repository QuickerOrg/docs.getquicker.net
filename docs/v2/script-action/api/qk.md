---
title: "qk：根成员与运行上下文"
description: "qk：根成员与运行上下文的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/qk
comments: false
sidebar_position: 10
---

{/* script-api:start */}

本页列出公开成员。

`qk.Context` 返回本次运行的上下文，字段见 [Ctx](./types/ctx.md)。

<a id="log" />

## Log

```csharp
void Log(string message, string level = "info")
```

记录运行日志（单条最多 4096 字符）；停止后的 finally 中仍可调用。

| 参数声明 | 说明 |
|---|---|
| `string message` | 日志内容。 |
| `string level = "info"` | 级别：debug&#124;info&#124;warn&#124;error。 取值：`debug`、`info`、`warn`、`error`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="wait" />

## Wait

```csharp
void Wait(int durationMs)
```

等待指定毫秒（可被停止打断）；停止后的 finally 中不可调用。

| 参数声明 | 说明 |
|---|---|
| `int durationMs` | 等待毫秒数（≥ 0）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
