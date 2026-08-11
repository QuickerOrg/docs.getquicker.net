---
title: “每个”模块
description: Quicker 2.x “每个”模块改进并行循环的 WaitAny、取消和结构化调试信息。
sidebar_position: 180
quickerDocKey: v2/what's-new/xaction-steps/each
comments: true
---

# “每个”模块

2.x 改进了“每个”模块的并行循环执行。循环项、迭代次数、分支耗时和提前结束原因可以进入结构化调试记录，定位是哪一项失败或被取消更直观。

多线程模式下新增“WaitAny模式下自动取消其它分支”选项。任一项处理完成后，可以请求取消其余未完成项；默认关闭，以保持 1.x 中 WaitAny 返回后其它线程继续运行的行为。

独立上下文、并发数、线程启动间隔和超时等原有参数继续保留。自动取消同样依赖内部步骤配合取消请求。

参数说明见[每个](/v2/xaction/modules/each)。
