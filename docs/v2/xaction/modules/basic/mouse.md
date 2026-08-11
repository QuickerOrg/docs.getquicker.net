---
title: "鼠标输入"
description: "移动指针、点击、滚动，或按窗口/找图结果定位鼠标。"
slug: "/v2/xaction/modules/mouse"
sidebar_label: "鼠标输入"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:mouse"
comments: true
moduleKey: "sys:mouse"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1453657
legacyContentUpdatedAt: "2025-01-20T02:00:01.000Z"
---

# 鼠标输入

移动指针、点击、滚动，或按窗口、找图结果把鼠标移到目标位置。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:mouse" />

## 概述

先选 **类型**，再填该类型需要的坐标、按钮或找图参数。默认类型是 **还原鼠标位置**。

<ModuleParamPreview moduleKey="sys:mouse" />

### 屏幕坐标

主屏幕左上角是原点 `(0, 0)`。多屏时仍以**主屏**左上角为原点。X 向右增大，Y 向下增大。在下图里移动指针，可直接读出坐标。

<CoordDiagram />

## 通用参数

这些项只在部分类型下出现。

**移动后操作**：移到目标后立刻执行的点击。可选：无、左键单击、左键双击、右键单击、中键单击。

**操作完成后恢复鼠标位置**：点完后把指针移回操作前的位置。

**逐渐移动到目标**：分成多次挪过去，用来触发某些软件对“鼠标经过”的响应。

**窗口句柄**：相对窗口定位时指定目标窗口。留空或 `0` 表示前台窗口（当前有输入焦点的窗口）。句柄是 Windows 给窗口的数字，可用获取窗口类模块得到。

## 操作类型

### 还原鼠标位置

把指针送回弹出 Quicker 面板**之前**的位置。用面板点选动作时指针会先移到动作上，需要在原处点击时用这个类型。

用悬浮按钮、悬浮面板或快捷键触发时，拿不到“弹出面板前”的位置，这一步会无效。

### 移动距离

从**当前位置**平移，单位像素。X 正右负左，Y 正下负上。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'x', 'y']}
  values={{type: 'move', x: '0', y: '0'}}
/>

### 移动到（x、y 分别指定）

移到屏幕绝对坐标，X、Y 分两个参数。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'x', 'y']}
  values={{type: 'moveTo'}}
  inputVars={{x: 'x', y: 'y'}}
/>

### 移动到（x、y 一同指定）

一个文本参数写 `x,y`，例如 `100,200`。也可用百分比：`50%,50%` 是屏幕中心，`50%,100` 是水平居中、Y=100。

软件里可点坐标框右侧准星，在屏幕上点选。也可用 Snipaste 等工具读坐标。

<PreviewMarks marks={[{key: 'xy', label: '点准星，在屏幕上选取坐标'}]}>
  <ModuleParamPreview
    moduleKey="sys:mouse"
    focusKeys={['type', 'xy']}
    values={{type: 'moveToXy', xy: '2429,762'}}
  />
</PreviewMarks>

### 单击、双击、按下、抬起

在**当前指针位置**发送按键事件。按钮可选左键、右键、中键、X1、X2。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'btn']}
  values={{type: 'click', btn: 'left'}}
/>

### 滚动

对指针所在窗口发送滚轮消息。X、Y 填 click 数（通常一格滚轮 = 1 click）：

- **Y**：正值向前（向上翻），负值向后（向下翻）
- **X**：正值向右，负值向左

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'x', 'y']}
  values={{type: 'scroll', x: '0', y: '0'}}
/>

不要用悬浮按钮直接触发滚动（指针还在按钮上）。用面板触发时，若动作一开始就滚，先加[等待时间](./delay.md)等面板关掉。有的软件要循环发多次滚动才生效。

### 按下 / 松开 Ctrl、Shift

用来做「Ctrl + 点击」这类组合：先按下修饰键，再鼠标，再松开。也可以改用[按键操作](../system/keyoperation.md)。修饰键和鼠标步骤之间建议加 10ms 以上延时（键盘、鼠标不在同一消息队列）。

### 移动到窗口位置

窗口位置或大小会变、但目标相对窗口固定时用。参考点：左上、右上、左下、右下、中心。

**X** / **Y** 是相对参考点的偏移，X 正右、Y 正下。相对右下角时，偏移通常是负值才能落到窗口内。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'hWnd', 'x', 'y']}
  values={{type: 'toWinTL', hWnd: '', x: '0', y: '0'}}
/>

**移动到窗口位置：xy 一同指定** 效果相当于相对左上角，但用一个字符串：`100,200` 或 `50%,50%`（窗口中心）。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'hWnd', 'xyForWin']}
  values={{type: 'moveToWinXy', hWnd: '', xyForWin: '50%,50%'}}
/>

### 获取鼠标位置

**获取鼠标位置（弹出面板前位置）**：和「还原鼠标位置」用的是同一处坐标。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'mouseLocation', 'mouseX', 'mouseY']}
  values={{type: 'getMouseOriginPosition'}}
  outputVars={{mouseLocation: 'mouseLocation', mouseX: 'mouseX', mouseY: 'mouseY'}}
/>

