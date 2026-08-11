---
title: "Shell文件操作"
description: "针对文件的Windows Shell相关操作"
slug: "/v2/xaction/modules/shelloperation"
sidebar_label: "Shell文件操作"
sidebar_position: 210
quickerDocKey: "xaction/module/sys:shelloperation"
comments: true
moduleKey: "sys:shelloperation"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 48150818
legacyContentUpdatedAt: "2023-08-17T06:49:24.000Z"
---

# Shell文件操作

对文件或文件夹触发资源管理器右键菜单功能（不必真的弹出菜单）。1.25.1 起提供。要复制、移动、删除文件本身，优先用 [文件操作](/v2/xaction/modules/fileoperation)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:shelloperation" />

## 概述

不是所有菜单项都能列出或调用（尤其是子菜单）。有 **动词** 的项用动词更稳；没有动词的可试菜单标题。菜单由 Windows 或已安装软件注册，没装对应软件就找不到。

![](./img/shelloperation-001-0e86bab9c4.png)

<ModuleParamPreview moduleKey="sys:shelloperation" />

## 参数说明

**操作类型**：获取文件的可用动词列表、对文件执行动词、获取文件的可用菜单标题列表、对文件执行菜单（指定菜单标题）、显示系统上下文菜单。

**失败后停止**：失败是否中止动作。默认开启。

### 获取文件的可用动词列表

<ModuleParamPreview
  moduleKey="sys:shelloperation"
  focusKeys={['operation', 'pathOrExt', 'stopIfFail', 'isSuccess', 'verbs']}
  values={{operation: 'getverb', pathOrExt: '$={file}'}}
  outputVars={{verbs: 'verbs'}}
/>

**文件路径或扩展名**：已存在的文件/文件夹完整路径，或扩展名（如 `.txt`）。填扩展名时，Quicker 会生成临时文件再取动词。

输出 **动词列表**：每项 `描述文字|动词`，可直接给 [用户选择](/v2/xaction/modules/userselect)。

![](./img/shelloperation-004-2dd47c23f3.png)

部分软件（如 7-Zip）的菜单标题里会带文件名，但动词是固定的。常见动词：`open` 打开、`edit` 编辑、`openas` 选择打开方式、`print` 打印。

### 对文件执行动词

<ModuleParamPreview
  moduleKey="sys:shelloperation"
  focusKeys={['operation', 'pathList', 'verb', 'stopIfFail', 'isSuccess']}
  values={{operation: 'execverb'}}
  inputVars={{pathList: 'files', verb: 'verb'}}
/>

**文件路径列表**：完整路径列表，须位于同一父目录。

**动词**：要执行的动词。

### 获取文件的可用菜单标题列表

没有动词时，可按标题查找并执行。Windows 用 `&` 标记快捷字母，得到的标题里可能含 `&`。

![](./img/shelloperation-006-8fb09e32a6.png)

<ModuleParamPreview
  moduleKey="sys:shelloperation"
  focusKeys={['operation', 'pathOrExt', 'stopIfFail', 'isSuccess', 'titles']}
  values={{operation: 'gettitles', pathOrExt: '$={files}[0]'}}
  outputVars={{titles: 'menuList'}}
/>

输出 **菜单标题列表**。

### 对文件执行菜单（指定菜单标题）

<ModuleParamPreview
  moduleKey="sys:shelloperation"
  focusKeys={['operation', 'pathList', 'title', 'stopIfFail', 'isSuccess']}
  values={{operation: 'execbytitle', title: '打开(o)'}}
  inputVars={{pathList: 'files'}}
/>

**菜单标题**：要执行的标题。从列表里拿到的 `&` 在调用时可省略：`打开(&O)` 与 `打开(O)` 都会尝试匹配。

### 显示系统上下文菜单

弹出接近资源管理器的右键菜单，点击后执行对应项。必须用鼠标点击才能关闭。

![](./img/shelloperation-009-62275bd2e7.png)

<ModuleParamPreview
  moduleKey="sys:shelloperation"
  focusKeys={['operation', 'pathList', 'stopIfFail', 'isSuccess']}
  values={{operation: 'showmenu'}}
  inputVars={{pathList: 'files'}}
/>

## 输出

- **是否成功**
- **动词列表** / **菜单标题列表**：见对应操作。

## 示例

<StepProgramView example="582c20af-30ec-423d-b6ce-08db782fe3a2" />

<ShareLinkCard
  code="582c20af-30ec-423d-b6ce-08db782fe3a2"
  title="Shell可用动词和菜单标题"
  description="获取选中文件的Shell可用动词"
  author="CL"
/>

## 限制与排障

列表为空时确认路径存在，且本机已安装会注册该菜单的软件。多文件必须在同一目录。子菜单项常常列不出来，改试标题或换动词。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getselectedfiles',
      label: '获取选择的文件(夹)/选择特定文件',
      description: '先拿到要操作的文件列表。',
    },
    {
      href: '/v2/xaction/modules/fileoperation',
      label: '文件操作',
      description: '复制、移动、删除等常规文件动作。',
    },
  ]}
/>
