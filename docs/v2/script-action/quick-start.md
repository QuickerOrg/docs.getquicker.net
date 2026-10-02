---
title: "快速开始：清理剪贴板文本"
description: "新建、检查、运行并保存第一个脚本动作。"
quickerDocKey: v2/script-action/quick-start
comments: false
sidebar_position: 2
---

这个例子读取剪贴板文本，去掉首尾空白，再把结果写回剪贴板。先复制一段可用于测试的普通文本，例如“  你好  ”。

## 新建并输入代码

新建动作，选择“Quicker脚本动作”，填写标题“清理剪贴板”。把编辑器模板替换为下面的完整源码：

```csharp
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
```

## 检查与运行

1. 点击“检查”，处理“问题”页中的错误。
2. 点击“运行”或按 F5。新建动作尚未保存时也能在编辑器中运行。
3. 剪贴板中的“  你好  ”应变成“你好”；“结果”页显示返回值，通知显示“已清理剪贴板”。
4. 点击保存，再从面板运行一次。保存源码与执行源码是两个操作。

如果剪贴板没有文本，会提示“剪贴板中没有文本”，不会写回。读取/写入被其他程序占用时可能失败，先看结果和日志，再参阅[常见问题](./troubleshooting.md)。

这个示例会真实覆盖剪贴板文本；如需保留原内容，请先复制到其他地方。自建动作通常不会弹能力确认，从外部导入的同类动作则可能需要授权。

下一步：[参数与返回值](./parameters.md)、[断点调试](./debugging.md)、[更多完整示例](./tutorials/index.md)。
