---
title: "加密/解密/哈希"
description: "加密、解密，以及哈希计算"
slug: "/v2/xaction/modules/enc"
sidebar_label: "加密/解密/哈希"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:enc"
comments: true
moduleKey: "sys:enc"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "952922b0e3c445d3cb51877002b5bd2fc7439e79a31afdd8fe7ed761ebb471ec"
legacyDocId: 127131509
legacyContentUpdatedAt: "2023-06-09T12:24:24.000Z"
---

# 加密/解密/哈希

加密、解密，以及哈希计算

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:enc`
- 分类：文本处理（`Text`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作类型 | `Enum` | hash_hmac | 是 | `Input` |  |  |
| `inputContentType` | 输入内容类型 | `Enum` | text | 否 | `Input` |  |  |
| `input` | 输入 | `Text` |  | 是 | `UseVarOrInput` |  | 待加密或解密的内容 |
| `keyContentType` | 密钥内容类型 | `Enum` | text | 否 | `Input` | 仅：dec_des, dec_aes, enc_aes, enc_des, hash_hmac |  |
| `key` | 密钥 | `Text` |  | 是 | `UseVarOrInput` | 仅：dec_des, dec_aes, enc_aes, enc_des, hash_hmac |  |
| `ivContentType` | 初始化向量IV内容类型 | `Enum` | text | 否 | `Input` | 仅：dec_des, dec_aes, enc_aes, enc_des |  |
| `iv` | 初始化向量 | `Text` |  | 是 | `UseVarOrInput` | 仅：dec_des, dec_aes, enc_aes, enc_des |  |
| `pairKey` | 公钥/私钥 | `Text` |  | 是 | `UseVarOrInput` | 仅：enc_rsa, dec_rsa | XML格式的公钥（加密用）或私钥（解密用） |
| `hashType` | 算法 | `Text` | MD5 | 是 | `UseVarOrInput` | 仅：hash |  |
| `hmacAlgorithm` | 算法 | `Text` | HMACSHA1 | 是 | `UseVarOrInput` | 仅：hash_hmac |  |
| `cipherMode` | 运算模式 | `Text` | CBC | 是 | `UseVarOrInput` | 仅：dec_aes, enc_aes, dec_des, enc_des |  |
| `paddingMode` | 填充模式 | `Text` | PKCS7 | 是 | `UseVarOrInput` | 仅：dec_aes, enc_aes, dec_des, enc_des |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `resultText` | 文本结果 | `Text` | 仅：dec_aes, dec_des, dec_rsa, local_dec |  |
| `resultHex` | 十六进制编码(大写) | `Text` |  |  |
| `resultLowerHex` | 十六进制编码(小写) | `Text` |  |  |
| `resultBase64` | Base64编码结果 | `Text` |  |  |

## 选项值

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `enc_des` | DES 加密 |  |
| `dec_des` | DES 解密 |  |
| `enc_aes` | AES 加密 |  |
| `dec_aes` | AES 解密 |  |
| `enc_rsa` | RSA 加密 |  |
| `dec_rsa` | RSA 解密 |  |
| `hash_hmac` | 键控哈希 HMAC |  |
| `hash` | 哈希（MD5、SHA1等） |  |
| `local_enc` | 自用加密 |  |
| `local_dec` | 自用解密 |  |

### `inputContentType` 输入内容类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `text` | 文本 |  |
| `base64` | Base64编码 |  |
| `hex` | 十六进制编码 |  |

### `keyContentType` 密钥内容类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `text` | 文本 |  |
| `base64` | Base64编码 |  |
| `hex` | 十六进制编码 |  |

### `ivContentType` 初始化向量IV内容类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `text` | 文本 |  |
| `base64` | Base64编码 |  |
| `hex` | 十六进制编码 |  |

### `hashType` 算法

| Value | 名称 | 说明 |
| --- | --- | --- |
| `MD5` | MD5 |  |
| `SHA1` | SHA1 |  |
| `SHA256` | SHA256 |  |
| `SHA384` | SHA384 |  |
| `SHA512` | SHA512 |  |

### `hmacAlgorithm` 算法

| Value | 名称 | 说明 |
| --- | --- | --- |
| `HMACSHA1` | HMACSHA1 |  |
| `HMACSHA256` | HMACSHA256 |  |
| `HMACSHA384` | HMACSHA384 |  |
| `HMACSHA512` | HMACSHA512 |  |
| `MACTripleDES` | MACTripleDES |  |
| `HMACMD5` | HMACMD5 |  |

### `cipherMode` 运算模式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `CBC` | CBC(密码块链，默认) |  |
| `CFB` | CFB(加密反馈) |  |
| `CTS` | CTS(密文窃取) |  |
| `ECB` | ECB(电子密码本) |  |
| `OFB` | OFB(输出反馈) |  |

### `paddingMode` 填充模式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `PKCS7` | PKCS7 |  |
| `None` | None |  |
| `ANSIX923` | ANSIX923 |  |
| `ISO10126` | ISO10126 |  |
| `Zeros` | Zeros |  |
{/* xaction-metadata:end */}

封装常用的加密解密及哈希算法：

-   对称加密：DES、AES
-   非对称加密：RSA
-   哈希：MD5、SHA1、SHA256、SHA384、SHA512
-   键控哈希：HMACSHA1、HMACSHA256，HMACSHA384，HMACSHA512，MACTripleDES，HMACMD5
-   自用加密、自用解密。



注：

-   每种加密解密算法都有自己特定参数及参数长度要求，您需要对此有一定了解才能使用本模块。
-   文本内容涉及编码处理时，会全部使用UTF8编码。



## 常规参数说明



**输入参数**

【操作类型】选择要执行的操作。

![](./img/enc-001-b26613fd58.png)



【xx内容类型】用于指定特定参数值的格式。如“输入内容类型”，用于指定“输入”参数（待加密、解密或哈希的原始内容）的内容类型。

![](./img/enc-002-5a262d846c.png)

可能为：

-   `文本`：输入的内容为原始文本，如`Hello World!`
-   `Base64编码`：输入的内容为原始文本的Base64编码，如`SGVsbG8gV29ybGQh`(`Hello World!`的base64编码结果）。
-   `十六进制编码`（HEX编码）：输入的内容为原始文本对应的字节数组的十六进制编码（每个字节编码为两个十六进制字符），如`48656C6C6F20576F726C6421`(`Hello World!`的HEX编码结果)。

【输入】待加密、解密或计算哈希值的内容。

【秘钥】对称加密算法中的秘钥内容。不同加密算法所需要的秘钥长度可能不同。

【初始化向量】（IV）对称加密算法中所需要提供的参数。不同加密算法所需要的初始化向量长度可能不同。

**输出参数**

![](./img/enc-003-ba5eae7780.png)

加解密或哈希运算后，会得到一个字节数组。由于字节数组本身不方便显示，通常需要将它们编码输出。

【Base64编码结果】对加解密或哈希运算的结果进行Base64编码后的值。

【十六进制编码】对运算结果进行十六进制编码后的值。可以根据需要选择大写或小写输出。

【文本结果】对于解密操作，输出对应的明文内容。



## 键控哈希 HMAC

常用于对HTTP请求参数进行签名。如[阿里云](https://help.aliyun.com/document_detail/30563.html)、[腾讯云](https://cloud.tencent.com/document/product/213/15693)、[百度云](https://cloud.baidu.com/doc/Reference/s/6k6yfh1he)等。

操作类型选择“键控哈希”后，可选择具体的算法。

![](./img/enc-004-79f3b7b5bf.png)

## 哈希

操作类型选择“哈希”后，选择具体的哈希算法。

![](./img/enc-005-2ee7f69184.png)

注：如果您需要对文件计算哈希，请使用“[检查路径/获取文件信息](/v2/xaction/modules/checkpathexists)”模块。它使用流式读取，可以避免将文件整个读入内存，具有更高的性能。

## 自用加密和自用解密

使用当前用户自己的用户标识信息作为秘钥对数据进行加密。 得到的数据只能在自己的Quicker账号上解密读取。

内部使用AES加密算法。

## 示例动作

-   [加密解密测试](https://getquicker.net/Sharedaction?code=b20f2a88-3bc4-4446-fe0c-08db67a6796c) ： 请调试运行动作以观察输入输出。

## 更新历史

-   20230609 1.38.17 版本增加模块。
