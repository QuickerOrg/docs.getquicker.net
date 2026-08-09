---
title: "向窗口发送消息"
description: "使用SendMessage Win32Api向窗口发送消息。使用方法请搜索SendMessage Win32 API接口。"
slug: "/v2/xaction/modules/sendmessage"
sidebar_label: "向窗口发送消息"
sidebar_position: 170
quickerDocKey: "xaction/module/sys:sendMessage"
comments: true
moduleKey: "sys:sendMessage"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "56d65968206ebace46deca9ed9f14406605eed3c6a948e90719680c5deb39dd8"
legacyDocId: 1627562
legacyContentUpdatedAt: "2024-08-09T13:50:24.000Z"
---

# 向窗口发送消息

使用SendMessage Win32Api向窗口发送消息。使用方法请搜索SendMessage Win32 API接口。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:sendMessage`
- 分类：Windows系统（`System`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作类型 | `Enum` | SendMessage | 是 | `Input` |  |  |
| `hWnd` | 窗口句柄hWnd | `Integer` |  | 否 | `UseVarOrInput` |  | 留空或0表示前台窗口 |
| `wMsg` | 消息 | `Text` |  | 否 | `UseVarOrInput` |  | 要发送的消息。 |
| `wParam` | wParam参数 | `Text` |  | 否 | `UseVarOrInput` |  |  |
| `lParam` | lParam参数 | `Text` | 0 | 否 | `UseVarOrInput` | 排除：SendMessageTextLParam |  |
| `textLParam` | lParam参数(文本) | `Text` |  | 否 | `UseVarOrInput` | 仅：SendMessageTextLParam | 文本内容 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `rtn` | 返回值 | `Integer` | 仅：SendMessage, SendMessageTextLParam | 返回值，依据消息的不同具有不同的含义，请查询对应API的文档。 |

## 选项值

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `SendMessage` | SendMessage(等待返回，LParam为数字) |  |
| `SendMessageTextLParam` | SendMessage(等待返回，LParam为文本) |  |
| `PostMessage` | PostMessage(不等待返回) |  |
{/* xaction-metadata:end */}

## 概述

【0.11.4版本之后开始提供】

调用[SendMessage](https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-sendmessage)向指定的窗口发送Windows消息。您需要了解Win32编程知识才能使用本模块。 另外本模块限制了只能发送数字类型到lParam参数中，因此不是所有的消息类型都可以调用。



## 参数

![image.png](./img/sendmessage-001-176f8c3c61.png "image.png")



【窗口句柄hWnd】要发送消息到的目标窗口。接收整数类型的参数。

【消息】要发送的消息，十进制数字值（如：1234），或十六进制值，如：0x0112。具体请查询Win32文档。

【wParam】wParam参数，十进制数字值（如：1234），或十六进制值，如：0x0112。具体可用值请参考消息文档。

【lParam】lParam参数，十进制数字值（如：1234），或十六进制值，如：0x0112。具体可用值请参考消息文档。



## 示例

-   [https://getquicker.net/sharedaction?code=ef1a10ef-bbb2-4dcf-5f17-08d6cebc3090](https://getquicker.net/sharedaction?code=ef1a10ef-bbb2-4dcf-5f17-08d6cebc3090)



## 参考文档

-   [SendMessage文档](https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-sendmessage)
-   [WM\_SYSCOMMAND消息文档](https://docs.microsoft.com/en-us/windows/desktop/menurc/wm-syscommand)
