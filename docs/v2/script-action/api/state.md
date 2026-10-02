---
title: "qk.State：动作状态"
description: "qk.State：动作状态的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/state
comments: false
sidebar_position: 10
---

{/* script-api:start */}

当前动作自己的状态存储（本机，与图形动作共用）；跨设备存储见 qk.Quicker.GetCloud。Get/Set 为 JSON（Get&lt;T> 的 T 也可为 Pt/Rect/Item/Hit/OcrResult/OcrLine/ScreenInfo/Tab/ChatMessage/ClassifyResult 及其数组/List），GetText/SetText 为原始文本，Remove/RemoveGlobal 删除键；停止后的 finally 中仍可调用。

<a id="state-get" />

## State.Get

```csharp
T? Get<T>(string key, T? defaultValue = default)
```

读取 JSON 状态并转换为 T；键不存在时返回 defaultValue。T 可为数据类型与纯数据 record（Pt、Rect、Item、Hit、OcrResult、OcrLine、ScreenInfo、Tab、ChatMessage、ClassifyResult 及其数组/List）。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `T? defaultValue = default` | 键不存在时的默认值。 |

返回类型：`T?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-set" />

## State.Set

```csharp
void Set(string key, object? value)
```

写入 JSON 状态（单值最多 1 MiB、10000 项、32 层）；不能写入 Win 句柄。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `object? value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-gettext" />

## State.GetText

```csharp
string? GetText(string key)
```

读取原始文本状态（与图形动作互通）；不存在返回 null。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-settext" />

## State.SetText

```csharp
void SetText(string key, string value)
```

写入原始文本状态（与图形动作互通）；保留删除值 *NULL* 会被拒绝。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `string value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-remove" />

## State.Remove

```csharp
void Remove(string key)
```

删除状态键；不存在时无操作。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-getglobal" />

## State.GetGlobal

```csharp
T? GetGlobal<T>(string key, T? defaultValue = default)
```

读取跨动作共享的全局状态（JSON），与“状态存储”步骤的全局状态互通；慎用。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `T? defaultValue = default` | 见本成员和所在域的说明。 |

返回类型：`T?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-setglobal" />

## State.SetGlobal

```csharp
void SetGlobal(string key, object? value)
```

写入跨动作共享的全局状态（JSON）；慎用。未保存的动作只写入本次运行的覆盖层（读取仍可见真实值）。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `object? value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-getglobaltext" />

## State.GetGlobalText

```csharp
string? GetGlobalText(string key)
```

读取全局状态的原始文本（与“状态存储”步骤的全局状态文本互通）；不存在返回 null。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-setglobaltext" />

## State.SetGlobalText

```csharp
void SetGlobalText(string key, string value)
```

写入全局状态的原始文本（与“状态存储”步骤互通）；保留删除值 *NULL* 会被拒绝。未保存的动作只写入本次运行的覆盖层。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `string value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="state-removeglobal" />

## State.RemoveGlobal

```csharp
void RemoveGlobal(string key)
```

删除全局状态键；不存在时无操作。未保存的动作只作用于本次运行的覆盖层。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
