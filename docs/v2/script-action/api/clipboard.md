---
title: "qk.Clipboard：剪贴板"
description: "qk.Clipboard：剪贴板的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/clipboard
comments: false
sidebar_position: 10
---

{/* script-api:start */}

系统剪贴板的读写（文本、HTML、图片、文件列表）；读取前台选中内容见 qk.Selection。宿主负责 STA、重试与历史隐藏。每次运行最多 64 次操作、32 次写入，文本单次最多 1 MiB；停止后的 finally 中仍可调用（WaitForChange 除外）。

<a id="clipboard-gettext" />

## Clipboard.GetText

```csharp
string? GetText()
```

读取剪贴板文本；无文本返回 null。

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-gethtml" />

## Clipboard.GetHtml

```csharp
string? GetHtml()
```

读取 HTML 片段正文（去掉 CF_HTML 头）；没有返回 null。

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-get" />

## Clipboard.Get

```csharp
string? Get(string format)
```

按格式读取并以文本返回；没有该格式返回 null。

| 参数声明 | 说明 |
|---|---|
| `string format` | rtf&#124;csv&#124;自定义格式名（自定义格式按 UTF-8 文本解码）；读文本/HTML 用 GetText()/GetHtml()。 取值：`rtf`、`csv`。也接受其他值，详见成员说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-getfiles" />

## Clipboard.GetFiles

```csharp
string[] GetFiles()
```

剪贴板中的文件/文件夹路径；没有返回空数组。

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-getimage" />

## Clipboard.GetImage

```csharp
Img? GetImage()
```

读取剪贴板图片；没有图片返回 null；剪贴板被占用或图片数据无法读取报 CLIPBOARD_UNAVAILABLE。

返回类型：`Img?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-setimage" />

## Clipboard.SetImage

```csharp
void SetImage(Img image)
```

把图片写入剪贴板（PNG 与位图格式）。

| 参数声明 | 说明 |
|---|---|
| `Img image` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-settext" />

## Clipboard.SetText

```csharp
void SetText(string text, bool noHistory = false)
```

写入文本；空文本等于清空。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `bool noHistory = false` | 不进剪贴板历史。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-sethtml" />

## Clipboard.SetHtml

```csharp
void SetHtml(string html, string? text = null)
```

写入 HTML（片段或完整文档）。

| 参数声明 | 说明 |
|---|---|
| `string html` | 见本成员和所在域的说明。 |
| `string? text = null` | 纯文本备用格式；缺省由 HTML 转换。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-setfiles" />

## Clipboard.SetFiles

```csharp
void SetFiles(IEnumerable<string> paths, bool cut = false)
```

写入文件列表（路径须存在）；需要读文件能力（校验路径会探测本机文件）。

| 参数声明 | 说明 |
|---|---|
| `IEnumerable<string> paths` | 见本成员和所在域的说明。 |
| `bool cut = false` | 剪切：粘贴后移动文件；需要写文件能力。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板；读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-set" />

## Clipboard.Set

```csharp
void Set(string format, object data)
```

按格式写入。

| 参数声明 | 说明 |
|---|---|
| `string format` | text&#124;html&#124;rtf&#124;csv&#124;自定义格式名。 取值：`rtf`、`csv`、`html`、`text`。也接受其他值，详见成员说明。 |
| `object data` | 字符串；自定义格式也可为 byte[]。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-clear" />

## Clipboard.Clear

```csharp
void Clear(bool history = false)
```

清空剪贴板。

| 参数声明 | 说明 |
|---|---|
| `bool history = false` | 同时清除系统剪贴板历史（Win+V，Windows 10 及以上）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="clipboard-waitforchange" />

## Clipboard.WaitForChange

```csharp
bool WaitForChange(int timeoutMs = 5000)
```

等待剪贴板内容变化；超时返回 false。

| 参数声明 | 说明 |
|---|---|
| `int timeoutMs = 5000` | 超时毫秒（最长 3600000，即 1 小时）。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取剪贴板。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
