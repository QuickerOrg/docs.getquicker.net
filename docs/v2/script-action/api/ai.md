---
title: "qk.Ai：AI 与翻译"
description: "qk.Ai：AI 与翻译的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/ai
comments: false
sidebar_position: 10
---

{/* script-api:start */}

调用 AI 模型（问答、提取、分类、看图、对话）与机器翻译；纯计算的文本工具见 qk.Text。按 Quicker 全局 AI 配置调用模型（useCase 为用例 Id，缺省 text.general），以及机器翻译（经 Quicker 服务器，可能消耗 Quicker 点数）；使用你的 AI 额度/配置。timeoutMs 为单次超时（默认 120000；0 为只受动作超时约束）。

<a id="ai-ask" />

## Ai.Ask

```csharp
string Ask(string prompt, string? system = null, string? useCase = null, IEnumerable<ChatMessage>? history = null, double? temperature = null, int maxTokens = 0, int timeoutMs = 120000)
```

对话，返回模型回复文本。使用你的 Quicker AI 配置与额度；错误码 AI_FAILED（未配置/模型错误）、AI_TIMEOUT（timeoutMs 到期或连接中断）；输入文本合计最多 20 万字符。

| 参数声明 | 说明 |
|---|---|
| `string prompt` | 见本成员和所在域的说明。 |
| `string? system = null` | 系统提示。 |
| `string? useCase = null` | AI 用例 Id；缺省 text.general，不存在时回退基础用例（记警告日志）。 |
| `IEnumerable<ChatMessage>? history = null` | 之前的对话轮次（按时间顺序，Role 为 user&#124;assistant，最多 100 条）。 |
| `double? temperature = null` | 0–2；null 为模型默认。 |
| `int maxTokens = 0` | 最大输出 token；0 为模型默认。 |
| `int timeoutMs = 120000` | 单次超时毫秒（默认 120000；0 为只受动作超时约束）；超时报 AI_TIMEOUT（本机取消请求，服务端是否已计费未确认）。Extract/Classify/AskImage 相同。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ai-extract" />

## Ai.Extract

```csharp
JsonNode? Extract(string text, string schema, string? instructions = null, string? useCase = null, int timeoutMs = 120000)
```

按 JSON Schema 从文本提取结构化数据，返回 JsonNode（node["字段"]?.GetValue&lt;string>() 读取）；模型须支持结构化输出。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string schema` | JSON Schema 文本（根必须是对象，否则 INVALID_ARGUMENT）。 |
| `string? instructions = null` | 额外的提取说明。 |
| `string? useCase = null` | 见本成员和所在域的说明。 |
| `int timeoutMs = 120000` | 见本成员和所在域的说明。 |

返回类型：`JsonNode?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ai-classify" />

## Ai.Classify

```csharp
ClassifyResult Classify(string text, IDictionary<string, string> categories, string? defaultValue = null, string? instructions = null, int timeoutMs = 120000)
```

把文本归入一个类别（用例 text.general）；模型给出未知类别且没有 defaultValue 时报 AI_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `IDictionary<string, string> categories` | 类别键 → 说明（至少一项，键忽略大小写不可重复）；结果 Key 为你定义的写法。 |
| `string? defaultValue = null` | 模型给出未知类别时使用的类别键（必须是 categories 中的键）。 |
| `string? instructions = null` | 见本成员和所在域的说明。 |
| `int timeoutMs = 120000` | 见本成员和所在域的说明。 |

返回类型：`ClassifyResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ai-askimage" />

## Ai.AskImage

```csharp
string AskImage(Img image, string prompt, string? system = null, string? useCase = null, int timeoutMs = 120000)
```

看图回答问题（缺省用例 image.understanding，模型须支持图片输入）。

| 参数声明 | 说明 |
|---|---|
| `Img image` | Img（最多 4000 万像素，PNG 编码后最多 10 MiB，否则 LIMIT_EXCEEDED；可先 Resize/Scale）。 |
| `string prompt` | 见本成员和所在域的说明。 |
| `string? system = null` | 见本成员和所在域的说明。 |
| `string? useCase = null` | 见本成员和所在域的说明。 |
| `int timeoutMs = 120000` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ai-translate" />

## Ai.Translate

```csharp
string Translate(string text, string targetLanguage = "zh", string? sourceLanguage = null, string? vendor = null, int timeoutMs = 120000)
```

机器翻译（经 Quicker 服务器，可能消耗 Quicker 点数，消耗数写入运行日志）；单次最多 1 万字符、每次运行累计最多 10 万字符（超出 LIMIT_EXCEEDED）；失败报 TRANSLATE_FAILED，超过 timeoutMs（默认 120000）报 TRANSLATE_TIMEOUT。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `string targetLanguage = "zh"` | zh&#124;en&#124;ja&#124;ko。 取值：`zh`、`en`、`ja`、`ko`。 |
| `string? sourceLanguage = null` | zh&#124;en&#124;ja&#124;ko；null 为自动检测。 取值：`zh`、`en`、`ja`、`ko`。 |
| `string? vendor = null` | quicker&#124;aliyun&#124;baidu&#124;tencent&#124;youdao&#124;caiyun&#124;xunfei&#124;xunfei2（讯飞 2 代）&#124;google；null 为默认（youdao）。 |
| `int timeoutMs = 120000` | 单次超时毫秒（默认 120000；0 为只受动作超时约束）；超时报 TRANSLATE_TIMEOUT。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="ai-chat" />

## Ai.Chat

```csharp
ChatResult? Chat(string prompt, string? conversationId = null, string? system = null, string? title = null, string? useCase = null, int maxRounds = 10, int maxTokens = 0)
```

打开交互式 AI 对话窗口：先发送 prompt，用户可追问；点“采用”返回结果，关闭/取消返回 null。等待用户操作（不受 AI 请求超时限制，受动作超时约束）；计入对话框限额。

| 参数声明 | 说明 |
|---|---|
| `string prompt` | 见本成员和所在域的说明。 |
| `string? conversationId = null` | 继续已有会话（此时 system 被忽略；不存在报 AI_FAILED）。 |
| `string? system = null` | 见本成员和所在域的说明。 |
| `string? title = null` | 窗口标题（默认“AI 对话”）。 |
| `string? useCase = null` | 见本成员和所在域的说明。 |
| `int maxRounds = 10` | 最多提问轮数 1–100。 |
| `int maxTokens = 0` | 见本成员和所在域的说明。 |

返回类型：`ChatResult?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：调用 AI 或翻译服务。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
