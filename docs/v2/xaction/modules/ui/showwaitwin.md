---
title: "显示等待窗口"
description: "弹出等待窗口，让用户点按钮继续、看进度或中止动作。"
slug: "/v2/xaction/modules/showwaitwin"
sidebar_label: "显示等待窗口"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:showWaitWin"
comments: true
moduleKey: "sys:showWaitWin"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1377039
legacyContentUpdatedAt: "2025-03-13T03:07:54.000Z"
---

# 显示等待窗口

弹出一个等待窗口：让用户标明「可以继续了」、提前结束等待，或看进度、中止动作。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:showWaitWin" />

## 概述

常见用法：循环复制时等用户点「开始粘贴」；配合 [等待时间](/v2/xaction/modules/delay)、[等待剪贴板变化](/v2/xaction/modules/waitclipboardchange) 让用户提前结束。

<WaitWinPreview
  title="完成后继续"
  message="完成复制操作后，点按钮开始粘贴"
  progress="44/100"
  buttons={['继续']}
/>

点窗口下部按钮会关窗。点右上角 × 会询问是否终止当前动作。

<ModuleParamPreview
  moduleKey="sys:showWaitWin"
  values={{
    mode: 'show',
    title: '完成后继续',
    prompt: '这里是一个循环，可以点击按钮提前中止',
    btnText: '结束循环',
    winLocation: 'BottomCenter',
    progress: '$${count}/100',
    operations: '暂停\n取消',
  }}
/>

## 参数说明

**操作**：

- **显示窗口**：弹出等待窗口。
- **更新窗口**：改标题、提示、按钮和进度。
- **检查是否关闭**：返回窗口是否已被点关。
- **关闭窗口(如果还开着的话)**：关掉窗口。
- **等待用户关闭**：等到用户关窗再继续。
- **显示窗口并等待用户关闭**：先显示再等待。

仅「显示窗口」「更新窗口」「显示窗口并等待用户关闭」时有下面这些外观参数。

**窗口标题**：标题栏文字。

**提示文字**：按钮上方的说明。

**默认按钮上的文字**：默认按钮文案。空则隐藏默认按钮。点默认按钮或附加按钮都会关窗。

**窗口位置**：屏幕各方位、跟随鼠标，或「上次的位置」（同一动作里再次弹出时，跟着手动拖过的位置）。

**进度条参数**：`当前值/最大值`，如 `90/100`。空则不显示。前面加负号表示倒数：`-10/100` 显示为 90%。

**附加操作按钮**：每行一个按钮，格式与 [用户选择](/v2/xaction/modules/userselect) 的选项相同，排在默认按钮左侧。

<WaitWinPreview
  title="完成后继续"
  message="请在完成操作后点下面的按钮"
  buttons={['aaa', 'bbb', 'ccc', '完成']}
/>

按钮文字可用 `[fa:Light_Pen:#99AAFF]标题(Tooltip)`（1.5.21+）。

**图标大小**：按钮图标逻辑像素，默认 16。

**文字大小**：按钮文字逻辑像素，默认 12。

**关闭窗口时（点右上角x按钮）后停止动作**：点 × 后是否停动作。默认开启。仅显示 / 显示并等待。

**自动关闭**：几秒后自动关。`0` 表示不自动关。仅显示 / 显示并等待。

**激活模式**（仅显示 / 显示并等待）：

- **不支持激活（不占用焦点，仅能使用鼠标操作）**
- **支持激活，打开时不抢占焦点**
- **支持激活，打开时抢占焦点**（会让之前的窗口失去焦点）

**帮助按钮内容**：Markdown。点帮助按钮弹出。仅显示 / 显示并等待。

## 输出

仅「检查是否关闭」「等待用户关闭」「显示窗口并等待用户关闭」时有输出。

<ModuleParamPreview
  moduleKey="sys:showWaitWin"
  focusKeys={['mode', 'isClosed', 'selectedOperation']}
  values={{mode: 'check'}}
  outputVars={{isClosed: 'isClosed', selectedOperation: 'selectedOperation'}}
/>

- **是否已关闭**：仅「检查是否关闭」。用户是否点了按钮关窗。
- **选择的按钮**：点了哪个附加按钮。点默认按钮则返回空。

## 结合其他模块

[等待时间](/v2/xaction/modules/delay) 打开「等待窗口关闭时取消」后，关掉等待窗口就会提前结束等待（等待须超过 1000ms）。[等待剪贴板变化](/v2/xaction/modules/waitclipboardchange) 同样可以提前结束。

<ModuleParamPreview
  moduleKey="sys:delay"
  focusKeys={['delayMs', 'monitorWaitWin']}
  values={{delayMs: '10000', monitorWaitWin: 'true'}}
/>

## 通常用法

1. 循环前用「显示窗口」。
2. 循环里需要时「更新窗口」；要判断用户是否点了按钮就「检查是否关闭」，再决定是否跳出。
3. 结束时「关闭窗口」。

## 示例动作

<StepProgramView example="80427a4f-78c4-4fc5-7b1a-08d6a9169e61" />

<ShareLinkCard
  code="80427a4f-78c4-4fc5-7b1a-08d6a9169e61"
  title="示例: 等待窗口"
  description="用于演示等待窗口模块的使用"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '可在等待窗口关掉时提前结束。',
    },
    {
      href: '/v2/xaction/modules/waitclipboardchange',
      label: '等待剪贴板变化',
      description: '同样可用等待窗口提前结束。',
    },
    {
      href: '/v2/xaction/modules/reportprogress',
      label: '显示进度条',
      description: '只要进度、不要按钮时用这个。',
    },
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '附加按钮的选项格式与这里相同。',
    },
  ]}
/>
