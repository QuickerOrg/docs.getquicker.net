---
title: InDesign 软件连接
description: InDesign Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/indesign
sidebar_position: 80
quickerDocKey: v2/software-connections/indesign
comments: true
---

通过 Bridge，Quicker 可以调用 InDesign 中的文档与页面、文本查询替换、版面对象、导出与 UXP 脚本等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

18.5–21.x；已有 2026（21.0）真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以设置页检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**当前用户 Startup Scripts 中的 UXP .idjs**。

先启动并退出一次 InDesign，生成对应语言与版本的用户配置。关闭全部 InDesign 实例后安装，通常不需要管理员权限。

启动脚本随 InDesign 自动运行，不需要打开面板。多个版本或语言配置可能有不同 Startup Scripts 目录，以软件卡片检测到的实际目录为准。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → InDesign**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[InDesign控制](/v2/xaction/modules/indesigncontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作不按前台窗口定位，只使用唯一在线 Bridge 会话。没有会话或存在多个会话时失败；命令工具能选择实例，并不代表生成动作会记住这个实例。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

用户配置尚未生成时不能靠创建任意空目录解决。动作只接受唯一在线会话，不按前台窗口定位；升级后重新启动宿主以加载新脚本。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [InDesign控制模块参考与最小示例](/v2/xaction/modules/indesigncontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
