---
title: "等待剪贴板内容改变"
description: "等待剪贴板的内容发生改变。等待第三方工具（如截图工具）完成操作并更新剪贴板。"
slug: "/v2/xaction/modules/waitclipboardchange"
sidebar_label: "等待剪贴板内容改变"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:waitClipboardChange"
comments: true
moduleKey: "sys:waitClipboardChange"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1465393
legacyContentUpdatedAt: "2025-12-05T02:21:23.000Z"
---

# 等待剪贴板内容改变

等到剪贴板内容发生变化再继续。常用来等第三方截图、复制工具写完。Quicker 自己截图用 [屏幕截图](/v2/xaction/modules/screencapture)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:waitClipboardChange" />

## 概述

典型用法：先发送快捷键或启动截图软件，再等剪贴板变化，然后 [获取剪贴板图片](/v2/xaction/modules/getclipboardimage)。

<ModuleParamPreview moduleKey="sys:waitClipboardChange" />

## 参数说明

**最长等待秒数**：持续检测，直到超时。默认 `10` 秒。超时仍未变化则结束等待。

**包含临近的改变**：把开始等待之前若干毫秒内已经发生的改变也算进去。单位毫秒，默认 `10`。旧稿未写。截图工具若在本步骤启动前就把图写入了剪贴板，适当加大这个值可以避免空等。

**等待窗口关闭时取消**：配合 [等待窗口](/v2/xaction/modules/showwaitwin)。用户关掉等待窗口就提前结束等待。

**失败后中止动作**：超时后剪贴板仍未改变，是否停止后续步骤。默认开启。

## 输出

- **是否改变**：剪贴板内容是否真的变了。超时或被取消时为否。

## 限制与排障

等剪贴板改变后，不要立刻模拟按键。这时 Ctrl、C 等键可能还没抬起，模拟按键容易把它们卡在按下状态。后面需要按键时，先用 [等待时间](/v2/xaction/modules/delay) 垫 100～200 毫秒。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getclipboardimage',
      label: '获取剪贴板图片',
      description: '等变化之后把图读出来。',
    },
    {
      href: '/v2/xaction/modules/getclipboardtext',
      label: '获取剪贴板文本',
      description: '等变化之后读文本。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '内置截屏，多数场景不必再等第三方。',
    },
    {
      href: '/v2/xaction/modules/showwaitwin',
      label: '等待窗口',
      description: '给用户看进度，关掉窗口可取消等待。',
    },
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '变化之后、模拟按键之前垫一小段延时。',
    },
  ]}
/>
