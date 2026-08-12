---
title: "写入剪贴板"
description: "将文本或图片等内容写入剪贴板"
slug: "/v2/xaction/modules/writeclipboard"
sidebar_label: "写入剪贴板"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:writeClipboard"
comments: true
moduleKey: "sys:writeClipboard"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1555222
legacyContentUpdatedAt: "2019-07-08T13:55:08.000Z"
---

# 写入剪贴板

把文本、图片或 HTML 等写入剪贴板，供之后粘贴。放文件用 [文件放入剪贴板](/v2/xaction/modules/filetoclipboard)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:writeClipboard" />

## 概述

先选 **类型**，再填该类型要写入的内容。清空剪贴板也走这个模块。

<ModuleParamPreview moduleKey="sys:writeClipboard" />

## 参数说明

**类型**：要写入的内容类型。换类型后，下面的写入字段会跟着变。

<PreviewMarks
  marks={[
    {key: 'type', label: '要写入剪贴板的内容类型'},
    {key: 'imageVar', label: '要写入的内容'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:writeClipboard"
    scrollBody={false}
    focusKeys={['type', 'imageVar']}
    values={{type: 'image'}}
    inputVars={{imageVar: 'img'}}
  />
</PreviewMarks>

- **自动（纯文本或图片）**：接受任意类型的变量。内容是图片就按图片写入，其它类型转成文本再写入。
- **HTML片段**：写入 HTML，粘贴到支持富文本的编辑器时保留链接、样式。
- **纯文本** / **Rtf** / **Csv**：按对应格式写入文本。
- **图片**：写入图片变量。
- **自定义格式**：按指定格式名写入。
- **清空剪贴板** / **清空剪贴板历史(Win10+)**：不写内容，只清空。

**输入**：仅 **自动（纯文本或图片）**。要写入的数据。

**HTML内容**：仅 **HTML片段**。要写入的 HTML 代码。

**文本内容**：在 **HTML片段**、**纯文本**、**Rtf**、**Csv**、**自定义格式** 时出现。HTML 类型下同时提供纯文本，方便不支持 HTML 的程序粘贴；留空则自动用 HTML 内容充当纯文本。

<ModuleParamPreview
  moduleKey="sys:writeClipboard"
  focusKeys={['type', 'html', 'text']}
  values={{
    type: 'html',
    html: '<a href=baidu.com>baidu.com</a>',
    text: 'baidu.com',
  }}
/>

**图片(变量)**：仅 **图片**。要写入的图片。

**快速模式**：仅 **图片**。图片没有透明通道、不需要处理透明度时勾选。默认关闭。

**格式名**：仅 **自定义格式**。目标程序认识的剪贴板格式名。可用 [Free Clipboard Viewer](http://www.freeclipboardviewer.com/) 核对。

**成功后提示**：可选。写入成功后弹出的提示，例如「已写入剪贴板」。旧稿未写。

**失败后停止**：写入失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：是否写入成功。

## 限制与排障

HTML 片段建议同时填 **文本内容**，否则只支持纯文本粘贴的程序可能拿到一堆标签。图片透明异常时，先关掉 **快速模式**。自定义格式名必须和对方程序一致。

## 示例动作

把选中的网址转成 HTML 链接再写入剪贴板。

<StepProgramView example="0e698f4e-04ac-426d-b3eb-08d6c3be0bea" />

<ShareLinkCard
  code="0e698f4e-04ac-426d-b3eb-08d6c3be0bea"
  title="转HTML链接"
  description="将编辑器的文本链接转换为HTML格式"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getclipboardtext',
      label: '获取剪贴板文本',
      description: '读回刚写入的文本或 HTML。',
    },
    {
      href: '/v2/xaction/modules/getclipboardimage',
      label: '获取剪贴板图片',
      description: '读回刚写入的图片。',
    },
    {
      href: '/v2/xaction/modules/filetoclipboard',
      label: '文件放入剪贴板',
      description: '要粘贴的是磁盘文件，不是文本或图。',
    },
  ]}
/>
