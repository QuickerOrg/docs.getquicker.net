---
title: WPS Office 软件连接
description: WPS Office Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/wps-office
sidebar_position: 160
quickerDocKey: v2/software-connections/wps
comments: true
---

:::caution[预览：正式分发闭环未完成]
已验证 JSA 加载、Bridge 回连及命令目录；正式管理页的安装、更新、卸载仍待真机验证。以下连接与动作说明适用于已有预览环境。
:::

通过 Bridge，Quicker 可以调用 WPS Office 中的文档与选择、表格区域、文字替换、幻灯片、已有宏及 JavaScript等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

需支持 JSA；已有个人版 12.1.0.28505 加载与回连记录。现有验证针对 Windows 个人版，不代表所有 WPS 发行包均支持。

## 安装前准备与首次启用

安装机制：**官方网页统一管理文字、表格、演示三个加载项**。

正式分发仍为预览：管理页安装、更新、卸载尚未完成真机闭环。不要将普通 Bridge 安装步骤或开发安装脚本作为正式安装承诺。

已有预览环境可在文字、表格、演示中检查 Quicker 功能区，并在 Quicker 查看相应组件会话。只有加载项文件存在不足以证明已加载。

## 确认连接

在已配置的预览环境中，打开 **Quicker 设置 → 软件连接 → WPS Office**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[WPS Office控制](/v2/xaction/modules/wpscontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

动作根据触发时的前台 WPS 窗口（HWND）和目标组件精确定位。相同窗口有多个组件时须明确选择文字、表格或演示；没有匹配会话时失败。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## 限制与排障

同一 WPS 窗口可能承载多个组件。通用命令如 bridge.ping 应明确选择文字/表格/演示，组件专用命令可自动判断；WPS 发行版缺少 JSA 时无法通过复制文件补齐。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [WPS Office控制模块参考与最小示例](/v2/xaction/modules/wpscontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
