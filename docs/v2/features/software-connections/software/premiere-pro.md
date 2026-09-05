---
title: Premiere Pro 软件连接
description: Premiere Pro Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/premiere-pro
sidebar_position: 110
quickerDocKey: v2/software-connections/premiere
comments: true
---

通过 Bridge，Quicker 可以调用 Premiere Pro 中的项目和序列、轨道与剪辑、素材整理、标记、导出及 UXP JavaScript等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

25.6 及以上；已有 2026（26.3）真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**Adobe UPIA 管理的 UXP 插件**。

退出 Premiere Pro，确认 Adobe Creative Cloud 提供的 UPIA 可用，再通过设置页软件卡片安装；无需启用开发者模式。

从“窗口 → UXP 插件”打开“Quicker Bridge 状态”。看到已连接状态后，再到 Quicker 命令工具选择实例。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → Premiere Pro**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[Premiere Pro控制](/v2/xaction/modules/premierecontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

触发时对应软件必须位于前台，然后要求只有一个在线 Bridge 会话。这里检查前台软件类型，但不按前台进程精确选会话；多个在线会话时会拒绝执行。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

需要前台 Premiere Pro 且唯一在线会话。素材重命名、导出和序列编辑会改变工程或文件；先用预览参数（命令支持时）确认范围。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [Premiere Pro控制模块参考与最小示例](/v2/xaction/modules/premierecontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
