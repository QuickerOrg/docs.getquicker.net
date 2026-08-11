---
title: "注释"
description: "使用注释将步骤分组，描述后续步骤的目的。"
slug: "/v2/xaction/modules/comment"
sidebar_label: "注释"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:comment"
comments: true
moduleKey: "sys:comment"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1530519
legacyContentUpdatedAt: "2023-04-02T13:16:49.000Z"
---

# 注释

在步骤列表里插入一段说明文字。运行时什么也不做，只给自己或别人看：后面一组步骤干什么、怎么按需改、以后改动作时要注意什么。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:comment" />

## 概述

注释夹在步骤中间，把前后步骤隔开，并写清这一段在干什么。步骤组也可以用来折叠、整体停用；注释更适合写说明。

<StepProgramView
  selectedIndexes={[1]}
  data={{
    steps: [
      {key: 'sys:group', note: '传统截图步骤'},
      {
        key: 'sys:comment',
        note: '平时不用QQ等截图工具的可启用下方Quicker截图步骤，并停用传统截图步骤。此功能需要0.10.3以上版本支持。',
      },
      {key: 'sys:group', note: 'Quicker自带截图', disabled: true},
      {
        key: 'sys:imgToBase64',
        inputs: {type: 'imgToBase64', img: '{img}'},
        outputs: {code: 'context'},
      },
    ],
  }}
/>

## 参数说明

<ModuleParamPreview
  moduleKey="sys:comment"
  values={{note: '要备注的内容\n可以多行'}}
/>

**注释内容**：显示在步骤行上的文字，可以多行。也可以绑变量；绑了变量时，不能靠右键「步骤颜色」改颜色，要在变量值前面加颜色标记（见下）。

## 右键运行打开网址

只选中**一条**注释，并且注释里有网址时，右键 **运行(_R)** 会打开注释里的每个网址（不是去「运行」这条空步骤）。多选、或注释里没有网址时，就是普通的「运行选中的步骤」。

