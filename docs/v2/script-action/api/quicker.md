---
title: "qk.Quicker：Quicker 服务"
description: "qk.Quicker：Quicker 服务的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/quicker
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Quicker 自身与账号服务（信息、命令、云端数据、临时分享、账号绑定加解密）；调用其他动作见 qk.Actions。云端数据（GetCloud/SetCloud/RemoveCloud）按 Quicker 用户跨动作、跨设备共享。

<a id="quicker-info" />

## Quicker.Info

```csharp
QuickerInfo Info()
```

读取 Quicker 版本、专业版状态、用户标识（UnionId）、暂停状态、主题与运行时长。需要“读取可识别信息”能力。

返回类型：`QuickerInfo`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取系统信息。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-command" />

## Quicker.Command

```csharp
void Command(string command, string? argument = null)
```

执行 Quicker 命令，发出即返回（showPanel 最多等 2 秒面板出现）；未知 command 报 INVALID_ARGUMENT（不开放退出 Quicker、删除动作等）。togglePause/stopAll/loadProfile/restart 需要“控制 Quicker”能力，runLast 需要“调用动作”能力；其他失败 QUICKER_COMMAND_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string command` | 不区分大小写：showPanel（在鼠标处弹出面板）&#124;showSearch&#124;showCircleMenu&#124;showToolbar（选中文本工具条）&#124;editAction（编辑动作）&#124;editSubprogram（编辑公共子程序）&#124;runLast（重新运行上一个动作）&#124;togglePause（暂停/恢复）&#124;stopAll（停止全部运行中的动作，含本次运行）&#124;loadProfile（加载动作页并显示面板）&#124;restart（重启 Quicker，本次运行随之结束）。 取值：`showPanel`、`showSearch`、`showCircleMenu`、`showToolbar`、`editAction`、`editSubprogram`、`runLast`、`togglePause`、`stopAll`、`loadProfile`、`restart`。 |
| `string? argument = null` | showSearch 的预填搜索文字；showCircleMenu 可选的场景 exe（"_curr" 为当前程序）；editAction 的动作 Id/名称/动作库 Id（不接受 %% 前缀）；editSubprogram 的公共子程序名称或 Id；loadProfile 的动作页 Id（editAction/editSubprogram/loadProfile 必填；找不到报 INVALID_ARGUMENT）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-getcloud" />

## Quicker.GetCloud

```csharp
string? GetCloud(string key)
```

读取云端数据（按 Quicker 账号加密保存，该账号的所有动作、所有设备共享）；键不存在返回 null（空串是已保存的空值）。key 1–256 字符，不含控制字符与反斜杠；可用 / 分层（如 "myapp/count"），但不能以 / 开头、不能有空层级或 . / .. 层级。同一个键被该账号的所有动作共享，建议以动作名作前缀避免冲突。每次运行最多 200 次读写，另受每日次数限制（专业版 5000、免费版 500）；失败 CLOUD_FAILED（未登录、网络、15 秒超时等）。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络；读写账号云端数据。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-setcloud" />

## Quicker.SetCloud

```csharp
void SetCloud(string key, string value)
```

写入云端数据（字符串；对象请先序列化为 JSON）；删除用 RemoveCloud（value 为 null 报 INVALID_ARGUMENT）；不支持过期时间。值上限：专业版 100 万字符、免费版 10 万字符（LIMIT_EXCEEDED）；"*NULL*" 是存储的保留删除值，不能作为值（INVALID_ARGUMENT）。多设备同时写入以最后一次为准；停止脚本时已发出的写入仍可能生效。读-改-写（列表、计数）时：在 SetCloud 之前立即重新 GetCloud，按 id/键修改这份最新值（不要用早先读取时的序号），然后马上 SetCloud。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |
| `string value` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络；读写账号云端数据。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-removecloud" />

## Quicker.RemoveCloud

```csharp
void RemoveCloud(string key)
```

删除云端数据（键不存在也不报错）；键规则、次数与超时同 SetCloud；停止脚本时已发出的删除仍可能生效。

| 参数声明 | 说明 |
|---|---|
| `string key` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络；读写账号云端数据。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-sharetemporary" />

## Quicker.ShareTemporary

```csharp
string ShareTemporary(object content)
```

上传文本（string，1–100 万字符，存为 .txt）或图片（Img，编码为 PNG，最多 10 MB）到 Quicker 临时分享并返回网址。会生成他人可访问的网址：任何拿到网址的人都能打开，不要分享敏感内容；有效期由服务器决定（临时，不要当作存储）。每次运行最多 20 次，另有上传间隔（专业版 2 秒、免费版 1 分钟）；失败 TEMP_SHARE_FAILED。

| 参数声明 | 说明 |
|---|---|
| `object content` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：访问网络；上传临时分享。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-sharetemporaryfile" />

## Quicker.ShareTemporaryFile

```csharp
string ShareTemporaryFile(string path, bool randomName = false)
```

上传本机文件（最多 10 MB，需要读文件能力）到 Quicker 临时分享并返回网址（他人可访问，有效期由服务器决定）。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `bool randomName = false` | true：网址使用随机文件名（保留扩展名）；false：网址保留原文件名。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件；访问网络；上传临时分享。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-encryptlocal" />

## Quicker.EncryptLocal

```csharp
string EncryptLocal(string text)
```

“自用加密”（与“加密解密”步骤的自用加密逐字节互通）：UTF-8 文本 → AES（固定 IV）→ Base64。密钥只由 Quicker 账号决定（同账号任意设备/动作可解，相同明文得到相同密文，无完整性校验），不适合对抗性场景；未登录报 ACCESS_DENIED。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="quicker-decryptlocal" />

## Quicker.DecryptLocal

```csharp
string DecryptLocal(string cipherText)
```

解密“自用加密”的 Base64 密文，返回 UTF-8 文本；需要“解密自用加密数据”能力（可解开本账号下任何动作保存的密文）。密文无效、不是本账号加密或结果不是 UTF-8 报 INVALID_ARGUMENT；未登录报 ACCESS_DENIED。

| 参数声明 | 说明 |
|---|---|
| `string cipherText` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：自用解密。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
