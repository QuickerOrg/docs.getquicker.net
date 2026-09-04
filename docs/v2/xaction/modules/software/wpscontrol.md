---
title: "WPS Office控制"
description: "通过 WPS Office Bridge 调用宿主能力，包含连接验证、目标规则和使用限制。"
slug: "/v2/xaction/modules/wpscontrol"
sidebar_label: "WPS Office控制"
sidebar_position: 250
quickerDocKey: "xaction/module/sys:wpscontrol"
comments: true
moduleKey: "sys:wpscontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-04 07:37:19"
---

# WPS Office控制

:::caution[预览：正式分发闭环未完成]
已验证 JSA 加载、Bridge 回连及命令目录；正式管理页的安装、更新、卸载仍待真机验证。以下连接与动作说明适用于已有预览环境。
:::

使用前先[安装并连接 WPS Office Bridge](/v2/features/software-connections/software/wps-office)。本模块用于文档与选择、表格区域、文字替换、幻灯片、已有宏及 JavaScript；根据任务选择对应操作，或发送当前实例支持的自定义命令。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:wpscontrol" />

## 目标与使用前提

动作根据触发时的前台 WPS 窗口（HWND）和目标组件精确定位。相同窗口有多个组件时须明确选择文字、表格或演示；没有匹配会话时失败。

动作不保存命令工具选择的临时 session。详细区别见[命令工具的目标规则](/v2/features/software-connections/command-tool#动作怎样选择目标)。

## 选择操作与输入

文档与选择、表格区域、文字替换、幻灯片、已有宏及 JavaScript是常见使用方向。选择操作后填写对应字段；字段名称、默认值、枚举和条件以上方当前模块定义为准。

自定义调用选择 **[高级] 发送自定义 Bridge 命令**，从命令工具复制实际命令名与参数模板。参数 JSON 必须是对象，路径中的反斜杠需要转义。不要把其他软件的参数直接套用到本模块。

## 最小示例：测试连接

这是不修改文档或文件的配置示例。先在命令工具确认 `bridge.ping` 可用，再新建组合动作，添加本模块并填写：

| 字段 | 设置 |
| --- | --- |
| 操作类型 | [Bridge] 测试连接（`bridge.ping`） |
| 目标组件 | WPS 文字（`wps`） |
| 命令结果（输出） | 绑定一个文本变量，例如 `bridgeResult` |

本例选择 WPS 文字，请从已连接的文字窗口触发；验证表格或演示时同时更换目标组件和触发窗口。

在调试器查看是否成功及 `bridgeResult`；正常结果应包含 `pong: true`，其余字段随宿主版本和文档状态变化。若失败，先检查在线实例与触发目标，不要改成发送模型修改命令来测试。

## 输出与失败处理

“是否成功”表示本次步骤是否成功；**命令结果** 在 Bridge 路径中接收宿主返回的 JSON 文本，可交给后续步骤解析。

宿主忙碌、目标断开或参数错误可能导致失败。等待超时不保证宿主操作已撤销；修改命令重试前先核对实际状态。

## 限制

同一 WPS 窗口可能承载多个组件。通用命令如 bridge.ping 应明确选择文字/表格/演示，组件专用命令可自动判断；WPS 发行版缺少 JSA 时无法通过复制文件补齐。

保存、导出、删除和脚本命令可能改变设计内容或文件。连接示例只验证通信；业务命令请先在副本中测试，不要假定任意脚本都能撤销。

## 相关页面

- [WPS Office 安装与使用指南](/v2/features/software-connections/software/wps-office)
- [命令工具与生成动作](/v2/features/software-connections/command-tool)
- [通用排障](/v2/features/software-connections/troubleshooting)
