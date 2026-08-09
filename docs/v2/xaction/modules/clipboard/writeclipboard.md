---
title: "写入剪贴板"
description: "将文本或图片等内容写入剪贴板"
slug: "/v2/xaction/modules/writeclipboard"
sidebar_label: "写入剪贴板"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:writeClipboard"
comments: true
moduleKey: "sys:writeClipboard"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "44faa4ffdd1a8162eb7aa7c2e6a8fe24126ff4c93bfcc0443996df7147ad6e58"
legacyDocId: 1555222
legacyContentUpdatedAt: "2019-07-08T13:55:08.000Z"
---

# 写入剪贴板

将文本或图片等内容写入剪贴板

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:writeClipboard`
- 分类：剪贴板操作（`Clipboard`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | auto | 是 | `Input` |  | 操作类型 |
| `customFormat` | 格式名 | `Text` |  | 是 | `Input` | 仅：custom | 自定义的剪贴板格式名 |
| `input` | 输入 | `Any` |  | 是 | `UseVar` | 仅：auto | 要写入剪贴板的数据 |
| `html` | HTML内容 | `Text` |  | 是 | `UseVarOrInput` | 仅：html | HTML代码片段 |
| `text` | 文本内容 | `Text` |  | 是 | `UseVarOrInput` | 仅：html, text, rtf, csv, custom | 纯文本格式内容。 |
| `imageVar` | 图片(变量) | `Image` |  | 否 | `UseVar` | 仅：image | 要写入剪贴板的图片内容 |
| `fastMode` | 快速模式 | `Boolean` | false | 否 | `Input` | 仅：image | 不需要处理图片中的透明通道时选择 |
| `successMsg` | 成功后提示 | `Text` |  | 是 | `Input` |  | 可选。写入成功后提示消息，如"XXX已写入剪贴板"。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `auto` | 自动（纯文本或图片） |  |
| `html` | HTML片段 |  |
| `text` | 纯文本 |  |
| `image` | 图片 |  |
| `rtf` | Rtf |  |
| `csv` | Csv |  |
| `custom` | 自定义格式 |  |
| `clear` | 清空剪贴板 |  |
| `clearHistory` | 清空剪贴板历史(Win10+) |  |
{/* xaction-metadata:end */}

## 概述

本模块用于将文本、图片或HTML代码片段写入剪贴板中，供后续的粘贴使用。

![image.png](./img/writeclipboard-001-860eaf8230.png "image.png")



## 参数



【类型】写入剪贴板的内容类型。支持的类型有：

-   自动
-   Html片段
-   纯文本
-   图片
-   Csv
-   Rtf
-   清空剪贴板



**类型：自动（图片或纯文本）**

用于将文本或图片变量的内容写入剪贴板。这种方式接受任何类型的变量，如果变量内容是图片则读取图片写入剪贴板，如果是其他类型，则转换为文本后写入剪贴板。



**类型：HTML片段**

用于将一段HTML代码写入剪贴板后，作为HTML格式粘贴到编辑器中。通常应该同时提供html格式内容和纯文本格式的内容以方便不同的第三方应用粘贴时使用。

![image.png](./img/writeclipboard-002-01877d07cf.png "image.png")

【HTML内容】要写入剪贴板的HTML代码片段。

【纯文本】要同时写入剪贴板的纯文本内容。如果为空，则自动将html内容作为纯文本格式使用。





## 示例动作

-   [将链接转换为HTML格式](https://getquicker.net/sharedaction?code=0e698f4e-04ac-426d-b3eb-08d6c3be0bea)



## 其他资源

-   剪贴板查看器：[http://www.freeclipboardviewer.com/](http://www.freeclipboardviewer.com/)
