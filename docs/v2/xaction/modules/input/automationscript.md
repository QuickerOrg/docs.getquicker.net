---
title: "自动化脚本"
description: "使用 JavaScript 编排鼠标、键盘等桌面自动化操作。"
slug: "/v2/xaction/modules/automationscript"
sidebar_label: "自动化脚本"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:automationScript"
comments: true
moduleKey: "sys:automationScript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 自动化脚本

使用 JavaScript 编排鼠标、键盘、Quicker 提示消息、文本剪贴板以及屏幕识别相关操作。适合坐标数组、循环、网格、批量点击、键鼠组合以及根据运行结果显示消息或读写文本这类用普通步骤不方便表达的自动化。

:::warning 安全提示

导入 `mouse` 或 `key` 时，本模块会操作真实鼠标和键盘。首次运行相关能力时需要确认桌面控制权限；脚本运行期间，用户操作键盘或鼠标会接管并取消脚本。导入 `clipboard` 时也需要确认本机剪贴板权限。请先用少量输入测试，不要一开始就对重要数据执行大量点击、按键、剪贴板写入或文本输入。

:::

## 应该选择哪个模块

- 只做一次移动、点击或找图定位：使用[鼠标输入](/v2/xaction/modules/mouse)。
- 执行很短的键盘、鼠标指令串：使用[多步骤输入](/v2/xaction/modules/inputscript)。
- 需要循环、数组、条件判断、坐标计算、热键、键鼠组合、提示消息、文本剪贴板或脚本化识别定位：使用本模块。
- 需要通用 JavaScript、动作变量读写或可选 CLR：使用[运行 Javascript 代码](/v2/xaction/modules/jsscript)。它与本模块的语法和安全边界不同。

本模块专门提供受控的桌面自动化能力，不是可任意访问系统资源的通用 JavaScript 环境，也不会替换已有的 JavaScript 模块。2.1.29 起，自动化脚本可面向窗口和区域做 OCR、找图、找色，并对识别或定位到的目标执行相对点击；目标窗口移动后，仍可按最新位置执行。完整 API 以软件编辑器当前提示与后续 `data/xaction` 同步为准，本页不编写尚未同步的方法名和参数。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:automationScript" />

## 快速开始

在组合动作里添加 **自动化脚本**，把下面代码填入 **脚本内容**：

```javascript
import { mouse } from "quicker";

mouse.moveTo(100, 200);
mouse.click();

export default mouse.position();
```

脚本会把鼠标移到 `(100, 200)`，单击，然后把最终位置写入步骤的 **结果** 输出。

<ModuleParamPreview moduleKey="sys:automationScript" />

### 导入方式

`"quicker"` 是 Quicker 在内存中提供的模块，不是 npm 包或本地文件。下方先列出当前结构化定义已覆盖的 `mouse`、`key`、`screen`、`sleep`、`input`、`notify`、`clipboard` 七个命名导出。

按需导入：

```javascript
import { mouse, key, screen, sleep, input, notify, clipboard } from "quicker";
```

导入整个命名空间：

```javascript
import * as qk from "quicker";

qk.mouse.click(100, 200);
qk.sleep(200);
```

也可以使用别名：

```javascript
import { mouse as m } from "quicker";

m.click(100, 200);
```

下面两种写法不支持：

```javascript
import quicker as qk from "quicker"; // 不是 JavaScript 语法
import qk from "quicker";            // quicker 没有 default export
```

除全局 `console` 外，这些 API 不会自动变成全局变量；漏写 `import` 会运行失败。

## 坐标和点

坐标使用整个 Windows 虚拟桌面的物理像素：主屏左上角通常是 `(0, 0)`，左侧或上方的副屏可能出现负坐标。X 向右增大，Y 向下增大。

一个点可以用三种形式表示：

```javascript
mouse.click(100, 200);
mouse.click([100, 200]);
mouse.click({ x: 100, y: 200 });
```

:::caution `(x, y)` 不是 JavaScript 的坐标类型

```javascript
const p = (100, 200); // p 的值只有 200
```

