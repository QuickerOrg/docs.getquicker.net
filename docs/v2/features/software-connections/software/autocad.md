---
title: AutoCAD 软件连接
description: AutoCAD Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/autocad
sidebar_position: 30
quickerDocKey: v2/software-connections/autocad
comments: true
---

通过 Bridge，Quicker 可以调用 AutoCAD 中的文档与系统变量、选择与对象、图层和布局、AutoCAD 命令、AutoLISP 与插件调用等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

已验收记录主要来自当前正式变体，面向 Windows x64。2.2.5 起尝试支持更多宿主版本；支持范围不等于所有小版本均已真机测试，实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**用户级 Autodesk ApplicationPlugins bundle**。

完全退出所有 AutoCAD 进程后安装，一般无需管理员权限。检测到多个跨运行时年份时，软件卡片可能拒绝安装单版本包。

启动时由插件自动加载器加载；如出现信任提示，核对来源后批准。不要把某个版本的插件手工复制到设置页未判定兼容的宿主中。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → AutoCAD**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[AutoCAD控制](/v2/xaction/modules/autocadcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。同一进程内的活动文档仍由具体命令决定。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

命令、LISP 或脚本入队后返回 queued 只表示已排队。宿主正在执行交互命令时，新文本可能成为该命令输入；先结束当前命令。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [AutoCAD控制模块参考与最小示例](/v2/xaction/modules/autocadcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
