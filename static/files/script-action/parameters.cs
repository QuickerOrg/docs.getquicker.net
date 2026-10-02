string Main(
    [ActionParameter("文本", MultiLine = true)] string text,
    [ActionParameter("模式", Options = "大写|upper\n小写|lower")] string mode = "upper")
{
    return mode == "upper" ? text.ToUpperInvariant() : text.ToLowerInvariant();
}