括号里的逗号是 JavaScript 的逗号表达式。需要保存一个点时，请写 `[100, 200]` 或 `{ x: 100, y: 200 }`。

:::

坐标必须是有限数字，字符串 `"100"` 不会自动转成数字。输入时允许小数，执行前按 JavaScript `Math.round` 的规则归一化到整数像素。目标点必须落在某块实际显示器内，不能位于多屏之间的空白区域。

## 常用示例

### 循环点击一组坐标

```javascript
import { mouse, sleep } from "quicker";

const points = [
  [320, 240],
  [520, 240],
  [720, 240]
];

for (const [x, y] of points) {
  mouse.click(x, y, { moveDurationMs: 100 });
  sleep(200);
}

export default {
  count: points.length,
  last: mouse.position()
};
```

### 使用步骤输入并批量点击

把一个词典或对象绑定到步骤的 **输入** 参数，例如：

```json
{
  "offsetX": 10,
  "offsetY": -5,
  "points": [[320, 240], [520, 240], [720, 240]]
}
```

脚本中从 `input` 读取：

```javascript
import { mouse, input } from "quicker";

const offsetX = input?.offsetX ?? 0;
const offsetY = input?.offsetY ?? 0;
const points = (input?.points ?? []).map(([x, y]) => [
  x + offsetX,
  y + offsetY
]);

export default mouse.clickAll(points, {
  moveDurationMs: 100,
  intervalMs: 200
});
```

`result` 将得到 `{ count, last }`，其中 `last` 是最后一次点击后的坐标。

### 按屏幕比例拖拽

```javascript
import { mouse, screen } from "quicker";

const start = screen.pointAt(0.25, 0.5);
const end = screen.pointAt(0.75, 0.5);

export default mouse.drag(start, end, {
  moveDurationMs: 150,
  durationMs: 600
});
```

`screen.pointAt()` 默认以主屏为基准。比例 `0` 到 `1` 会映射到该屏幕内的有效像素。

### 在指定位置滚动

```javascript
import { mouse } from "quicker";

mouse.scroll(-3, {
  at: [800, 500],
  moveDurationMs: 100
});
```

正数向上滚，负数向下滚。首版只支持垂直滚轮。

### 执行热键并输入文本

```javascript
import { key, sleep } from "quicker";

key.hotkey(["ctrl", "shift"], "s");
sleep(200);
key.type("报告.txt", { intervalMs: 30 });
key.press("enter");
```

`key.press()` 操作一个物理按键，`key.type()` 输入 Unicode 文本。输入中文等文本时使用 `key.type()`，不要逐个猜测对应的键盘布局。

### 组合键盘状态和鼠标操作

```javascript
import { key, mouse } from "quicker";

key.down("shift");
try {
  mouse.click(500, 300);
} finally {
  key.up("shift");
}
```

只有确实需要跨多次调用保持按键时才使用 `key.down()` / `key.up()`。普通单键和热键优先使用 `key.press()` / `key.hotkey()`，更不容易留下未释放的按键状态。

## `mouse` API

除特别说明外，坐标操作成功后都返回最终位置 `{ x, y }`。

| API | 用途 |
| --- | --- |
| `mouse.position()` | 读取当前鼠标位置。 |
| `mouse.moveTo(x, y, options?)` | 移到绝对坐标。也可把点作为第一个参数。 |
| `mouse.moveBy(dx, dy, options?)` | 从当前位置按像素偏移。 |
| `mouse.click()` | 在当前位置单击逻辑主按钮。 |
| `mouse.click(options)` | 在当前位置按指定按钮单击。 |
| `mouse.click(x, y, options?)` | 移到指定点后单击；点也可写成数组或对象。 |
| `mouse.doubleClick(...)` | 与 `click` 使用相同的参数形式，执行双击。 |
| `mouse.clickAll(points, options?)` | 依次点击点数组，最多 100 个点；返回 `{ count, last }`。 |
| `mouse.scroll(verticalClicks, options?)` | 垂直滚动 `-120..120` click。 |
| `mouse.dragTo(x, y, options?)` | 从当前位置拖到目标点。 |
| `mouse.drag(from, to, options?)` | 先移到起点，再拖到终点。 |
| `mouse.budget()` | 查看本次运行剩余的写操作、按压和滚轮额度。 |

