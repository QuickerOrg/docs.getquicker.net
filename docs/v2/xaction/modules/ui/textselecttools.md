---
title: "辅助选择工具"
description: "一些常用的选择内容并获取文本的工具"
slug: "/v2/xaction/modules/textselecttools"
sidebar_label: "辅助选择工具"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:textSelectTools"
comments: true
moduleKey: "sys:textSelectTools"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "94bcbe1a834685aeab8fc9699ce314816db6f12c0efb73ed249fc8bdf9898969"
legacyDocId: 55498152
legacyContentUpdatedAt: "2023-03-26T05:50:32.000Z"
---

# 辅助选择工具

一些常用的选择内容并获取文本的工具

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:textSelectTools`
- 分类：界面组件（`Ui`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 选择器 | `Enum` |  | 否 | `UseVarOrInput` |  |  |
| `currValue` | 当前值 | `Text` |  | 否 | `UseVarOrInput` | 仅：OperationItemEditor |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `output` | 结果文本 | `Text` |  | 选择器的结果 |

## 选项值

### `operation` 选择器

| Value | 名称 | 说明 |
| --- | --- | --- |
| `SelectSingleFile` | 选取文件 |  |
| `SelectMultiFile` | 选取(多个)文件 |  |
| `SelectSingleFolder` | 选取文件夹 |  |
| `SelectSavePath` | 选择保存路径 |  |
| `SelectProcessPath` | 选择窗口的进程路径 |  |
| `SelectProcessName` | 选择进程名 |  |
| `SelectProfileExe` | 选择场景标识 |  |
| `SelectWindowHandle` | 选择窗口句柄 |  |
| `SelectKeyName` | 从键盘输入键名 |  |
| `SelectSendKeysData` | 从键盘输入模拟按键B的内容 |  |
| `SelectKeyCode` | 从键盘输入键码数字 |  |
| `SelectLocationArea` | 选取区域 |  |
| `SelectLocationPoint` | 选取坐标位置 |  |
| `SelectRelativePoint` | 选取窗口坐标位置 |  |
| `CaptureToFile` | 截图并获取路径 |  |
| `SelectIcon` | 选取矢量图标 |  |
| `SelectActionId` | 选取动作ID |  |
| `SelectActionName` | 选取动作名称 |  |
| `SelectControlXPath` | 选择窗口控件，获取其XPath |  |
| `OperationItemEditor` | 操作项编辑器 |  |
| `SelectBluetoothDevice` | 已配对的蓝牙设备 |  |
| `SelectBluetoothLEDevice` | 低功耗蓝牙设备 |  |
| `SelectNetworkProfile` | 网络连接 |  |
| `SelectWebElementSelector` | 网页元素的CSS选择器 |  |
{/* xaction-metadata:end */}

用于选取某项内容并得到对应的文本值。

![](./img/textselecttools-001-2a21b8f41c.png)



功能类似于“表单”窗口或“用户输入”窗口的“文本选择工具”：

![](./img/textselecttools-002-0ad744ffe9.png)

只是不再显示表单界面，而是直接显示选取界面开始选取。

目前支持的选择工具如下：

-   选取文件... - SelectSingleFile
-   选取(多个)文件... - SelectMultiFile
-   选取文件夹... - SelectSingleFolder
-   选择保存路径... - SelectSavePath
-   选择窗口的进程路径。 - SelectProcessPath
-   选择进程名 - SelectProcessName
-   选择场景标识 - SelectProfileExe
-   选择窗口句柄 - SelectWindowHandle
-   从键盘输入键名 - SelectKeyName
-   从键盘输入模拟按键B的内容 - SelectSendKeysData
-   从键盘输入键码数字 - SelectKeyCode
-   选取区域 - SelectLocationArea
-   选取坐标位置 - SelectLocationPoint
-   选取窗口坐标位置 - SelectRelativePoint
-   截图并获取路径 - CaptureToFile
-   选取矢量图标 - SelectIcon
-   选取动作ID - SelectActionId
-   选取动作名称 - SelectActionName
-   选择窗口控件，获取其XPath - SelectControlXPath
-   已配对的蓝牙设备 - SelectBluetoothDevice
-   低功耗蓝牙设备 - SelectBluetoothLEDevice
-   网络连接 - SelectNetworkProfile

## 更新历史

-   20230326 更新工具列表。
