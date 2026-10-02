string Main()
{
    var text = qk.Clipboard.GetText();
    if (text == null)
    {
        qk.Ui.Notify("剪贴板中没有文本");
        return "";
    }
    var result = text.Trim();
    qk.Clipboard.SetText(result);
    qk.Ui.Notify("已清理剪贴板", kind: "success");
    return result;
}
