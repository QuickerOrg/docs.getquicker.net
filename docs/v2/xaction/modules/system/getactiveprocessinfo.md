---
title: "获取前台进程信息"
description: "获取当前活动窗口进程的信息。"
slug: "/v2/xaction/modules/getactiveprocessinfo"
sidebar_label: "获取前台进程信息"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:getActiveProcessInfo"
comments: true
moduleKey: "sys:getActiveProcessInfo"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "89be4a66c9aba1e461cbc28d2e94b29cd368e6876b133dbff4eefb1224965bec"
legacyDocId: 2118185
legacyContentUpdatedAt: "2019-07-15T04:33:57.000Z"
---

# 获取前台进程信息

获取当前活动窗口进程的信息。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:getActiveProcessInfo`
- 分类：Windows系统（`System`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `stopIfFail` | 失败后中止动作 | `Boolean` | true | 否 | `Input` |  | 获取进程信息失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 是否成功获得进程信息 |
| `path` | 程序路径 | `Text` |  | 获得的进程路径 |
| `procName` | 进程名 | `Text` |  | 进程名称 |
| `pid` | PID | `Integer` |  | 进程ID |
{/* xaction-metadata:end */}

获取Windows活动窗口所属进程的信息。



![image.png](./img/getactiveprocessinfo-001-f2ed91d257.png "image.png")



## 参数

### 输出

【程序路径】进程exe文件的完整路径。

【进程名】进程名称，通常为去掉扩展名的exe文件名。比如记事本的进程名为“notepad”。

【PID】进程ID

【是否成功】是否获取成功。有时候会因为权限原因无法获得进程信息。
