---
title: "清理剪贴板文本"
description: "读取、转换并写回剪贴板，处理没有文本的情况。"
quickerDocKey: v2/script-action/tutorials/clipboard
comments: false
sidebar_position: 2
---

读取、转换并写回剪贴板，处理没有文本的情况。

## 准备

复制一段首尾有空格的普通文本；这个例子会覆盖剪贴板文本。

## 完整源码

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

[下载源码](/files/script-action/clipboard.cs)

## 运行与预期结果

新建脚本动作并输入代码，检查后运行。“  你好  ”变成“你好”，结果页返回清理后的文本。

## 取消与失败

不弹对话框；动作停止前已完成的剪贴板写入不会撤回。

剪贴板被占用或授权拒绝时，结果页显示失败。没有文本时只通知，不写入。

## 相关 API

[Clipboard](../api/clipboard.md)、[Ui](../api/ui.md)