### 移动选项

```javascript
{
  durationMs: 0 // 0..2000，0 表示直接移动
}
```

适用于 `moveTo` 和 `moveBy`。

### 点击选项

```javascript
{
  button: "primary", // primary | secondary | middle
  moveDurationMs: 0  // 0..2000
}
```

`primary` 和 `secondary` 是 Windows 的逻辑主、次按钮，会遵循系统的左右键交换设置。默认使用 `primary`。

`clickAll` 还支持点击间隔：

```javascript
{
  button: "primary",
  moveDurationMs: 0,
  intervalMs: 200 // 0..10000
}
```

空点数组不会操作鼠标，返回 `{ count: 0, last: mouse.position() }`。

### 滚轮选项

```javascript
{
  at: [800, 500],   // 可选；省略时在当前位置滚动
  moveDurationMs: 0 // 0..2000
}
```

### 拖拽选项

```javascript
// dragTo
{ durationMs: 300 } // 50..2000

// drag
{
  moveDurationMs: 0, // 先移动到起点，0..2000
  durationMs: 300    // 拖拽过程，50..2000
}
```

拖拽固定使用逻辑主按钮。首版没有独立的 `mouse.down()` / `mouse.up()`，脚本不能跨多次调用保持按钮按下，避免取消或异常后出现“卡键”。

传入未知选项、字符串数字或范围外的整数会返回 `INVALID_ARGUMENT`。

### 查询剩余额度

```javascript
const budget = mouse.budget();

console.log(budget.remainingWrites);
console.log(budget.remainingPresses);
console.log(budget.remainingWheelClicks);
```

额度由宿主固定，脚本不能提高。任一键鼠输入额度超限后，本次脚本的后续键鼠输入都会被禁用。

## `key` API

| API | 用途 |
| --- | --- |
| `key.down(name)` | 按下一个支持的物理按键，并由本次脚本持有。 |
| `key.up(name)` | 释放本次脚本已持有的物理按键。 |
| `key.press(name, options?)` | 按下并释放一个物理按键。 |
| `key.hotkey(modifiers, name, options?)` | 依次按下修饰键和主键，再按相反顺序释放。修饰键数组最多 4 项。 |
| `key.type(text, options?)` | 向当前前台窗口输入 Unicode 文本；返回实际处理的字符或换行输入项数。 |
| `key.budget()` | 查看键盘剩余额度和本次脚本当前持有的按键数。 |

### 按键名称

按键名称不区分大小写，使用一个封闭列表，不接受虚拟键码、扫描码或鼠标伪按键：

- 字母 `a..z`、主键盘数字 `0..9`
- 功能键 `f1..f24`、数字键盘 `numpad0..numpad9`
- `backspace`、`tab`、`enter`、`numpadEnter`、`pause`、`escape`、`space`
- `pageUp`、`pageDown`、`end`、`home`、`left`、`up`、`right`、`down`、`insert`、`delete`
- `shift`、`ctrl`、`alt`、`leftShift`、`rightShift`、`leftCtrl`、`rightCtrl`、`leftAlt`、`rightAlt`
- `leftWin`、`rightWin`、`apps`、`printScreen`
- `capsLock`、`numLock`、`scrollLock`
- `numpadMultiply`、`numpadAdd`、`numpadSubtract`、`numpadDecimal`、`numpadDivide`

还可以使用这些别名：`return` 等同于 `enter`，`esc` 等同于 `escape`，`control` 等同于 `ctrl`，`win` 等同于 `leftWin`，`leftControl` / `rightControl` 分别等同于 `leftCtrl` / `rightCtrl`。

通用修饰键名 `shift`、`ctrl`、`alt` 分别使用左侧物理按键，与 `leftShift`、`leftCtrl`、`leftAlt` 是同一个按键身份；需要右侧按键时请显式使用 `rightShift`、`rightCtrl`、`rightAlt`。

