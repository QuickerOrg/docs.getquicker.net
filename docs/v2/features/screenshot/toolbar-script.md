---
title: JS 自定义工具栏
description: 用一段 JavaScript 定义截图 Pro 工具栏布局，以及自定义按钮如何处理图片或启动动作。
sidebar_position: 20
quickerDocKey: v2/features/screenshot/toolbar-script
comments: true
---

# JS 自定义工具栏

截图 Pro 标注工具栏默认提供铅笔、形状、复制、贴图等内置项。通过 **JS 自定义工具栏**，你可以：

- 决定工具栏上显示哪些内置工具、分隔线和分组；
- 增加自定义按钮：调用子程序处理当前截图，或把图片交给某个动作继续处理。

脚本在打开截图会话前求值一次，用于生成工具栏布局；点击自定义按钮时再执行对应逻辑。

:::info 步骤参数
后续会在组合动作的 **截图 Pro** 步骤中增加一个输入参数，用于填写本页所述的工具栏脚本。参数名称与编辑器界面以正式版本为准；本文先固定脚本写法，便于提前编写与验证。
:::

请先了解 [截图 Pro](./capture-pro.md) 的选区与标注流程。

## 你只需记住三件事

1. **排布局**：脚本最终 `return` 一个数组（或带 `items` 的对象），列出工具栏从左到右的内容。
2. **要结果**：自定义按钮里用 `await ctx.runSp(名字, { 参数 })` 跑子程序，再用 `post.plan({ replace: ... })` 把新图写回截图。
3. **交给动作**：用 `post.plan({ launchAction: 动作Id })` 把当前图交给某个动作（图由宿主自动带上，默认先结束截图再打开动作）。

不需要在脚本里手动传「当前截图」；也不提供 `runAction` 一类接口——结构化处理写子程序，命令型移交用 `launchAction`。

## 最短示例

下面这段脚本：左侧保留常用标注工具，右侧增加「增强」和「发送」两个自定义按钮。

```js
const 增强 = {
    title: '增强',
    icon: 'fa:Light_WandMagic',
    async run(ctx) {
        const r = await ctx.runSp('增强图片', { strength: 0.8 });
        if (!r.ok) return post.error(r);
        return post.plan({ replace: r.outputs.image });
    },
};

const 发送 = {
    title: '发送',
    icon: 'fa:Light_PlayCircle',
    async run() {
        return post.plan({
            launchAction: '11111111-1111-1111-1111-111111111111',
        });
    },
};

return [
    'pencil',
    ['rect', 'ellipse', 'polyline'],
    'arrow', 'serial', 'text',
    ['mosaic', 'smart_mosaic'],
    '|',
    '长截图', '录屏', 'ocr',
    [增强, 发送],
];
```

说明：

- `增强图片` 是**当前动作内**的子程序名称（或 ID）。调用公共子程序时，在名字前加 `%%`，例如 `await ctx.runSp('%%上传到图床', { note: 'toolbar' })`。
- `launchAction` 里的 GUID 换成你要启动的动作 ID；也可写成对象并附带字符串 `param`（见下文）。
- 自定义按钮必须是**对象本身**放进数组，不能写字符串 `'增强'` 指望宿主去猜变量名。

## 布局怎么写

脚本顶层最终返回值决定工具栏。两种等价形式：

```js
// 简写：直接返回数组
return ['pencil', '|', 我的按钮];

// 对象形式（需要显式 version 时）
return {
    version: 1,
    items: ['pencil', '|', 我的按钮],
};
```

含顶层 `return` 的脚本由宿主自动包装执行，你按「整段脚本最后 return 布局」来写即可。

| 写法 | 含义 |
| --- | --- |
| `'pencil'` | 内置工具（见下表稳定 ID） |
| `'\|'` | 分隔线（把工具栏分成左 / 中 / 右区域；首版最多两个分隔线） |
| `['rect', 'ellipse']` | **绘图工具组**：分裂按钮，组内轮换；成员必须是内置绘图工具 |
| `[按钮A, 按钮B]` | **自定义动作组**：分裂 / 分组展示自定义按钮；成员必须是命令对象 |
| `{ title, icon?, run }` | 自定义命令；`id` / `type` 可省略（宿主按标题生成稳定 id） |

