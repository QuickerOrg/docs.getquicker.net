---
title: "音频设备"
description: "获取音频设备信息，设置默认音频设备。"
slug: "/v2/xaction/modules/audiocontrol"
sidebar_label: "音频设备"
sidebar_position: 180
quickerDocKey: "xaction/module/sys:audioControl"
comments: true
moduleKey: "sys:audioControl"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 43543457
legacyContentUpdatedAt: "2025-01-20T01:00:00.000Z"
---

# 音频设备

列出或读取音频设备，设置默认设备，以及静音、音量。只要播一段提示音，用 [播放声音](/v2/xaction/modules/playsound)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:audioControl" />

## 概述

先选 **操作类型**。设备 ID 形如 `{0.0.0.00000000}.{2c3a51b4-780e-4290-bc03-8c25dfed52d1}`，可从「获取设备列表」等操作得到。

<ModuleParamPreview moduleKey="sys:audioControl" />

## 参数说明

**操作类型**：获取输出/输入设备列表、获取默认输出/输入设备信息、获取指定设备的信息、设置默认设备、设置静音、设置音量。

**失败后停止动作**：失败是否中止动作。默认开启。

### 获取设备列表

<ModuleParamPreview
  moduleKey="sys:audioControl"
  focusKeys={['operation', 'returnAll']}
  values={{operation: 'GetOutputDeviceList', returnAll: 'false'}}
/>

**返回所有状态的设备**：关闭时只返回就绪（Active）设备。默认关闭。

输出：

- **设备信息列表**：每项 `[图标]名称(注释)|设备ID`，可直接当作 [用户选择](/v2/xaction/modules/userselect) 的选项。
- **原始对象列表**：内部 `MMDevice` 对象列表。

### 获取默认设备 / 指定设备

<ModuleParamPreview
  moduleKey="sys:audioControl"
  focusKeys={['operation', 'id']}
  values={{operation: 'GetDeviceById', id: 'deviceId'}}
/>

**设备ID**：获取指定设备、设置默认设备、静音、音量时需要。

输出（默认设备或指定设备）：**设备ID**、**设备名称**、**设备状态**、**是否静音**、**是否正在播放**、**设置音量**、**实时音量**、**原始对象**。

### 设置默认设备

<ModuleParamPreview
  moduleKey="sys:audioControl"
  focusKeys={['operation', 'id']}
  values={{operation: 'SetDefaultDeviceById', id: 'deviceId'}}
/>

把指定设备设为默认输出或输入。

### 设置静音

<ModuleParamPreview
  moduleKey="sys:audioControl"
  focusKeys={['operation', 'id', 'mute']}
  values={{operation: 'SetDeviceMute', id: 'deviceId', mute: 'true'}}
/>

**静音状态**：静音、取消静音、切换静音状态。**设备ID** 为空时操作当前默认输出设备。

### 设置音量

<ModuleParamPreview
  moduleKey="sys:audioControl"
  focusKeys={['operation', 'id', 'volume']}
  values={{operation: 'SetDeviceVolume', id: 'deviceId', volume: '0.1'}}
/>

**音量**：`0`–`1.0` 的小数。**设备ID** 为空时操作当前默认输出设备。

## 输出

- **是否成功**
- 其余输出随操作类型变化，见上。

## 示例

25 步的综合演示只保留安装卡片；下面三个不超过 8 步，可直接看步骤定义。

<ShareLinkCard
  code="0cf96600-866a-4eac-7f44-08d8fe1fe745"
  title="音频设备控制示例"
  description="演示音频设备相关操作"
  author="CL"
/>

<StepProgramView example="789bfd8d-3ef0-43c9-7f48-08d8fe1fe745" />

<ShareLinkCard
  code="789bfd8d-3ef0-43c9-7f48-08d8fe1fe745"
  title="输出到固定设备"
  description="设置音频输出到指定的设备。"
  author="CL"
/>

<StepProgramView example="d4eab7c4-b53e-4fd9-7f4a-08d8fe1fe745" />

<ShareLinkCard
  code="d4eab7c4-b53e-4fd9-7f4a-08d8fe1fe745"
  title="切换音频设备"
  description="在两个指定的音频输出设备之间切换"
  author="CL"
/>

<StepProgramView example="8139f36b-059a-49a6-9f64-08d8ff04bb1d" />

<ShareLinkCard
  code="8139f36b-059a-49a6-9f64-08d8ff04bb1d"
  title="选择音频设备"
  description="复制音频设备的ID，方便通过扩展热键等功能使用"
  author="CL"
/>

## 限制与排障

设备 ID 随系统变化，不要写死后换电脑仍用旧值。列表为空时先打开 **返回所有状态的设备**，确认设备是否处于未就绪。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/playsound',
      label: '播放声音',
      description: '在指定设备上播放提示音。',
    },
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '把设备信息列表当作选项。',
    },
  ]}
/>
