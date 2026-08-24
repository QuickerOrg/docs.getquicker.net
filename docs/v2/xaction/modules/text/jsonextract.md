---
title: "提取JSON内容"
description: "提取Json文本中的信息"
slug: "/v2/xaction/modules/jsonextract"
sidebar_label: "提取JSON内容"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:jsonExtract"
comments: true
moduleKey: "sys:jsonExtract"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2113782
legacyContentUpdatedAt: "2022-03-11T14:45:55.000Z"
---

# 提取JSON内容

从 JSON 文本或已有的 JToken 里按路径取出值。一次最多 5 条路径；要取更多，把 **根对象** 交给下一步再提取。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:jsonExtract" />

## 概述

内部先用 [JToken.SelectToken](https://www.newtonsoft.com/json/help/html/SelectToken.htm) 取单个值，失败再试 [SelectTokens](https://www.newtonsoft.com/json/help/html/Overload_Newtonsoft_Json_Linq_JToken_SelectTokens.htm) 取列表。路径前加 `list:` 可强制按数组提取（1.30.14+）。

<ModuleParamPreview moduleKey="sys:jsonExtract" />

## 参数说明

**输入**：JSON 文本或 JToken。

**提取路径0**～**提取路径4**：各对应一路输出。写法：

- 点分层级：`Manufacturers[0].Name`
- JSONPath：`$..Products[*].Name`
- Key 里带点：`['Dot.Name']`

**日期时间按照文本处理**：保留原始日期文本，不当成日期对象。默认关闭。旧稿未写。

**失败后停止**：提取失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：有没有异常。旧稿未写。
- **值0**～**值4**：与路径 0～4 对应。复杂类型会得到 JToken，请保证变量类型兼容。
- **根对象**：整段输入解析后的 JToken，可再提取或在表达式里用。

## 路径示例

| 要取的内容 | 路径 | 结果形态 |
| --- | --- | --- |
| `City` | `City` | 文本 |
| `Stores` | `Stores` | 列表 |
| 第一个厂商名 | `Manufacturers[0].Name` | 文本 |
| 所有产品名 | `$..Products[*].Name` | 列表 |
| 全部厂商 | `Manufacturers` | 对象列表，可用「每个」遍历 |
| Key 含点 | `['Dot.Name']` | 文本 |

表达式里也可以：`JsonConvert.DeserializeObject({json})` 得到 JToken，再 `{token}["path1"]["path2"]`。

## 限制与排障

路径写错或类型对不上时，打开失败停止会中止动作；调试时可先关掉，看 **是否成功** 和空值。日期被解析坏了，勾选 **日期时间按照文本处理**。

## 示例动作

步骤较多，用卡片打开原动作查看。

<ShareLinkCard
  code="05d33931-477a-4c18-a917-08d7b30d7779"
  title="示例：Json提取"
  description="演示多条路径提取"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/each',
      label: '循环：每个',
      description: '遍历提取到的列表或对象列表。',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '格式化 JSON、转义 JSON 值。',
    },
  ]}
/>

## 更新历史

- 1.4.18 复杂类型返回原始 JToken。
