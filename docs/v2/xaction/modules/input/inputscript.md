---
title: "多步骤输入"
description: "多步骤键盘组合输入"
slug: "/v2/xaction/modules/inputscript"
sidebar_label: "多步骤输入"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:inputScript"
comments: true
moduleKey: "sys:inputScript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 60667217
legacyContentUpdatedAt: "2025-02-20T23:53:47.000Z"
---

# 多步骤输入

用一小段脚本来连续模拟键盘、鼠标和粘贴。适合短串操作；运行中不能中途停止，不要塞太多步。单步按键用 [模拟按键B](/v2/xaction/modules/sendkeys)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:inputScript" />

## 概述

<ModuleParamPreview
  moduleKey="sys:inputScript"
  values={{
    data: 'input:hello\ndelay:200\nhotkey:Ctrl+A',
  }}
/>

## 参数说明

**步骤脚本**：每行一条指令。`//` 开头是注释。格式为 `命令:参数`。没法换行时，可用 `;;` 表示换行（1.36.17+）。

**失败后停止**：出错后是否中止动作。默认开启。

### 键盘命令

- **input**：模拟键入纯文本（不受输入法影响）。如 `input:hello world，你好 世界`。
- **input2**（1.30.0+）：纯文本，支持转义。`\t` 是 Tab，`\r\n` 是换行。
- **sendkeys**：按 [模拟按键B](/v2/xaction/modules/sendkeys) 语法。如 `sendkeys:{LEFT 2}`。
- **delay**：等待毫秒。如 `delay:1000`。
- **paste**：写入剪贴板后模拟 Ctrl+V。如 `paste:hello world`。
- **keydown** / **keyup** / **keypress**：按下、抬起、点按。如 `keydown:F1`，或 `keydown:#175`（`#` + 键值）。keydown 必须配对 keyup。键名见 [Keys 枚举](https://docs.microsoft.com/zh-cn/dotnet/api/system.windows.forms.keys?view=net-5.0)。
- **hotkey**：组合键。如 `hotkey:Ctrl+S`。数字键写成 `D` + 数字，如 `hotkey:Ctrl+Alt+D1`。

### 鼠标命令（1.28.16+）

- **moveto**：移到绝对坐标。`moveto:100,200`。1.30.0+ 支持百分比，`moveto:50%,50%` 是主屏中心。
- **move**：相对移动。`move:10,-10` 向右、向上各 10 像素。
- **click** / **dbclick** / **down** / **up**：按键名为 `left` / `right` / `middle` / `x1` / `x2`。按下和抬起必须配对。
- **wheel** / **wheeldelta**：垂直滚动。正值远离用户（内容向下），负值朝向用户。`wheel` 单位是 click（行），`wheeldelta` 是 1/120 click。
- **hwheel** / **hwheeldelta**：水平滚动。正值内容向左，负值向右。

### 组合命令（1.28.12+）

- **pastefile**：把文件放进剪贴板后 Ctrl+V。多个路径用英文分号：`pastefile:d:\test1.png;d:\test2.txt`。
- **pasteimage**：读图片文件为图片对象再粘贴（不是粘贴文件）。只支持一张：`pasteimage:d:\test.png`。

## 输出

- **是否成功**：脚本是否跑完。

## 限制与排障

- 步骤运行中不支持停止，不适合放大量步骤。
- `down` / `keydown` 必须配对抬起，否则按键会卡住。

## 辅助动作

生成脚本用下面的分享动作，不必手写每行：

<ShareLinkCard
  code="82678afc-219e-4e63-a7d1-08dd5143284a"
  title="多步骤生成"
  description="通过拖拽的方式快速生成多步骤脚本"
  author="IDongYou"
/>

<ShareLinkCard
  code="52e0112f-076d-4347-df18-08d9db64e6a1"
  title="多步骤生成器"
  description="辅助编写多步骤输入模块。"
  author="EC10010"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/automationscript',
      label: '自动化脚本',
      description: '需要循环、坐标数组、热键、提示消息或文本剪贴板时使用。',
    },
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B',
      description: 'sendkeys 命令用同一套语法。',
    },
    {
      href: '/v2/xaction/modules/keyinput',
      label: '模拟按键',
      description: '单步按键、组合键。',
    },
    {
      href: '/v2/xaction/modules/mouse',
      label: '鼠标操作',
      description: '单步移动、点击、滚轮。',
    },
  ]}
/>

## 更新历史

- 20230219 增加 hotkey 中使用数字键的说明。
- 20250221 增加新的辅助动作链接。
