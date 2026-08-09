---
title: "发送文本到窗口"
description: "将文本输出到活动窗口中"
slug: "/v2/xaction/modules/outputtext"
sidebar_label: "发送文本到窗口"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:outputText"
comments: true
moduleKey: "sys:outputText"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "e1e9550d93b1a5d86655c2802e37e53a703b4431b888ca7185470dd68ebd3b28"
legacyDocId: 1530559
legacyContentUpdatedAt: "2025-01-20T02:53:53.000Z"
---

# 发送文本到窗口

将文本输出到活动窗口中

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:outputText`
- 分类：基础（`Basic`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `content` | 内容 | `Text` |  | 是 | `UseVarOrInput` |  | 要输出的内容 |
| `method` | 方法 | `Enum` | paste | 是 | `Input` |  | 发送内容使用的方法 |
| `delayBeforePaste` | 粘贴前延时 | `Integer` | 50 | 否 | `Input` | 仅：paste | 毫秒数。写入剪贴板以后，等待指定的时间后再发送粘贴按键(Ctrl+V) |
| `delayAfterPaste` | 粘贴后延时 | `Integer` | 10 | 否 | `Input` | 仅：paste | 毫秒数。发送粘贴按键(Ctrl+V)之后等待的毫秒数 |
| `delayBetweenChar` | 字符间延迟 | `Integer` | 0 | 否 | `Input` | 仅：input | 模拟输入下一个字符之前等待的毫秒数。 |
| `appendReturn` | 在末尾添加回车 | `Boolean` | false | 否 | `Input` |  | 发送内容后，在末尾输入回车 |
| `hideInHistory` | 从剪贴板历史中隐藏 | `Boolean` | false | 否 | `Input` | 仅：paste | Win+v 是否允许看到本条历史 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 步骤是否成功 | `Boolean` |  | 步骤是否成功完成 |

## 选项值

### `method` 方法

| Value | 名称 | 说明 |
| --- | --- | --- |
| `input` | 模拟输入 |  |
| `paste` | 复制到剪贴板后粘贴(Ctrl+V) |  |
{/* xaction-metadata:end */}

## 概述

本模块用于将指定的文本发送到当前活动窗口中。例如一个去除空格的动作，则获得文本并去除空格后，需要将处理后的结果再发回到窗口替换之前的文本。

请参考基本动作类型“[发送文本](https://getquicker.net/kc/manual/doc/send-text)”。

![](./img/outputtext-001-d1f5c49bfa.png)

## 参数





**内容：**要发送到窗口的文字内容。

**方法：**发送内容使用的方法，可选：

-   复制到剪贴板后粘贴：将内容写入剪贴板后，在窗口中发送Ctrl+V按键粘贴。适合于大段文字，速度快。
-   模拟输入：使用模拟键盘输入的方式键入，**速度较慢**，可能会受到输入法影响，不适合大量的文本输出。

**在末尾添加回车:** 在完成内容输出后，是否发送一个回车键，从而完成换行、在聊天窗口发送等功能。

**粘贴前/后延时：**使用复制粘贴方式发送时，在模拟Ctrl+V之前及之后要等待的时间。某些情况下需要一些时间来改善稳定性。

**字符间延迟**：模拟输入方式时，在每个字符之间增加延迟。 模拟输入收到目标软件接收速度、输入法等影响时，如果出现顺序错乱，可以增加此值。

## 注意事项

-   Excel或WPS表格：粘贴内容时，如果某个单元格处于激活状态（虚线环绕的选中状态）时，会粘贴此单元格的内容。请先模拟Esc按键，取消此状态之后再使用发送文本到窗口功能。







## 更新历史

-   20230116 增加注意事项。
-   20250120 完善文档以匹配实际功能。
