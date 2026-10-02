---
title: "qk.Selection：选区"
description: "qk.Selection：选区的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/selection
comments: false
sidebar_position: 10
---

{/* script-api:start */}

前台程序中用户当前选中的内容（选中文本、资源管理器/桌面中选中的文件）；读写剪贴板见 qk.Clipboard，资源管理器当前文件夹见 qk.Files.GetExplorerPath/SetExplorerPath。选中文本经模拟复制读取（复制前快照剪贴板、完成后恢复）；选中的文件只支持资源管理器和桌面。每次运行最多 16 次。

<a id="selection-gettext" />

## Selection.GetText

```csharp
string? GetText(int timeoutMs = 500, string format = "text")
```

模拟复制读取选中内容；无选中返回 null。复制前快照剪贴板常见格式（文本、HTML、RTF、CSV、图片、文件列表），完成或停止后若剪贴板仍是本次复制的内容则恢复；快照超限、超时或失败时照常读取但不恢复（记警告）。

| 参数声明 | 说明 |
|---|---|
| `int timeoutMs = 500` | 等待复制结果的最长毫秒数（0–2000）。 |
| `string format = "text"` | text&#124;html（片段正文）&#124;rtf&#124;csv。 取值：`text`、`html`、`rtf`、`csv`。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取选中文本。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="selection-getfiles" />

## Selection.GetFiles

```csharp
string[] GetFiles()
```

资源管理器或桌面中选中的文件/文件夹（完整路径）；不在资源管理器中返回空数组。最多 256 项。

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取资源管理器路径。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
