---
title: "屏幕取色/颜色转换与计算"
description: "从文本、屏幕或调色板取得颜色，并输出各通道和指定格式的文本。"
slug: "/v2/xaction/modules/color"
sidebar_label: "屏幕取色/颜色转换与计算"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:color"
comments: true
moduleKey: "sys:color"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 3996714
legacyContentUpdatedAt: "2020-04-02T03:19:32.000Z"
---

# 屏幕取色/颜色转换与计算

获取或编辑颜色，并返回各通道的值和指定格式的文本。1.3.10 起提供。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:color" />

## 概述

先选 **类型**，再按类型填颜色文本或坐标。

<ModuleParamPreview moduleKey="sys:color" />

## 参数说明

**类型**：

- **通过文本指定颜色**：按颜色文本解析。
- **从屏幕选取颜色**：运行时用小方框从屏幕上点选。
- **取屏幕指定位置颜色**：按 **坐标** 取色。
- **编辑/选择颜色**：弹出调色板，可改色或用吸管。

**颜色**：仅「通过文本指定颜色」「编辑/选择颜色」。支持：

- HTML：`#RGB`、`#RRGGBB`
- ARGB：`#AARRGGBB`
- 颜色名：`Red`
- `rgb(10,20,30)` / `rgba(10,20,30,0.5)`
- `CMYK(0,0,0,0)` 或 `CMYK:0,0,0,0`

**坐标**：仅「取屏幕指定位置颜色」。格式 `横坐标X,纵坐标Y`，如 `0,0`。

**输出文本格式**：控制 **文本值** 的格式。点开下拉看当前全部选项，例如十六进制 RGB/ARGB、`rgb`/`rgba`、逗号分隔、浮点、Swift、CMYK、HSL/HSV。

**失败后停止**：失败是否中止动作。默认开启。旧稿未写。

### 编辑/选择颜色

弹出颜色选择窗口，并预先选中当前颜色。可在窗口里调色，或用吸管从别处取色。

![编辑或选择颜色操作](./img/color-002-efae8e7c2b.gif)

### 从屏幕选择颜色

显示一个小方框，按下后开始从屏幕上选颜色。

![从屏幕选择颜色](./img/color-003-6bd4fc7342.gif)

## 输出

- **是否成功**：操作是否成功。旧稿未写。
- **透明度值**：Alpha，0–255，0 为全透明。
- **红色值** / **绿色值** / **蓝色值**：0–255。
- **色相**：Hue，0–360。
- **HSL.S** / **HSL.L**：HSL 饱和度、亮度。
- **HSV.S** / **HSV.V**：HSV 饱和度、明度。
- **文本值**：按 **输出文本格式** 写出的颜色文本。

## 限制与排障

取屏幕颜色依赖当前显示器上的像素，窗口被挡住或坐标越界会取到别的颜色。颜色文本格式不对时步骤会失败，先对照上面列出的写法。

## 示例动作

<StepProgramView example="a6aaa916-9fea-4355-fbd4-08d7cd418588" />

<ShareLinkCard
  code="a6aaa916-9fea-4355-fbd4-08d7cd418588"
  title="编辑颜色"
  description="选择颜色"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/mouse',
      label: '鼠标',
      description: '先移动到目标位置，再按坐标取色。',
    },
  ]}
/>
