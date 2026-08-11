---
title: "提取HTML内容"
description: "从HTML代码中提取内容"
slug: "/v2/xaction/modules/htmlextract"
sidebar_label: "提取HTML内容"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:htmlExtract"
comments: true
moduleKey: "sys:htmlExtract"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 4497897
legacyContentUpdatedAt: "2023-07-04T10:07:42.000Z"
---

# 提取HTML内容

从 HTML（一定程度上也支持 XML）里按 XPath 取出文本、属性或表格。内部用 [HtmlAgilityPack](https://html-agility-pack.net/)，深入用法见其 [文档](https://html-agility-pack.net/documentation)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:htmlExtract" />

## 概述

源可以是 HTML 文本，也可以是 `http` / `https` 网址（模块会先下载）。同一网址短时间内多次提取会走缓存；更新很勤的页面请先用 [HTTP请求](/v2/xaction/modules/http) 再提取，避免拿到旧数据。

<ModuleParamPreview moduleKey="sys:htmlExtract" />

## 参数说明

**操作类型**：

- **提取文本内容**：按 XPath 取节点。
- **提取表格内容**：取表格，可写入工作表对象。

**源HTML**：HTML 代码、网址，或根节点对象。

**网页编码类型**：按网址下载时的编码。留空默认 UTF-8；选 **自动检测 (加载两次)** 会先探测编码再重新请求。乱码时改这里。

**节点XPath**：例如网页标题 `html/head/title`。找不到节点时，试把标签名改成**小写**。

**提取方式**：第一个符合条件的节点，或所有符合条件的节点（结果是列表）。

**提取内容类型**：

| 提取内容类型 | 说明 |
| --- | --- |
| innerHtml 内部HTML | 节点内部的 HTML |
| innerText 内部文本 | 节点内部的纯文本 |
| outerHTML 节点全部HTML | 含节点自身的 HTML |
| Attribute 节点的某个属性 | 再填 **属性名称** |
| 节点对象 | 返回 HtmlNode |

**属性名称**：仅提取内容类型为属性时有效。

**写入工作表对象**：提取表格时，把结果写入工作表。旧稿未写。

**失败后停止动作**：失败是否中止动作。默认开启。

## 输出

- **步骤执行是否成功**
- **提取值**：单个值或列表，变量类型要匹配。
- **根节点**：整份源对应的 HtmlNode，可交给下一步再提取。旧稿未写。

## 示例动作

步骤较多，用卡片打开后查看。

<ShareLinkCard
  code="bf4e796f-e1a5-41ba-1925-08d7b02d7fd4"
  title="生成MarkDown链接"
  description="把浏览器当前网址做成 Markdown 链接"
  author="CL"
/>

## 限制与排障

- 短时间重复拉同一网址会命中缓存。
- XPath 大小写不对时经常取不到节点。
- 编码不对会乱码：试 `auto`、`gb2312` 或 `utf-8`。

XPath 教程：[W3School](https://www.w3school.com.cn/xpath/index.asp)、[知乎笔记](https://zhuanlan.zhihu.com/p/29436838)。在线测试：[xpather.com](http://xpather.com/)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/http',
      label: 'HTTP请求',
      description: '先下载再提取，避开本模块的网址缓存。',
    },
    {
      href: '/v2/xaction/modules/jsonextract',
      label: '提取JSON内容',
      description: '源是 JSON 而不是 HTML 时用这个。',
    },
  ]}
/>

## 更新历史

- 1.4.17 开始提供。
- 20230704 增加支持 XML，以及使用小写 XPath 的说明。
