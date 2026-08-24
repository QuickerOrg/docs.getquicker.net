---
title: "词典操作"
description: "对词典变量进行添加、删除等操作"
slug: "/v2/xaction/modules/dictoperations"
sidebar_label: "词典操作"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:dictOperations"
comments: true
moduleKey: "sys:dictOperations"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2131924
legacyContentUpdatedAt: "2022-04-24T09:36:46.000Z"
---

# 词典操作

对词典变量取值、设置、删除，或和查询字符串互转。整本替换用 [赋值](/v2/xaction/modules/assign)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:dictOperations" />

## 概述

先选 **操作类型**。读写某一个键时再填 **键**、**值**。

<ModuleParamPreview moduleKey="sys:dictOperations" />

## 参数说明

**操作类型**：要进行的操作。点开下拉看当前全部选项。

| 操作类型 | 说明 |
| --- | --- |
| 取值 | 读某个键对应的值，写入 **结果** |
| 设置值 (文本类型) | 写入时转成文本 |
| 设置值 (变量原始类型) | 保持原来的类型 |
| 删除一项 | 去掉这个键值对 |
| 清空 | 旧稿未写。去掉全部键 |
| 获取键(Key)列表 | 所有键组成文本列表，写入 **结果** |
| 获取值列表 | 所有值组成文本列表，写入 **结果** |
| 翻转键值 | 生成新词典：原值变键、原键变值。原值必须是文本且不能重复 |
| 查询字符串转换为词典(name1=value1&name2=value2...) | 解析查询串，写入 **结果** |
| 词典转换为查询字符串 | 转成 `name1=value1&…`，写入 **结果** |
| 词典转换为查询字符串(不对键和值进行URL编码) | 旧稿未写。同上但不做 URL 编码 |

**设置值 (变量原始类型)** 时，如果值是列表、词典等引用类型，词典里存的是同一份对象：后来改列表，词典里也会变。

<StepProgramView example="a46e9573-1e4e-4e11-e93f-08d82eb96b41" />

<ShareLinkCard
  code="a46e9573-1e4e-4e11-e93f-08d82eb96b41"
  title="复杂词典值的变化"
  description="将复杂对象保存到词典值中的时候，它的内容可能会变化。"
  author="CL"
/>

**词典**：要操作的词典变量。类型为「查询字符串转换为词典」时不显示。

**查询字符串**：仅「查询字符串转换为词典」。要解析的 `name1=value1&name2=value2` 文本。

**键**：要读写或删除的键名。

**值**：要存到该键下的内容。仅两种「设置值」。

**键不存在时返回空值**：仅 **取值**。开启后键不存在不当作失败。旧稿未写。

**忽略键的大小写**：读写时是否忽略大小写。仅取值、设置、删除时显示。

**失败后停止**：失败是否中止动作。默认关闭。旧稿未写。

## 输出

- **是否成功**：操作是否成功。
- **结果**：随操作类型变化。取值是该键的值；取键/值列表是列表；翻转和查询串转换是新词典或查询文本。

## 限制与排障

翻转键值要求原值都是不重复的文本，否则会失败。引用类型放进词典后会跟着原变量一起变；只要独立副本，先 [赋值](/v2/xaction/modules/assign) 再写入。

## 示例动作

<ShareLinkCard
  code="456c2ade-5d5c-4096-a96c-08d7296fb043"
  title="示例：词典操作"
  description="词典操作，赋值、取值、设置值、取列表、清空。"
  author="Ever"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/assign',
      label: '赋值',
      description: '整本替换，或先复制再改。',
    },
    {
      href: '/v2/xaction/modules/jsonextract',
      label: '提取JSON数据',
      description: '从 JSON 取出字段，再放进词典。',
    },
    {
      href: '/v2/xaction/modules/listoperations',
      label: '列表操作',
      description: '键列表、值列表拿出来之后再处理。',
    },
  ]}
/>

## 更新历史

- 1.5.3 增加「翻转键值」。
- 1.9.11 设置值增加保持原有类型的操作。
- 1.9.15 增加词典与查询字符串之间的转换。
