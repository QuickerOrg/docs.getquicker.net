---
title: CorelDRAW 软件连接
description: CorelDRAW Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/coreldraw
sidebar_position: 60
quickerDocKey: v2/software-connections/coreldraw
comments: true
---

通过 Bridge，Quicker 可以调用 CorelDRAW 中的文档和页面、选择与图形、导入导出、宏与脚本等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

27.x（2026）；已有 Technical Suite 2026 27.1 真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以安装器检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**机器级 Tool Add-on**。

关闭全部 CorelDRAW 进程。插件写入宿主 Programs64 下的 Addons，需要在执行安装、修复或卸载时接受 UAC。

启动时自动加载 Tool Add-on。安装器使用实际安装路径，插件无需另做 COM 注册。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → CorelDRAW**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[CorelDRAW控制](/v2/xaction/modules/coreldrawcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

VBA 能力还要求安装 VBA 并满足宿主宏安全设置。Bridge 不会自动降低宏安全级别；仅运行自己信任的脚本，先在副本文档验证。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [CorelDRAW控制模块参考与最小示例](/v2/xaction/modules/coreldrawcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
