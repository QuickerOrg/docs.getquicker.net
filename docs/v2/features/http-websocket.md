---
title: HTTP 与 WebSocket 服务
description: 开启 Quicker 本机或局域网服务，通过 HTTP 运行动作、复制与输入文本，并配置 WebSocket、安全连接及访问范围。
sidebar_position: 65
quickerDocKey: v2/features/http-websocket
comments: true
---

# HTTP 与 WebSocket 服务

在 **设置 → HTTP / WebSocket服务** 中，可以让脚本、快捷指令或其他设备调用这台电脑上的 Quicker。HTTP API 支持运行动作、复制、粘贴、模拟输入及打开网址或文件；WebSocket 供已有客户端保持连接使用。

本文适用于提供该设置页和 HTTP API 的 V2 版本。如果界面仍显示旧的手机 APP 设置，请先更新到包含此功能的版本。旧的“连接手机APP”菜单和二维码窗口已移除。

## 先完成一次调用

1. 打开设置页，在“基础设置”确认服务端口及是否启用安全连接。
2. 仅在这台电脑调用时，关闭“允许其他设备访问”；从其他设备调用时保持开启，并在“连接地址所用 IP”中选择可访问的局域网 IP。
3. 在“HTTP API”下点击“生成令牌”，然后启用 HTTP API。
4. 点击 **应用设置**，确认“运行状态”显示服务正在监听、HTTP 已开启。
5. 点击 **复制调用命令 ▾**，选择实际使用的终端，将命令粘贴到该终端运行。

默认示例会把 `Hello from HTTP API` 写入 **运行 Quicker 的电脑** 的剪贴板。返回 `ok: true`、`status: completed` 表示复制已完成。

复制的地址和命令使用当前编辑值。修改端口、安全连接、IP 或令牌后，应先应用设置，再调用；复制本身不会保存或启动服务。命令含有访问令牌，分享示例时请替换令牌。

## 基础设置

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| 服务端口 | `668` | HTTP 和 WebSocket 共用；被其他程序占用时可修改 |
| 启用安全连接（HTTPS / WSS） | 开启 | 同时决定 HTTP 使用 HTTPS、WebSocket 使用 WSS |
| 允许其他设备访问 | 开启 | 同时作用于 HTTP、WebSocket 及 WebSocket 服务提供的静态文件；关闭后仅监听本机 |
| 连接地址所用 IP | 以界面显示为准 | 用于生成连接地址，不限定监听网卡 |
| 启用 HTTP API / WebSocket 服务 | 均关闭 | 两个服务分别开启，使用 HTTP API 无需同时开启 WebSocket |

修改端口、安全连接或监听范围会重启共用服务，并影响现有连接。局域网调用还需要设备之间网络可达，且防火墙允许所选端口。

### HTTPS 域名与地址

安全连接使用 Quicker 提供的域名和证书。例如电脑 IP 为 `192.168.5.50`、端口为 `668` 时：

| 用途 | 安全连接地址 |
| --- | --- |
| HTTP 执行接口 | `https://192-168-5-50.lan.quicker.cc:668/api/exec` |
| WebSocket | `wss://192-168-5-50.lan.quicker.cc:668/ws` |
| 本机 HTTP 调用 | `https://127-0-0-1.lan.quicker.cc:668/api/exec` |

关闭安全连接时，使用 `http://IP:端口/api/exec` 或 `ws://IP:端口/ws`。优先复制设置页显示的地址；使用 HTTPS 时不要自行将域名换成数字 IP，否则可能无法通过证书校验。

域名需要能够正常解析，更新证书需要联网。运行状态会显示证书有效期。证书不可用时不会自动降级为明文连接。局域网访问请使用可信网络；HTTP 访问令牌和 WebSocket 验证码仍需分别配置。

## HTTP 调用命令

下面使用本机默认 HTTPS 地址。将 `REPLACE_WITH_YOUR_TOKEN` 替换为设置页复制的令牌；从另一台设备调用时，将地址替换为服务电脑的局域网调用地址。

### PowerShell（Windows）

打开 PowerShell，粘贴整段执行。请求体按 UTF-8 编码，也适用于中文文本。

