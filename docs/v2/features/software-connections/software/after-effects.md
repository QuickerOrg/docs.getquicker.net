---
title: After Effects 软件连接
description: After Effects Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/after-effects
sidebar_position: 20
quickerDocKey: v2/software-connections/aftereffects
comments: true
---

通过 Bridge，Quicker 可以调用 After Effects 中的工程和素材整理、合成和文本图层、属性与关键帧、渲染配置、ExtendScript等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

24.0 及以上；已有 2026（26.3）真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以安装器检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**用户级签名 CEP 扩展**。

完全退出 After Effects 后安装。正式 CEP 包不要求开启 PlayerDebugMode，也不需要使用 UXP Developer Tool。

通常自动连接。未自动连接时，从“窗口 → 扩展”调用“Quicker After Effects Bridge”；此入口启动后台扩展，不显示业务面板。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → After Effects**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[After Effects控制](/v2/xaction/modules/aftereffectscontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

触发时对应软件必须位于前台，然后要求只有一个在线 Bridge 会话。这里检查前台软件类型，但不按前台进程精确选会话；多个在线会话时会拒绝执行。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

图层索引可能因重排变化，优先使用命令返回的稳定 ID。可选时间、变换属性留空表示不修改时，不要为了填满表单而写入 0。任意脚本的撤销边界需自行处理。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [After Effects控制模块参考与最小示例](/v2/xaction/modules/aftereffectscontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
