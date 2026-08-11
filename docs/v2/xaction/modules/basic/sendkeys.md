---
title: "模拟按键B（参数）"
description: "用文本参数向当前窗口发送按键序列，可用变量或插值。"
slug: "/v2/xaction/modules/sendkeys"
sidebar_label: "模拟按键B（参数）"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:sendKeys"
comments: true
moduleKey: "sys:sendKeys"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1986707
legacyContentUpdatedAt: "2025-09-19T04:54:11.000Z"
---

# 模拟按键B（参数）

用**文本**向当前窗口发送按键序列。内容可以来自变量或插值，适合动态组合。固定快捷键用[模拟按键A（录入）](./keyinput.md)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:sendKeys" />

## 概述

把一段 SendKeys 字符串发给前台窗口。和 A 的差别：

- **A（录入）**：在步骤里录制或点选一组固定按键。
- **B（参数）**：按键写在文本里，可以 `{变量}` 插值，也可以和其他步骤拼出不同序列。

内部使用 .NET 的 `SendKeys.SendWait`（Quicker 做了兼容处理）。语法与 [Microsoft 文档](https://learn.microsoft.com/dotnet/api/system.windows.forms.sendkeys) 一致。

<ModuleParamPreview
  moduleKey="sys:sendKeys"
  values={{keys: '^c'}}
/>

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:sendKeys',
        note: 'Ctrl+C',
        inputs: {keys: '^c'},
      },
    ],
  }}
/>

## 参数说明

**按键序列**：要发送的字符串。留空则不发送。软件里可点参数右侧工具从键盘选择；文档预览是普通文本框。

<ModuleParamPreview
  moduleKey="sys:sendKeys"
  focusKeys={['keys']}
  values={{keys: 'Hello~Next line'}}
/>

## 语法

### 要点

| 写法 | 含义 |
| --- | --- |
| `^` | Ctrl |
| `+` | Shift |
| `%` | Alt |
| 普通字母、数字 | 用**小写**，如 `^c` 表示 Ctrl+C |
| `{键名}` | 特殊键，见下表 |
| `{键名 次数}` | 重复。键名和次数之间有一个空格，如 `{LEFT 10}` |

不支持 Win 键，以及 F17–F24、媒体键等。

### 普通字符与转义

普通字符按原样发送：`a` 发 a，`abc` 发三个字符。

这些字符有特殊含义，要发字面量时必须包在大括号里：`+` `^` `%` `~` `(` `)` 分别写成 `{+}` `{^}` `{%}` `{~}` `{(}` `{)}`。`[` `]` 本身无特殊含义，但仍要写成 `{[}` `{]}`。字面量的大括号写成 `{{}` 和 `{}}`。

### 特殊键

| 按键 | 代码 |
| --- | --- |
| Win | 底层 API **不支持** |
| Backspace | `{BACKSPACE}`、`{BS}` 或 `{BKSP}` |
| Break | `{BREAK}` |
| Caps Lock | `{CAPSLOCK}` |
| Delete | `{DELETE}` 或 `{DEL}` |
| ↓ | `{DOWN}` |
| End | `{END}` |
| Enter | `{ENTER}` 或 `~` |
| Esc | `{ESC}` |
| Help | `{HELP}` |
| Home | `{HOME}` |
| Insert | `{INSERT}` 或 `{INS}` |
| ← | `{LEFT}` |
| Num Lock | `{NUMLOCK}` |
| Page Down | `{PGDN}` |
| Page Up | `{PGUP}` |
| Print Screen | `{PRTSC}`（预留，通常无效） |
| → | `{RIGHT}` |
| Scroll Lock | `{SCROLLLOCK}` |
| Tab | `{TAB}` |
| ↑ | `{UP}` |
| F1–F16 | `{F1}` … `{F16}` |
| 小键盘 + − × ÷ | `{ADD}` `{SUBTRACT}` `{MULTIPLY}` `{DIVIDE}` |

### 组合与分组

要在按住 Shift / Ctrl / Alt 的同时按其他键，把修饰符写在前面：

| 代码 | 含义 |
| --- | --- |
| `^c` | Ctrl+C |
| `+p` | Shift+P |
| `%p` | Alt+P |
| `^+s` | Ctrl+Shift+S |
| `+(ec)` | 按住 Shift，依次按 E、C |
| `^(kc)` | 按住 Ctrl，依次按 K、C |
| `^kc` | 先 Ctrl+K，松开后再按 C |

大小写可能影响结果（`^s` 和 `^S` 不一定一样）。改完后请在目标软件里实测。

### 示例

| 代码 | 效果 |
| --- | --- |
| `^p` | Ctrl+P |
| `Hello~New Line` | 输入 Hello，回车，再输入 New Line |
| `中文字符` | 按字符发送中文（更易受输入法影响） |
| `{LEFT 10}` | ← 十次 |
| `{h 10}` | H 十次 |

## 限制与排障

- 可能受输入法影响。效果不对时，先切到英文，或在前面加[输入法状态](../system/imecontrol.md)切到英文。
- 发送前确保目标窗口已就绪；必要时在前后加[等待时间](./delay.md)。
- 不支持鼠标按键，也不支持 Win 键。
- 语法无效时步骤失败，提示「发送按键出错。」加具体原因。
- 需要不受输入法影响的纯文本，用[多步骤输入](../input/inputscript.md)的 `input:`。
- 只要一组固定快捷键，用[模拟按键A（录入）](./keyinput.md)。
- 要单独按下或抬起某个键，用[按键操作](../system/keyoperation.md)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/keyinput',
      label: '模拟按键A（录入）',
      description: '录制一组固定按键，不能随变量变化。',
    },
    {
      href: '/v2/xaction/modules/imecontrol',
      label: '输入法状态',
      description: '发送前切到英文，减少输入法干扰。',
    },
    {
      href: '/v2/xaction/modules/inputscript',
      label: '多步骤输入',
      description: 'input: 可键入不受输入法影响的纯文本。',
    },
    {
      href: '/v2/xaction/modules/keyoperation',
      label: '按键操作',
      description: '单独按下或抬起某个键。',
    },
  ]}
/>
