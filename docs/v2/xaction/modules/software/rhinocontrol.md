---
title: "Rhino软件控制"
description: "向Rhino发送命令或脚本"
slug: "/v2/xaction/modules/rhinocontrol"
sidebar_label: "Rhino软件控制"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:rhinocontrol"
comments: true
moduleKey: "sys:rhinocontrol"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "881c3a572559236127eb97229e0b4d641dda3931dc8c382eda24034741fe7038"
legacyDocId: 80629667
legacyContentUpdatedAt: "2022-06-17T01:44:17.000Z"
---

# Rhino软件控制

向Rhino发送命令或脚本

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:rhinocontrol`
- 分类：第三方软件交互（`SoftInteraction`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作类型 | `Enum` | RunScript | 是 | `Input` |  | 操作类型 |
| `command` | 命令内容 | `Text` |  | 否 | `UseVarOrInput` | 仅：RunScript | 命令或脚本内容。 |
| `waitResp` | 等待命令结束 | `Boolean` | true | 否 | `UseVarOrInput` | 仅：RunScript |  |
| `waitMs` | 最长等待时间(ms) | `Number` | 10000 | 是 | `Input` |  | 最长的等待返回结果的，毫秒数 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `output` | 脚本输出 | `Text` |  | 仅通过接口执行脚本时支持返回内容。 |

## 选项值

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `RunScript` | 执行脚本 |  |
{/* xaction-metadata:end */}

## 概述

向Rhino软件发送命令或脚本。

![](./img/rhinocontrol-001-33e73dbbca.png)



【操作类型】

可选的操作类型，目前仅支持“执行命令”。

【命令内容】

要执行的命令。

**示例动作**

-   [https://getquicker.net/Sharedaction?code=4e40c634-8eca-4515-6b7e-08da4f3f8574](https://getquicker.net/Sharedaction?code=4e40c634-8eca-4515-6b7e-08da4f3f8574)

[
](http://www.hanlindong.com/2017/autolisp-beginner-2/)

## 通过手势、轮盘等执行命令或脚本

因为轮盘等快速触发不能直接向Rhino发送命令，需要通过一个单独的动作来中转。实现步骤如下：

（1）先在合适的位置安装此动作：[参数传递Rhino命令](https://getquicker.net/Sharedaction?code=ff3309da-7c30-4655-6b7d-08da4f3f8574)

（2）在轮盘、手势等位置，使用下面的设定方式调用动作，并将要执行的命令作为参数传递给动作。

![](./img/rhinocontrol-002-c58000d477.png)

设置方法：1、操作类型选择“运行Quicker动作”。2、输入动作名称“参数传递Rhino命令”。3、动作参数中输入要执行的命令。
