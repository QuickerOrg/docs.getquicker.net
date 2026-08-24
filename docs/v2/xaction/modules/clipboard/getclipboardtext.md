---
title: "获取剪贴板文本"
description: "读取剪贴板中的文本内容"
slug: "/v2/xaction/modules/getclipboardtext"
sidebar_label: "获取剪贴板文本"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:getClipboardText"
comments: true
moduleKey: "sys:getClipboardText"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2066073
legacyContentUpdatedAt: "2019-08-21T01:42:45.000Z"
---

# 获取剪贴板文本

读取剪贴板里的文本。读图片用 [获取剪贴板图片](/v2/xaction/modules/getclipboardimage)，写回去用 [写入剪贴板](/v2/xaction/modules/writeclipboard)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getClipboardText" />

## 概述

一次复制往往同时带好几种文本格式（纯文本、HTML、RTF 等）。按动作需要选一种来读，一般用 **纯文本（默认）**。

<ModuleParamPreview moduleKey="sys:getClipboardText" />

## 参数说明

**文本数据格式**：要读哪一种。

- **纯文本（默认）**：Unicode 纯文本，大多数场景用这个。
- **Rtf** / **Html** / **逗号分隔的值（csv）**：对应格式存在时再选。
- **自定义格式名**：读某个软件自己的剪贴板格式。

**格式名称**：仅 **自定义格式名**。填实际格式名，必须和剪贴板里的一致，且内容本身是文本。先复制目标内容，再用下面的动作查看左侧格式列表；也可以用 [Free Clipboard Viewer](http://www.freeclipboardviewer.com/)。

<ShareLinkCard
  code="fe33cf74-7834-45d8-dd42-08deaef5f4fb"
  title="剪贴板查看器"
  description="查看剪贴板数据，支持查看拖拽数据"
  author="Cea"
/>

![Free Clipboard Viewer 中同时存在多种剪贴板格式](./img/getclipboardtext-002-493ba546c2.png)

**文本编码**：仅 **自定义格式名**。按哪种编码把字节解成文本。默认 UTF8。

<ModuleParamPreview
  moduleKey="sys:getClipboardText"
  focusKeys={['format', 'customFormat', 'encoding']}
  values={{format: 'Custom'}}
/>

**重试时间**：每 10ms 重试一次，直到读到文本。默认 `400` 毫秒；填 `0` 不重试。旧稿未写。对方程序还没写完剪贴板时，适当加大这个值。

**失败后中止动作**：剪贴板没有对应格式，或读取失败时，是否停止后续步骤。默认开启。

## 输出

- **是否成功**：是否读到了文本。
- **完整结果内容**：读到的数据。
- **主要HTML片段**：仅 **Html**。`<!--StartFragment-->` 与 `<!--EndFragment-->` 之间的部分。旧稿未写。
- **完整的HTML文档**：仅 **Html**。去掉剪贴板头部后的完整 HTML，带 `<html>` 等标签，可直接存成 `.html`。旧稿未写。
- **来源网址**：从网页复制时，有的程序会带上页面地址。旧稿未写。
- **已更新时间**：剪贴板最后一次更新距现在多少毫秒。旧稿未写。

<ModuleParamPreview
  moduleKey="sys:getClipboardText"
  focusKeys={['format', 'output', 'cleanHtml', 'htmlDoc', 'url']}
  values={{format: 'Html'}}
/>

## 限制与排障

选的格式在剪贴板里不存在就会失败。自定义格式名必须和查看器里看到的完全一致，编码不对会读出乱码。需要等第三方工具写完再读时，先用 [等待剪贴板内容改变](/v2/xaction/modules/waitclipboardchange)。

## 更新历史

- 1.0.13 增加自定义格式的读取支持。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/writeclipboard',
      label: '写入剪贴板',
      description: '把文本、HTML 或图片写回去。',
    },
    {
      href: '/v2/xaction/modules/waitclipboardchange',
      label: '等待剪贴板内容改变',
      description: '等对方程序写完再读。',
    },
    {
      href: '/v2/xaction/modules/getclipboardimage',
      label: '获取剪贴板图片',
      description: '剪贴板里是图时用这个。',
    },
  ]}
/>
