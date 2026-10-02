string Main([ActionParameter("窗口标题包含")] string title)
{
    var window = qk.Window.Find(title: title);
    if (window == null)
    {
        qk.Ui.Notify("没有找到匹配窗口", kind: "warn");
        return "未找到";
    }
    qk.Window.Activate(window);
    return window.Title;
}