不在列表里的名称返回 `KEY_NOT_SUPPORTED`。`key.press("A")` 与 `key.press("a")` 都表示物理 A 键；它不会自动按住 Shift 来生成大写文本。需要输入字符时使用 `key.type("A")`。

### 按键和热键选项

`key.press()` 和 `key.hotkey()` 支持按住时长：

```javascript
key.press("space", { holdMs: 100 });
key.hotkey(["ctrl", "shift"], "s", { holdMs: 100 });
```

`holdMs` 默认为 `0`，范围 `0..2000` 毫秒。热键的修饰键不能重复，主键也不能同时出现在修饰键数组中。

### 输入 Unicode 文本

```javascript
const count = key.type("你好，Quicker\n第二行", {
  intervalMs: 20
});
```

`intervalMs` 默认为 `0`，范围 `0..1000` 毫秒。`\r\n`、`\r` 和 `\n` 都会作为一次 Enter 输入；其它控制字符和不完整的 Unicode 代理项会被拒绝。文本输入面向普通 Windows 文本控件，不等同于剪贴板粘贴，也不保证游戏、远程桌面或自定义输入控件都接受。

返回值按实际输入项计数：一个 Unicode 代理对（例如一个 emoji）算 1 项，任一种换行序列也算 1 项。键盘文本额度则按原字符串的 UTF-16 代码单元计数，因此一个 emoji 消耗 2 个额度，`\r\n` 也消耗 2 个额度。

### 原始按下和释放

`key.down()` 只能按下本次脚本尚未持有的键；重复按下返回 `KEY_ALREADY_HELD`。`key.up()` 只能释放本次脚本持有的键，否则返回 `KEY_NOT_HELD`。每次脚本最多同时持有 8 个键。

脚本正常结束、取消、超时或失败时，Quicker 都会按相反顺序尝试释放本次脚本仍持有的键。这个兜底不能撤销已经送出的输入，因此仍应使用 `try` / `finally` 尽早配对 `down()` 和 `up()`。如果脚本正常完成但宿主无法确认清理结果，步骤返回 `INPUT_CLEANUP_FAILED`；如果脚本已经失败、超时或取消，则保留原结果，并在运行日志中记录清理异常。

### 查询键盘剩余额度

```javascript
const budget = key.budget();

console.log(budget.remainingEdges);
console.log(budget.remainingTransactions);
console.log(budget.remainingTextCodeUnits);
console.log(budget.heldKeys);
```

一次 `down` 或 `up` 消耗一个按键边沿；一次 `press` 消耗两个。额度由宿主固定，脚本不能提高。

## `notify` API

`notify` 显示 Quicker 自己的非阻塞提示消息。它不会暂停脚本等待用户操作，也不会创建 Windows 系统通知。

```javascript
import { notify } from "quicker";

notify.info("任务开始");
notify.success("处理完成", {
  title: "批量处理",
  durationMs: 5000,
  placement: "bottomRight"
});
```

| API | 用途 |
| --- | --- |
| `notify.show(message, options?)` | 显示消息；默认类型为 `info`，可通过 `options.kind` 指定类型。 |
| `notify.info(message, options?)` | 显示信息消息。 |
| `notify.success(message, options?)` | 显示成功消息。 |
| `notify.warning(message, options?)` | 显示警告消息。 |
| `notify.error(message, options?)` | 显示错误消息。 |

消息必须是字符串，最长 4096 个字符。便捷方法的消息类型已经固定，不能再传 `kind`；需要动态选择类型时使用 `notify.show()`。

### 提示选项

```javascript
notify.show("正在同步", {
  kind: "info",              // info | success | warning | error
  title: "同步任务",         // 省略时使用动作标题；null 表示不显示标题
  durationMs: 0,              // 0 使用 Quicker 默认时长，或 2000..30000
  placement: "bottomCenter", // 见下方位置列表
  key: "sync-progress",      // 可选；同一动作内用于识别重复消息
  duplicate: "replace"       // replace | count | ignore；使用时必须同时提供 key
});
```

