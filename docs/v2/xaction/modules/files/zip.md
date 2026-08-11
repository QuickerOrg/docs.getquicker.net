---
title: "Zip压缩打包"
description: "把文件夹或文件打成 zip，或把 zip 解压到指定目录。"
slug: "/v2/xaction/modules/zip"
sidebar_label: "Zip压缩打包"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:zip"
comments: true
moduleKey: "sys:zip"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 8014488
legacyContentUpdatedAt: "2025-12-18T13:17:15.000Z"
---

# Zip压缩打包

创建 zip，或把 zip 解压到指定目录。适合打包几个文件发给别人；不要用来压大文件或海量文件。1.8.2 起提供。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:zip" />

## 概述

先选 **操作类型**：创建 Zip 文件，或解压缩 Zip 文件。

<ModuleParamPreview moduleKey="sys:zip" />

## 创建 Zip 文件

把一个文件夹、一个文件，或同一目录下的多个文件/子文件夹打成 zip。多个路径时每行一条。

**源路径**：待压缩的文件夹或文件。

**Zip文件路径**：

- 完整路径，如 `d:\backup\20200618_work.zip`
- 留空：在 Windows 临时目录生成，路径从 **结果路径** 输出
- `.`：生成到源文件或文件夹所在目录，文件名自动生成

**源路径为单个文件夹时，压缩整个文件夹（保留文件夹名称）**：开启则 zip 里带上文件夹本身；关闭则只压文件夹里的内容。默认关闭。

**密码** / **备注**：可选。

**级别**：0–9。0 不压缩（快），9 压到最小（慢）。默认 1。

**显示进度条**：仅压缩单个文件夹时有效。默认关闭。

**失败后停止**：失败是否中止动作。默认开启。

## 解压缩 Zip 文件

<ModuleParamPreview
  moduleKey="sys:zip"
  focusKeys={[
    'type',
    'sourceZipFile',
    'outputPath',
    'password',
    'overwrite',
    'skipOverwriteError',
    'showProgress',
    'stopIfFail',
    'isSuccess',
    'resultPath',
  ]}
  values={{
    type: 'Unzip',
    overwrite: 'false',
    skipOverwriteError: 'false',
    showProgress: 'false',
  }}
/>

**Zip文件路径**：待解压的 zip 完整路径。

**目标路径**：

- 目标文件夹的完整路径
- `.`：解压到 zip 所在文件夹
- `*`：解压到以 zip 文件名创建的子文件夹

**密码**：有密码时填写。

**自动覆盖文件**：解压时覆盖已有文件。默认关闭。

**覆盖失败时忽略**：某个文件盖不上时，跳过并继续解其余文件。默认关闭。

**显示进度条**：解压时是否显示。默认关闭。

## 输出

- **是否成功**：操作是否完成。
- **结果路径**：生成的 zip 完整路径，或解压后的完整路径。

## 限制与排障

不要用来压缩或解压大文件、大量文件。进度条只支持压缩/解压单个文件夹。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/fileoperation',
      label: '文件和目录操作',
      description: '打包前后复制、移动或列举文件。',
    },
    {
      href: '/v2/xaction/modules/gentempfilepath',
      label: '生成临时文件路径',
      description: '需要临时落盘时先生成路径。',
    },
  ]}
/>
