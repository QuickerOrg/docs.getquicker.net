---
title: "获取浏览器网址"
description: "获取当前浏览器网址。"
slug: "/v2/xaction/modules/getchromeurl"
sidebar_label: "获取浏览器网址"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:getChromeUrl"
comments: true
moduleKey: "sys:getChromeUrl"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2118114
legacyContentUpdatedAt: "2021-10-06T14:07:29.000Z"
---

# 获取浏览器网址

获取当前浏览器网址。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getChromeUrl" />

## 使用说明

获取当前浏览器窗口的网址。

对于chrome、msedge和firefox进程，它会首先尝试通过浏览器扩展接口获取网址。

如果失败了，会尝试模拟Ctrl+L跳转到地址栏复制网址。

<ModuleParamPreview moduleKey="sys:getChromeUrl" />