`placement` 支持 `bottomCenter`、`bottomLeft`、`bottomRight`、`topCenter`、`topLeft`、`topRight`，默认 `bottomCenter`。`title` 最长 128 个字符，`key` 最长 64 个字符且不能全是空白。

相同 `key` 只在当前动作范围内参与去重：`replace` 替换已有消息，`count` 合并并累计次数，`ignore` 忽略新的重复消息。每次脚本最多显示 20 条提示，每秒最多 5 条；超过限制返回 `NOTIFY_LIMIT_EXCEEDED`。

提示消息不支持按钮、点击动作、激活回调或 JavaScript 回调，也不会进入 Windows 通知中心。脚本不能通过提示消息获得新的执行入口。

## `clipboard` API

`clipboard` 只处理 Windows 剪贴板中的纯文本，不读取或写入图片、文件列表、HTML 等其它格式。

```javascript
import { clipboard, notify } from "quicker";

const text = clipboard.readText();
if (text === null) {
  notify.warning("剪贴板中没有文本");
} else {
  clipboard.writeText(text.trim(), { hideFromHistory: true });
}
```

| API | 用途 |
| --- | --- |
| `clipboard.hasText()` | 剪贴板当前是否包含文本。 |
| `clipboard.readText()` | 读取文本；没有文本格式时返回 `null`。 |
| `clipboard.writeText(text, options?)` | 写入文本；传入空字符串等同于清空剪贴板。 |
| `clipboard.clear()` | 清空剪贴板。 |

`readText()` 会区分“没有文本”和“文本为空”：前者返回 `null`，后者返回 `""`。`writeText()` 的 `text` 必须是字符串；唯一选项 `hideFromHistory` 是布尔值，默认为 `false`，设为 `true` 时请求 Windows 不把这次写入保留到剪贴板历史。

单次读出或写入的文本最多包含 1,048,576 个 UTF-16 代码单元。每次脚本最多执行 64 次剪贴板操作，其中写入或清空最多 32 次。剪贴板正被其它程序占用或暂时不可用时返回 `CLIPBOARD_UNAVAILABLE`；文本或次数超过限制时返回 `CLIPBOARD_LIMIT_EXCEEDED`。

## `screen` API

`screen` 是脚本开始时取得的只读屏幕快照：

```javascript
import { screen } from "quicker";

console.log(screen.virtualBounds);
console.log(screen.primary);
console.log(screen.displays);
```

| 成员 | 说明 |
| --- | --- |
| `screen.virtualBounds` | 整个虚拟桌面的边界。 |
| `screen.primary` | 主显示器。 |
| `screen.displays` | 所有显示器数组。 |
| `screen.contains(x, y)` | 坐标归一化后是否落在某块显示器内；也接受点数组或对象。 |
| `screen.pointAt(ratioX, ratioY, displayIndex?)` | 按 `0..1` 比例取得屏幕内的点；默认使用主屏。 |

边界和显示器对象包含：

```text
index, deviceName, isPrimary,
left, top, right, bottom,
width, height, centerX, centerY
```

`right` 和 `bottom` 是不包含的边界。`screen.pointAt(1, 1)` 会返回屏幕内最后一个有效像素，不会返回边界外的点。

运行期间如果显示器布局发生变化，后续输入会停止并返回 `SCREEN_TOPOLOGY_CHANGED`。

## `sleep`、`console`、`input` 和结果

### 等待

```javascript
import { sleep } from "quicker";

sleep(500); // 0..10000 毫秒，可被取消
```

自动化脚本是同步运行时，不支持 `await`。需要短暂停顿时使用 `sleep()`；等待和速率限制占用的时间都计入步骤超时。

### 日志

`console` 是全局对象，不需要从 `quicker` 导入：

```javascript
console.log("位置", mouse.position());
console.info("开始");
console.warn("请检查目标窗口");
console.error("自定义错误信息");
```

