string Main()
{
    var trim = new TextTool("去除首尾空白", input => input.Text.Trim());
    var upper = new TextTool("选区转大写",
        input => input.SelectedText.ToUpperInvariant(), Replace: "selection");
    return qk.Ui.Prompt("输入内容后点击文本工具", value: "  Hello  ",
        tools: "EditInCodeWindow", customTools: new[] { trim, upper }) ?? "已取消";
}
