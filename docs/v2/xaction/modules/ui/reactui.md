---
title: "React 界面"
description: "用单文件 TSX 显示可交互窗口，通过 Quicker.close 把结果写回动作。"
slug: "/v2/xaction/modules/reactui"
sidebar_label: "React 界面"
sidebar_position: 125
quickerDocKey: "xaction/module/sys:reactui"
comments: true
moduleKey: "sys:reactui"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# React 界面

用单文件 TSX 编写可交互窗口：用户点确定后，界面把数据通过 **返回结果** 交给后续步骤；取消或关窗则视为用户取消。适合需要自定义布局、动态校验或比固定表单更灵活的输入场景。

:::info 与其它界面步骤怎么选

- 固定字段、拖拽设计表单：用 [多字段表单](/v2/xaction/modules/form)。
- 需要 WPF / XAML、复杂桌面绑定：用 [自定义窗口](/v2/xaction/modules/customwindow)。
- 要加载外部网页或与网页双向通信：用 [WebView2浏览器窗口](/v2/xaction/modules/webview2)。
- 键鼠自动化脚本、不需要弹窗界面：用 [自动化脚本](/v2/xaction/modules/automationscript)。
- 本模块：用 React + Quicker 内置组件快速做卡片式弹窗，逻辑写在 **TSX 源码** 里。

:::

## 当前模块定义

<XActionModuleMeta moduleKey="sys:reactui" />

## 快速开始

在组合动作里添加 **React 界面**。步骤自带一份可运行的默认 **TSX 源码**，直接运行即可看到名称输入窗。

典型用法分三步：

1. 在上游步骤准备好 **输入数据**（词典或 JSON），例如 `{ "name": "任务 A", "title": "填写名称" }`。
2. 界面里用 `Quicker.getInput()` 读取这份数据（只读）。
3. 用户点确定时调用 `Quicker.close({ ... })`，把对象写入本步骤 **返回结果**；后续步骤读取变量 `reactResult`（默认名）即可。

```tsx
import Quicker from "Quicker";
import { Button, Field, Panel, Stack, TextField } from "QuickerUi";

export default function App() {
  const input = Quicker.getInput<{ title?: string; name?: string }>() ?? {};

  return (
    <main className="qk-ui-page">
      <Panel
        title={input.title ?? "React 界面"}
        footer={
          <>
            <Button onClick={() => Quicker.cancel()}>取消</Button>
            <Button variant="primary" onClick={() => Quicker.close({ name: "示例" })}>
              确定
            </Button>
          </>
        }
      >
        <Stack>
          <Field label="名称">
            <TextField defaultValue={input.name ?? ""} wide />
          </Field>
        </Stack>
      </Panel>
    </main>
  );
}
```

<ModuleParamPreview moduleKey="sys:reactui" />

## 数据怎么进出动作

本模块**不提供**在 TSX 里直接读写动作变量的 API（没有 `vars.get` / `vars.set`）。请按下面三种通道理解：

| 通道 | 方向 | 用法 |
| --- | --- | --- |
| **输入数据** | 动作 → 界面 | 步骤参数 **输入数据** → `Quicker.getInput()`，打开时的一次性快照 |
| **返回结果** | 界面 → 动作 | `Quicker.close(result)` → 输出 **返回结果**（默认变量名 `reactResult`） |
| **草稿 storage** | 本机持久化 | `Quicker.storage` / `useQuickerStorage`，同一动作下次打开可回填，**不会**自动写入动作变量 |

```text
上游步骤 / 输入数据  →  Quicker.getInput()     （只读）
Host 草稿 storage   →  useQuickerStorage(...)  （按动作保存，可选）
Quicker.close(result) →  返回结果 / reactResult  （交给后续步骤）
Quicker.cancel()      →  已取消 = 真
```

**输入数据** 可以是词典、列表、数字、文本等；若填 JSON 文本，运行时会尝试解析成对象。界面里改动的内容，只有在你调用 `Quicker.close` 时才会回到动作。

## TSX 源码编写规则

**TSX 源码** 必须是**单文件**，并 **`export default` 一个 React 组件**。

### 允许导入的模块

运行时只解析以下 import（区分大小写）：

| 模块名 | 用途 |
| --- | --- |
| `react` | React 本身 |
| `Quicker` | 与 Host 通信（关闭、取消、读输入、草稿等） |
| `QuickerUi` | Quicker 内置界面组件 |

示例：

```tsx
import { useState } from "react";
import Quicker from "Quicker";
import { Button, Panel } from "QuickerUi";
```

以下写法**不支持**，保存或运行时会报错：

- `import()` 动态导入
- `require(...)`
- 从 npm 包、本地路径或其它名称导入（例如 `"lodash"`、`"./helper"`）

### 体积与其它限制

- **TSX 源码** 不超过 128 KiB。
- 界面在沙箱中运行：不能任意访问网络、文件系统或执行系统命令。
- 编译失败时，窗口会显示错误信息，动作按失败或取消处理（取决于 **取消后停止**）。

