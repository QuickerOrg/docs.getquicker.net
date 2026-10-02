---
title: "读取并解析 JSON 接口"
description: "请求用户指定的 JSON 地址，解析响应并输出格式化数据。"
quickerDocKey: v2/script-action/tutorials/http-json
comments: false
sidebar_position: 6
---

请求用户指定的 JSON 地址，解析响应并输出格式化数据。

## 准备

准备可信、无认证的 JSON 接口或本机测试接口；请求会向该地址发送网络流量。示例不自动附带浏览器 Cookie。

## 完整源码

```csharp
string Main([ActionParameter("JSON 地址")] string url)
{
    try
    {
        var text = qk.Http.GetText(url);
        var data = JsonNode.Parse(text);
        return data == null ? "null" : data.ToJsonString();
    }
    catch (ActionApiException e)
    {
        qk.Log(e.Code.Value + " @ " + e.OperationId + "：" + e.Message, "error");
        return "请求失败，详见日志";
    }
}
```

[下载源码](/files/script-action/http-json.cs)

## 运行与预期结果

输入返回 `{"message":"hello"}` 的地址，结果应为等价 JSON 文本。

## 取消与失败

没有额外对话框；停止或超时会取消脚本等待，但服务端可能已收到请求。

HTTP 错误记录错误码和调用名，并返回失败说明；非 JSON 内容会产生解析错误。登录页面返回的 HTML 不能当 JSON 解析。

## 相关 API

[Http](../api/http.md)、[错误处理](../troubleshooting.md)
