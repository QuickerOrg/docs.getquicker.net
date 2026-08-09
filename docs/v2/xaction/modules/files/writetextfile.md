---
title: "写入文本文件"
description: "将内容写入文本文件"
slug: "/v2/xaction/modules/writetextfile"
sidebar_label: "写入文本文件"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:WriteTextFile"
comments: true
moduleKey: "sys:WriteTextFile"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "563b9ba6f404dc03eab4fc2c78cb2fb117ad33f8b3f6fdc53a7b3e037e54bc52"
legacyDocId: 2117245
legacyContentUpdatedAt: "2019-12-20T02:52:44.000Z"
---

# 写入文本文件

将内容写入文本文件

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:WriteTextFile`
- 分类：系统操作（`Files`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `content` | 内容 | `Text` |  | 是 | `UseVarOrInput` |  | 要写入文件的内容 |
| `filePath` | 文件路径 | `Text` |  | 是 | `UseVarOrInput` |  | 要写入的完整文件路径（包含文件名） |
| `encoding` | 文件编码 | `Enum` | utf-8 | 是 | `Input` |  | 写入文件的编码格式 |
| `addUtf8Bom` | 添加UTF-BOM | `Boolean` | false | 否 | `Input` |  | UTF8编码文件是否写入BOM标记 |
| `appendMode` | 添加到文件末尾 | `Boolean` | false | 否 | `Input` |  | 如果文件已存在，则添加到文件的末尾 |
| `addNewLine` | 添加空行 | `Boolean` | false | 否 | `Input` |  | 在文件末尾添加空行 |
| `newLineChars` | 统一换行字符 | `Enum` |  | 是 | `Input` |  |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |

## 选项值

### `encoding` 文件编码

| Value | 名称 | 说明 |
| --- | --- | --- |
| `utf-8` | UTF8 |  |
| `utf-16` | UTF-16 LE |  |
| `utf-16BE` | UTF-16 BE |  |
| `us-ascii` | ASCII |  |
| `utf-7` | UTF7 |  |
| `utf-32` | UTF32 |  |
| `default` | 系统默认(gb2312) |  |

### `newLineChars` 统一换行字符

| Value | 名称 | 说明 |
| --- | --- | --- |
| `` | 默认（不处理） |  |
| `<br>` | \r\n | Windows |
| `` | \r  | (Mac) |
| `<br>` | \n  | (Linux) |
{/* xaction-metadata:end */}

将文本内容写入指定的文件。



![image.png](./img/writetextfile-001-3d59a24b6b.png "image.png")



## 参数

### 输入

【内容】要写入文件的内容。

【文件路径】目标文件的完整路径。

【文件编码】文件编码。
