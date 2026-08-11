---
title: "Rhino软件控制"
description: "向已启动的 Rhino 发送命令或脚本。"
slug: "/v2/xaction/modules/rhinocontrol"
sidebar_label: "Rhino软件控制"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:rhinocontrol"
comments: true
moduleKey: "sys:rhinocontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 80629667
legacyContentUpdatedAt: "2022-06-17T01:44:17.000Z"
---

# Rhino软件控制

向已启动的 Rhino 发送命令或脚本。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:rhinocontrol" />

## 概述

<ModuleParamPreview moduleKey="sys:rhinocontrol" />

## 参数说明

**操作类型**：目前只有「执行脚本」。

**命令内容**：要执行的命令或脚本。仅「执行脚本」。

**等待命令结束**：是否等命令跑完再继续。仅「执行脚本」。默认开启。

**最长等待时间(ms)**：等待上限，默认 10000。

**失败后停止**：失败后是否中止动作。默认开启。

## 输出

- **是否成功**：命令是否执行成功。
- **脚本输出**：仅通过接口执行时可能有返回。

## 示例动作

<StepProgramView example="4e40c634-8eca-4515-6b7e-08da4f3f8574" />

<ShareLinkCard
  code="4e40c634-8eca-4515-6b7e-08da4f3f8574"
  title="示例：Rhino画线"
  description="绘制一条从 0,0,0 到 100,100,100 的线"
  author="CL"
/>

## 通过手势、轮盘执行

轮盘等快速触发不能直接向 Rhino 发命令，需要一个中转动作：先安装 [参数传递Rhino命令](https://getquicker.net/Sharedaction?code=ff3309da-7c30-4655-6b7d-08da4f3f8574)，再在轮盘里「运行 Quicker 动作」，动作名填「参数传递Rhino命令」，动作参数填要执行的命令。

<StepProgramView example="ff3309da-7c30-4655-6b7d-08da4f3f8574" />

<ShareLinkCard
  code="ff3309da-7c30-4655-6b7d-08da4f3f8574"
  title="参数传递Rhino命令"
  description="从参数传递要执行的命令，方便在轮盘等触发方式中使用"
  author="CL"
/>

![](./img/rhinocontrol-002-c58000d477.png)

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/autocadcontrol',
      label: 'AutoCAD控制',
      description: '同类：向 CAD 发命令。',
    },
  ]}
/>
