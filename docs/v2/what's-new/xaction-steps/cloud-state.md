---
title: 云状态存取模块
description: Quicker 2.x 云状态存取模块在读取内容时增加本机时间和 UTC 最后更新时间输出。
sidebar_position: 225
quickerDocKey: v2/what's-new/xaction-steps/cloud-state
comments: true
---

# 云状态存取模块

2.x 在读取云状态内容时，增加“最后更新时间”和“最后更新时间(UTC)”两个输出。前者已经转换为当前电脑的本机时区，后者保留服务器使用的 UTC 时间。

动作可以利用更新时间判断缓存是否过期、提示其它设备何时完成同步，或只处理某个时间点之后的数据，不必再把时间戳单独写进状态正文。

写入、读取和超时等原有能力保持不变。只有服务返回了修改时间时，模块才会写入这两个时间输出。

参数说明见[云状态存取](/v2/xaction/modules/clouddata)。