注意：

- 工具组与动作组**不能混装**（同一组里不能既有 `'pencil'` 又有自定义对象）。
- 布局阶段只收集按钮元数据，**不会**调用 `run`，也**不能**在布局阶段调用 `ctx.runSp`。
- 只要布局里出现过绘图工具，系统会保证有「鼠标操控」(`move`)。关闭 / 确认等宿主必需按钮若未写出，会按默认规则补上。
- 数字快捷键在过滤不可用项后重新编号：`0` 仍是鼠标；`1`–`9` 按可见绘图工具 / 工具组从左到右分配；**自定义动作组不占数字键**。

### 内置工具稳定 ID

推荐在脚本里使用下列稳定 ID（大小写敏感）：

```text
move, pencil, rect, ellipse, arrow, polyline, serial, text,
mosaic, smart_mosaic, spotlight, eraser,
undo, redo, long_screenshot, screen_recording, ocr,
save, copy, pin, close, confirm
```

部分别名也可识别，并会归一成稳定 ID，例如：

| 别名 | 稳定 ID |
| --- | --- |
| `square` | `rect` |
| `circle` | `ellipse` |
| `line` | `polyline` |
| `number` | `serial` |
| `长截图` | `long_screenshot` |
| `录屏` | `screen_recording` |

图标字段使用 Quicker 矢量图标写法，例如 `fa:Light_WandMagic`（与动作图标体系一致）。

## 自定义按钮

最小字段：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 按钮标题 |
| `run` | 是 | `async function (ctx) { ... }`，点击时执行 |
| `icon` | 否 | 矢量图标 |
| `tooltip` | 否 | 悬停提示 |
| `id` | 否 | 跨版本稳定引用时再写；省略则由宿主根据标题生成 |

`run` 的返回值必须是明确契约之一（见「告诉宿主事后做什么」），不要直接 `return 图片` 或随意对象。

## `ctx`：点击时可用的上下文

点击自定义按钮时，宿主会注入只读上下文 `ctx`：

| 字段 / 方法 | 说明 |
| --- | --- |
| `ctx.image` | 点击瞬间的合成图（含已提交标注，不含工具栏等界面装饰）。不透明句柄，勿当普通对象枚举 |
| `ctx.area` | 当前选区：`{ left, top, width, height }`（屏幕坐标） |
| `ctx.sessionId` | 本次截图会话 ID |
| `ctx.toolId` | 当前自定义命令 ID |
| `ctx.host` | `'capturePro'` 或 `'pin'`（贴图宿主若启用脚本时） |
| `ctx.originActionId` | 发起本次截图的动作 ID；仅由动作内 **截图 Pro** 步骤进入时存在。全局快捷截图入口可能为空 |
| `ctx.runSp(...)` | 运行子程序并**等待**结果（见下） |

当前截图会自动进入子程序 / 动作的截图附加数据；`runSp` 的 `inputs` 里通常不必再传 `image`。

### `ctx.runSp`：跑子程序

```js
// 动作内子程序（推荐）
const r = await ctx.runSp('增强图片', { strength: 0.8 });

// 公共子程序
await ctx.runSp('%%上传到图床', { note: 'toolbar' });

// 完整对象形式
await ctx.runSp({
    id: '增强图片',
    // actionId: ctx.originActionId, // 可省略；默认用 originActionId
    inputs: { strength: 0.8 },
});
```

| `id` 写法 | 含义 |
| --- | --- |
| `'增强图片'` / 动作内 GUID | 动作内子程序；归属动作 = `actionId` 或 `ctx.originActionId` |
| `'%%' + 名称或 GUID` | 公共子程序；不需要归属动作 |

结果形状（业务失败不抛异常，而是 `ok: false`）：

| 字段 | 说明 |
| --- | --- |
| `ok` | 是否成功 |
| `status` | `'succeeded'` / `'cancelled'` / `'failed'` |
| `code` / `message` | 失败时的稳定错误码与说明 |
| `outputs` | 子程序输出字典；图片字段为可交给 `post.plan` 的句柄 |

