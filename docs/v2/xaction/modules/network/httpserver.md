---
title: "HTTP服务器"
description: "创建临时的本地HTTP服务器，从而可以从移动端或其它设备访问。"
slug: "/v2/xaction/modules/httpserver"
sidebar_label: "HTTP服务器"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:httpserver"
comments: true
moduleKey: "sys:httpserver"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 66932563
legacyContentUpdatedAt: "2024-07-01T08:24:43.000Z"
---

# HTTP服务器

在本机对某个文件夹开一个临时网页服务，给手机或其它设备浏览、下载、上传。证书过期时请先升级 Quicker。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:httpserver" />

## 概述

常见用途：临时传文件、用手机看视频、启动后让手机端自动化来传文件。

<ModuleParamPreview moduleKey="sys:httpserver" />

<ShareLinkCard
  code="7a49ca6b-d243-4478-1e87-08d9f1ba2358"
  title="文件服务器"
  description="对当前资源管理器目录开服务并显示二维码"
  author="CL"
/>

## 参数说明

**操作类型**：创建文件服务器、关闭服务、获取服务状态。

### 创建文件服务器

**端口号**：1～65535，不能已被占用。`0` 表示自动找空闲端口。Windows 防火墙要把 Quicker 加入白名单，或放行该端口入站。

**启用HTTPS**：默认开启。开启后用 `https://转换后的本机局域网ip.lan.quicker.cc:端口` 访问：把 IP 里的 `.` 换成 `-`。例如本机 `192.168.1.56`、端口 `8080` → `https://192-168-1-56.lan.quicker.cc:8080`。这只是 IP 别名，别人不能凭这个域名进你的局域网。关掉则用 `http://本机局域网IP:端口`。

**文件夹路径**：网站根目录。打开网址会列出其中的文件和文件夹。不支持磁盘根目录。留空时（纯自定义请求）会在 Windows 临时目录建一个空目录。

**默认文档**：例如 `index.html`。目录下有这个文件时直接打开，而不是列目录。

**基础验证密码**：Basic Authentication 的密码，账号固定为 `quicker`。和别人共享网络时建议开。

**服务ID**：后续更新、关闭时用。再次用同一 ID 创建会先关掉旧服务。默认 `default`。

**闲置自动关闭**：若干秒没有新请求就关。`0` 表示不自动关。

**自动关闭时显示通知**：闲置超时关闭时是否弹通知。默认关闭。旧稿未写。

**自定义请求处理**：用子程序处理请求，格式见下文。

**HEAD插入代码** / **BODY插入代码**：生成目录页时，分别替换 `<!--HEAD-CODE-->`、`<!--BODY-CODE-->`，可用来加 CSS / JS。

**失败后停止**：失败是否中止动作。默认开启。

输出：

- **服务地址**
- **带账号的地址**：开了密码时为 `https://quicker:密码@网址:端口`。可做成二维码给手机扫。部分浏览器不支持这种 URL（iOS Safari 不支持，微信和 Chrome 支持；360 浏览器也不支持）。

### 关闭服务

关掉指定 **服务ID**。

<ModuleParamPreview
  moduleKey="sys:httpserver"
  focusKeys={['operation', 'serviceId', 'stopIfFail']}
  values={{operation: 'CloseServer', serviceId: 'default', stopIfFail: 'true'}}
/>

常见用法：开服务后显示等待窗口，关掉窗口再关服务；或加一条右键菜单来关。

### 获取服务状态

看某个服务是否在跑，或列出全部运行中的服务。

<ModuleParamPreview
  moduleKey="sys:httpserver"
  focusKeys={['operation', 'serviceId', 'stopIfFail', 'isSuccess', 'isRunning', 'serverList']}
  values={{operation: 'GetServerState', serviceId: 'default', stopIfFail: 'true'}}
/>

- **是否在运行**：指定 ID 是否在跑。
- **运行中的服务列表**

## 文件服务网页

![](./img/httpserver-004-1f37d5a3e3.png)

1. 当前路径的上级
2. 返回上级目录
3. 当前文件夹名
4. 缩略图。图片、视频可点进浏览模式。

![](./img/httpserver-005-67be9476a8.png)

5. 文件名。点击按浏览器默认方式打开或下载。
6. 文件大小。点击当附件下载。
7. 勾选文件或文件夹，打包下载。选中后会出现「全选」「下载」。
8. 上传到当前文件夹。

![](./img/httpserver-006-5a764aa2e7.png)

9. 全选当前目录。
10. 打包下载所选内容（只打成 zip，不压缩）。

## 程序调用上传文件

程序、脚本不必改 **自定义请求处理**，可直接调：

```text
POST /__api/upload
Content-Type: multipart/form-data
```

查询参数 `path` 指定根目录内的目标文件夹。省略则传到根目录；`path=/uploads/` 会传到 `uploads`，不存在就创建。

把 `D:\Temp\demo.txt` 传到 `uploads`：

```powershell
curl.exe -F "file=@D:\Temp\demo.txt" "http://127.0.0.1:8080/__api/upload?path=/uploads/"
```

成功返回 `200 OK` 和 JSON，不会跳到目录页：

```json
{
  "success": true,
  "files": [
    {
      "fieldName": "file",
      "name": "demo.txt",
      "path": "/uploads/demo.txt",
      "url": "/uploads/demo.txt",
      "size": 1234,
      "contentType": "text/plain"
    }
  ]
}
```

