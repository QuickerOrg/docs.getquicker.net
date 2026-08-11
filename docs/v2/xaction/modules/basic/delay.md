---
title: "等待时间"
description: "等待指定的毫秒数"
slug: "/v2/xaction/modules/delay"
sidebar_label: "等待时间"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:delay"
comments: true
moduleKey: "sys:delay"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1465639
legacyContentUpdatedAt: "2025-12-05T02:21:38.000Z"
---

# 等待时间

等待指定的毫秒数

## 当前模块定义

<XActionModuleMeta moduleKey="sys:delay" />

## 概述

功能：等待一段时间（指定毫秒数）再继续后面的动作步骤。

<ModuleParamPreview moduleKey="sys:delay" />

## 参数说明

**等待时间**：要等待的毫秒数。实际等待的时间可能会存在误差（多等待0-20ms）。

**等待窗口关闭时取消**：结合“[等待窗口](/v2/xaction/modules/showwaitwin)”模块，在“等待窗口”被关闭时提前结束等待。

## 快速操作

**快速插入等待时间**

选择多个连续步骤，点击右键，选择“插入延时”即可。

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

**快速调整延时**

在步骤列表中，在“等待时间模块”上**Ctrl+鼠标滚轮**上下滚动，可以以50ms为单位快速调整等待的毫秒数。

![](./img/delay-003-d2cf99fe72.gif)

## 应用场景

-   等待界面响应前面的操作，如

-   等待界面切换
-   等待菜单弹出
-   等待操作执行完成等

-   等待程序启动完成等