**获取鼠标位置及指针类型（当前位置）**：取执行到这一步时的指针位置和形状，不是弹出面板前。

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type', 'mouseLocation', 'mouseX', 'mouseY', 'cursorType']}
  values={{type: 'getMouseCurrentPosition'}}
  outputVars={{
    mouseLocation: 'mouseLocation',
    mouseX: 'mouseX',
    mouseY: 'mouseY',
    cursorType: 'cursorType',
  }}
/>

**光标类型**常见值：Arrow（默认）、IBeam（文本）、Hand（链接）、SizeAll / SizeWE / SizeNS / SizeNESW / SizeNWSE（移动或拉伸）、Wait、Appstarting。认不出来时返回原始数字。请在目标软件里实测。

### 显示鼠标位置提示

在当前指针处播一个由小变大的水波纹，用来标位置。

<ClickIndicatorPreview />

<ModuleParamPreview
  moduleKey="sys:mouse"
  focusKeys={['type']}
  values={{type: 'showIndicator'}}
/>

## 移动到位图位置（找图）

按小图在屏幕或窗口里查找，找到后把指针移过去。位图必须和屏幕像素一致，不能压缩。

只找位置、或要自己决定怎么点，请用[屏幕找图](../image/searchbmp.md)。后续新动作也建议用那个模块。容错更高可用子程序 [屏幕找图增强版](https://getquicker.net/subprogram?id=e4af1d5b-143b-4b62-4de5-08d85ac8eddb)。

**位图路径** / **位图变量**：要找的小图。

**查找范围**：主屏幕、当前窗口、所有屏幕，或 **坐标范围**（再填 **查找坐标范围**，格式 `left,top,right,bottom`）。

**定位位置**：移到匹配区域的中间或四角。下图 A 是左上角，B 是中间。

![](./img/mouse-014-efb9812e0a.png)

**颜色容差**：每个颜色通道允许的偏差，`0`–`100`。`0` 是精确匹配，最快。默认 `10`。

**最大匹配数量**：最多处理几个匹配；每个匹配都会执行 **移动后操作**。默认 `1`。

**重试次数**：找不到时重试，每次间隔 300ms。

**X** / **Y**：在定位点上再偏移。

**失败后中止动作**：找不到是否停掉后面的步骤。默认开启。

**找图定位是否成功**：布尔输出。

<PreviewMarks
  marks={[
    {key: 'bmpVar', label: '读取截到的 img 变量'},
    {key: 'bmpTargetType', label: '在当前窗口里找'},
    {key: 'bmpPosition', label: '移到位图中间'},
    {key: 'bmpColorError', label: '0 = 精确匹配'},
    {key: 'maxFindCount', label: '最多处理 50 处'},
    {key: 'extAction', label: '找到后左键单击'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:mouse"
    values={{
      type: 'locateByBitmapVar',
      bmpVar: 'img',
      bmpTargetType: 'CurrentWindow',
      bmpPosition: 'Center',
      bmpColorError: '0',
      maxFindCount: '50',
      x: '0',
      y: '0',
      extAction: 'left',
      stopIfFail: 'false',
    }}
    outputVars={{isSuccess: 'imgTrue'}}
  />
</PreviewMarks>

### 示例：截图后点击匹配位置

先截一块图存进 `img`，再循环找图并点击。参考 [分享动作](https://getquicker.net/sharedaction?code=95efcbcf-0333-4e72-0086-08d6b398dbc5)。

<StepProgramView
  showVariables
  data={{
    steps: [
      {
        key: 'sys:screenCapture',
        note: '截图后位图存入 img 变量',
        outputs: {img: 'img'},
      },
      {
        key: 'sys:repeat',
        inputs: {count: '10'},
        ifSteps: [
          {key: 'sys:delay', inputs: {delayMs: '100'}},
          {
            key: 'sys:mouse',
            note: '找到截图位置并点击',
            inputs: {
              type: 'locateByBitmapVar',
              bmpVar: 'img',
              bmpTargetType: 'CurrentWindow',
              bmpPosition: 'Center',
              extAction: 'left',
            },
            outputs: {isSuccess: 'imgTrue'},
          },
          {
            key: 'sys:assign',
            note: '判断是否找图成功',
            inputs: {input: '{imgTrue}'},
            outputs: {output: 'found'},
          },
        ],
      },
      {key: 'sys:notify'},
    ],
  }}
/>

## 限制与排障

- 滚动只作用在指针所在窗口。悬浮按钮触发时指针还在按钮上，滚动会打偏。
- Ctrl/Shift + 鼠标时，键盘步骤和鼠标步骤之间加 10ms 以上延时。
- 「还原 / 获取弹出面板前位置」依赖面板触发；快捷键、悬浮按钮没有这个坐标。
- 找图对压缩、缩放、主题变化敏感；对不上就加大容差，或改用[屏幕找图](../image/searchbmp.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/searchbmp',
      label: '屏幕找图',
      description: '只定位图片或颜色，不强制移动鼠标。',
    },
    {
      href: '/v2/xaction/modules/keyoperation',
      label: '按键操作',
      description: '单独按下或抬起 Ctrl / Shift，再配合点击。',
    },
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '等面板关掉，或隔开键盘与鼠标消息。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '截一块图供「移动到位图位置」使用。',
    },
  ]}
/>