日志进入组合动作运行日志。每次运行最多记录 100 条、总计 32,000 个字符；超过后丢弃后续日志并记录一次警告。

### 输入

`input` 来自步骤的 **输入** 参数，未提供时为 `null`。运行前 Quicker 会拍摄数据快照并递归冻结；修改 `input` 不会写回动作变量。

支持 `null`、布尔、文本、有限数字、数组和键为文本的普通对象。整数必须在 JavaScript 安全整数范围内；数据最多 16 层、10,000 个节点。图片、表格、函数、CLR 对象和循环引用等复杂值不支持。

### 输出结果

用 `export default` 把结果写到步骤的 **结果** 输出：

```javascript
export default {
  count: 3,
  last: mouse.position()
};
```

没有 `export default` 时，脚本仍可成功，但不会设置 `result`。显式导出 `null` 会得到一个真实的空值结果。

结果支持的数据形状与输入相同。Promise、函数、Symbol、BigInt、循环引用、对象内部的 `undefined` 等值会被拒绝。

## 步骤参数和输出

**脚本内容**：要执行的 ESM JavaScript。Quicker 不会把它当成动作表达式求值。

**输入**：可绑定动作变量，供脚本中的 `input` 读取。

**超时时间（毫秒）**：默认 `30000`，范围 `100..120000`。包括脚本计算、`sleep()`、平滑移动、按键保持、文本间隔和节流等待。

**结束后恢复鼠标位置**：正常结束、脚本错误或内部超时时，在输入清理状态可确认时尝试回到开始位置。用户接管或主动取消动作时不会强行恢复，以免把用户刚移动的鼠标拉走。

**失败后停止**：脚本失败时是否停止组合动作后续步骤。

输出包括：

- **是否成功**（`isSuccess`）
- **结果**（`result`）
- **错误码**（`errorCode`）
- **错误消息**（`errMessage`）

用户接管或主动停止属于“动作已取消”，不是普通的脚本失败，因此不保证产生普通失败输出。

## 权限、用户接管和输入安全

- Quicker 会先静态分析从 `"quicker"` 导入的能力。使用 `mouse`、`key` 或 `clipboard` 时，首次真实运行会请求对应的本机权限；权限确认前不会执行脚本。
- 当前 `clipboard` 是一个整体导出。即使脚本只调用读取或只调用写入方法，`import { clipboard }` 也会保守地同时申请“读取剪贴板文本”和“写入或清空剪贴板文本”权限。
- `notify` 只发布受限的 Quicker 提示消息，不需要持久授权。它仍受消息长度、次数和速率限制。
- `import * as qk from "quicker"` 可以访问全部当前导出，因此会按鼠标、键盘、剪贴板读取和剪贴板写入能力请求权限。只想申请必要能力时请使用命名导入。
- 授权绑定动作、脚本、超时、恢复位置选项和固定配额策略；这些内容变化后需要重新确认。
- 授权只保存在当前账号的本机数据中，不随动作导出、分享、状态备份或同步到其它设备。
- 只有脚本导入 `mouse` 或 `key` 时才会建立输入接管会话和占用输入互斥。仅使用 `notify`、`clipboard`、`screen`、`sleep` 或 `input` 的脚本不会占用鼠标键盘输入接管。
- 锁屏、UAC / 安全桌面下不会注入输入。鼠标操作会核对目标坐标下的窗口，键盘操作会核对当前前台窗口；管理员权限或高完整性目标一律拒绝，其它权限高于 Quicker 或权限无法确认的目标也会被拒绝。
- 启动时已经按住的动作触发键或鼠标按钮，需要在 1 秒内松开；新的按键、鼠标按钮或滚轮输入会立即由用户接管。
- 真实鼠标在 200 毫秒内累计移动约 5 个物理像素也会接管；极小的传感器抖动不会立刻中止。
- 如果已经配置 Quicker 的“停止运行中动作”全局热键，也可以用它取消正在执行的自动化脚本。
- 用户接管、主动取消、超时、异常或部分注入失败后，Quicker 会停止剩余输入，并尽力释放本次脚本按下的鼠标按钮和键盘按键。
- 已经发生的移动、点击、按键或文本输入不能回滚。失败只会阻止尚未执行的输入。
- 同一时间只能运行一个已支持输入互斥的自动化；冲突时返回 `INPUT_BUSY`，不会排队。部分旧输入模块暂不受此机制约束。

