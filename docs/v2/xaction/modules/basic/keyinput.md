---
title: "模拟按键A（录入）"
description: "模拟键盘输入"
slug: "/v2/xaction/modules/keyinput"
sidebar_label: "模拟按键A（录入）"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:keyInput"
comments: true
moduleKey: "sys:keyInput"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "63dd0d195d4e1059a1def1030cef96dcedb43eb59b34b20f8205c540ca08e43a"
legacyDocId: 1529913
legacyContentUpdatedAt: "2024-11-20T14:47:06.000Z"
---

# 模拟按键A（录入）

模拟键盘输入

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:keyInput`
- 分类：基础（`Basic`）
- 类型：`Keyboard`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `keys` | 按键 | `Keyboard` |  | 是 | `Input` |  | 模拟的按键内容 |
| `repeat` | 重复次数 | `Integer` | 1 | 否 | `Input` |  |  |
| `interval` | 重复间隔(毫秒) | `Integer` | 1 | 否 | `Input` |  | 每次重复之间的间隔毫秒数 |
| `holdMs` | 保持毫秒数 | `Integer` | -1 | 否 | `Input` |  | 普通键（非Ctrl/Alt/Shift/Win）在抬起前保持的时间。-1表示使用默认设置。<br />某些直接模拟按键无法生效的软件中可以尝试增加此值。 |

## 输出参数

无。
{/* xaction-metadata:end */}

## 概述

模拟按键模块用于向当前窗口发送固定的键盘按键操作，如快捷键等。可以参考基础动作“[模拟按键](https://getquicker.net/KC/Manual/Doc/keyboard-input)”的说明。



如需发送复杂或动态变更的按键序列，请使用“[模拟按键B（参数）](/v2/xaction/modules/sendkeys)”模块。



![](./img/keyinput-001-2fdc4c2e0a.png)



添加模块时，点击“录制”按钮后，在键盘上按下要模拟的按键组合即可。也可以点击右侧的“...”按钮选择按键组合。



### 提示

-   模拟按键有可能会受到输入法影响，如果运行时效果不对，可以切换输入法到英文状态。
-   在模拟按键前，应确保要输入的窗口状态已准备好，可根据需要在前后增加延时（等待时间）。
-   本模块不支持模拟鼠标按键。
-   部分软件使用了特殊的快捷键机制，可能不支持本模块模拟的按键。此时可以：

-   尝试使用“模拟按键B”模块；
-   （使用按键操作模块）分别模拟按键的按下和抬起，并在中间增加一些延迟时间；
