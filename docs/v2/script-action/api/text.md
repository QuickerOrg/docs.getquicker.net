---
title: "qk.Text：文本工具"
description: "qk.Text：文本工具的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/text
comments: false
sidebar_position: 10
---

{/* script-api:start */}

纯计算的文本工具（哈希、拼音、HTML 解析）；显示文本见 qk.Ui.ShowText。不需要能力。

<a id="text-hash" />

## Text.Hash

```csharp
string Hash(object data, string algorithm = "sha256", string? hmacKey = null, string output = "hex")
```

计算哈希或 HMAC，如 Hash("abc", "md5") == "900150983cd24fb0d6963f7d28e17f72"；API 签名常用 Hash(body, "sha256", secret, "base64")。文件内容的哈希请用 qk.Files.Hash(path)（流式计算，不受 16 MiB 限制）。

| 参数声明 | 说明 |
|---|---|
| `object data` | string（按 UTF-8 字节）或 byte[]（原样）；其他编码请先 Encoding.GetEncoding("gbk").GetBytes(s)。 |
| `string algorithm = "sha256"` | md5&#124;sha1&#124;sha256&#124;sha384&#124;sha512（不区分大小写）。 取值：`md5`、`sha1`、`sha256`、`sha384`、`sha512`。 |
| `string? hmacKey = null` | HMAC 密钥（UTF-8）；非空时计算对应算法的 HMAC，null 或空串为普通哈希。 |
| `string output = "hex"` | hex（小写）&#124;base64。 取值：`hex`、`base64`。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="text-topinyin" />

## Text.ToPinyin

```csharp
string ToPinyin(string text, bool initials = false, bool allReadings = false, string? separator = null)
```

汉字转拼音（无声调、小写；非汉字原样保留）；未给 all 时按词组判断多音字（"重庆" → "chong qing"）。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `bool initials = false` | 只取首字母。 |
| `bool allReadings = false` | 多音字列出全部读音（以 &#124; 分隔，如 "重" → "zhong&#124;chong"；与 initials 同用时为 "z&#124;c"）。 |
| `string? separator = null` | 汉字的拼音与相邻汉字/字母/数字之间的分隔符，空白与标点旁不加；null 为默认（全拼为空格，首字母为空串）。如 "Quicker中文" → "Quicker zhong wen"，"你好, 世界!" → "ni hao, shi jie!"。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="text-matchpinyin" />

## Text.MatchPinyin

```csharp
bool MatchPinyin(string text, string query)
```

text 是否匹配 query（包含、全拼、首字母或混合；空格分隔的多个词须都匹配、顺序不限；忽略大小写；query 为空返回 true），与 Quicker 搜索同一规则。如 "中文输入法" 匹配 "zwsrf"、"zhongwen"、"srf zw"。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string query` | 见本成员和所在域的说明。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="text-htmltotext" />

## Text.HtmlToText

```csharp
string HtmlToText(string html)
```

HTML 转纯文本（同“文本处理”步骤的 html2text）：去掉 script/style/注释、解码实体，只有 p/br 换行；只解析传入的字符串（网址/路径也按文本处理）；最多 16 M 字符、嵌套 1000 层。

| 参数声明 | 说明 |
|---|---|
| `string html` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="text-queryhtml" />

## Text.QueryHtml

```csharp
string[] QueryHtml(string html, string xpath, string? attribute = null, string output = "text")
```

用 XPath 1.0 查询 HTML（以 / 、( 或 . 开头；不支持 CSS 选择器；元素名与属性名用小写），每个匹配节点返回一个字符串；"//a/@href" 等同 attribute: "href"；无匹配返回空数组；XPath 错误报 INVALID_ARGUMENT；最多 10000 个结果。

| 参数声明 | 说明 |
|---|---|
| `string html` | 见本成员和所在域的说明。 |
| `string xpath` | 见本成员和所在域的说明。 |
| `string? attribute = null` | 取该属性值（缺失为空串）；给出时忽略 output。 |
| `string output = "text"` | text（InnerText，已解码实体、去首尾空白）&#124;innerHtml（InnerHtml）&#124;outerHtml（OuterHtml）；均去首尾空白。 取值：`text`、`innerHtml`、`outerHtml`。 |

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
