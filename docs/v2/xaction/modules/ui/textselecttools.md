---
title: "辅助选择工具"
description: "直接弹出选文件、窗口、坐标等拾取界面，返回对应文本。"
slug: "/v2/xaction/modules/textselecttools"
sidebar_label: "辅助选择工具"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:textSelectTools"
comments: true
moduleKey: "sys:textSelectTools"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 55498152
legacyContentUpdatedAt: "2023-03-26T05:50:32.000Z"
---

# 辅助选择工具

直接弹出拾取界面，选完后得到一段文本。和 [用户输入](/v2/xaction/modules/userinput)、[多字段表单](/v2/xaction/modules/form) 里的「文本选择工具」是同一套拾取器，只是这里不先出输入窗。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:textSelectTools" />

## 概述

<ModuleParamPreview moduleKey="sys:textSelectTools" />

表单 / 用户输入里，同一套工具挂在输入框右侧：

![](./img/textselecttools-002-0ad744ffe9.png)

## 参数说明

**选择器**：要启动的拾取工具。

| 选择器 | 值 |
| --- | --- |
| 选取文件 | `SelectSingleFile` |
| 选取(多个)文件 | `SelectMultiFile` |
| 选取文件夹 | `SelectSingleFolder` |
| 选择保存路径 | `SelectSavePath` |
| 选择窗口的进程路径 | `SelectProcessPath` |
| 选择进程名 | `SelectProcessName` |
| 选择场景标识 | `SelectProfileExe` |
| 选择窗口句柄 | `SelectWindowHandle` |
| 从键盘输入键名 | `SelectKeyName` |
| 从键盘输入模拟按键B的内容 | `SelectSendKeysData` |
| 从键盘输入键码数字 | `SelectKeyCode` |
| 选取区域 | `SelectLocationArea` |
| 选取坐标位置 | `SelectLocationPoint` |
| 选取窗口坐标位置 | `SelectRelativePoint` |
| 截图并获取路径 | `CaptureToFile` |
| 选取矢量图标 | `SelectIcon` |
| 选取动作ID | `SelectActionId` |
| 选取动作名称 | `SelectActionName` |
| 选择窗口控件，获取其XPath | `SelectControlXPath` |
| 操作项编辑器 | `OperationItemEditor` |
| 已配对的蓝牙设备 | `SelectBluetoothDevice` |
| 低功耗蓝牙设备 | `SelectBluetoothLEDevice` |
| 网络连接 | `SelectNetworkProfile` |
| 网页元素的CSS选择器 | `SelectWebElementSelector` |

**当前值**：仅「操作项编辑器」。打开编辑器时预填的内容。

**失败后停止**：用户取消后是否中止动作。默认开启。

## 输出

- **是否成功**：是否完成了选取。
- **结果文本**：拾取结果。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/userinput',
      label: '用户输入',
      description: '输入框上也能挂同一套选择工具。',
    },
    {
      href: '/v2/xaction/modules/form',
      label: '多字段表单',
      description: '多个字段各自挂选择工具。',
    },
    {
      href: '/v2/xaction/modules/selectfile',
      label: '选择文件',
      description: '只要选文件路径时用这个更直接。',
    },
  ]}
/>

## 更新历史

- 20230326 更新工具列表。