## Quicker API

`Quicker` 由 Quicker 在运行时注入，不是 npm 包。

| API | 说明 |
| --- | --- |
| `Quicker.getInput<T>()` | 读取步骤 **输入数据** 的快照 |
| `Quicker.close(result?)` | 关闭窗口并把 `result` 写入 **返回结果** |
| `Quicker.cancel()` | 取消并关闭，**已取消** 为真 |
| `Quicker.notify(message)` | 弹出 Quicker 提示消息 |
| `Quicker.theme` | 当前主题：`"dark"` 或 `"light"` |
| `Quicker.storage.get(key, defaultValue?)` | 读取草稿（Promise） |
| `Quicker.storage.set(key, value)` | 写入草稿 |
| `Quicker.storage.remove(key)` | 删除键 |
| `Quicker.storage.keys()` | 列出已有键 |

组件仍可通过 props 接收 `input` / `close` / `cancel` / `notify`（与上面 API 等价）；推荐直接使用 `Quicker.*`。

## QuickerUi 组件

从 `QuickerUi` 按需导入，用于快速搭界面（样式随 Quicker 主题变化）：

| 组件 / 钩子 | 典型用途 |
| --- | --- |
| `Panel` | 带标题、页脚的操作卡片 |
| `Stack` / `Row` | 纵向 / 横向布局 |
| `Field` | 带标签的表单项容器 |
| `TextField` | 单行输入 |
| `Button` | 按钮（含 `variant="primary"`） |
| `Switch` / `Segmented` / `Chip` | 开关、分段选择、标签 |
| `Banner` / `EmptyState` | 提示条、空状态 |
| `FilterBox` | 筛选输入框 |
| `ChatFrame` / `MessageBubble` | 对话式布局演示 |
| `StepList` / `StepProgramView` | 展示步骤列表（如说明性 UI） |
| `useQuickerStorage(key, default)` | 带 Host 持久化的 state，用法类似 `useState` |

外层建议使用 `<main className="qk-ui-page">`，以便与窗口边距、主题一致。

### 草稿 storage 示例

若希望用户上次填写的名称在**同一动作**下次运行时仍保留，可用 `useQuickerStorage`：

```tsx
import Quicker from "Quicker";
import { TextField, useQuickerStorage } from "QuickerUi";

export default function App() {
  const input = Quicker.getInput<{ name?: string }>() ?? {};
  const [name, setName] = useQuickerStorage("name", input.name ?? "");

  return (
    <TextField value={name} onChange={(e) => setName(e.target.value)} wide />
  );
}
```

说明：

- 草稿按**已保存的动作**分别存储；未保存的临时动作仅在本机当次有效。
- 键名仅允许字母、数字、`.`、`_`、`-`，最长 128 字符；每个动作最多 64 个键，单值不超过 64 KiB，总容量约 256 KiB。
- 这是 **Host 管理的草稿**，不是浏览器网页里的 `localStorage`；也不会自动同步到其它电脑。

## 窗口行为

- 窗口为卡片式布局，无传统系统标题栏；**窗口标题** 显示在卡片顶部。
- **窗口宽度** / **窗口高度** 表示允许的最大尺寸（像素）；内容较小时窗口会随卡片收缩。
- 按 **Esc** 或点关闭，相当于 `Quicker.cancel()`。
- **取消后停止** 为真时，取消或关闭会中止后续步骤（与多数界面步骤一致）。

## 输出与后续步骤

| 输出 | 含义 |
| --- | --- |
| **是否成功** | 正常 `close` 且无编译/运行错误时为真 |
| **返回结果** | `Quicker.close` 传入的对象或值 |
| **已取消** | 用户取消、关窗或动作被中止 |

后续步骤可判断 **已取消**，或读取 **返回结果** 里的字段，例如 `{var:reactResult.name}`（变量名以你在步骤里设置的为准）。

## 限制与排障

| 现象 | 可能原因 |
| --- | --- |
| 提示「必须使用 export default」 | 组件未默认导出 |
| 提示「仅允许从 react / QuickerUi / Quicker 导入」 | 使用了不允许的 import |
| 界面空白或报错面板 | TSX 语法错误、运行时异常；查看窗口内错误文案 |
| `getInput()` 不是预期结构 | **输入数据** 不是合法 JSON，或上游变量类型不对 |
| 草稿未保留 | 动作未保存（无稳定动作 ID）；或键名不符合规则 |
| 修改源码后仍像旧界面 | 确认已保存步骤并重新运行动作 |

## 相关链接

- [多字段表单](/v2/xaction/modules/form) — 固定字段、可视化表单设计
- [自定义窗口](/v2/xaction/modules/customwindow) — WPF / XAML 自定义界面
- [自动化脚本](/v2/xaction/modules/automationscript) — JavaScript 桌面自动化（数据流同样用 `getInput` / `export default`）
- [动作变量](/v2/xaction/concepts/variables) — 在步骤之间传递数据
