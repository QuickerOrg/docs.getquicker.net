---
title: "Adobe系列软件控制"
description: "Adobe系列软件控制模块的参数、输出与使用说明。"
slug: "/v2/xaction/modules/adobesoftscontrol"
sidebar_label: "Adobe系列软件控制"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:adobesoftscontrol"
comments: true
moduleKey: "sys:adobesoftscontrol"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "0da1e9bb4bd574e2d7b745f08e9dfc9b97cff86ca9d8f4dbd50f4f70871e190a"
legacyDocId: 80638336
legacyContentUpdatedAt: "2025-12-15T02:38:05.000Z"
---

# Adobe系列软件控制



{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:adobesoftscontrol`
- 分类：第三方软件交互（`SoftInteraction`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `software` | 软件名称 | `Enum` | Photoshop.Application | 是 | `Input` |  | 要执行脚本的软件 |
| `operation` | 操作类型 | `Enum` | dojavascript | 是 | `Input` |  | 操作类型 |
| `script` | 脚本内容 | `Text` |  | 否 | `UseVarOrInput` | 仅：dojavascript | 要执行的js脚本代码。 |
| `scriptFile` | 脚本文件路径 | `Text` |  | 否 | `UseVarOrInput` | 仅：dojavascriptfile | js脚本文件的完整路径 |
| `waitResp` | 等待执行结束 | `Boolean` | true | 否 | `UseVarOrInput` |  |  |
| `waitMs` | 最长等待时间(ms) | `Number` | 10000 | 是 | `Input` |  | 最长的等待返回结果的，毫秒数 |
| `tryRunScriptUsingExe` | 接口失败后，尝试使用程序exe运行脚本文件 | `Boolean` | false | 否 | `UseVarOrInput` |  | 使用运行程序并将脚本路径作为参数的方式执行脚本。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `output` | 脚本输出 | `Text` |  | 仅通过接口执行脚本时支持返回内容。 |

## 选项值

### `software` 软件名称

| Value | 名称 | 说明 |
| --- | --- | --- |
| `Photoshop.Application` | Photoshop |  |
| `Illustrator.Application` | Illustrator |  |
| `afterfx` | After Effects |  |

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `dojavascript` | 执行js脚本 |  |
| `dojavascriptfile` | 执行js脚本文件 |  |
{/* xaction-metadata:end */}

## 概要

用于对Photoshop、Illustrator、AE等软件运行jsx脚本。

需要启动软件后才能使用。

![](./img/adobesoftscontrol-001-2aca30bd3a.png)

注意：如果同时安装了多个版本的软件，只能控制其中一个版本。在其它版本上使用会报错 `操作无法使用 (异常来自 HRESULT:0x800401E3 (MK_E_UNAVAILABLE))`。

【软件名称】选择要执行脚本的软件。

【操作类型】

-   执行js脚本：参数中指定要运行的脚本内容。
-   执行js脚本文件：参数中指定jsx文件的路径。

【脚本内容】

-   jsx脚本内容。

【等待执行结束】

是否等待脚本执行结束后再进行后续步骤。

【接口失败后，尝试使用程序exe运行脚本文件】

当系统环境不支持使用接口运行脚本时，尝试使用`photoshop.exe -r path.jsx`的方式执行脚本。这种情况下无法获知脚本是否执行成功，无法等待脚本执行完成。

【脚本输出】

从脚本中返回的内容。

-   仅在通过接口、等待执行结束的方式执行脚本时可返回内容。
-   仅支持PS、Illustrator。
-   仅支持简单类型的内容，不支持返回object。

![](./img/adobesoftscontrol-002-dd05e47dea.png)

**示例动作**

-   [右转90度](https://getquicker.net/Sharedaction?code=f757e64d-dff9-4bc1-6b82-08da4f3f8574)：画布向右旋转90度
-   [批量生成不同尺寸图标](https://getquicker.net/Sharedaction?code=56fba2f1-898e-403a-6b87-08da4f3f8574)

**参考文档**

-   [Photoshop 脚本教程](https://github.com/Adobe-CEP/CEP-Resources/blob/master/Documentation/Product%20specific%20Documentation/Photoshop%20Scripting/photoshop-scripting-guide-2020.pdf)

## 问题排查

### 1\. 0x800401E1 (MK\_E\_UNAVAILABLE)

![](./img/adobesoftscontrol-003-a9e1412f80.png)

1）确认您安装的PS是完整版而非绿色版。

2）确认系统UAC设置为默认，如果修改过，改为默认后重启Windows。

![](./img/adobesoftscontrol-004-58eaea5eb4.png)



## psjs脚本的执行

目前PS尚未提供执行psjs代码的接口。可以通过如下方式执行psjs脚本：

![](./img/adobesoftscontrol-005-d07b486340.png)



## 更新历史

-   20230914 增加返回内容的功能。
-   20230923 1.39.33 支持同时安装多个Photoshop、 AI 的情况。
