---
title: "AutoCAD控制"
description: "通过 AutoCAD Bridge 调用宿主能力，包含连接验证、目标规则和使用限制。"
slug: "/v2/xaction/modules/autocadcontrol"
sidebar_label: "AutoCAD控制"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:autocadcontrol"
comments: true
moduleKey: "sys:autocadcontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-04 07:37:19"
legacyDocId: 80627663
legacyContentUpdatedAt: "2025-01-20T00:50:55.000Z"
---

# AutoCAD控制

使用前先[安装并连接 AutoCAD Bridge](/v2/features/software-connections/software/autocad)。本模块用于文档与系统变量、选择与对象、图层和布局、AutoCAD 命令、AutoLISP 与插件调用；根据任务选择对应操作，或发送当前实例支持的自定义命令。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:autocadcontrol" />

## 目标与使用前提

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存命令工具选择的临时 session。详细区别见[命令工具的目标规则](/v2/features/software-connections/command-tool#动作怎样选择目标)。以下说明以“HTTP Bridge（插件）”连接方式为前提。

## 选择操作与输入

文档与系统变量、选择与对象、图层和布局、AutoCAD 命令、AutoLISP 与插件调用是常见使用方向。选择操作后填写对应字段；字段名称、默认值、枚举和条件以上方当前模块定义为准。

自定义调用选择 **[高级] 发送自定义 Bridge 命令**，从命令工具复制实际命令名与参数模板。参数 JSON 必须是对象，路径中的反斜杠需要转义。不要把其他软件的参数直接套用到本模块。

## 最小示例：测试连接

这是不修改文档或文件的配置示例。先在命令工具确认 `bridge.ping` 可用，再新建组合动作，添加本模块并填写：

| 字段 | 设置 |
| --- | --- |
| 连接方式 | HTTP Bridge（插件）（`bridge`） |
| Bridge 操作 | [Bridge] 测试连接（`bridge.ping`） |
| 返回内容（输出） | 绑定一个文本变量，例如 `bridgeResult` |

回到已连接的 AutoCAD 窗口，再通过面板或配置好的快捷键触发动作。

在调试器查看是否成功及 `bridgeResult`；正常结果应包含 `pong: true`，其余字段随宿主版本和文档状态变化。若失败，先检查在线实例与触发目标，不要改成发送模型修改命令来测试。

## 输出与失败处理

“是否成功”表示本次步骤是否成功；**返回内容** 在 Bridge 路径中接收宿主返回的 JSON 文本，可交给后续步骤解析。

宿主忙碌、目标断开或参数错误可能导致失败。等待超时不保证宿主操作已撤销；修改命令重试前先核对实际状态。若返回 `queued: true`，只表示命令已排队，不能据此认定 AutoCAD 命令已完成。

## 限制

命令、LISP 或脚本入队后返回 queued 只表示已排队。宿主正在执行交互命令时，新文本可能成为该命令输入；先结束当前命令。

保存、导出、删除和脚本命令可能改变设计内容或文件。连接示例只验证通信；业务命令请先在副本中测试，不要假定任意脚本都能撤销。

## 旧版兼容

连接方式默认仍为“低权限代理（兼容）”，旧动作不会自动改走 Bridge。旧通道支持执行命令和读取变量；命令内容通常以空格或回车结束以开始执行。等待结束及变量输出语义只适用于该旧路径。使用本页 Bridge 示例时必须明确切换连接方式。

旧版依赖中转动作的轮盘用法不作为 Bridge 的前置条件。Bridge 从触发上下文选择前台 AutoCAD 实例，按[命令工具说明](/v2/features/software-connections/command-tool#动作怎样选择目标)配置触发即可。

## 相关页面

- [AutoCAD 安装与使用指南](/v2/features/software-connections/software/autocad)
- [命令工具与生成动作](/v2/features/software-connections/command-tool)
- [通用排障](/v2/features/software-connections/troubleshooting)
