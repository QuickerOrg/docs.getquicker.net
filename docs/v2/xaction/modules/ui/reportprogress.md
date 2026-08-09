---
title: "显示进度条"
description: "显示/更新进度条"
slug: "/v2/xaction/modules/reportprogress"
sidebar_label: "显示进度条"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:reportProgress"
comments: true
moduleKey: "sys:reportProgress"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "3960f91e5fb2979ce34a6869908f05e0e9180595cc673e6f0591ce5cc5425bb3"
legacyDocId: 12796417
legacyContentUpdatedAt: "2025-12-05T02:25:20.000Z"
---

# 显示进度条

显示/更新进度条

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:reportProgress`
- 分类：界面组件（`Ui`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | REQUEST_ID | 是 | `Input` |  | 操作类型 |
| `progressId` | 进度条ID | `Integer` | 0 | 否 | `UseVarOrInput` | 仅：UPDATE_PROGRESS, REMOVE | 进度条的序号，用于后续更新或删除进度条 |
| `title` | 进度条标题 | `Text` |  | 否 | `UseVarOrInput` | 仅：UPDATE_PROGRESS | 进度条的标题(显示在进度条上方) |
| `percentage` | 进度百分比 | `Number` | 0.0 | 否 | `UseVarOrInput` | 仅：UPDATE_PROGRESS | 0到100之间的数字 |
| `text` | 说明文字 | `Text` |  | 否 | `UseVarOrInput` | 仅：UPDATE_PROGRESS | 显示在进度条下方 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `progressId` | 进度条ID | `Integer` | 仅：REQUEST_ID | 进度条的序号，用于后续更新或删除进度条 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `REQUEST_ID` | 创建进度条 |  |
| `UPDATE_PROGRESS` | 更新进度 |  |
| `REMOVE` | 去除进度条 |  |
{/* xaction-metadata:end */}

自1.10.8+版本开始提供。



用于显示某项操作的进度。

示例动作：[https://getquicker.net/sharedaction?code=9a2970fd-14a5-4428-9b2a-08d852fc39cc](https://getquicker.net/sharedaction?code=9a2970fd-14a5-4428-9b2a-08d852fc39cc)

![](./img/reportprogress-001-0a53ad12b4.gif)

进度条窗口显示在桌面的**右下角**，窗口中可以同时堆叠显示多个进度条。窗口默认以半透明的方式显示，鼠标移动到窗口上时会变成完全不透明。



每行进度条由三个部分组成：

![](./img/reportprogress-002-1351e8abb3.png)



在1.10.8版本中，下载模块和Http模块增加了是否显示进度条的参数，它们与本模块共用一个进度条窗口。

## 使用进度条

进度条通常按下面的步骤来使用：

1.  创建进度条：用于获得一个表示序号的进度条ID。
2.  在循环中更新进度条。
3.  去除进度条：操作完成后，删除进度条。

更新和删除进度条时，现需指定在第一步中获得的进度条ID。

![](./img/reportprogress-003-0c1b805480.png)



### 创建进度条

操作类型选择“创建进度条”，将【进度条ID】输出到变量中。

![](./img/reportprogress-004-b96c25698b.png)

创建进度条只是生成一个id，并不会立即显示进度条。



### 更新进度

更新进度操作会让进度条实际显示出来。

![](./img/reportprogress-005-6a90af0ce0.png)

参数说明：

【进度条ID】通过“创建进度条”操作获得的进度条ID编号。

【进度条标题】显示在进度条上方的文字，会以粗体/颜色较深的字体显示。

【进度百分比】从0到100之间的表示进度的数字（小数）。

-   如果表示总共7件任务完成了3件，百分比可以用表达式：$= 100.0 \* 3 / 7

【说明文字】显示在进度条下方的浅色文字。



### 去除进度条

操作完成后，需要去除进度条。

![](./img/reportprogress-006-d2a48ec1b5.png)



如果没有消除进度条（如忘记添加消除步骤，或动作提取中止），该进度条将会一直显示。这时候也可以点击进度条窗口的垃圾桶图标清理。

![](./img/reportprogress-007-0a60ada33f.png)
