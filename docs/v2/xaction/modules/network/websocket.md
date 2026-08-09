---
title: "Websocket"
description: "Websocket相关操作"
slug: "/v2/xaction/modules/websocket"
sidebar_label: "Websocket"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:websocket"
comments: true
moduleKey: "sys:websocket"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "108b5640bc25076c4846cda5dd5dad95d5e9a23d56d3d5a662d7e8fdd39e35af"
legacyDocId: 66932334
legacyContentUpdatedAt: "2022-02-25T12:22:45.000Z"
---

# Websocket

Websocket相关操作

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:websocket`
- 分类：网络服务（`Network`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作类型 | `Enum` | CreateClient | 是 | `Input` |  |  |
| `server` | 服务器地址 | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient |  |
| `clientId` | 连接ID | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient, SendMsgToServer, GetClientState, CloseClient | 用于区分不同的客户端连接。连接相同id的客户端时，前一个连接会被自动关闭。 |
| `spName` | 消息处理子程序 | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient | 使用子程序处理从websocket服务接收到的消息。详情请参考文档。 |
| `account` | 账号密码 | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient | 支持Basic和Digest认证方式。多行填写。第一行写账号，第二行写密码。 |
| `origin` | Origin | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient | 仅需要时填写 |
| `cookie` | Cookie | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient | 请求的cookie内容 |
| `content` | 消息内容 | `Text` |  | 否 | `UseVarOrInput` | 仅：CreateClient, SendTextToClient, SendFileToClient, SendFileToClientBase64, SendMsgToServer | 文本内容。发送文件时为文件的完整路径。 |
| `callbackOnClose` | 服务断开时通知动作(调用动作并传入参数:websocket__closed) | `Boolean` | true | 否 | `Input` | 仅：CreateClient | 是否等待服务器响应 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `isConnected` | 是否连接 | `Boolean` | 仅：GetClientState | 指定客户端是否连接到远程服务器 |

## 选项值

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `CreateClient` | 客户端：连接到Websocket服务 |  |
| `SendMsgToServer` | 客户端：向Websocket服务发送消息 |  |
| `GetClientState` | 客户端：获取连接状态 |  |
| `CloseClient` | 客户端：关闭连接 |  |
| `SendTextToClient` | 服务器：向连接的客户端发送文本 |  |
| `SendFileToClient` | 服务器：向连接的客户端发送文件(二进制方式) |  |
| `SendFileToClientBase64` | 服务器：向连接的客户端发送文件(Base64方式) |  |
{/* xaction-metadata:end */}

主要有2个功能：

-   创建WebSocket客户端以连接第三方websocket服务。
-   向连接到[本机Websocket服务](https://getquicker.net/KC/Manual/Doc/websocketservice)的客户端发送数据。

![](./img/websocket-001-ebc7a182e1.png)

## 创建Websocket连接

当Quicker作为websocket客户端连接第三方服务时使用。

大概的使用流程：

-   先设计好接收消息处理子程序。
-   连接到Websocket服务，并指定“连接ID”和接收消息处理子程序。连接将会建立并保持（即使动作已经结束）。

-   需要时，通过指定 “连接ID” 向Websocket服务器发送消息。
-   接收到消息后，Quicker会调用创建连接时指定的子程序，并将子程序的输出发送给Websocket服务器。

### 设计接收消息处理子程序

在收到消息时（仅支持文本消息），Quicker将会调用设定的子程序，并将详细内容传入Data参数变量中。

![](./img/websocket-002-d3e9cf9c3a.png)

处理完成后，将要返回的结果赋值给Response输出变量。 如果Response变量内容不为空，Quicker会将此内容返回给Websocket服务器。

子程序会被直接调用，因此不需要将其添加到主程序步骤中。 主程序的步骤也不会被执行。

### 连接到Websocket服务

向指定的服务器建立连接并保持。

![](./img/websocket-003-208456130d.png)

【服务器地址】第三方websocket服务器地址。

【连接ID】标识一个连接。可在后续步骤中通过指定此id向对端服务器发送消息，也可用于获取连接状态或关闭连接。

【消息处理子程序】设定用于处理接收到的消息的子程序。

【消息内容】连接后立即发送的消息内容。

【账号密码】支持Basic Authentication、Digest Authentication。第一行写用户名，第二行写密码。

【cookie】请求附带的cookie内容。格式为每行一个，每个为 name:value 的形式。

【origin】可选。请求的http来源信息。



### 向Websocket服务发送消息

![](./img/websocket-004-a824988831.png)

### 获取连接状态

获取连接是否建立的信息。

### 关闭连接

关闭指定ID的连接。

### 示例动作

在 `https://tools.getquicker.cn/ws` 提供websocket了“回显”（返回客户端所发送的数据）服务可供测试。

-   [WebSocket操作](https://getquicker.net/Sharedaction?code=16cd6907-13d1-45bb-9c56-08d9f836c603)

## 通过Webscoekt服务向客户端发送内容

向连接到 [webscoket服务](https://getquicker.net/KC/Manual/Doc/websocketservice) 的所有客户端发送内容。

![](./img/websocket-005-20c5252288.png)

操作类型可选：发送文本、二进制方式或Base64方式发送文件。

具体消息格式要求请参考[websocket服务文档](https://getquicker.net/KC/Manual/Doc/websocketservice)中的内容。
