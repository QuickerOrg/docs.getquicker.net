---
title: Revit 软件连接
description: Revit Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/revit
sidebar_position: 120
quickerDocKey: v2/software-connections/revit
comments: true
---

通过 Bridge，Quicker 可以调用 Revit 中的文档、元素和参数、选择与视图、文件导出及脚本等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

当前正式变体为 2027。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**当前用户 Revit Add-in**。

保存工程并退出 Revit。插件程序集和 .addin 清单写入当前用户目录，通常不需要管理员权限。

首次启动可能提示加载附加模块；核对 Quicker Bridge 来源后允许加载。此前真机验证使用“总是载入”；若拒绝，安装完成也不会出现在线连接。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → Revit**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[Revit控制](/v2/xaction/modules/revitcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

2025/2026 与 2027 使用不同运行时，不能互用程序集。宿主模态窗口或交互状态会延迟 API 调用；参数写入仍受文档可编辑性约束。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [Revit控制模块参考与最小示例](/v2/xaction/modules/revitcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
