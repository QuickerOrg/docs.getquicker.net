---
title: 步骤组模块
description: Quicker 2.x 步骤组模块改进多线程 WaitAny 的取消行为，并接入统一执行和调试管道。
sidebar_position: 170
quickerDocKey: v2/what's-new/xaction-steps/group
comments: true
---

# 步骤组模块

2.x 的步骤组接入统一执行管道，多线程分支的开始、结束、错误、取消和调试层级会以同一套规则记录。

使用 WaitAny 时新增“自动取消其它分支”选项。启用后，只要有一个分支完成，Quicker 就会请求取消尚未完成的分支，并阻止这些分支继续执行后续步骤；关闭时保持 1.x 的兼容行为，其它分支仍可继续运行。

取消是协作式的。正在执行的模块如果不支持取消，仍要等该调用返回后才能停止。

参数说明见[步骤组](/v2/xaction/modules/group)。
