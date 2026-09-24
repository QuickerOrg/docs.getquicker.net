---
title: "显示器"
description: "获取显示器列表、读取显示器坐标与工作区，获取或调整指定显示器的硬件亮度。"
slug: "/v2/xaction/modules/monitorbrightness"
sidebar_label: "显示器"
sidebar_position: 170
quickerDocKey: "xaction/module/sys:monitorBrightness"
comments: true
moduleKey: "sys:monitorBrightness"
docStatus: "generated"
metadataGeneratedAt: "2026-09-24 08:30:46"
---

# 显示器

获取显示器列表、读取显示器坐标与工作区，获取或调整指定显示器的硬件亮度。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:monitorBrightness" />

## 使用说明

2.2.20 起可获取显示器列表、坐标与工作区，或读取、设置硬件亮度。先用「获取显示器列表」确认设备，再选择鼠标所在、主显示器、指定显示器或所有显示器。设备标识可供后续步骤引用；显示器断开或更换后，应重新选择。

设置亮度时可打开可交互的亮度浮层。并非所有外接显示器都支持硬件亮度控制；选择所有显示器时，已完成的调整不会因另一块失败而回滚。更多说明见[显示器与虚拟桌面](/v2/features/displays-and-desktops)。
