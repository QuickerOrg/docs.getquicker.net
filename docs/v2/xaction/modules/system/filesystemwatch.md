---
title: "文件系统监控"
description: "监控文件创建/变更/删除等事件。"
slug: "/v2/xaction/modules/filesystemwatch"
sidebar_label: "文件系统监控"
sidebar_position: 160
quickerDocKey: "xaction/module/sys:fileSystemWatch"
comments: true
moduleKey: "sys:fileSystemWatch"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 69738760
legacyContentUpdatedAt: "2022-07-15T06:51:51.000Z"
---

# 文件系统监控

监视指定文件夹下文件或目录的创建、删除、变更、重命名。1.31.0+ 提供。内部使用 [.NET FileSystemWatcher](https://learn.microsoft.com/dotnet/api/system.io.filesystemwatcher)。只要等剪贴板变化，用 [等待剪贴板改变](/v2/xaction/modules/waitclipboardchange)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:fileSystemWatch" />

## 概述

两种工作方式：等到事件后再继续后续步骤；或持续监控，事件发生后调用子程序（动作会停在本步骤）。

<ModuleParamPreview moduleKey="sys:fileSystemWatch" />

## 参数说明

**操作类型**：等待事件发生、持续监控（事件发生后调用子程序）。

**文件夹路径**：要监控的文件夹。

**包含子文件夹**：是否监控子文件夹。默认开启。

**文件筛选**：对应 `FileSystemWatcher.Filter`。可用 `*`、`?`。

- 所有带后缀文件：`*.*`（不含无后缀文件）
- 所有文件或子文件夹：留空
- 某类文件：`*.txt`（不支持 `*.txt|*.doc` 这种多筛选）
- 特定名字：`MyDoc.txt`、`*recipe.doc`、`win*.xml`、`销售*202?.xlsx`

**通知筛选**：对应 `NotifyFilter`，英文逗号连接：`Attributes`、`CreationTime`、`DirectoryName`、`FileName`、`LastAccess`、`LastWrite`、`Security`、`Size`。留空表示 `LastWrite,FileName,DirectoryName`。

**失败后停止**：失败是否中止动作。默认开启。

### 等待事件发生

类似等待剪贴板：目录里出现预期事件后再继续。

**等待的事件**：`created`、`deleted`、`changed`、`renamed`，逗号连接，如 `created,deleted`。默认 `created`。

**等待秒数**：最长等待时间。`0` 表示不限时。

输出：**变更的路径**、**变更类型**、**旧路径**（重命名时的原路径）。

### 持续监控

动作停在本步骤，后续步骤不会运行。请备好停止动作的快捷键。

<ModuleParamPreview
  moduleKey="sys:fileSystemWatch"
  focusKeys={[
    'operation',
    'path',
    'includeSubdirectories',
    'filter',
    'notifyFilter',
    'createdCallback',
    'changedCallback',
    'deletedCallback',
    'renamedCallback',
    'isSuccess',
  ]}
  values={{
    operation: 'callback',
    includeSubdirectories: 'true',
    filter: '*.*',
    notifyFilter: '',
    createdCallback: 'OnCreated',
    changedCallback: 'OnChanged',
    deletedCallback: 'OnDeleted',
    renamedCallback: 'OnRenamed',
  }}
  inputVars={{path: 'path'}}
  outputVars={{isSuccess: 'isSuccess'}}
/>

**[创建] 处理子程序** / **[变更] 处理子程序** / **[删除] 处理子程序** / **[重命名] 处理子程序**：填写要监控的事件对应的子程序名；留空表示不监控该事件。多个事件可以共用同一个子程序。

回调子程序的输入变量：

- `ChangeType`：`Changed` / `Created` / `Deleted` / `Renamed`
- `FullPath` / `Name`：发生事件的路径和名称（重命名时为改后的）
- 重命名额外：`OldFullPath`、`OldName`

![](./img/filesystemwatch-003-5a29d275fb.png)

需要手动停止监控时，可再启动本动作并传入特定参数（如 `shutdown`），在动作开头判断后 [停止其它实例](/v2/xaction/modules/runaction)：

<ModuleParamPreview
  moduleKey="sys:runAction"
  focusKeys={['type', 'actionId', 'inputParam', 'wait']}
  values={{type: 'StartAction', actionId: 'xxx目录监控', inputParam: 'shutdown', wait: 'false'}}
/>

<ModuleParamPreview
  moduleKey="sys:runAction"
  focusKeys={['type', 'stopIfFail']}
  values={{type: 'StopOtherInstance', stopIfFail: 'true'}}
/>

## 输出

- **是否成功**
- 等待模式下还有 **变更的路径**、**变更类型**、**旧路径**。

## 示例

<StepProgramView example="27d4c30d-803e-473e-4296-08da08643be0" />

<ShareLinkCard
  code="27d4c30d-803e-473e-4296-08da08643be0"
  title="文件监控示例"
  description="监控某个目录并获得提示"
  author="CL"
/>

## 限制与排障

网络盘、部分同步盘可能漏事件或连发。筛选不要写多个 `|` 条件。持续监控时后续步骤不会执行，停止请用快捷键或「停止其它实例」。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/checkpathexists',
      label: '检查路径/获取文件信息',
      description: '事件到来后确认文件是否还在。',
    },
    {
      href: '/v2/xaction/modules/waitclipboardchange',
      label: '等待剪贴板改变',
      description: '同类「等到变化再继续」的模块。',
    },
  ]}
/>
