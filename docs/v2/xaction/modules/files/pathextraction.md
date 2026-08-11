---
title: "提取文件路径信息/生成路径"
description: "从路径里取出文件名、扩展名，或拼出一条新路径。"
slug: "/v2/xaction/modules/pathextraction"
sidebar_label: "提取文件路径信息/生成路径"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:pathExtraction"
comments: true
moduleKey: "sys:pathExtraction"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2117073
legacyContentUpdatedAt: "2022-06-14T01:38:52.000Z"
---

# 提取文件路径信息/生成路径

从完整路径里取出文件名、扩展名、所在目录，或按规则拼一条新路径。先选 **操作类型**。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:pathExtraction" />

## 概述

<ModuleParamPreview moduleKey="sys:pathExtraction" />

**失败后停止**：处理失败是否中止动作。默认开启。所有操作都会输出 **是否成功**。

## 提取文件路径信息

从完整路径里拆出文件名等信息。

**路径**：要提取的完整路径。

**输出**（仅本操作）：

- **文件名**
- **文件名(去掉扩展名)**
- **所在文件夹路径**
- **扩展名**

例如路径 `D:\Work\Quicker\doc\icon.psd`：文件名 `icon.psd`，去掉扩展名 `icon`，扩展名 `.psd`，所在文件夹 `D:\Work\Quicker\doc`。

## 更改扩展名，其它不变

基于现有路径，只改扩展名（需 Quicker 1.33.25+）。

<ModuleParamPreview
  moduleKey="sys:pathExtraction"
  focusKeys={['operation', 'path', 'newExtension', 'resultPath']}
  values={{operation: 'changeExt', path: 'D:\\Work\\Quicker\\doc\\icon.psd', newExtension: '.jpg'}}
  outputVars={{resultPath: 'resultPath'}}
/>

**路径**：现有完整路径或文件名。

**新的扩展名**：目标后缀，如 `.jpg`。

**结果路径**：例如 `D:\Work\Quicker\doc\icon.jpg`。

## 更改文件名(含扩展名)，所在目录不变

同一目录下换成新文件名。

<ModuleParamPreview
  moduleKey="sys:pathExtraction"
  focusKeys={['operation', 'path', 'newFileName', 'resultPath']}
  values={{
    operation: 'changeName',
    path: 'D:\\Work\\Quicker\\doc\\icon.psd',
    newFileName: 'icon_save_20220506_112233.psd',
  }}
  outputVars={{resultPath: 'resultPath'}}
/>

**路径**：现有完整路径。

**新的文件名**：含扩展名，如 `icon_save_20220506_112233.psd`。

**结果路径**：例如 `D:\Work\Quicker\doc\icon_save_20220506_112233.psd`。

## 更改文件名(不含扩展名和所在目录)

只改主文件名，扩展名和所在目录保持不变。

<ModuleParamPreview
  moduleKey="sys:pathExtraction"
  focusKeys={['operation', 'path', 'newFileNameWithoutExt', 'resultPath']}
  values={{
    operation: 'changeNameWithoutExt',
    path: 'D:\\Work\\Quicker\\doc\\icon.psd',
    newFileNameWithoutExt: 'icon_save',
  }}
  outputVars={{resultPath: 'resultPath'}}
/>

**路径**：现有完整路径。

**新的文件名**：不含扩展名，如 `newfile`。

**结果路径**：例如 `D:\Work\Quicker\doc\icon_save.psd`。

## 更改所在目录，文件名不变

把同一文件名放到另一个目录。

<ModuleParamPreview
  moduleKey="sys:pathExtraction"
  focusKeys={['operation', 'path', 'newDir', 'resultPath']}
  values={{operation: 'changeDir', path: 'D:\\Work\\Quicker\\doc\\icon.psd', newDir: 'D:\\Backup\\20220105'}}
  outputVars={{resultPath: 'resultPath'}}
/>

**路径**：现有完整路径。

**目标目录路径**：目标目录，如 `D:\Backup\20220105`。

**结果路径**：例如 `D:\Backup\20220105\icon.psd`。

## 合并路径 (拼接)

用根路径和后续片段拼出完整路径。某一段为空则跳过。

<ModuleParamPreview
  moduleKey="sys:pathExtraction"
  focusKeys={['operation', 'path', 'path2', 'path3', 'path4', 'resultPath']}
  values={{operation: 'combine', path: 'D:\\Work', path2: 'media', path3: '20220506', path4: 'abc.gif'}}
  outputVars={{resultPath: 'resultPath'}}
/>

**路径** / **路径部分2** / **路径部分3** / **路径部分4**：依次拼接。

**结果路径**：例如 `D:\Work\media\20220506\abc.gif`。

## 示例动作

调试运行可观察各操作的输入和输出。

<StepProgramView example="7e0ffda7-cbc9-4e31-2462-08da4d582a20" />

<ShareLinkCard
  code="7e0ffda7-cbc9-4e31-2462-08da4d582a20"
  title="示例：路径操作 (请调试运行)"
  description="演示路径信息获取和生成"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/fileoperation',
      label: '文件和目录操作',
      description: '拼好路径后再复制、移动或创建。',
    },
    {
      href: '/v2/xaction/modules/writetextfile',
      label: '写入文本文件',
      description: '用新路径落盘。',
    },
  ]}
/>