- `path` 是服务内的公开路径，不含电脑上的真实目录。
- `url` 经过网址转义，可继续 GET。
- 一次可传多个文件；若最终重名，请求会被拒绝并恢复上传前的文件，避免静默覆盖。
- `path` 不能指到根目录之外，也不能经过目录符号链接、junction 或其它重解析点。
- 必须是标准 `multipart/form-data`；普通文本、JSON 或伪造的相似类型返回 `415`。
- 非法路径、无文件等返回 400；落盘失败返回 500。错误正文为 `application/problem+json`。
- 沿用当前服务的 HTTPS、密码、监听范围和闲置关闭，不会另开服务或绕过密码。
- **自定义请求处理** 优先。规则若匹配 `POST /__api/upload`，仍交给对应子程序。

浏览器目录页原来的上传方式不变，成功后仍回目录页；程序要结构化结果时再用这个接口。

### 上传失败排查

标准 multipart 支持中文文件名。某个客户端传中文文件返回 500 时，更可能是它生成的 `Content-Disposition` 不标准，而不是 Windows 不支持中文路径。

请保留原始 multipart 请求，并查看：

1. HTTP 500 的完整响应正文；
2. Quicker 日志里的 `HTTP 文件上传失败`。

日志会记 `Content-Type`、`Content-Length`、`User-Agent` 和失败分段的 `Content-Disposition`，不会记文件正文、Cookie 或认证信息。文件名可能含隐私，这些诊断只写本机日志。

## 自定义请求处理

需要时用子程序自己处理 HTTP 请求。

1. 写路由：哪些请求交给哪个子程序。
2. 按模板定义子程序的输入输出。

<ShareLinkCard
  code="b89f2926-96a1-4c81-fad4-08d9f7308243"
  title="示例：自定义HTTP"
  description="自定义请求处理"
  author="CL"
/>

### 路由规则

在 **自定义请求处理** 里写：

- 每行一条，从上往下匹配，命中后不再看后面。
- 格式：`路径:HTTP方法列表:子程序名`
- 路径：URI 的 [AbsolutePath](https://docs.microsoft.com/en-us/dotnet/api/system.uri.absolutepath?view=net-6.0)，可写完整路径或正则。`/api` 匹配 `http://192.168.1.20:8080/api`；`\S+` 匹配全部。
- 方法：`GET`、`POST`、`PUT`、`DELETE`、`HEAD`，或 `*` 表示全部。例如 `GET`、`GET,POST`、`*`。
- 子程序须按规定定义输入输出。可导入 [模板子程序](https://getquicker.net/subprogram?id=c6f51262-75ca-4a39-fab7-08d9f7308243)。

下面这条表示任意路径的 GET/POST 都交给「http请求处理」：

<ModuleParamPreview
  moduleKey="sys:httpserver"
  focusKeys={['customRequest']}
  values={{
    operation: 'CreateFileServer',
    customRequest: '\\S+:get,post:http请求处理',
  }}
/>

<StepProgramView example="b89f2926-96a1-4c81-fad4-08d9f7308243" />

### 实现处理子程序

- 先导入模板再改。
- 子程序会被直接执行，主程序步骤不会跑，也不必把子程序加进步骤列表。
- 里面只处理数据并尽快返回，不要做界面交互。

#### 输入

![](./img/httpserver-008-7783207c79.png)

**Path**：网址的[路径](https://docs.microsoft.com/en-us/dotnet/api/system.uri.absolutepath)。例如 `http://192.168.5.114:810/2022年文件/系统设计?action=copy` 的路径是 `/2022年文件/系统设计`。

**QueryString**：问号起的查询串，如 `?action=copy`。

**QueryDict**：查询串转成的词典。

**Method**：GET / POST / PUT / DELETE / HEAD。

**FORM**：`x-www-form-urlencoded` 或 `multipart/form-data` 时解析出的表单词典。

**BODY**：`application/json` 或 `x-www-form-urlencoded` 时的完整请求体；其它类型为空。

**Files**：multipart 上传的文件会被存到服务目录，这里是完整路径列表。

表达式里还可以通过 `_context.ExtraData.HttpRequestEventArgs` 访问 [请求上下文](https://github.com/sta/websocket-sharp/blob/master/websocket-sharp/Server/HttpRequestEventArgs.cs)，直接读写响应。

#### 输出

**Processed**：若已用上面的上下文对象自己写过响应，设为 `true`，Quicker 就不再处理输出。

**StatusCode** / **ContentType** / **RespBody**：返回的状态码、MIME 类型和正文。

## 限制与排障

- HTTPS 证书过期：升级 Quicker。
- 手机访问不到：检查防火墙、是否和电脑同一局域网、HTTPS 域名是否按 IP 转换。
- 上传 500：先看日志里的 `HTTP 文件上传失败`，核对 multipart 是否标准。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/createqrcode',
      label: '生成二维码',
      description: '把服务地址做成二维码给手机扫。',
    },
    {
      href: '/v2/xaction/modules/showwaitwin',
      label: '等待窗口',
      description: '开着服务等用户关掉窗口，再关闭服务。',
    },
  ]}
/>

## 更新历史

- 20240701 增加 HTTPS 证书过期说明。
- 20260810 增加程序化上传 API 及失败排查。
