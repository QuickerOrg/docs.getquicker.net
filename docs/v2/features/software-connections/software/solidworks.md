---
title: SOLIDWORKS 软件连接
description: SOLIDWORKS Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/solidworks
sidebar_position: 150
quickerDocKey: v2/software-connections/solidworks
comments: true
---

通过 Bridge，Quicker 可以调用 SOLIDWORKS 中的文档与选择、特征和配置、自定义属性、装配体和工程图、质量属性、宏与脚本等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

当前正式变体为 2026；已有 2026 SP0 真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**机器级 COM Add-in**。

关闭全部 SOLIDWORKS 进程。安装、修复和卸载需要 UAC，以完成计算机级 Add-in/COM 注册。

启动后 Add-in 自动加载。未连接时在宿主加载项中确认 Quicker Bridge 已加载，再到 Quicker 软件连接页刷新。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → SOLIDWORKS**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[SOLIDWORKS控制](/v2/xaction/modules/solidworkscontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

基础连接已有真机记录，增强命令仍需逐项验证。内联 VBA 属于实验性能力，内联 C# 与 VBA 不提供安全沙箱；优先在副本中验证，不运行不可信代码。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [SOLIDWORKS控制模块参考与最小示例](/v2/xaction/modules/solidworkscontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
