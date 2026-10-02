int Main()
{
    var count = qk.State.Get("count", 0) + 1;
    qk.State.Set("count", count);
    qk.Ui.Notify("已运行 " + count + " 次");
    return count;
}

[ActionMenu("工具/查看计数")]
void ShowCount()
{
    qk.Ui.Alert("已运行 " + qk.State.Get("count", 0) + " 次");
}

[ActionMenu("工具/重置计数")]
void ResetCount()
{
    qk.State.Remove("count");
    qk.Ui.Notify("已重置");
}
