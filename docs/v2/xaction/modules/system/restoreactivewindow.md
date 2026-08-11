---
title: "恢复活动窗口"
description: "如果活动窗口改变了（比如使用了参数输入步骤）,使用此动作恢复窗口焦点。"
slug: "/v2/xaction/modules/restoreactivewindow"
sidebar_label: "恢复活动窗口"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:restoreActiveWindow"
comments: true
moduleKey: "sys:restoreActiveWindow"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2117977
legacyContentUpdatedAt: "2019-07-15T04:10:14.000Z"
---

# 恢复活动窗口

把输入焦点还给动作开始前的那个窗口。弹过 [用户输入](/v2/xaction/modules/userinput) 或 [用户选择](/v2/xaction/modules/userselect) 之后，常用本步骤再回去打字。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:restoreActiveWindow" />

## 概述

活动窗口是当前具有输入焦点的窗口。本模块没有参数：执行后尝试把焦点恢复到运行动作之前的窗口。

<ModuleParamPreview moduleKey="sys:restoreActiveWindow" />

## 参数说明

本模块没有输入或输出参数。

## 限制与排障

若中间又切到了别的软件，或目标窗口已经关闭，恢复可能失败。只想把某个进程提到前台时，用 [激活进程主窗口](/v2/xaction/modules/activateprocessmainwindow) 或 [窗口操作](/v2/xaction/modules/windowoperations)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/userinput',
      label: '用户输入',
      description: '输入窗会抢走焦点，之后常用本模块还回去。',
    },
    {
      href: '/v2/xaction/modules/windowoperations',
      label: '窗口操作',
      description: '按句柄移动、置顶或设为前台窗口。',
    },
  ]}
/>
