---
title: "用户输入"
description: "请用户输入内容。"
slug: "/v2/xaction/modules/userinput"
sidebar_label: "用户输入"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:userInput"
comments: true
moduleKey: "sys:userInput"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "57b5682e96ed96f0091322c0c1b8fb394bee429b76bdc506178e0e811d138c7b"
legacyDocId: 1460412
legacyContentUpdatedAt: "2024-10-29T00:17:04.000Z"
---

# 用户输入

请用户输入内容。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:userInput`
- 分类：基础（`Basic`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | text | 是 | `Input` |  | 输入内容的类型 |
| `prompt` | 提示文字 | `Text` | 请输入内容 | 是 | `UseVarOrInput` |  | 提示用户输入什么内容。显示在输入框上方。 |
| `defaultValue` | 默认值 | `Text` |  | 否 | `UseVarOrInput` |  | 默认填写到输入框中的内容 |
| `texttools` | 文本选择工具 | `Text` |  | 否 | `UseVarOrInput` | 仅：text, multiline | 鼠标悬浮在文本框上时显示的小工具 |
| `extraSettings` | 扩展设置 | `Text` |  | 否 | `UseVarOrInput` | 仅：text, multiline | 可用于自定义文本选择工具，详情请参考文档。 |
| `pattern` | 验证表达式 | `Text` |  | 否 | `Input` | 仅：text, multiline, number | 正则验证表达式 |
| `isRequired` | 必填 | `Boolean` | false | 否 | `Input` |  | 是否必须填写内容 |
| `winLocation` | 窗口位置 | `Enum` | CenterScreen | 否 | `UseVarOrInput` |  | 在哪里显示选择窗口 |
| `restoreFocus` | 恢复活动窗口 | `Boolean` | true | 否 | `Input` |  | 用户输入后，是否将焦点还原到之前的活动窗口 |
| `closeOnDeactivated` | 失去焦点后关闭窗口 | `Boolean` | false | 否 | `Input` |  |  |
| `submitWithReturn` | 回车提交结果（Shift+回车换行） | `Boolean` | false | 否 | `Input` | 仅：multiline |  |
| `fontfamily` | 字体名称 | `Text` |  | 否 | `UseVarOrInput` | 仅：text, multiline, number | 可选。设置字体名称。如有2个字体，使用逗号分隔。 |
| `fontsize` | 字体大小 | `Number` | 14.0 | 是 | `UseVarOrInput` | 仅：text, multiline, number |  |
| `imeState` | 输入法状态 | `Enum` | NO_CONTROL | 否 | `Input` | 仅：text, multiline |  |
| `help` | 帮助按钮内容 | `Text` |  | 否 | `Input` |  | 点击弹出显示帮助内容，MarkDown格式 |
| `topMost` | 置顶显示 | `Boolean` | false | 否 | `Input` |  |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 用户取消后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `textValue` | 文本值 | `Text` |  | 文本类型的输入值 |
| `numberValue` | 数字值 | `Number` | 仅：number | 数字类型的输入值 |
| `datetimeValue` | 日期时间值 | `DateTime` | 仅：date_time |  |
| `isEmpty` | 是否为空 | `Boolean` |  | 用户是否没有输入内容 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `text` | 单行文本 |  |
| `multiline` | 多行文本 |  |
| `number` | 数字 |  |
| `date_time` | 日期时间 |  |

### `winLocation` 窗口位置

| Value | 名称 | 说明 |
| --- | --- | --- |
| `WithMouse1` | 跟随鼠标（指针周围） |  |
| `WithMouse2` | 跟随鼠标（指针右下） |  |
| `CenterScreen` | 屏幕中间 |  |
| `TopLeft` | 屏幕左上 |  |
| `TopCenter` | 屏幕中上 |  |
| `TopRight` | 屏幕右上 |  |
| `LeftCenter` | 屏幕左中 |  |
| `RightCenter` | 屏幕右中 |  |
| `BottomLeft` | 屏幕左下 |  |
| `BottomCenter` | 屏幕中下 |  |
| `BottomRight` | 屏幕右下 |  |

### `imeState` 输入法状态

| Value | 名称 | 说明 |
| --- | --- | --- |
| `NO_CONTROL` | 不控制 |  |
| `ON` | 开启 |  |
| `OFF` | 关闭 |  |
{/* xaction-metadata:end */}

## 概述

显示一个文本输入窗口，获取用户输入的内容。

![](./img/userinput-001-9f5976c4ce.png)



注：

-   用户输入模块仅能用于输入一个信息，如果需要同时输入多个内容，以及使用其它类型的输入方式（如下拉选择等），请使用《[多字段表单](/v2/xaction/modules/form)》模块。



## 参数

![](./img/userinput-002-ce4cb73b05.png)





### 输入参数

**类型：**输入内容的类型及输入方式。可选值：单行文本、多行文本、数字、日期时间。

**提示文字：**向用户显示的提示信息。

**默认值：**预先填写到输入框里的内容。

**验证表达式：**如果对输入的内容有格式要求，可以使用正则表达式进行验证。

**必填：**是否必须填写内容后才能保存。

**恢复活动窗口：**由于用户输入窗口会抢占输入焦点，如果希望在此窗口关闭后对原有软件窗口进行操作，可以选择此项以将输入焦点恢复到弹窗之前的窗口上。

**失去焦点后关闭窗口：**弹出输入窗口后，如果用户鼠标点击了窗口以外的地方，则自动关闭此窗口取消当前操作。

**失败后停止：**取消输入后，是否停止动作。

**文本选择工具：**在输入框右侧显示的工具按钮（鼠标悬浮在输入框上时显示），点击之后可以用于选择文件、进程路径等内容。

**字体名称：**输入框字体类型；

**字体大小：**输入框字体大小；

**窗口位置：**输入框的显示位置。

**输入法状态：**设置是否主动开启和关闭中文输入状态；

**帮助按钮内容：**Markdown格式的帮助内容，点击“帮助”按钮时显示。提示：

-   两个空格表示换行；
-   \[连接标题\](网址)
-   支持一些[扩展的语法](&lt;https://github.com/whistyun/MdXaml/wiki/How-to-use-Enhanched-syntax &gt;)控制渲染格式。



### 输出

**是否成功：**是否成功获得了用户输入。

**文本值：**输入的文字内容（文本格式）。

**数字值：**输入的数字，用于输出到数字类型变量中。仅适用于类型为“数字”时。

**是否为空：**用户是否没有输入任何内容。



## 更新历史

-   1.1.0，增加“必填”选项。如果为非必填，允许空值的时候保存。
-   20241029 增加帮助按钮Markdown扩展语法文档链接。

## 示例动作

-   [示例：用户输入](https://getquicker.net/sharedaction?code=c6da399c-c64f-468a-6d89-08d6bfa4ff29)
