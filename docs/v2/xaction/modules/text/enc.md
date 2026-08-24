---
title: "加密/解密/哈希"
description: "加密、解密，以及哈希计算"
slug: "/v2/xaction/modules/enc"
sidebar_label: "加密/解密/哈希"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:enc"
comments: true
moduleKey: "sys:enc"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 127131509
legacyContentUpdatedAt: "2023-06-09T12:24:24.000Z"
---

# 加密/解密/哈希

做对称/非对称加解密、哈希和 HMAC。只算一段文本的 MD5 / SHA，也可以用 [文本处理](/v2/xaction/modules/stringprocess)；算整个文件用 [检查路径/获取文件信息](/v2/xaction/modules/checkpathexists)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:enc" />

## 概述

每种算法对密钥、IV 长度有自己的要求。文本编解码一律按 UTF-8。

<ModuleParamPreview moduleKey="sys:enc" />

## 参数说明

**操作类型**：DES / AES / RSA 加解密、键控哈希 HMAC、哈希、自用加密/解密。

**输入内容类型** / **密钥内容类型** / **初始化向量IV内容类型**：文本、Base64 或十六进制。例如 `Hello World!` 的 Base64 是 `SGVsbG8gV29ybGQh`，HEX 是 `48656C6C6F20576F726C6421`。

**输入**：待处理内容。

**密钥**：对称算法和 HMAC 用。长度按算法要求。

**初始化向量**：对称算法的 IV，同样有长度要求。

**公钥/私钥**：仅 RSA。XML 格式，加密用公钥、解密用私钥。

**算法**：哈希选 MD5 / SHA1 / SHA256 / SHA384 / SHA512；HMAC 另有一套算法列表。

<ModuleParamPreview
  moduleKey="sys:enc"
  focusKeys={['operation', 'hmacAlgorithm', 'hashType', 'input', 'key']}
  values={{operation: 'hash_hmac', hmacAlgorithm: 'HMACSHA1'}}
/>

**运算模式** / **填充模式**：仅 DES / AES。默认 CBC、PKCS7。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

运算结果是字节数组，用下面几种编码取出：

- **是否成功**
- **文本结果**：仅解密和自用解密，明文。
- **十六进制编码(大写)** / **十六进制编码(小写)**
- **Base64编码结果**

<ModuleParamPreview
  moduleKey="sys:enc"
  focusKeys={['isSuccess', 'resultText', 'resultHex', 'resultLowerHex', 'resultBase64']}
  values={{operation: 'dec_des'}}
/>

## 键控哈希 HMAC

常用于给 HTTP 请求签名（阿里云、腾讯云、百度云等）。操作类型选 **键控哈希 HMAC**，再选算法。

## 哈希

操作类型选 **哈希（MD5、SHA1等）**，再选算法。大文件请用检查路径模块流式计算，不要整文件读进内存。

<ModuleParamPreview
  moduleKey="sys:enc"
  focusKeys={['operation', 'hashType', 'input']}
  values={{operation: 'hash', hashType: 'MD5'}}
/>

## 自用加密和自用解密

用当前 Quicker 账号标识当密钥，只能在本账号解开。内部是 AES。

## 限制与排障

密钥或 IV 长度不对会失败。输入已是 Base64 / HEX 时，对应内容类型要选对，否则会把编码字面量再加密一遍。

## 示例动作

步骤较多，用卡片打开后调试查看输入输出。

<ShareLinkCard
  code="b20f2a88-3bc4-4446-fe0c-08db67a6796c"
  title="加密解密测试"
  description="请调试运行以观察输入输出"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '只要文本 MD5 / SHA / Base64。',
    },
    {
      href: '/v2/xaction/modules/checkpathexists',
      label: '检查路径/获取文件信息',
      description: '流式计算文件哈希。',
    },
  ]}
/>

## 更新历史

- 20230609 1.38.17 增加本模块。
