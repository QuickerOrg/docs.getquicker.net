---
title: "提示消息"
description: "显示可以自动消失的消息提示。"
slug: "/v2/xaction/modules/notify"
sidebar_label: "提示消息"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:notify"
comments: true
moduleKey: "sys:notify"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
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

### 点击操作

这个参数有三种填写方式：

1. **留空**：对于“成功 / 信息 / 告警 / 错误”通知，点击通知会复制“消息内容”。Windows 通知留空时没有点击操作。
2. **填写普通文本**：点击整条通知时执行该文本。写法与在 Windows 的“运行”（Win+R）中输入命令相同，可填写网址、文件或文件夹路径、程序路径、系统命令等。例如：

   ```text
   https://getquicker.net
   ```

   如果填写多行，每个非空行都会作为一条命令执行。

3. **显示操作按钮**：第一行单独填写 `@button` 或 `@buttons`，从第二行开始每行定义一个按钮。两个标记的效果相同，均可定义 **1～2 个**按钮；使用按钮模式后，只有按钮可以操作，点击通知卡片本身不会再执行命令或复制正文。

按钮行的基本格式为：

```text
按钮文字|operation=操作类型&data=操作数据
```

例如，显示“复制”和“取消”两个按钮：

```text
@buttons
复制|operation=copy&data=复制成功
取消|operation=none
```

常用填写示例：

| 目的 | 按钮行 |
| --- | --- |
| 复制文字 | `复制\|operation=copy&data=要复制的文字` |
| 打开网址或文件 | `查看详情\|operation=open&data=https://getquicker.net` |
| 运行命令 | `打开记事本\|operation=run&data=notepad.exe` |
| 运行当前动作 | `再次运行\|operation=action&action=_this_` |
| 运行其他动作 | `运行清理动作\|operation=action&action=动作ID或动作名称` |
| 只关闭通知 | `取消\|operation=none` |

`data`、`action` 等参数采用 URL 查询字符串格式。如果内容中包含 `&`、`=`、`+` 等特殊字符，应先进行 URL 编码。例如要复制 `a&b`，可填写：

```text
复制|operation=copy&data=a%26b
```

按钮还支持 `paste`（粘贴文字）、`pastefile`（粘贴文件）、`pasteimage`（粘贴图片）、`sendkeys`（模拟按键）、`inputtext`（键入文字）、`selectfile`（在资源管理器中定位）和 `inputscript`（多步骤输入）。按钮不支持子程序 `sp`、分隔线、子菜单或第三个及更多按钮；配置不合法时该步骤会报错。

也可以在标记后填写 `CommonOperationItem` 的 JSON 数组，但一般使用上面的逐行格式更直观：

```text
@button
[{"Title":"再次运行","Operation":"action","Action":"_this_"}]
```

:::note Windows 通知

“Windows 通知 (win10+)”支持普通文本形式的整卡点击命令，但不支持 `@button` / `@buttons` 按钮模式；使用按钮格式时，Quicker 会忽略点击操作并显示普通通知。

:::

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
