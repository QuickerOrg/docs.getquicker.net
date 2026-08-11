---
title: "提示消息"
description: "在桌面显示一条可自动消失的提示，不打断动作。"
slug: "/v2/xaction/modules/notify"
sidebar_label: "提示消息"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:notify"
comments: true
moduleKey: "sys:notify"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1530071
legacyContentUpdatedAt: "2022-07-01T09:39:34.000Z"
---

# 提示消息

在桌面弹出一条提示，到点自己消失，动作不用等用户点确定。需要用户明确选「是 / 否」时用 [弹窗提示或确认](/v2/xaction/modules/msgbox)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:notify" />

## 概述

默认出现在屏幕底部居中。

<NotifyToastPreview message="你好，感谢你使用Quicker!" />

<ModuleParamPreview
  moduleKey="sys:notify"
  values={{
    type: 'Info',
    msg: 'Hello Quicker!',
    maxLines: '0',
    placement: 'BottomCenter',
    clickAction: 'https://getquicker.net',
  }}
/>

## 参数说明

**类型**：信息、成功、告警、错误（颜色不同），或 **Windows 通知 (win10+)**。

**消息内容**：要显示的文字。

**标题**：留空用动作名；填 `-` 不显示标题；其他文字原样显示。

**显示位置**：底部居中、四角、顶/底居中。仅成功 / 信息 / 告警 / 错误。

底部居中：

<NotifyToastPreview
  message={"Hello Quicker!\nHello Quicker!\n..."}
  maxLines={3}
/>

右上角卡片：

<NotifyToastPreview
  styleVariant="card"
  message={"Hello Quicker!Hello Quicker!Hello Quicker!\nHello Quicker!Hello Quicker!Hello Quicker!\nHello Quicker!\n..."}
  maxLines={4}
/>

**最大行数**：按换行计。`0` 不限制。

**保持秒数**：`0` 用默认时长，`-1` 一直显示，或填 2～30 秒。

**显示时间**：有标题时在右上角显示发出时间；无标题的紧凑条不显示。

**重复控制**：留空则每次都出一条新的。填标识可复用同一条：`replace:标识` 换内容，`count:标识` 累计次数，`ignore:标识` 忽略后续重复。只写标识时按 `replace` 处理。

**点击操作**：普通文本当作整卡点击命令（要能在 Win+R 里执行，常用来打开网址）。以独立首行 `@button` / `@buttons` 开头时定义一到两个按钮。留空则点击复制正文。

## 限制与排障

个别情况下提示可能不出现，重启 Quicker 后一般能恢复。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/msgbox',
      label: '弹窗提示或确认',
      description: '要用户点按钮再继续时用这个。',
    },
    {
      href: '/v2/xaction/modules/run',
      label: '运行或打开',
      description: '点击操作里的命令，和 Win+R 同一套。',
    },
  ]}
/>
