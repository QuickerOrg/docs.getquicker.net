object? Main(
    [ActionParameter("动作名称或 Id")] string action,
    [ActionParameter("传入文本", Ask = true)] string input = "")
{
    return qk.Actions.Call(action, input);
}