```powershell
$body = '{"operation":"copy","data":"Hello from HTTP API","wait":true}'
Invoke-RestMethod -Method Post -Uri 'https://127-0-0-1.lan.quicker.cc:668/api/exec' -Headers @{ Authorization = 'Bearer REPLACE_WITH_YOUR_TOKEN' } -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

### curl（Windows CMD）

在 Windows **命令提示符**中执行下面这一行。CMD 使用双引号，JSON 内部的双引号需要保留下面的转义写法。

```bat
curl.exe --request POST "https://127-0-0-1.lan.quicker.cc:668/api/exec" --header "Authorization: Bearer REPLACE_WITH_YOUR_TOKEN" --header "Content-Type: application/json" --data-raw "{\"operation\":\"copy\",\"data\":\"Hello from HTTP API\",\"wait\":true}"
```

### curl（Bash / macOS / Linux）

这些设备通常需要调用 Windows 电脑的局域网地址，下面的 IP 仅为示例。

```bash
curl --request POST 'https://192-168-5-50.lan.quicker.cc:668/api/exec' --header 'Authorization: Bearer REPLACE_WITH_YOUR_TOKEN' --header 'Content-Type: application/json' --data-raw '{"operation":"copy","data":"Hello from HTTP API","wait":true}'
```

“原始 HTTP 请求”适合查看方法、请求头和正文，或在 HTTP 调试工具中分别填写这些内容，不能直接当作终端命令执行。请按实际工具选择命令格式；不要将 Markdown 链接的 `[地址](地址)` 整体粘贴进 URL。

## HTTP 请求参数

向 **`POST /api/exec`** 发送 JSON，并携带 `Authorization: Bearer 令牌` 和 `Content-Type: application/json`。请求体直接包含以下字段，无需 `id`、`method` 或 `params` 包装。

| 字段 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `operation` | 字符串，`"copy"` | 要执行的操作，见下表 |
| `data` | 字符串，`""` | 文本、按键表达式、网址、文件路径或动作输入参数；除 `action` 操作外不能为空 |
| `action` | 字符串，`""` | `operation` 为 `action` 时必填，可用动作 ID、名称或来源 ID；建议用动作 ID 避免重名 |
| `wait` | 布尔值，`false` | 是否等待执行结果 |
| `maxWaitMs` | 整数，`3000` | 等待上限，单位毫秒，范围 `1`～`60000`；仅 `wait: true` 时用于等待 |
| `dataType` | 字符串，`"text"` | 当前仅支持 `text`，可省略 |
| `source` | 字符串，`""` | 调用来源标记，最多 128 个字符，不参与鉴权 |

字段名和类型应按表填写，例如使用布尔值 `true`，而非字符串 `"true"`。不接受未知字段、重复字段或字符串字段的 `null` 值；请求正文最多 **32000 字节**。

| `operation` | 行为 | `data` 的含义 |
| --- | --- | --- |
| `copy` | 写入剪贴板 | 要复制的文本 |
| `paste` | 向目标窗口粘贴文本 | 要粘贴的文本 |
| `inputtext` | 向目标窗口输入普通文本 | 按文字内容输入，不解析为快捷键 |
| `input` / `sendkeys` | 模拟按键，两者含义相同 | SendKeys 按键表达式，例如 `^c` 表示 Ctrl+C |
| `open` | 使用 Windows 默认程序打开 | 网址或服务电脑上的文件路径 |
| `action` | 运行已存在的 Quicker 动作 | 传给动作的输入参数，可为空；另用 `action` 指定动作 |

输入和粘贴操作会影响服务电脑上的目标窗口，测试前请确认焦点。文件路径也以服务电脑为准。

例如运行动作并等待最多 10 秒：

```json
{
  "operation": "action",
  "action": "替换为动作ID",
  "data": "传给动作的输入参数",
  "wait": true,
  "maxWaitMs": 10000
}
```

## 返回结果与等待

执行完成时返回：

```json
{"ok":true,"result":{"status":"completed"}}
```

动作有返回值时，`result.data` 中还会包含返回字符串。`wait: false` 则只确认请求已受理：

```json
{"ok":true,"result":{"status":"accepted"}}
```

**`accepted` 不代表执行成功。** 需要结果时使用 `wait: true`。动作失败、取消或无法启动，会返回 `ok: false`，错误原因位于 `error.code` 和 `error.message`。

等待超时示例：

```json
{"ok":false,"error":{"code":"WAIT_TIMEOUT","message":"等待超时，操作可能仍在运行，请勿自动重试。"}}
```

`maxWaitMs` 只限制等待时间，超时或客户端断开不会撤销已开始的操作。**不要因等待超时自动重试**，否则可能重复运行动作或输入内容。当前没有事件订阅、后台结果查询或按请求 ID 取消的接口。

执行失败和等待超时也可能返回 HTTP `200`，调用方必须检查 JSON 中的 `ok`，不能只看 HTTP 状态码。

## WebSocket 与已有客户端

启用 WebSocket 服务后，在客户端使用设置页复制的 `/ws` 地址及对应验证码。HTTP 访问令牌和 WebSocket 验证码是两种不同凭据，不能相互替代；HTTP 的 JSON 执行请求也不能直接当作 WebSocket 消息发送。

已有 WebSocket 客户端继续使用原有消息协议，但要核对共享端口、安全连接和访问范围。修改验证码或关闭 WebSocket 后，应让客户端断开重连；如果需要立即清退全部旧连接，请退出并重新启动 Quicker。

WebSocket 服务还可提供“文档”目录下 `Quicker/_websocket` 中的静态文件。仅开启 HTTP API 时不会开放该静态文件目录。

## 设置保存在哪里

这些设置按当前账号保存在 **本机账号数据目录的 `data/local-settings.json`** 中，属于本地账号设置。端口、安全连接、访问范围、两个服务的开关与凭据均不随账号同步到其他电脑；换电脑后需要重新配置。HTTP 令牌在本机加密保存，不能靠复制文件让另一台电脑直接使用同一密文。

首次建立本地设置时会沿用已有的 WebSocket 配置。设置文件损坏、无法读取或版本不受支持时，会保留原文件并停止服务，页面提示错误；请先处理文件问题再重启，不要将此状态理解为成功恢复默认设置。

重置 HTTP 令牌后需要应用设置，旧令牌随后无法用于新请求；已经开始的操作不会因此撤销。更多账号目录与同步说明见 [账号、登录与数据同步](./account-and-sync.md)。

## 常见问题

### 连接失败或 HTTPS 握手失败

先确认运行状态显示服务正在监听、地址与应用后的设置一致。局域网调用检查 IP、网络和防火墙；HTTPS 还需检查域名解析、系统时间和证书状态。

如果使用代理，可以在 curl 命令中加入 `--noproxy "*"`，让这次请求直接连接。例如：

```bat
curl.exe --noproxy "*" --request POST "https://127-0-0-1.lan.quicker.cc:668/api/exec" --header "Authorization: Bearer REPLACE_WITH_YOUR_TOKEN" --header "Content-Type: application/json" --data-raw "{\"operation\":\"copy\",\"data\":\"Hello from HTTP API\",\"wait\":true}"
```

代理可能把解析到局域网的目标交给远端代理连接，导致无法到达本机服务。若绕过代理后恢复正常，可在代理软件中为 `lan.quicker.cc` 及其子域名配置直连；同时确认所选 IP 确实可达。`schannel` 握手错误本身不能单独证明是代理问题，不应以关闭证书校验代替排查。

### 返回端口格式错误或 Bad hostname

确认 URL 是纯地址，没有 `[地址](地址)` 形式的 Markdown 包装；在 CMD 中使用上面的 CMD 示例，不要使用 Bash 的单引号命令。

### HTTP 错误状态

| 状态 | 常见原因与处理 |
| --- | --- |
| `400` | JSON 字段、类型或操作不支持；检查 `error.code` |
| `401` | 缺少或使用了无效令牌；检查 Bearer 请求头及是否应用了新令牌 |
| `403` | 当前仅允许本机访问 |
| `404` | HTTP API 未开启，或请求路径错误 |
| `405` | 使用了非 POST 方法，例如直接在浏览器地址栏打开接口 |
| `408` | 请求正文读取超时 |
| `413` | 请求正文超过 32000 字节 |
| `415` | 未使用 `application/json` |
| `429` | 请求或运行容量已满，确认已有操作状态后再调用 |
| `503` | 服务退出、切换账号或配置变化，确认运行状态后再调用 |

此接口未开放跨域访问，不能假设任意网页中的 JavaScript 都能直接调用。优先使用脚本、快捷指令或 HTTP 客户端。

### 与其他网络功能有什么区别

- 本页服务让外部调用 Quicker，不需要云端推送服务转发。
- [软件连接](./software-connections/index.md)通过 Bridge 让 Quicker 调用第三方软件，使用独立的连接服务。
- 组合动作中的 [HTTP 服务](/v2/xaction/modules/httpserver)和 [WebSocket](/v2/xaction/modules/websocket)模块用于编写动作内的网络逻辑，独立于本页内置服务的开关和接口。