## 运行限制

这些限制按每次步骤运行计算，脚本不能修改：

| 项目 | 上限 |
| --- | ---: |
| 脚本源码 | 100 KiB UTF-8 |
| JavaScript 内存 | 64 MiB |
| 执行语句数 | 500,000 |
| 函数递归深度 | 64 |
| 语法树节点 / 深度 | 100,000 / 256 |
| 桌面写操作（鼠标 API 或键盘事务） | 512 |
| 单击、双击和拖拽的按压事务 | 100 |
| 点击 / 拖拽按压速率 | 每秒 5 次，短时突发 2 次 |
| 垂直滚轮累计 | 120 click |
| 滚轮速率 | 每秒 20 click，短时突发 6 click |
| 键盘按下 / 释放边沿 | 4,096 |
| 键盘事务 | 256 |
| 键盘事务速率 | 每秒 20 次，短时突发 8 次 |
| `key.type()` 文本 | 累计 2,000 个 UTF-16 代码单元 |
| 同时持有的按键 | 8 |
| `key.hotkey()` 修饰键 | 4 |
| 单次平滑移动或拖拽 | 最长 2 秒、最多 120 个采样 |
| 平滑移动采样率 | 最多 60 Hz |
| `clickAll` 点数 | 100 |
| 单次 `sleep` | 10 秒 |
| 日志 | 100 条、总计 32,000 字符 |
| Quicker 提示消息 | 每次运行 20 条、每秒 5 条 |
| 单条提示正文 / 标题 / 去重键 | 4096 / 128 / 64 个字符 |
| 剪贴板操作 | 每次运行 64 次，其中写入或清空 32 次 |
| 单次剪贴板文本 | 1,048,576 个 UTF-16 代码单元 |

双击消耗 2 次鼠标按压额度，拖拽消耗 1 次。每次键盘 API 调用消耗 1 个键盘事务；`down` / `up` 各消耗 1 个边沿，`press` 消耗 2 个。节流等待仍计入步骤的总超时。

## 仍需注意的限制

- `async` / `await`、Promise、`setTimeout` 和后台任务
- 动态 `import()`、其它静态模块、`require()`、npm 和 Node.js 模块
- `eval()`、`new Function()`、CLR、反射和程序集访问
- HTTP、文件、进程、浏览器 DOM、动作变量写回和子程序调用
- 剪贴板图片、文件列表、HTML 等非文本格式
- 阻塞式对话框、消息按钮、点击动作、JavaScript 回调和 Windows 系统通知；当前尚未导出 `dialog`
- 独立 `mouse.down()` / `mouse.up()`、原始键码、扫描码和任意键盘布局映射
- 录制回放
- 水平滚轮、X1 / X2 按钮和任意点击次数
- 游戏级、驱动级或硬实时鼠标轨迹

2.1.29 新增的窗口 / 区域 OCR、找图、找色和相对点击能力，请以软件界面中的脚本提示为准；结构化定义同步前，本页暂不列新增导出、参数名或返回形状。

需要上述仍未支持的能力时，请组合使用对应的 Quicker 步骤，不要试图从脚本绕过限制。

## 常见错误和排障

