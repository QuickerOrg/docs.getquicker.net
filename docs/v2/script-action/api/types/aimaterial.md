---
title: "AiMaterial"
description: "AiMaterial的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/aimaterial
comments: false
sidebar_position: 10
---

{/* script-api:start */}

字段与构造方法如下。

{/* script-api:end */}

## 创建材料

2.3.45 起，用以下静态方法创建材料，再放入 `OpenAssistantOptions.Materials`；不要直接构造 `AiMaterial`：

```csharp
AiMaterial.Text(string text, string? name = null)
AiMaterial.Image(Img? image)
AiMaterial.Files(IEnumerable<string> paths)
AiMaterial.WindowContext(long handle)
```

- `Text` 将日志、JSON 或正文作为文本附件，避免挤入提示词输入框。
- `Image` 使用图片变量，按 PNG 编码后最多 8 MiB；过大时先缩小图片。
- `Files` 提供本地文件或目录路径。受支持的图片、文本按规则导入内容，其它类型附带路径；附带路径不表示已经读取正文。
- `WindowContext` 附带窗口背景：`0` 表示调用时前台窗口，`-1` 表示不附带，其它值指定窗口句柄。沿用现有采集确认设置，不单独模拟复制选中文字。

更多发送与结果约定见 [qk.Ai.OpenAssistant](../ai.md#aiopenassistant)。
