---
title: Photoshop 软件连接
description: Photoshop Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/photoshop
sidebar_position: 100
quickerDocKey: v2/software-connections/photoshop
comments: true
---

通过 Bridge，Quicker 可以调用 Photoshop 中的文档与图层、选择与图像处理、文件导出、UXP JavaScript等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

25.0 及以上；已有 2026（27.1）真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以安装器检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**Adobe UPIA 管理的 UXP 插件**。

退出 Photoshop，确认 Adobe Creative Cloud 提供的 UPIA 可用，再使用统一安装器。生产使用无需 UXP Developer Tool。

启动 Photoshop，从“增效工具”打开 Quicker Bridge Status 状态面板，确认连接；保持插件容器正常运行。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → Photoshop**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[Photoshop控制](/v2/xaction/modules/photoshopcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

触发时对应软件必须位于前台，然后要求只有一个在线 Bridge 会话。这里检查前台软件类型，但不按前台进程精确选会话；多个在线会话时会拒绝执行。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

需要前台 Photoshop 且唯一在线会话。重复加载插件可能暂时留下同名会话，刷新并等待旧会话消失；模态操作可能阻塞调用。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [Photoshop控制模块参考与最小示例](/v2/xaction/modules/photoshopcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
