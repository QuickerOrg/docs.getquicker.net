---
title: Photoshop 软件连接
description: Photoshop Bridge 的兼容范围、安装启用、目标选择与常见限制。
slug: /v2/features/software-connections/software/photoshop
sidebar_position: 100
quickerDocKey: v2/software-connections/photoshop
comments: true
---

通过 Bridge，Quicker 可以调用 Photoshop 中的文档与图层、选择与图像处理、文件导出、UXP JavaScript等能力。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

25.0 及以上；已有 2026（27.1）真机记录。面向 Windows x64。支持范围不等于所有小版本均已真机测试；实际可安装的版本组合以安装器检测与选择结果为准。

## 安装前准备与首次启用

安装机制：**Adobe UPIA 管理的 UXP 插件**。

退出 Photoshop，确认 Adobe Creative Cloud 提供的 UPIA 可用，再使用统一安装器。生产使用无需 UXP Developer Tool。

启动 Photoshop，从“增效工具”打开 Quicker Bridge Status 状态面板，确认连接；保持插件容器正常运行。

## 确认连接

安装并重启后，打开 **Quicker 设置 → 软件连接 → Photoshop**，确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用；版本与当前文档摘要以实际结果为准。

宿主没有打开文档时，部分业务命令可能不可用；先测试连接，再测试文档命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

使用[Photoshop控制](/v2/xaction/modules/photoshopcontrol)，或在命令工具选择命令、填写参数后点击 **生成动作**，粘贴到 Quicker 面板。模块页提供只读的最小连接示例。

触发时对应软件必须位于前台，然后要求只有一个在线 Bridge 会话。这里检查前台软件类型，但不按前台进程精确选会话；多个在线会话时会拒绝执行。

