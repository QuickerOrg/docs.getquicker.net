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
