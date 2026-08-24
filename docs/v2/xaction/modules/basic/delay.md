---
title: "等待时间"
description: "等待指定的毫秒数"
slug: "/v2/xaction/modules/delay"
sidebar_label: "等待时间"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:delay"
comments: true
moduleKey: "sys:delay"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1465639
legacyContentUpdatedAt: "2025-12-05T02:21:38.000Z"
---

# 等待时间

暂停一段时间（毫秒），再继续后面的步骤。常用来等界面切换、菜单弹出或程序启动完。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:delay" />

## 概述

<ModuleParamPreview moduleKey="sys:delay" />

## 参数说明

**等待时间**：毫秒数。实际可能多等 0～20ms。

**等待窗口关闭时取消**：配合 [等待窗口](/v2/xaction/modules/showwaitwin)，窗口被关掉就提前结束等待。仅当等待时间超过 1000ms 时生效。

## 快速操作

选中连续步骤后右键 **插入延时(_T)**：选一个步骤就插在它后面；选多个就插在它们中间。

<ContextMenuPreview
  openPath={['插入延时(_T)']}
  items={[
    {label: '复制(_C)', icon: 'fa:Light_Copy:#6aaded'},
    {label: '剪切(_X)', icon: 'fa:Light_Cut:#6aaded'},
    {type: 'separator'},
    {
      label: '插入延时(_T)',
      icon: 'fa:Light_Clock:#6aaded',
      tooltip:
        '选择一个模块，在模块后插入延时；\n选择多个模块，在模块中间插入延时；',
    },
    {
      label: '放入...(_F)',
      icon: 'fa:Light_ObjectGroup:#6aaded',
      children: [
        {label: '步骤组(_G)', icon: 'fa:Light_LayerGroup:#6aaded'},
        {label: '循环：每个(_E)', icon: 'fa:Light_Repeat:#6aaded'},
        {label: '循环：重复(_R)', icon: 'fa:Light_Repeat:#6aaded'},
        {label: '如果/否则 的 “如果” 分支(_I)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
        {label: '如果/否则 的 “否则” 分支(_F)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
        {label: '如果(_S)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
      ],
    },
    {label: '转换成子程序(_S)', icon: 'fa:Light_Cube:#6aaded'},
    {label: '运行(_R)', icon: 'fa:Light_Play:#f5b042'},
    {label: '停用/取消停用(_P)', icon: 'fa:Light_Ban:#E00000'},
  ]}
>
  <StepProgramView
    selectedIndexes={[1, 2, 3, 4]}
    data={{
      steps: [
        {key: 'sys:getWindowTitle'},
        {key: 'sys:sendMessage', note: '最大化窗口'},
        {key: 'sys:delay', inputs: {delayMs: '1000'}, note: '等待 1000 ms'},
        {key: 'sys:sendMessage', note: '最小化窗口'},
        {key: 'sys:delay', inputs: {delayMs: '1000'}, note: '等待 1000 ms'},
        {key: 'sys:sendMessage', note: '还原'},
      ],
    }}
  />
</ContextMenuPreview>

在等待时间步骤上 **Ctrl+鼠标滚轮**，按 50ms 加减。

<StepProgramView
  wheelDelay={{from: 100, to: 350, step: 50}}
  data={{
    steps: [{key: 'sys:delay', inputs: {delayMs: '100'}}],
  }}
/>

## 使用场景

- 等界面响应：切页、弹出菜单、操作做完。
- 等程序启动完再点下一步。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/showwaitwin',
      label: '等待窗口',
      description: '给用户看进度；关掉窗口可取消超过 1 秒的等待。',
    },
    {
      href: '/v2/xaction/modules/mouse',
      label: '鼠标输入',
      description: '点按之后常要垫一点延时。',
    },
  ]}
/>
