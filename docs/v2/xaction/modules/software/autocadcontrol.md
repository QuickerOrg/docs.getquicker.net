---
title: "AutoCAD控制"
description: "向已启动的 AutoCAD 发送命令，或读取文档变量。"
slug: "/v2/xaction/modules/autocadcontrol"
sidebar_label: "AutoCAD控制"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:autocadcontrol"
comments: true
moduleKey: "sys:autocadcontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 80627663
legacyContentUpdatedAt: "2025-01-20T00:50:55.000Z"
---

# AutoCAD控制

向已启动的 AutoCAD 发送命令或 AutoLisp，也可以读取文档变量。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:autocadcontrol" />

## 概述

<ModuleParamPreview moduleKey="sys:autocadcontrol" />

## 参数说明

**操作类型**：

- **执行命令**：发送命令或 AutoLisp。
- **读取变量**：按名称读当前文档变量。

**命令内容**：AutoCAD 命令或 AutoLisp。通常在末尾加空格或回车表示开始执行；多一个空格/回车可能连跑两次。仅「执行命令」。

**变量列表**：每行一个变量名。仅「读取变量」。

**等待命令结束**：是否等命令跑完再继续。仅「执行命令」。默认开启。

**最长等待时间(ms)**：等待上限，默认 10000。

**失败后停止**：失败后是否中止动作。默认开启。

## 输出

- **是否成功**：是否执行成功。
- **变量值**：仅「读取变量」。多个变量时每行一个，顺序与变量列表一致。

## 示例动作

<StepProgramView example="837633b1-cbea-4156-0c36-08da45d22d56" />

<ShareLinkCard
  code="837633b1-cbea-4156-0c36-08da45d22d56"
  title="ZoomAll"
  description="运行 _zoom all 命令"
  author="CL"
/>

<StepProgramView example="2de554cd-f7f6-417c-6b7c-08da4f3f8574" />

<ShareLinkCard
  code="2de554cd-f7f6-417c-6b7c-08da4f3f8574"
  title="LispHelloWorld"
  description="用 AutoLisp 显示 Hello World"
  author="CL"
/>

参考：[AutoLisp 入门（上）](http://www.hanlindong.com/2017/autolisp-beginner-1/)、[AutoLisp 入门（下）](http://www.hanlindong.com/2017/autolisp-beginner-2/)。

## 通过手势、轮盘执行

轮盘等快速触发不能直接向 CAD 发命令。先安装 [参数传递CAD命令](https://getquicker.net/Sharedaction?code=3dfd19f5-7e33-4864-5286-08da4e691004)，再在轮盘里「运行 Quicker 动作」，动作名填「参数传递CAD命令」，动作参数填命令（末尾加空格开始执行）。

<StepProgramView example="3dfd19f5-7e33-4864-5286-08da4e691004" />

<ShareLinkCard
  code="3dfd19f5-7e33-4864-5286-08da4e691004"
  title="参数传递CAD命令"
  description="从参数传递要执行的 CAD 命令"
  author="CL"
/>

![](./img/autocadcontrol-002-00baa37969.png)

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/rhinocontrol',
      label: 'Rhino软件控制',
      description: '同类：向 Rhino 发命令。',
    },
  ]}
/>

## 更新历史

- 20250120 更新文档标题，以匹配实际功能。
