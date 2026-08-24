---
title: "选择文件夹"
description: "文件夹选择对话框"
slug: "/v2/xaction/modules/selectfolder"
sidebar_label: "选择文件夹"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:selectFolder"
comments: true
moduleKey: "sys:selectFolder"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 13909162
legacyContentUpdatedAt: "2022-01-14T14:50:43.000Z"
---

# 选择文件夹

弹出文件夹选择对话框，拿到完整路径。要选文件，用 [选择文件](/v2/xaction/modules/selectfile)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:selectFolder" />

## 概述

<ModuleParamPreview moduleKey="sys:selectFolder" />

## 参数说明

**提示文字**：选择窗口标题。默认「请选择文件夹」。

**初始路径**：对话框打开时的文件夹，可留空。

**显示已打开的文件夹**：开启后，先列出当前资源管理器里已打开的目录，方便点选；也可再打开系统选择对话框。

<ChoiceListPreview
  title="请选择文件夹"
  options={['D:\\PR', 'D:\\Work\\Quicker', '选择…']}
  showIndex
  primaryLabel="确定(S)"
  secondaryLabel="取消(C)"
/>

关闭时直接弹出系统文件夹对话框：

![](./img/selectfolder-003-660ad2667a.png)

**失败后停止**：用户取消后是否中止动作。默认开启。

## 输出

- **是否成功**：是否选了一个文件夹。
- **路径**：文件夹完整路径。

## 相关子程序与动作

<ShareLinkCard
  kind="subprogram"
  id="fe43699c-88dc-4b8d-0913-08d9d6a79e0f"
  title="多选文件夹"
  description="选择多个文件夹并获得路径列表"
  author="CL"
  category="文件和目录"
/>

<ShareLinkCard
  kind="action"
  code="065dc9ec-731b-4230-58c2-08d6a5df163e"
  title="切换文件夹"
  description="获取资源管理器已打开的路径，选择后填入保存对话框。"
  author="CL"
  category="文件处理"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/selectfile',
      label: '选择文件',
      description: '选文件而不是目录。',
    },
    {
      href: '/v2/xaction/modules/getexplorerpath',
      label: '获取资源管理器路径',
      description: '直接读当前已打开的文件夹。',
    },
  ]}
/>
