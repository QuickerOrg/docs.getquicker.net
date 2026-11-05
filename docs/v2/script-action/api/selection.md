---
title: "qk.Selection：选区"
description: "qk.Selection：选区的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/selection
comments: false
sidebar_position: 10
---

## 2.3.30 · 获取文件管理器选中文件 {/* #selected-files-2330 */}

`qk.Selection.GetFiles()` 不再只限于资源管理器和桌面，也可复用「获取选中的文件」模块的文件管理器支持。运行时让目标文件管理器处于前台，并先选中文件。

必要时会发送复制按键并读取结果，**保留复制后的剪贴板内容**，这与选中文字 `GetText()` 的剪贴板恢复策略不同。对剪贴板内容有依赖的脚本，应先保存需要的内容，再获取文件。没有选中项时检查返回数组是否为空，不要直接取第一项。

{/* script-api:start */}

前台程序中用户当前选中的内容。选中文本经模拟复制读取，复制前快照剪贴板、完成后尝试恢复；2.3.30 起，选中文件复用“获取选中的文件”模块，支持文件管理器，必要时模拟复制并保留复制后的剪贴板。每次运行最多 16 次。读写剪贴板见 qk.Clipboard，资源管理器当前文件夹见 qk.Files.GetExplorerPath/SetExplorerPath。

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

<a id="selection-getfiles" />

## Selection.GetFiles

```csharp
string[] GetFiles()
```

2.3.30 起，复用“获取选中的文件”模块，优先读取动作文件参数和文件管理器接口，必要时模拟复制（包括 Directory Opus、OneCommander）并保留复制后的剪贴板内容。无选中或无法获取输入会话时返回空数组；明确停止仍取消动作。返回文件/文件夹完整路径，最多 256 项。

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

{/* script-api:end */}
