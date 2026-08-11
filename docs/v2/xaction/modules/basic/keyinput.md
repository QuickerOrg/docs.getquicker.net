---
title: "模拟按键A（录入）"
description: "向当前窗口发送一组固定的键盘按键或快捷键。"
slug: "/v2/xaction/modules/keyinput"
sidebar_label: "模拟按键A（录入）"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:keyInput"
comments: true
moduleKey: "sys:keyInput"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1529913
legacyContentUpdatedAt: "2024-11-20T14:47:06.000Z"
---

# 模拟按键A（录入）

向当前窗口发送一组**固定**的键盘按键（快捷键）。内容要随变量变化，或需要按键序列时，用[模拟按键B（参数）](./sendkeys.md)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:keyInput" />

## 概述

添加步骤后点 **录制**，再在键盘上按下要模拟的组合；也可以点 **...** 从列表里选。

<PreviewMarks
  marks={[{key: 'keys', label: '点录制后，在键盘上输入按键'}]}
>
  <ModuleParamPreview
    moduleKey="sys:keyInput"
    values={{keys: '{"CtrlKeys":[164],"Keys":[72]}'}}
  />
</PreviewMarks>

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:keyInput',
        note: 'LeftAlt+ [ H ]',
        inputs: {keys: '{"CtrlKeys":[164],"Keys":[72]}'},
      },
    ],
  }}
/>

## 参数说明

**按键**：要模拟的组合。文档预览里也可以点 **录制** 试一下（Esc 取消）。

**重复次数**：连续发送几次。默认 `1`。

**重复间隔(毫秒)**：两次重复之间的间隔。默认 `1`。

**保持毫秒数**：普通键（非 Ctrl / Alt / Shift / Win）在抬起前按住的时间。`-1` 表示用软件默认。某些软件直接模拟无效时，可以加大这个值。

<ModuleParamPreview
  moduleKey="sys:keyInput"
  focusKeys={['holdMs']}
  values={{keys: '{"CtrlKeys":[164],"Keys":[72]}', holdMs: '50'}}
/>

## 限制与排障

- 可能受输入法影响。效果不对时，先把输入法切到英文。
- 发送前先确保目标窗口已就绪；必要时在前后加[等待时间](./delay.md)。
- 本模块不支持鼠标按键。
- 部分软件用了特殊快捷键机制，模拟可能无效。可以：
  - 改用[模拟按键B（参数）](./sendkeys.md)
  - 用[按键操作](../system/keyoperation.md)分别模拟按下和抬起，中间加一点延时

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B（参数）',
      description: '用文本参数发送可变的按键序列。',
    },
    {
      href: '/v2/xaction/modules/keyoperation',
      label: '按键操作',
      description: '单独按下或抬起某个键。',
    },
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '在模拟按键前后留出窗口响应时间。',
    },
  ]}
/>
