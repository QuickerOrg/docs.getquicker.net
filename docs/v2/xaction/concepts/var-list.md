---
title: "列表类型"
description: "列表存一组字符串；可与多行文本互转，用拆分/合并/列表操作模块处理。"
slug: "/v2/xaction/concepts/var-list"
sidebar_position: 60
quickerDocKey: "xaction/concepts/var-list"
comments: true
docStatus: reviewed
legacyDocId: 2245598
legacyContentUpdatedAt: "2023-12-29T00:05:09.000Z"
---

# 列表类型

列表用来存一组字符串。例如一次选中的多个文件路径，每一项是一条完整路径。

## 变量定义

创建变量时选「列表」。默认值按多行填写，每行一项。

<VariableDefPreview
  name="fileList"
  typeLabel="列表"
  remark="文件路径列表"
  defaultValue={"AAAAAA\nBBBBBB\nCCCCCCC"}
/>

## 和多行文本互转

需要文本的地方直接写列表变量，会自动变成多行文本。

用分隔符切开一段文本，用 [拆分文本为列表](/v2/xaction/modules/splitstring)。例如 `AA,BB,CC` 按 `,` 拆成三项。

把列表拼回去，用 [列表合并成文本](/v2/xaction/modules/joinlist)。

## 在表达式里

- 取某一项（从 0 开始）：`$= {列表变量}[0]`
- 用整数变量当序号：`$= {列表变量}[(int){序号变量}]`。内部整数是 `long`，下标要 `(int)` 转一下。
- 项数：`$= {列表变量}.Count()`

## 限制与排障

- 下标从 0 起。写成 `1` 会拿到第二项。
- 序号变量若不是整数，先转成整数再 `(int)`。
- 空列表取 `[0]` 会失败，先判断 `.Count()`。

<StepProgramView example="840b5f51-e57c-4141-a270-08dc0740f11f" />

<ShareLinkCard
  code="840b5f51-e57c-4141-a270-08dc0740f11f"
  title="示例：修改列表每一项"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/splitstring',
      label: '拆分文本为列表',
      description: '按分隔符切开',
    },
    {
      href: '/v2/xaction/modules/joinlist',
      label: '列表合并成文本',
      description: '用分隔符拼回去',
    },
    {
      href: '/v2/xaction/modules/listoperations',
      label: '列表操作',
      description: '增删改查、排序、去重',
    },
    {
      href: '/v2/xaction/modules/getselectedfiles',
      label: '获取选择的文件列表',
      description: '资源管理器里多选的文件',
    },
    {
      href: '/v2/xaction/modules/getclipboardfiles',
      label: '获取剪贴板文件列表',
      description: '剪贴板里的文件路径',
    },
  ]}
/>
