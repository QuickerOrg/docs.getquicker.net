---
title: "重复"
description: "循环指定的次数，或符合某个条件时中止"
slug: "/v2/xaction/modules/repeat"
sidebar_label: "重复"
sidebar_position: 150
quickerDocKey: "xaction/module/sys:repeat"
comments: true
moduleKey: "sys:repeat"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "0cda28c34728cee324da52dfbba0cd0771b762cd0d836999e151b94191fe4f7f"
legacyDocId: 2134056
legacyContentUpdatedAt: "2023-06-23T14:05:51.000Z"
---

# 重复

循环指定的次数，或符合某个条件时中止

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:repeat`
- 分类：程序流程（`Flow`）
- 类型：`Loop`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `count` | 次数 | `Integer` | 1 | 否 | `UseVarOrInput` |  | 重复次数，除非符合条件提前中止。-1表示无限循环。 |
| `startIndex` | 计数开始值 | `Integer` | 0 | 否 | `UseVarOrInput` |  | 计数序号的开始值，通常应该为0。 |
| `stopCondition` | 中止条件 | `Boolean` |  | 否 | `UseVarOrInput` |  | 选填。条件满足时停止循环（每次循环开始时检查）。 |
| `repeatDelayMs` | 循环间隔时间 | `Integer` | 1 | 否 | `UseVarOrInput` |  | 每次循环之间的间隔毫秒数。如果为0，请确保循环内部有其他等待步骤，避免连续循环占用较多资源。 |
| `progressBarTitle` | 进度条标题 | `Text` |  | 否 | `UseVarOrInput` |  | 如果设置了此参数，则在循环过程中会显示一个进度条，标题为此参数的值。 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `count` | 计数 | `Integer` |  | 计数序号，表示第几次循环。 |
{/* xaction-metadata:end */}

循环指定的次数。

循环中通常应增加“等待时间”，以避免耗费大量计算机资源。

![](./img/repeat-001-a28f455d1c.png)



演示视频链接：[在组合动作中使用循环](https://www.bilibili.com/video/BV1ty4y1S7AK)



请事先设置好停止动作运行的快捷键，以避免出现循环开始后无法停止的尴尬局面。

![](./img/repeat-002-9644e73781.png)

## 参数

【次数】循环执行的总次数。-1 表示无限循环。

【中止条件】非必填。设定一个布尔变量或表达式，在每次循环时进行判断如果其结果为真则中止循环。

也可以在循环内部使用“跳出循环”模块来中止循环。请参考“[如果](/v2/xaction/modules/if)”模块的说明编写表达式。

【计数开始值】一般在计算机语言中次数或序号都是从0开始，0表示第一次、第一项。为方便用户的日常习惯，如果您需要给用户显示当前是第几次循环，可以在这里设置循环开始值为1。



## 输出

【计数】当前是第几次循环，从“计数开始值”开始计算。





## 设置要重复的内容

将需要重复执行的步骤拖放到“重复”模块中中间的“槽”中即可。

![](./img/repeat-003-9990394c7d.gif)



## 停止循环中的动作

如果希望中间停止较长时间的循环，可以有2个方式：

-   在配置窗口中设置“停止运行中动作”的快捷键。在需要的时候按下此快捷键。
    ![](./img/repeat-002-9644e73781.png)
-   在托盘右键菜单中停止运行中动作。



## 更新历史

-   1.1.1 重复次数为0时为无限循环。
-   1.1.2 重复次数为-1时表示无限循环。





## 示例动作

-   [重复示例](https://getquicker.net/Sharedaction?code=d9eb6be1-6185-4d6e-8459-08db738638c3)：重复5次，合并输出两个列表中的每一项。
