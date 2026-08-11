---
title: "文本处理"
description: "对一段文本做截取、编解码、排序、补齐等处理。"
slug: "/v2/xaction/modules/stringprocess"
sidebar_label: "文本处理"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:stringProcess"
comments: true
moduleKey: "sys:stringProcess"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2114367
legacyContentUpdatedAt: "2025-06-10T03:28:24.000Z"
---

# 文本处理

对一段文本做一种处理并输出结果。只要替换指定内容，用 [替换文本](/v2/xaction/modules/strreplace)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:stringProcess" />

## 概述

先选 **处理**，再按类型填写附加参数。点开下拉可看当前全部选项。

<ModuleParamPreview moduleKey="sys:stringProcess" />

## 参数说明

**待处理内容**：原文。

**处理**：要做哪一种。下面按类型说明；名称与下拉一致。

**失败后停止**：处理失败是否中止动作。默认开启。

### 大小写与翻转

| 处理 | 说明 |
| --- | --- |
| 英文转大写 / 英文转小写 | `abc` ↔ `ABC` |
| 前后反转 | `ABC` → `CBA` |
| 首字母大写 | 每个单词首字母大写 |
| 组合词拆分成句子(thisIsChina=>this Is China) | 驼峰拆成词，方便搜索或翻译 |

### 截取、插入、删除、补齐

这些项会显示 **开始位置**、**长度**、**内容**、**总宽度**、**填充字符**（按处理类型）。

**开始位置**：从 0 计；负数表示从末尾往前。

**长度**：截取时 `0` 表示一直到末尾；负数表示截到结束前若干字符。移除时是要删的个数。

**内容**：插入或追加的文字。追加也可用表达式 `$={文本1} + "追加内容"`。

**总宽度** / **填充字符**：左右补齐用，默认空格。

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  focusKeys={['data', 'method', 'start', 'value', 'length', 'totalWidth', 'paddingChar']}
  values={{data: 'abc', method: 'padLeft', totalWidth: '5', paddingChar: '*'}}
/>

例如：`aaa` 在位置 2 插入 `bb` → `aabba`；`abcdefg` 从 `-2` 移除长度 `2` → `abcde`；`abc` 左侧用 `*` 补到 5 → `**abc`。

### 空白与多行

| 处理 | 说明 |
| --- | --- |
| 去除前面 / 后面 / 前后空白字符 | 去空格和 Tab，不含零宽字符 |
| 移除零宽字符 | 旧稿未写 |
| 去除空行 | 丢掉没有可见字符的行 |
| 合并多个空行 | 连续空行收成 1 行 |
| 排序多行A-Z / 排序多行Z-A | 按字母序 |
| 翻转多行顺序 | 整行倒序 |

### 编解码与哈希

| 处理 | 说明 |
| --- | --- |
| URL编码 / URL解码 (+解码为空格) | 解码时 `+` 变空格 |
| URL数据解码 (保留+号) | 旧稿未写 |
| Html编码 / Html解码 | |
| HTML转纯文本 | 旧稿未写 |
| Base64编码 / Base64解码 | |
| 计算MD5 / SHA1 / SHA256哈希 | |
| 转义文本为合法Json值 | 避免拼进 JSON 时格式乱掉 |
| 格式化JSON | 输入必须是合法 JSON |
| 解码Unicode字串(\\uXXXX转普通字符) | `\u65b9\u6b63\u5c0f` → `方正小` |
| 转换编码 | 显示 **编码**、**目标编码**，常用于网络返回值 |

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  focusKeys={['data', 'method', 'srcEncoding', 'dstEncoding']}
  values={{method: 'convertEncoding', srcEncoding: 'utf-8', dstEncoding: 'gbk'}}
/>

### 中文数字与环境变量

| 处理 | 例子 |
| --- | --- |
| 金额数字转换为大写 | `1234` → `壹仟贰佰叁拾肆元` |
| 中文转数字 | `一万二千三百四十五点四五` → `12345.45` |
| 数字转中文 | `12345.45` 或 `12,345.45` → `一万二千三百四十五点四五` |
| 替换环境变量 | `%USERPROFILE%\AppData` → 实际用户目录 |

## 输出

- **是否成功**：处理是否成功。
- **结果**：处理后的文本。

## 限制与排障

格式化 JSON 时输入不合法会失败。去空白不含零宽字符，需要时另选 **移除零宽字符**。哈希整文件请用 [检查路径/获取文件信息](/v2/xaction/modules/checkpathexists)，避免整文件进内存。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/strreplace',
      label: '替换文本',
      description: '按查找内容或正则替换。',
    },
    {
      href: '/v2/xaction/modules/enc',
      label: '加密/解密/哈希',
      description: 'HMAC、AES 等，不只算文本哈希。',
    },
    {
      href: '/v2/xaction/modules/checkpathexists',
      label: '检查路径/获取文件信息',
      description: '流式计算整个文件的哈希。',
    },
    {
      href: '/v2/xaction/modules/splitstring',
      label: '拆分文本为列表',
      description: '拆开后再逐项处理。',
    },
  ]}
/>
