---
title: "获取浏览器网址"
description: "读取当前浏览器标签页的网址。"
slug: "/v2/xaction/modules/getchromeurl"
sidebar_label: "获取浏览器网址"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:getChromeUrl"
comments: true
moduleKey: "sys:getChromeUrl"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2118114
legacyContentUpdatedAt: "2021-10-06T14:07:29.000Z"
---

# 获取浏览器网址

读取当前浏览器窗口里活动标签的网址。要对 Chrome 做更细的控制，用 [Chrome控制](/v2/xaction/modules/chromecontrol)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getChromeUrl" />

## 概述

对 `chrome`、`msedge`、`firefox` 进程，先走浏览器扩展接口。失败后再模拟 `Ctrl+L` 跳到地址栏复制。

<ModuleParamPreview moduleKey="sys:getChromeUrl" />

## 参数说明

**失败后停止**：拿不到网址时是否中止动作。默认开启。

## 输出

- **是否成功**：是否读到了网址。
- **网址**：当前标签的 URL。

## 限制与排障

- 扩展未安装、未启用，或浏览器未授权时，会落到模拟地址栏复制，可能抢焦点、改剪贴板。
- 非上述浏览器进程通常只能走模拟复制。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/chromecontrol',
      label: 'Chrome控制',
      description: '标签、元素、执行脚本等完整控制。',
    },
    {
      href: '/v2/xaction/modules/openurl',
      label: '打开网址',
      description: '拿到网址后再打开。',
    },
  ]}
/>
