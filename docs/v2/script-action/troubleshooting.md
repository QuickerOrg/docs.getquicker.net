---
title: "常见问题与错误处理"
description: "诊断检查错误、运行异常、用户取消、超时与外部依赖。"
quickerDocKey: v2/script-action/troubleshooting
comments: false
sidebar_position: 14
---

## 常见错误与排查

### 读懂错误：错误码与 OperationId

`qk` 调用失败时抛出 `ActionApiException`（不需要 `using`）。它有四个关键信息：

| 属性 | 含义 | 示例 |
|---|---|---|
| `e.Code.Value` | **错误码**，稳定的英文大写字符串，用来判断失败原因 | `FILE_NOT_FOUND`、`CAPABILITY_DENIED` |
| `e.OperationId` | 出错的**调用名**，与源码中的写法对应 | `Files.ReadText`、`Img.Crop` |
| `e.Detail` | 扩展错误码（可能为 `null`），如浏览器扩展、被调动作返回的具体原因 | `URL_PATTERN_MISMATCH` |
| `e.Message` | 中文错误说明，只用于阅读 | “文件不存在：…” |

`OperationId` 的取值：

- `域.方法`：如 `Files.ReadText`、`Window.Activate`；根方法为 `Log`、`Wait`；
- `类型.成员`：图片、文本窗口、进度窗口等句柄上的方法，如 `Img.Crop`、`TextWin.Append`、`ProgressWin.Update`；
- `input`：绑定 `Main` 参数时出错（如缺少必填参数，错误码 `INPUT_MISSING`）；
- `return`：转换返回值时出错（如返回了 `Win`）；
- `run`：运行前的准备阶段出错（如用户拒绝了授权，错误码 `CAPABILITY_DENIED`）。

在脚本里按错误码处理：

```csharp
string Main(string path = @"C:\temp\不存在.txt")
{
    try
    {
        return qk.Files.ReadText(path);
    }
    catch (ActionApiException e) when (e.Code == ActionErrorCode.FileNotFound)
    {
        return null;   // 文件不存在就返回空
    }
    catch (ActionApiException e)
    {
        // 其他失败：把错误码、调用名和扩展码写进日志，便于排查
        qk.Log($"{e.Code.Value} @ {e.OperationId}，Detail={e.Detail ?? "无"}：{e.Message}", "error");
        return null;
    }
}
```

- 每个错误码都有同名的静态成员（错误码的帕斯卡写法，如 `ActionErrorCode.FileNotFound`），也可以写 `e.Code.Value == "FILE_NOT_FOUND"`。
- **不要解析 `e.Message`**：消息文字可能随版本调整，错误码用于程序判断，不随消息文字变化。
- 没有捕获的错误会让动作运行失败，“结果”页只显示错误说明文字，不单独显示错误码与 OperationId；需要时按上面的写法记录到日志。
- 全部错误码见 [API 参考·错误码表](./api/index.md)。

### 用户取消与停止

- **用户取消对话框不是错误**：`qk.Ui.Select`、`Prompt`、`Form`、`PickFile` 等取消时返回 `null`，`Confirm` 返回 `false`。
- **停止不是错误**：用户点停止、超过动作超时、被调用的动作被取消时，脚本会被停止，`catch` 捕获不到（包括 `catch (Exception)`），只会执行 `finally`。停止后的 `finally` 里只能做有限的清理（如写日志、恢复剪贴板、松开按键、清除角标），其他 `qk` 调用会报 `CAPABILITY_DENIED`。

### 常见问题速查

| 现象 / 错误 | 可能原因 | 处理 |
|---|---|---|
| 检查提示“不能声明类/命名空间” | 写了 `class`、`record`、`namespace` | 改用元组、匿名类型或字典；只写方法 |
| 检查提示 `File`/`HttpClient`/`Thread.Sleep` 等不可用 | 使用了有副作用的 .NET 类型 | 按[语言与脚本结构](./language.md)中的对照表改用 `qk` |
| 检查提示 `async`/`await` 不支持 | 脚本是同步执行的 | 去掉 `async`/`await`，`qk` 调用本身就是同步的 |
| 编辑器里运行时选中文本为空 | 直接运行时前台是编辑器 | 改用“最小化后延迟运行” |
| “脚本执行超时（30000 毫秒…）” | 超过动作超时；等待对话框、按键的时间也计入 | 在编辑器调大超时，交互式脚本建议 ≥ 300 秒；计时/监视类可设为不限制 |
| `CAPABILITY_DENIED` | 未获授权；在停止后的 `finally` 中调用了不允许的方法；`qk` 写法无法识别 | 见 [安全与授权](./security.md)；**直接写 `qk.域.方法(...)`**，不要把 `qk` 或 `qk.Files` 赋给变量、当参数传递或写 `qk?.` |
| “请先保存动作；只有动作编辑器中的临时调试运行可以逐次确认权限。” | 需要授权确认的动作（如导入的动作）还没有保存，且不是从编辑器运行 | 先保存动作再运行 |
| `INPUT_MISSING`（OperationId 为 `input`） | 非交互触发且缺少必填参数 | 给参数加默认值，或从面板等交互方式触发 |
| `CODEC_UNSUPPORTED`（OperationId 为 `return`） | 返回或写入状态的值里含 `Win`、`Img` 等句柄 | 返回 `qk.Window.Info(w)`、`img.ToBase64()` 等数据 |
| `CODEC_VALUE_INVALID` | `qk.State.Get<T>` 读回的数据与类型不符 | 检查写入与读取的类型是否一致；文本状态用 `GetText` |
| `INPUT_LIMIT_EXCEEDED` | 键盘输入超出本次运行的限额（如 `Type` 累计超过 2000 字符） | 之后本次运行的键鼠输入全部失败；长文本改用 `qk.Keyboard.Paste` |
| `WINDOW_LIMIT_EXCEEDED` | 窗口查询/操作次数超限 | 用 `FindAllInfo` 一次取回多个窗口信息，避免循环里逐个 `Info` |
| `ELEVATED_TARGET_DENIED` | 目标是管理员权限运行的程序 | 普通权限下无法操作管理员窗口 |
| 右键菜单点击提示“源码已更新” | 保存了新源码，菜单还是旧的 | 重新打开右键菜单 |
| 检查提示“`qk.X.Y` 在当前 Quicker 中不存在” | 成员名写错，或当前 Quicker 版本没有它 | 按补全列表改正，或更新 Quicker |

排查的一般顺序：先点“检查”→ 看“问题”页；再运行 → 看“结果”页和“日志”页；仍不明白时点“让 AI 修复”，或用 `try/catch` 把 `e.Code.Value`、`e.OperationId`、`e.Detail` 记到日志里。