| 错误码 | 处理方法 |
| --- | --- |
| `EMPTY_SCRIPT`、`JS_PARSE_ERROR` | 检查脚本是否为空、括号和引号是否配对。 |
| `IMPORT_NOT_ALLOWED` | 只从 `"quicker"` 做命名导入或命名空间导入，不要使用 default import。 |
| `ASYNC_NOT_SUPPORTED`、`UNSUPPORTED_SYNTAX`、`STRING_COMPILATION_DISABLED` | 删除异步、Promise、动态导入、命名导出、`eval` 或动态函数。 |
| `INVALID_ARGUMENT` | 检查坐标、整数范围、按钮名、热键数组、文本和选项字段；不要传字符串数字。 |
| `KEY_NOT_SUPPORTED` | 改用文档列出的封闭按键名称；不要传虚拟键码或扫描码。 |
| `KEY_ALREADY_HELD`、`KEY_NOT_HELD` | 检查 `key.down()` / `key.up()` 是否成对，并优先改用 `press()` 或 `hotkey()`。 |
| `UNSUPPORTED_VALUE` | 把输入或结果转换成简单值、数组和普通对象。 |
| `POINT_OUTSIDE_DISPLAY`、`INVALID_VIRTUAL_DESKTOP` | 确认坐标落在实际显示器内，并检查主屏和多屏布局。 |
| `SCREEN_TOPOLOGY_CHANGED` | 显示器布局在运行中改变；重新运行脚本。 |
| `TRUST_REQUIRED` | 安装或保存动作后重新运行，并在本机确认当前脚本的桌面控制权限。 |
| `PHYSICAL_INPUT_ACTIVE` | 松开触发动作时按住的键或鼠标按钮，再重新运行。 |
| `INPUT_BUSY` | 另一个已接入协调器的输入自动化正在运行；等待它结束。 |
| `INPUT_MONITOR_UNAVAILABLE` | Quicker 无法可靠监测用户接管；重新启动 Quicker 后再试。 |
| `WINDOWS_LOCKED`、`SECURE_DESKTOP`、`UNSAFE_DESKTOP` | 解锁 Windows，关闭 UAC / 安全桌面后再运行。 |
| `ELEVATED_TARGET_DENIED`、`TARGET_PERMISSION_UNKNOWN` | 管理员权限或高完整性目标一律不支持；其它目标也不能高于 Quicker，且必须能确认权限。 |
| `INPUT_LIMIT_EXCEEDED`、`LIMIT_EXCEEDED` | 减少点击、滚轮、按键、文本、循环、源码规模或复杂度。 |
| `NOTIFY_LIMIT_EXCEEDED` | 减少提示消息数量或发送频率；每次运行最多 20 条、每秒最多 5 条。 |
| `NOTIFY_FAILED` | Quicker 提示消息发布失败；检查应用状态后重试。 |
| `CLIPBOARD_LIMIT_EXCEEDED` | 减少剪贴板操作次数或文本长度。 |
| `CLIPBOARD_UNAVAILABLE` | Windows 剪贴板正被其它程序占用或暂时不可用；稍后重试。 |
| `TIMEOUT` | 减少工作量，或谨慎提高步骤的超时时间。 |
| `INPUT_INJECTION_FAILED`、`INPUT_OPERATION_FAILED`、`HOST_OPERATION_FAILED` | 输入未能完整发送；检查系统状态和目标窗口，再从安全位置重试。 |
| `INPUT_CLEANUP_FAILED` | Quicker 无法确认本次脚本持有的按键已完全释放；先人工松开相关按键并检查系统输入状态。 |
| `JS_RUNTIME_ERROR` | 查看 **错误消息** 和动作运行日志，定位普通 JavaScript 运行错误。 |

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/mouse',
      label: '鼠标输入',
      description: '单次移动、点击、滚轮、窗口定位或图片定位。',
    },
    {
      href: '/v2/xaction/modules/inputscript',
      label: '多步骤输入',
      description: '使用逐行命令执行短串键盘和鼠标操作。',
    },
    {
      href: '/v2/xaction/modules/jsscript',
      label: '运行 Javascript 代码',
      description: '旧的通用 Jint 模块，使用 exec() 入口。',
    },
    {
      href: '/v2/xaction/concepts/debug',
      label: '调试运行组合动作',
      description: '查看步骤输出、错误和运行日志。',
    },
  ]}
/>

## 更新历史

- 2026-08-14 新增 Quicker 提示消息和文本剪贴板 API，并按导入能力建立宿主。
- 2026-08-13 首次加入自动化脚本模块文档，提供受控的鼠标和键盘 API。
