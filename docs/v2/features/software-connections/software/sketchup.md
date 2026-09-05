---
title: SketchUp 软件连接
description: SketchUp Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/sketchup
sidebar_position: 140
quickerDocKey: v2/software-connections/sketchup
comments: true
---

通过 Bridge，Quicker 可以调用 SketchUp 中的选择、视图与场景、标签和材质、几何变换、Ruby 与第三方扩展命令等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

2024–2026；已有 2026 真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**各年份当前用户 Plugins 目录**。

退出全部 SketchUp 进程再安装。不同年份有各自 Plugins 目录，软件卡片按检测结果部署，通常不需管理员权限。

在扩展管理器核对 Quicker Bridge 是否启用；若宿主要求批准未签名扩展，确认来源后按宿主规则处理。软件卡片不会自动降低扩展加载策略。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → SketchUp**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[SketchUp控制](/v2/xaction/modules/sketchupcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

更新 Ruby 文件不会让运行中的实例热重载，必须完全退出并重启。第三方命令受扩展是否加载影响；模型对象 ID 不应跨模型复用。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [SketchUp控制模块参考与最小示例](/v2/xaction/modules/sketchupcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
