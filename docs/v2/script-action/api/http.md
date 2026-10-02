---
title: "qk.Http：HTTP 请求"
description: "qk.Http：HTTP 请求的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/http
comments: false
sidebar_position: 10
---

{/* script-api:start */}

直接发送 HTTP 请求与下载文件（不经浏览器）；操作网页见 qk.Browser。仅 http/https，使用 Quicker 代理设置，不共享 Cookie；Send/GetText/PostJson 不自动跳转，正文各限 4 MiB。timeoutMs 为单次超时（Send/GetText/PostJson 默认 60000，Download 默认 0；0 为只受动作超时约束，动作超时始终有效），超时取消请求并报 HTTP_TIMEOUT（服务端可能已处理）。常见错误码：HTTP_FAILED（网络失败、重定向过多）、HTTP_STATUS_FAILED（非 2xx）、LIMIT_EXCEEDED。

<a id="http-send" />

## Http.Send

```csharp
HttpResult Send(string url, string method = "GET", string? body = null, string contentType = "application/json", IDictionary<string, string>? headers = null, IDictionary<string, string>? form = null, IDictionary<string, string>? files = null, int timeoutMs = 60000)
```

发送请求并返回响应；非 2xx 仍返回结果（看 StatusCode/IsSuccess）；不自动跳转，文本正文与响应各限 4 MiB；给出 form/files 时按 multipart/form-data 上传（method 须为 POST/PUT，body 须为 null）。

| 参数声明 | 说明 |
|---|---|
| `string url` | 见本成员和所在域的说明。 |
| `string method = "GET"` | GET&#124;POST&#124;PUT&#124;DELETE 等。 |
| `string? body = null` | 请求正文（文本）。 |
| `string contentType = "application/json"` | 正文类型，默认 application/json。 |
| `IDictionary<string, string>? headers = null` | 自定义请求头。 |
| `IDictionary<string, string>? form = null` | multipart/form-data 的文本字段（字段名 → 值，null 为空串）；给出 form 或 files 时按 multipart 发送：body 须为 null、忽略 contentType、headers 不能含 Content-Type、method 不能是 GET/HEAD。 |
| `IDictionary<string, string>? files = null` | multipart 的文件字段（字段名 → 本机文件路径）；需要读文件能力；流式上传，合计最多 256 MiB；文件不存在报 FILE_NOT_FOUND（发送前检查）。 |
| `int timeoutMs = 60000` | 单次超时毫秒（默认 60000；0 为只受动作超时约束）；超时报 HTTP_TIMEOUT（请求已取消，服务端可能已处理，非幂等请求可能已生效）。 |

返回类型：`HttpResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="http-gettext" />

## Http.GetText

```csharp
string GetText(string url, int timeoutMs = 60000)
```

GET 并返回响应文本；非 2xx 抛 HTTP_STATUS_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string url` | 见本成员和所在域的说明。 |
| `int timeoutMs = 60000` | 单次超时毫秒（默认 60000；0 为只受动作超时约束）；超时报 HTTP_TIMEOUT。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="http-postjson" />

## Http.PostJson

```csharp
string PostJson(string url, string json, int timeoutMs = 60000)
```

POST JSON 并返回响应文本；非 2xx 抛 HTTP_STATUS_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string url` | 见本成员和所在域的说明。 |
| `string json` | 已序列化的 JSON 字符串。 |
| `int timeoutMs = 60000` | 单次超时毫秒（默认 60000；0 为只受动作超时约束）；超时报 HTTP_TIMEOUT。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="http-download" />

## Http.Download

```csharp
string Download(string url, string path, bool overwrite = false, IDictionary<string, string>? headers = null, int timeoutMs = 0)
```

下载到文件并返回保存的完整路径；最多 512 MiB，跟随最多 5 次重定向；非 2xx 抛错，失败不留残缺文件。

| 参数声明 | 说明 |
|---|---|
| `string url` | 见本成员和所在域的说明。 |
| `string path` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 覆盖已有文件（默认不覆盖）。 |
| `IDictionary<string, string>? headers = null` | 自定义请求头（跨主机重定向时不转发）。 |
| `int timeoutMs = 0` | 整次下载的超时毫秒（默认 0 为不单独限时，只受动作超时约束）；超时报 HTTP_TIMEOUT，不留残缺文件。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件；访问网络。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