动作不保存工具窗口选择的临时 session。请阅读[立即调用与动作目标的区别](../command-tool.md#动作怎样选择目标)，再配置快捷键、面板或轮盘触发。

## JavaScript 与 JSX：选择正确的执行方式

Photoshop 有两套不同的 JavaScript 运行环境。**Bridge 的“执行任意 JavaScript”指 UXP JavaScript，不是传统 JSX（ExtendScript）**。把 `.jsx` 改名为 `.js` 或 `.psjs` 不会自动转换脚本。

| 对比项 | Photoshop Bridge：UXP JavaScript | Adobe系列软件控制：JSX / ExtendScript |
| --- | --- | --- |
| Quicker 入口 | [Photoshop控制](/v2/xaction/modules/photoshopcontrol) → [脚本] 执行任意 JavaScript | [Adobe系列软件控制](/v2/xaction/modules/adobesoftscontrol) → Photoshop → 执行js脚本 / 执行js脚本文件 |
| 执行通道 | Photoshop 内的 UXP Bridge 插件 | Windows 低权限代理调用 Photoshop COM，不需要 Bridge |
| 输入内容 | UXP 代码文本；不是 `.psjs` 文件路径 | ExtendScript 代码，或 `.jsx` / `.js` 文件路径 |
| Photoshop 对象 | `require("photoshop")`；当前 Bridge 也预置 `photoshop`、`app`、`action`、`core`、`uxp` | 全局 `app`、`UnitValue`、`ResampleMethod` 等旧脚本对象 |
| 读取像素宽高 | `doc.width`、`doc.height`，直接得到数值 | `doc.width.as("px")`、`doc.height.as("px")` |
| 修改文档 | 通常需要 `core.executeAsModal()`，异步 API 使用 `await` | 使用 ExtendScript 的同步 API，无需 UXP 模态包装 |
| 语法 | 支持现代 JavaScript、Promise、async/await；不支持 `#target`、`UnitValue` 等 ExtendScript 写法 | 使用旧版 JavaScript 语法；不要直接使用 UXP 的 `require("photoshop")`、async/await |
| 返回结果 | Bridge 等待脚本求值产生的 Promise，结果转换为 JSON 文本 | 开启“等待执行结束”后接收简单类型的脚本输出；不是 Bridge JSON 结果 |

### 已有 JSX 怎么运行

在“Adobe系列软件控制”中选择 Photoshop，然后：

- **执行js脚本**：把原始 JSX 放入“脚本内容”。
- **执行js脚本文件**：把已有 `.jsx` 文件的完整路径放入“脚本文件路径”。

先启动 Photoshop。该方式复用已有 COM 接口，不按 Bridge 会话选择目标，多版本或多实例请参阅[该模块的限制](/v2/xaction/modules/adobesoftscontrol)。如果需要结果，开启“等待执行结束”；接口失败后的 EXE 兼容方式不能确认脚本成败，也不能等待其完成。

Bridge 当前没有单独的 JSX 执行命令，不会把输入自动转交给 ExtendScript。无需为了运行已有 JSX 安装或修改 Bridge。Adobe 开发者论坛对 UXP 内通过 BatchPlay 间接启动 JSX 的做法提示了兼容性和分发风险，因此不把它作为受支持的运行入口。参见 [Adobe 开发者论坛说明](https://forums.creativeclouddeveloper.com/t/can-i-run-javascript-jsx-file-using-uxp-button/3006/3)。

### Bridge 脚本的写法

只读测试可以直接填写：

```javascript
photoshop.app.documents.length
```

需要异步修改文档时，用 async 自执行函数，并让它成为脚本最后求值的表达式。下面的 UXP 示例把当前图像等比例缩小到最长边 500 像素，小图不放大，不自动保存。请先在图片副本中测试：

```javascript
(async () => {
    const { app, core, constants } = require("photoshop");
    return await core.executeAsModal(async () => {
        if (app.documents.length === 0) {
            throw new Error("请先打开一张图片。");
        }
        const doc = app.activeDocument;
        const scale = Math.min(1, 500 / Math.max(doc.width, doc.height));
        if (scale < 1) {
            await doc.resizeImage(
                Math.max(1, Math.round(doc.width * scale)),
                Math.max(1, Math.round(doc.height * scale)),
                doc.resolution,
                constants.ResampleMethod.BICUBICSHARPER
            );
        }
        return { width: doc.width, height: doc.height };
    }, { commandName: "最长边缩小到500像素" });
})()
```

“执行任意 JavaScript”默认**不自动进入模态作用域**。上例在脚本中自行调用 `executeAsModal()`；如果改用自定义 `script.evaluate` 命令，也可以通过参数 `modal: true` 让 Bridge 包装模态作用域，此时不要再嵌套同样的包装。

粘贴代码时只复制代码内容，不要复制 Markdown 的三反引号、`javascript` 标记或说明文字。JSX 中的 `#target photoshop` 不是 UXP 语法，删除这一行也不代表其余旧 API 已兼容。无文档等错误可通过 `throw new Error(...)` 返回给 Quicker，不要直接照搬 ExtendScript 的全局 `alert()`。

接口参考：[Adobe UXP 与 ExtendScript 的区别](https://developer.adobe.com/photoshop/uxp/guides/uxp_for_you/uxp_for_extendscript_devs)、[Document API](https://developer.adobe.com/photoshop/uxp/2022/ps-reference/classes/document)、[executeAsModal](https://developer.adobe.com/photoshop/uxp/2022/ps-reference/media/executeasmodal)。

## 限制与排障

需要前台 Photoshop 且唯一在线会话。重复加载插件可能暂时留下同名会话，刷新并等待旧会话消失；模态操作可能阻塞调用。

命令全集来自当前实例的 `command.list`，本文不保证每个命令在所有宿主版本或文档状态下均可用。遇到问题先保存错误和版本信息，按[通用排障](../troubleshooting.md)定位安装、加载、连接或命令执行阶段。

## 相关页面

- [Photoshop控制模块参考与最小示例](/v2/xaction/modules/photoshopcontrol)
- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