<ContextMenuPreview
  openPath={['运行(_R)']}
  items={[
    {label: '复制(_C)', icon: 'fa:Light_Copy:#6aaded'},
    {label: '剪切(_X)', icon: 'fa:Light_Cut:#6aaded', tooltip: '剪切选中的步骤'},
    {type: 'separator'},
    {
      label: '插入延时(_T)',
      icon: 'fa:Light_Clock:#6aaded',
      tooltip: '选择一个模块，在模块后插入延时;选择多个模块，在模块中间插入延时;',
    },
    {
      label: '放入...(_F)',
      icon: 'fa:Light_ObjectGroup:#6aaded',
      children: [
        {label: '步骤组(_G)', icon: 'fa:Light_LayerGroup:#6aaded', tooltip: '快捷键：Ctrl+G'},
        {label: '循环：每个(_E)', icon: 'fa:Light_Repeat:#6aaded'},
        {label: '循环：重复(_R)', icon: 'fa:Light_Repeat:#6aaded', tooltip: '快捷键：Ctrl+R'},
        {label: '如果/否则 的 “如果” 分支(_I)', icon: 'fa:Light_ProjectDiagram:#6aaded', tooltip: '快捷键：Ctrl+I'},
        {label: '如果/否则 的 “否则” 分支(_F)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
        {label: '如果(_S)', icon: 'fa:Light_ProjectDiagram:#6aaded', tooltip: '快捷键：Ctrl+Shift+I'},
      ],
    },
    {label: '转换成子程序(_S)', icon: 'fa:Light_Cube:#6aaded'},
    {
      label: '运行(_R)',
      icon: 'fa:Light_Play:#f5b042',
      tooltip: '运行选中的步骤，Shift+点击以调试方式运行',
    },
    {
      label: '步骤颜色(_C)',
      icon: 'fa:Light_Palette:#6aaded',
      children: [
        {label: '红色', icon: 'fa:Solid_Circle:#d92d20'},
        {label: '黄色', icon: 'fa:Solid_Circle:#b7791f'},
        {label: '绿色', icon: 'fa:Solid_Circle:#1f7a3f'},
        {label: '蓝色', icon: 'fa:Solid_Circle:#2563eb'},
        {label: '灰色', icon: 'fa:Solid_Circle:#6b7280'},
        {type: 'separator'},
        {label: '自定义背景色...', icon: 'fa:Light_Palette:#6aaded'},
        {label: '清除颜色', icon: 'fa:Light_Eraser:#f75800'},
      ],
    },
    {label: '停用/取消停用(_P)', icon: 'fa:Light_Ban:#E00000'},
    {label: '删除(_D)', icon: 'fa:Light_TrashAlt:#E00000'},
    {type: 'separator'},
    {
      label: '查看模块文档(_Q)',
      icon: 'fa:Light_QuestionCircle:#6aaded',
      tooltip: '打开模块文档网页',
    },
    {
      label: '高亮相似步骤(_H)',
      icon: 'fa:Light_Highlighter:#FF3333',
      tooltip: '高亮相同模块的步骤',
    },
  ]}
>
  <StepProgramView
    selectedIndexes={[0]}
    data={{
      steps: [
        {key: 'sys:comment', note: '来自 https://getquicker.net/QA 问题'},
        {key: 'sys:showWaitWin', disabled: true, inputs: {mode: 'show'}},
        {key: 'sys:notify', disabled: true, inputs: {msg: 'ik'}},
        {
          key: 'sys:repeat',
          disabled: true,
          inputs: {count: '30', repeatDelayMs: '1m'},
          ifSteps: [
            {
              key: 'sys:runAction',
              inputs: {type: 'StartAction', actionId: '压缩截图'},
            },
          ],
        },
        {key: 'sys:notify', disabled: true, inputs: {msg: 'okkokk'}},
        {
          key: 'sys:screenCapture',
          disabled: true,
          inputs: {type: 'select'},
          outputs: {img: 'bmp'},
        },
        {
          key: 'sys:basic-ocr',
          disabled: true,
          inputs: {operation: 'QuickerServerOcr'},
        },
        {
          key: 'sys:tempImgBed',
          disabled: true,
          inputs: {imgVar: 'bmp'},
        },
      ],
    }}
  />
</ContextMenuPreview>

## 步骤颜色

右键 **步骤颜色(_C)** 可以给这一行加上预设底色，方便在长列表里扫一眼分区。设计器会在注释开头写入标记；列表里只显示后面的正文，不显示标记本身。

| 菜单 | 写入注释开头的标记 |
| --- | --- |
| 红色 / 黄 / 绿 / 蓝 / 灰 | `[tint:red]`、`[tint:yellow]`、`[tint:green]`、`[tint:blue]`、`[tint:gray]` |
| 自定义背景色 | `[#RRGGBB]`，也可以 `[#背景色,#文字色]` |
| 清除颜色 | 去掉开头的 `[…]` 标记 |

`grey` 和 `gray` 一样。注释内容绑了变量时，把同样的标记写在变量值最前面。

<StepProgramView
  data={{
    steps: [
      {key: 'sys:comment', note: '[tint:red]红色'},
      {key: 'sys:comment', note: '[tint:yellow]黄色'},
      {key: 'sys:comment', note: '[tint:green]绿色'},
      {key: 'sys:comment', note: '[tint:blue]蓝色'},
      {key: 'sys:comment', note: '[tint:gray]灰色'},
      {key: 'sys:comment', note: '[#dbeafe]自定义背景色'},
    ],
  }}
/>

## 限制与排障

- 注释步骤本身不执行任何操作，不能用来「跳过」或「停止」后面的步骤。要整体关掉一段逻辑，用步骤组并停用该组。
- 右键打开网址只在**单选一条注释**且注释里能解析出网址时生效。
- 颜色标记必须写在注释**最开头**，格式是 `[tint:颜色]` 或 `[#十六进制]`。写在中间或用别的前缀不会变色。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/group',
      label: '步骤组',
      description: '把相关步骤收成一组，方便整体停用或删除。',
    },
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '同一右键菜单里可以给选中步骤插入延时。',
    },
    {
      href: '/v2/xaction/modules/subprogram',
      label: '子程序',
      description: '可以把选中步骤转换成子程序。',
    },
  ]}
/>
