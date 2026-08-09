---
title: "获取剪贴板文本"
description: "读取剪贴板中的文本内容"
slug: "/v2/xaction/modules/getclipboardtext"
sidebar_label: "获取剪贴板文本"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:getClipboardText"
comments: true
moduleKey: "sys:getClipboardText"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "ca1c3b81471ab9ca4961022a4a7859531acb4a5715f087034e24e175ca6b8962"
legacyDocId: 2066073
legacyContentUpdatedAt: "2019-08-21T01:42:45.000Z"
---

# 获取剪贴板文本

读取剪贴板中的文本内容

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:getClipboardText`
- 分类：剪贴板操作（`Clipboard`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `format` | 文本数据格式 | `Enum` | UnicodeText | 是 | `Input` |  | 需要读取的剪贴板文本内容格式。通常请使用Unicode纯文本格式。 |
| `customFormat` | 格式名称 | `Text` |  | 否 | `Input` | 仅：Custom | 自定义的剪贴板格式名，请和实际剪贴板格式名一致。只支持实际为文本类型的内容。 |
| `encoding` | 文本编码 | `Enum` | utf-8 | 是 | `Input` | 仅：Custom | 读取自定义格式时候使用的编码类型 |
| `waitMs` | 重试时间 | `Integer` | 400 | 否 | `UseVarOrInput` |  | 每10ms重试一次，直到获取到文本。为0时不重试。 |
| `stopIfFail` | 失败后中止动作 | `Boolean` | true | 否 | `Input` |  | 获取剪贴板文本失败后，是否停止后续动作的执行。 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 是否成功获得文本 |
| `output` | 完整结果内容 | `Text` |  | 将获得的文本内容写入到变量 |
| `cleanHtml` | 主要HTML片段 | `Text` | 仅：Html | HTML的主要内容。&lt;!--StartFragment--&gt;和&lt;!--EndFragment--&gt;之间的部分 |
| `htmlDoc` | 完整的HTML文档 | `Text` | 仅：Html | 仅去除剪贴板头部信息的完整HTML文档内容。包含&lt;html&gt;等标签，可直接保存为.html文件。 |
| `url` | 来源网址 | `Text` |  | 从网页中复制内容时，可能会携带网址信息。 |
| `elapsedMs` | 已更新时间 | `Integer` |  | 剪贴板最后更新是在多少毫秒以前 |

## 选项值

### `format` 文本数据格式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `UnicodeText` | 纯文本（默认） |  |
| `Rtf` | Rtf |  |
| `Html` | Html |  |
| `CommaSeparatedValue` | 逗号分隔的值（csv） |  |
| `Custom` | 自定义格式名 |  |

### `encoding` 文本编码

| Value | 名称 | 说明 |
| --- | --- | --- |
| `utf-8` | UTF8 |  |
| `utf-16` | UTF-16 LE |  |
| `utf-16BE` | UTF-16 BE |  |
| `us-ascii` | ASCII |  |
| `utf-7` | UTF7 |  |
| `utf-32` | UTF32 |  |
| `default` | 系统默认(gb2312) |  |
{/* xaction-metadata:end */}

## 概述

读取剪贴板中的文本格式内容。



![image.png](./img/getclipboardtext-001-be2c678bbf.png "image.png")



## 参数

### 输入

【文本数据格式】选择读取剪贴板中哪种格式的文本。剪贴板中可能同时存在多种格式的文本数据，根据动作需求读取一种。一般使用Unicode纯文本格式。当需要读取某个软件的特定剪贴板内容时，可以选择“自定义格式名”。

【格式名称】文本数据格式为“自定义格式名”时，输入格式名称。（可以在Free Clipboard Viewer软件中左侧格式列表中查看）。

【文本编码】文本数据格式为“自定义格式名”时，使用什么编码读取文本。



【失败后中止动作】剪贴板中没有内容或读取失败时是否停止后续步骤。



### 输出

【结果内容】从剪贴板读取到的数据。

【是否成功】是否读取成功。





-   功能

-   当剪贴板中存在文本时，获取该文本并输出到一个文本类型变量中。
-   输出获取状态（可选），获取成功时，输出True，否则输出False。

-   使用场景

-   在需处理剪贴板中文本的情况下，首先执行此步骤获取到待处理的文本。



## 变更历史

-   1.0.13 增加自定义格式的读取支持。



## 参考工具

-   [http://www.freeclipboardviewer.com/](http://www.freeclipboardviewer.com/)  剪贴板内容查看器。

    ![](./img/getclipboardtext-002-493ba546c2.png)