常见情况：

- 从全局快捷截图进入、且未传 `actionId` 时调用动作内子程序 → 失败，`code` 类似 `missing_owner_action`。此时请改用 `%%` 公共子程序，或 `launchAction`。
- 参数形状错误、过期图片句柄等属于 API 用法错误，可能直接抛异常。

## 告诉宿主事后做什么：`post`

| 写法 | 含义 |
| --- | --- |
| `return` / `post.none()` | 成功，且不改图、不结束会话 |
| `post.error(r)` 或 `post.error('说明')` | 显示失败，不改图 |
| `post.plan({ ... })` | 按字段执行后处理 |

### `post.plan` 常用字段

均可选；未写图片的项默认使用 `replace` 的结果，否则用点击时的 `ctx.image`。

| 字段 | 说明 |
| --- | --- |
| `replace` | 将返回的图片设为当前截图的新底图（原标注已扁平进快照；替换后清空绘制元素与撤销栈，**屏幕选区框不变**） |
| `clipboard` | `true`，或 `{ image }`：写入剪贴板 |
| `pin` | `true`，或 `{ image, showToolbar? }`：贴图 |
| `save` | `true` 或 `{ prompt: true, image? }`：走现有保存对话框（首版不支持静默任意路径写盘） |
| `launchAction` | 启动动作（**不等待**结束）。字符串简写为动作 ID；对象可为 `{ id, param?, image?, area? }` |
| `session` | `'keep'` 保持截图；`'confirm'` 成功结束；`'close'` 按取消关闭。单独 `launchAction` 且未写 `session` 时，默认 `'confirm'` |
| `notification` | 字符串简写为提示文字；或 `{ level: 'success' \| 'info' \| 'warning', text }` |

示例：

```js
// 替换并复制，再提示
return post.plan({
    replace: r.outputs.image,
    clipboard: true,
    notification: '已增强并复制',
});

// 带字符串参数移交动作
return post.plan({
    launchAction: { id: '动作GUID或名称', param: 'hello' },
});
```

后处理按固定顺序执行：校验 → `replace` → `clipboard` → `pin` → `save` → `session` → `launchAction` → `notification`。`launchAction` 放在会话收口之后，以便动作窗口在全屏截图关闭后再出现。某步在启动动作之前失败时，会停止后续步骤并保持截图打开以显示错误；已完成的副作用不会回滚。

## 运行时行为（使用注意）

- **同一时间只跑一个自定义命令**；执行期间其它扩展按钮和会改图的内置命令会禁用，关闭 / 取消仍可用。
- 关闭截图或取消命令会尝试中断进行中的 `runSp`；已收口会话后，晚到的结果不会再改图或贴图。
- 子程序里改图后务必 `post.plan({ replace })`，否则截图界面看不到新图。
- 不要依赖布局阶段的副作用；每次点击都会重新求值脚本以找到对应 `run`。

## 常见问题

### 按钮点了没反应或提示失败

检查 `run` 是否 `async`、是否 `return post.plan(...)` / `post.error(...)`。子程序失败时应 `if (!r.ok) return post.error(r)`，不要忽略 `r.ok`。

### `runSp` 提示缺少归属动作

说明本次截图不是由动作内步骤发起的，或未指定 `actionId`。改用公共子程序（`%%` 前缀），或改用 `launchAction` 启动完整动作。

### 自定义按钮写成了字符串不显示

布局数组里必须放入命令**对象**（变量），不能写 `'增强'` 这种字符串去引用 JS 变量。

### 和默认工具栏有何关系

未配置脚本时，截图 Pro 使用内置默认工具栏。配置脚本后，以脚本返回的布局为准（宿主仍可能补上必需的关闭 / 确认等项）。

### 能否自定义画笔或 OCR 浮层

首版不支持用本 API 做自定义实时画笔或替换 OCR 交互；这类能力仍走内置工具。JS 工具栏负责**布局**与**处理型 / 命令型**扩展。

## 相关文档

- [截图 Pro](./capture-pro.md)
- [截图与贴图概览](./index.md)
