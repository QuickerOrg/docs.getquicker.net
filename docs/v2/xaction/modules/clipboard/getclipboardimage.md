---
title: "获取剪贴板图片"
description: "读取剪贴板中的图片内容输出到图片变量中。"
slug: "/v2/xaction/modules/getclipboardimage"
sidebar_label: "获取剪贴板图片"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:getClipboardImage"
comments: true
moduleKey: "sys:getClipboardImage"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2064749
legacyContentUpdatedAt: "2020-05-28T06:41:20.000Z"
---

# 获取剪贴板图片

把剪贴板里的图片读到图片变量。读文本用 [获取剪贴板文本](/v2/xaction/modules/getclipboardtext)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getClipboardImage" />

## 概述

常用来接第三方截图工具：对方把图写入剪贴板后，这一步取出来。Quicker 自己截图用 [屏幕截图](/v2/xaction/modules/screencapture)。

<ModuleParamPreview moduleKey="sys:getClipboardImage" />

## 参数说明

**失败后中止动作**：获取失败时是否停止后续步骤。默认开启。

## 输出

- **是否成功**：是否拿到了图片。把这项输出到变量后，失败时不再弹出提示，只靠这个值判断。
- **结果图片**：剪贴板里的图片对象。
- **已更新时间**：剪贴板最后一次更新距现在多少毫秒。旧稿未写。

## 限制与排障

剪贴板里没有图片（只复制了文字、文件，或还是空的）会失败。等第三方截图工具写完再取，可先用 [等待剪贴板内容改变](/v2/xaction/modules/waitclipboardchange)。不确定里面有没有图时，用下面的动作确认是否存在 Bitmap、DIB 等图像格式。

<ShareLinkCard
  code="fe33cf74-7834-45d8-dd42-08deaef5f4fb"
  title="剪贴板查看器"
  description="查看剪贴板数据，支持查看拖拽数据"
  author="Cea"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/waitclipboardchange',
      label: '等待剪贴板内容改变',
      description: '等截图工具把图写入剪贴板。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '不经过第三方工具，直接截屏。',
    },
    {
      href: '/v2/xaction/modules/writeclipboard',
      label: '写入剪贴板',
      description: '把图片变量写回剪贴板。',
    },
  ]}
/>
