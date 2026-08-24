---
title: "按键操作"
description: "单个键盘按键的操作控制或状态获取"
slug: "/v2/xaction/modules/keyoperation"
sidebar_label: "按键操作"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:keyoperation"
comments: true
moduleKey: "sys:keyoperation"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 3663420
legacyContentUpdatedAt: "2022-06-16T07:03:48.000Z"
---

# 按键操作

读取单个键盘或鼠标键的按下、锁定状态，或按下 / 抬起某个键。要连续发送一串按键，用 [模拟按键B](/v2/xaction/modules/sendkeys)；要等用户按某键，用 [等待按键](/v2/xaction/modules/waitkeyboard)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:keyoperation" />

## 概述

常见用途：动作开头根据是否按住某键切换功能；读 CapsLock 再设成需要的状态；模拟一直按住某个键。

<ModuleParamPreview moduleKey="sys:keyoperation" />

## 参数说明

**类型**：获取按键状态、按下按键、抬起按键、按下 Quicker 虚拟键 V1、抬起 Quicker 虚拟键 V1。按下和抬起需要配对。

**按键**：要读取或操作的单个键名或虚拟键码。获取状态时可用鼠标键；要发送真实鼠标事件，用 [鼠标输入](/v2/xaction/modules/mouse)。键名说明见 [等待按键](/v2/xaction/modules/waitkeyboard)。获取按键状态、按下、抬起时显示。

**获取按键的实际状态（在远程时无法获取）**：仅 **获取按键状态**。默认关闭。

**保持按下时间**：仅 **按下 Quicker 虚拟键 V1**。保持按下的毫秒数，到期自动抬起。默认 `1000`。

## 输出

仅 **获取按键状态**：

- **是否按下**：该键是否处于按下状态。
- **是否锁定**：是否处于锁定状态，仅对 CapsLock、NumLock 等有效。

## 限制与排障

若该键被设成扩展热键，或被 Quicker 用作触发功能的鼠标键，按键消息会被拦截，本模块会读不到。只检测没有被 Quicker 特殊处理的键。远程桌面里「实际状态」可能拿不到。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B',
      description: '发送一串按键或热键。',
    },
    {
      href: '/v2/xaction/modules/waitkeyboard',
      label: '等待按键',
      description: '等用户按下指定键再继续。',
    },
    {
      href: '/v2/xaction/modules/mouse',
      label: '鼠标输入',
      description: '发送真实鼠标移动或点击。',
    },
  ]}
/>
