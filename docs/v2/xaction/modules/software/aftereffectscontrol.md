---
title: "After Effects控制"
description: "通过 After Effects Bridge 调用宿主能力，包含连接验证、目标规则和使用限制。"
slug: "/v2/xaction/modules/aftereffectscontrol"
sidebar_label: "After Effects控制"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:aftereffectscontrol"
comments: true
moduleKey: "sys:aftereffectscontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-04 07:37:19"
---

# After Effects控制

使用前先[安装并连接 After Effects Bridge](/v2/features/software-connections/software/after-effects)。本模块用于工程和素材整理、合成和文本图层、属性与关键帧、渲染配置、ExtendScript；根据任务选择对应操作，或发送当前实例支持的自定义命令。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:aftereffectscontrol" />

## 目标与使用前提

触发时对应软件必须位于前台，然后要求只有一个在线 Bridge 会话。这里检查前台软件类型，但不按前台进程精确选会话；多个在线会话时会拒绝执行。

动作不保存命令工具选择的临时 session。详细区别见[命令工具的目标规则](/v2/features/software-connections/command-tool#动作怎样选择目标)。

## 选择操作与输入

工程和素材整理、合成和文本图层、属性与关键帧、渲染配置、ExtendScript是常见使用方向。选择操作后填写对应字段；字段名称、默认值、枚举和条件以上方当前模块定义为准。

自定义调用选择 **[高级] 发送自定义 Bridge 命令**，从命令工具复制实际命令名与参数模板。参数 JSON 必须是对象，路径中的反斜杠需要转义。不要把其他软件的参数直接套用到本模块。

## 最小示例：测试连接

这是不修改文档或文件的配置示例。先在命令工具确认 `bridge.ping` 可用，再新建组合动作，添加本模块并填写：

| 字段 | 设置 |
| --- | --- |
| 操作类型 | [Bridge] 测试连接（`bridge.ping`） |
| 命令结果（输出） | 绑定一个文本变量，例如 `bridgeResult` |

回到已连接的 After Effects 窗口，再通过面板或配置好的快捷键触发动作。

在调试器查看是否成功及 `bridgeResult`；正常结果应包含 `pong: true`，其余字段随宿主版本和文档状态变化。若失败，先检查在线实例与触发目标，不要改成发送模型修改命令来测试。

## 输出与失败处理

“是否成功”表示本次步骤是否成功；**命令结果** 在 Bridge 路径中接收宿主返回的 JSON 文本，可交给后续步骤解析。

宿主忙碌、目标断开或参数错误可能导致失败。等待超时不保证宿主操作已撤销；修改命令重试前先核对实际状态。

## 限制

图层索引可能因重排变化，优先使用命令返回的稳定 ID。可选时间、变换属性留空表示不修改时，不要为了填满表单而写入 0。任意脚本的撤销边界需自行处理。

保存、导出、删除和脚本命令可能改变设计内容或文件。连接示例只验证通信；业务命令请先在副本中测试，不要假定任意脚本都能撤销。

## 相关页面

- [After Effects 安装与使用指南](/v2/features/software-connections/software/after-effects)
- [命令工具与生成动作](/v2/features/software-connections/command-tool)
- [通用排障](/v2/features/software-connections/troubleshooting)
