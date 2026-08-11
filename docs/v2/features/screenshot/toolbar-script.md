---
title: JS 自定义工具栏
description: 用一段 JavaScript 给截图 Pro 工具栏增加自定义按钮，或在进阶场景下重排整栏布局。
sidebar_position: 20
quickerDocKey: v2/features/screenshot/toolbar-script
comments: true
---

# JS 自定义工具栏

截图 Pro 标注工具栏默认提供铅笔、形状、复制、贴图等内置项。通过 **JS 自定义工具栏**，你可以：

- **默认**：只定义几个自定义按钮；原工具栏不动，宿主在保存 / 复制前固定位置加一个「扩展」下拉；
- 自定义按钮里调用子程序处理当前截图，或把图片交给某个动作继续处理；
- **进阶**：才整栏重排内置工具、分隔线和分组。

脚本在打开截图会话前求值一次，用于决定加哪些按钮（或整栏布局）；点击自定义按钮时再执行对应逻辑。

:::info 步骤参数
后续会在组合动作的 **截图 Pro** 步骤中增加一个输入参数，用于填写本页所述的工具栏脚本。参数名称与编辑器界面以正式版本为准；本文先固定脚本写法，便于提前编写与验证。
:::

请先了解 [截图 Pro](./capture-pro.md) 的选区与标注流程。

## 你只需记住三件事

1. **加按钮**：脚本最终 `return [ 增强, 发送 ]`。默认工具栏不动，固定位置出一个下拉。
2. **处理、不关窗**：`await ctx.runSp(名字, { strength: 0.8 })` 跑子程序，再用 `post.keep({ replace: r.outputs.image })` 把新图写回。当前图可省略。窗口继续开着，可以接着画。
3. **交给动作、关窗**：`post.confirm({ launchAction: 动作Id })` 先结束截图（等同点勾），再打开动作。当前图由宿主自动带上。

`runSp` 第二个对象的**每个键就是子程序的一个输入变量**，名字必须一致。当前截图可以不写（宿主会自动带上）；要看清「图进了哪个参数」时再写 `image: ctx.image`。看 `post` 后面的动词就能知道截图窗会怎样：`keep` 不关，`confirm` 确认关闭，`close` 取消关闭。

不提供 `runAction` 一类接口——结构化处理写子程序，命令型移交用 `launchAction`。

## 最短完整示例

下面这段脚本只定义两个自定义按钮。默认标注工具栏保持原样，宿主会在保存 / 复制前加一个「扩展」下拉。可直接复制后改子程序名和动作 ID。

```js
const 增强 = {
    title: '增强',
    icon: 'fa:Light_WandMagic',
    async run(ctx) {
        const r = await ctx.runSp('增强图片', { strength: 0.8 });
        if (!r.ok) return post.error(r);
        return post.keep({ replace: r.outputs.image });
    },
};

const 发送 = {
    title: '发送',
    icon: 'fa:Light_PlayCircle',
    async run() {
        return post.confirm({ launchAction: '这里换成动作ID' });
    },
};

return [增强, 发送];
```

当前图没写在 `runSp` 里：宿主会自动带上。子程序用输入变量 **`image`**，或用 **获取Quicker信息** 的 **图片上下文参数** 都能读到。

要一眼看出「图进了哪个参数」时，把当前图写出来（和省略写法等价）：

```js
const r = await ctx.runSp('增强图片', {
    image: ctx.image,
    strength: 0.8,
});
```

说明：

- `增强图片` 是**当前动作内**的子程序名称（或 ID）。调用公共子程序时，在名字前加 `%%`。
- `{ strength: 0.8 }` 里的键必须和子程序**输入变量同名**。`image` 可省略；写了就是当前截图。
- 处理型子程序请把结果图输出到名为 **`image`** 的变量，脚本里用 `r.outputs.image`。
- `launchAction` 里换成你要启动的动作 ID（或名称）。
- 自定义按钮必须是**对象本身**放进数组，不能写字符串 `'增强'` 指望宿主去猜变量名。

## 两个最常见的按钮

### 处理图片（窗口继续开着）

适合增强、加水印、打码、上传后仍要继续标注。子程序跑完，用新图替换当前截图，**不关窗**。

省略当前图（更短；图由宿主自动带上）：

```js
const 增强 = {
    title: '增强',
    icon: 'fa:Light_WandMagic',
    async run(ctx) {
        const r = await ctx.runSp('增强图片', { strength: 0.8 });
        if (!r.ok) return post.error(r);
        return post.keep({ replace: r.outputs.image });
    },
};
```

没有业务参数时可以更短：

```js
const r = await ctx.runSp('增强图片');
if (!r.ok) return post.error(r);
return post.keep({ replace: r.outputs.image });
```

写全（和图省略等价，只是能看出进了输入变量 `image`）：

```js
const r = await ctx.runSp('增强图片', {
    image: ctx.image,
    strength: 0.8,
});
```

替换并复制，再给一句提示：

```js
return post.keep({
    replace: r.outputs.image,
    clipboard: true,
    notification: '已增强并复制',
});
```

调用公共子程序（不改图、不关窗）：

```js
const 上传 = {
    title: '上传',
    async run(ctx) {
        const r = await ctx.runSp('%%上传到图床', { note: 'toolbar' });
        if (!r.ok) return post.error(r);
        return post.keep({ notification: '已上传' });
    },
};
```

### 把图交给动作（先关掉截图窗）

适合发送到聊天、打开编辑器、走一套需要弹窗交互的动作。**先确认结束截图**（全屏收口），再启动动作；不等待动作跑完。

```js
const 发送 = {
    title: '发送',
    icon: 'fa:Light_PlayCircle',
    async run() {
        return post.confirm({
            launchAction: '这里换成动作ID',
        });
    },
};
```

需要带上动作原有的字符串参数时：

```js
return post.confirm({
    launchAction: { id: '这里换成动作ID', param: 'hello' },
});
```

## 布局怎么写

### 默认：只返回自定义按钮

多数情况到这里就够了。脚本最后返回命令对象列表即可：

```js
return [增强, 发送];
```

- 两个及以上按钮：默认工具栏不变，在保存 / 复制前固定插入「扩展」下拉。
- 只有一个按钮：同一位置直接放这一个按钮，不下拉。
- 含顶层 `return` 的脚本由宿主自动包装执行。

自定义命令可省略 `id` / `type`（宿主按标题生成稳定 id）。必须把**对象本身**放进数组，不能写字符串 `'增强'`。

### 进阶：整栏重排

只有当你要改内置工具顺序、去掉某些项、或自己排分隔线时，才走这条路。出现下列任一情况，脚本返回值会**整栏替换**默认工具栏：

- 数组里出现内置 id（如 `'pencil'`）、分隔线 `'|'`，或绘图工具组；
- `return { layout: [...] }`；
- `return { replace: true, items: [...] }`。

```js
return {
    layout: [
        'pencil',
        ['rect', 'ellipse', 'polyline'],
        '|',
        增强,
    ],
};
```

| 写法 | 含义 |
| --- | --- |
| `{ title, icon?, run }` | 自定义命令 |
| `'pencil'` | 内置工具（见下表稳定 ID；出现即进入整栏重排） |
| `'\|'` | 分隔线（把工具栏分成左 / 中 / 右区域；首版最多两个分隔线） |
| `['rect', 'ellipse']` | **绘图工具组**：分裂按钮，组内轮换；成员必须是内置绘图工具 |
| `[按钮A, 按钮B]` | **自定义动作组**：在整栏重排里也是下拉；成员必须是命令对象 |

注意：

- 工具组与动作组**不能混装**（同一组里不能既有 `'pencil'` 又有自定义对象）。
- 布局阶段只收集按钮元数据，**不会**调用 `run`，也**不能**在布局阶段调用 `ctx.runSp`。
- 整栏重排时：只要出现过绘图工具，系统会保证有「鼠标操控」(`move`)。关闭 / 确认等宿主必需按钮若未写出，会按默认规则补上。
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

`runSp` 第二个对象的键必须和子程序输入变量同名。当前图可以省略；要看清参数时再写 `image: ctx.image`。省略时宿主仍会自动带上当前截图，子程序用输入变量 **`image`** 或 **图片上下文参数** 都能读到。

### `ctx.runSp`：跑子程序

```js
// 省略当前图（更短）
const r = await ctx.runSp('增强图片', { strength: 0.8 });
await ctx.runSp('增强图片'); // 连业务参数也没有时

// 写全：键名 = 子程序输入变量名
await ctx.runSp('增强图片', {
    image: ctx.image,
    strength: 0.8,
});

// 公共子程序
await ctx.runSp('%%上传到图床', { note: 'toolbar' });

// 完整对象形式（inputs 里才是子程序变量）
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
| `outputs` | 子程序输出字典；**处理型推荐出图键名为 `image`**，再交给 `post.keep({ replace })` |

常见情况：

- 从全局快捷截图进入、且未传 `actionId` 时调用动作内子程序 → 失败，`code` 类似 `missing_owner_action`。此时请改用 `%%` 公共子程序，或 `launchAction`。
- 参数形状错误、过期图片句柄等属于 API 用法错误，可能直接抛异常。

### 处理型子程序怎么写

面向「图进图出」的工具栏子程序，**变量名和脚本键一一对应**：

| 子程序变量 | 方向 | 脚本里怎么写 |
| --- | --- | --- |
| `image` | 输入 | 可省略；要写清就 `image: ctx.image` |
| `strength` 等 | 输入 | `runSp` 第二参里的同名键 |
| `image` | 输出 | `r.outputs.image` |

1. **读图**：在子程序里声明名为 **`image`** 的输入变量，直接用它。也可以用 **获取系统或动作信息** / **获取Quicker信息** 的 **图片上下文参数**。脚本里都可以不传图。
2. **出图**：处理后把结果图放到名为 **`image`** 的输出变量。脚本里写 `r.outputs.image`。
3. **关不关窗**：不要写在子程序输出里。由脚本的 `post.keep` / `post.confirm` / `post.close` 决定。

宿主不会把其它输出键名猜成「替换当前图」。若你的子程序用了别的变量名，脚本里自行对齐，例如 `runSp('…', { photo: ctx.image })` 再 `post.keep({ replace: r.outputs.result })`。

## 告诉宿主事后做什么：`post`

看动词就知道截图窗会怎样：

| 写法 | 截图窗 | 含义 |
| --- | --- | --- |
| `post.keep({ ... })` | **不关** | 处理完继续画。常见：`replace` |
| `post.confirm({ ... })` | **确认关**（等同点勾） | 先收口全屏，再做事。常见：`launchAction` |
| `post.close()` | **取消关**（等同点叉） | 丢掉本次截图 |
| `post.error(r)` 或 `post.error('说明')` | **不关** | 显示失败，不改图 |
| `return` / `post.none()` | **不关** | 成功，且无后处理（等同空的 `post.keep()`） |
| `post.plan({ ..., session })` | 由 `session` 决定 | 进阶组合；**请写明 `session`** |

`keep` / `confirm` / `close` 可带的字段相同（都可选）：

| 字段 | 说明 |
| --- | --- |
| `replace` | 将返回的图片设为当前截图的新底图（原标注已扁平进快照；替换后清空绘制元素与撤销栈，**屏幕选区框不变**） |
| `clipboard` | `true`，或 `{ image }`：写入剪贴板 |
| `pin` | `true`，或 `{ image, showToolbar? }`：贴图 |
| `save` | `true` 或 `{ prompt: true, image? }`：走现有保存对话框（首版不支持静默任意路径写盘） |
| `launchAction` | 启动动作（**不等待**结束）。字符串简写为动作 ID；对象可为 `{ id, param?, image?, area? }` |
| `notification` | 字符串简写为提示文字；或 `{ level: 'success' \| 'info' \| 'warning', text }` |

未单独指定图片的 `clipboard` / `pin` / `save` / `launchAction` 使用 `replace` 的结果，否则用点击时的 `ctx.image`。

只想确认结束、或只想取消时：

```js
return post.confirm(); // 等同点勾
return post.close();   // 等同点叉
```

需要一次做多件事、又不想用动词时，用 `post.plan` 并**自己写** `session`：

```js
return post.plan({
    replace: r.outputs.image,
    pin: true,
    session: 'keep',
});
```

后处理按固定顺序执行：校验 → `replace` → `clipboard` → `pin` → `save` → 关闭或保持窗口 → `launchAction` → `notification`。`launchAction` 放在窗口收口之后，以便动作窗口在全屏截图关闭后再出现。某步在启动动作之前失败时，会停止后续步骤并保持截图打开以显示错误；已完成的副作用不会回滚。

## TypeScript 类型定义（完整参考）

运行时执行的是 **JavaScript**；下面 TypeScript 仅作作者参考，脚本里**不必** `import`，也不用改成 `.ts`。字段与上文表格一致，可直接对照复制。

```typescript
/** 当前截图选区（屏幕坐标；只用 left/top/width/height，避免 right/bottom 含边歧义）。 */
type CaptureArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * 不透明图片句柄。只能传给 runSp / post.keep / post.confirm / post.plan，
 * 不要当普通对象枚举或序列化。真实像素保存在宿主侧；伪造或过期句柄会被拒绝。
 */
type ImageRef = {
  readonly __captureImageHandle: string;
};

/** 可传入子程序 inputs / 出现在 outputs 中的值。 */
type JsPrimitive = null | boolean | number | string;
type JsInputValue =
  | JsPrimitive
  | ImageRef
  | CaptureArea
  | JsInputValue[]
  | { [key: string]: JsInputValue };
type JsOutputValue = JsInputValue;

type ProgramRunStatus = 'succeeded' | 'cancelled' | 'failed';

/** ctx.runSp 的统一结果。业务失败不抛异常，而是 ok: false。 */
type ProgramRunResult = {
  ok: boolean;
  status: ProgramRunStatus;
  /** 稳定错误码，如 missing_owner_action */
  code?: string;
  message?: string;
  target: {
    type: 'subprogram' | 'publicSubprogram';
    /** 公共子程序的 id 不含 %% 前缀 */
    id: string;
    title?: string;
  };
  /**
   * 子程序输出变量。
   * 处理型（图进图出）推荐：把结果图放到名为 image 的输出 → r.outputs.image → post.keep({ replace })。
   * 宿主不会把其它键名自动猜成 replace。
   */
  outputs?: Record<string, JsOutputValue>;
};

/** ctx.runSp 的完整对象参数；也可用字符串 id + 第二参 inputs 简写。 */
type RunSpOptions = {
  /** 动作内：名称或 GUID；公共：'%%' + 名称或 GUID */
  id: string;
  /** 仅动作内子程序需要；省略则用 ctx.originActionId */
  actionId?: string;
  /** 子程序输入变量，键名与输入变量同名；image: ctx.image 可省略 */
  inputs?: Record<string, JsInputValue>;
  /** 写入附加数据的图；默认 ctx.image；显式 null 表示不注入截图附加数据 */
  image?: ImageRef | null;
  area?: CaptureArea | null;
  timeoutMs?: number;
};

/** 点击自定义按钮时注入的只读上下文。布局阶段没有可用的 runSp。 */
type CaptureToolContext = {
  sessionId: string;
  toolId: string;
  host: 'capturePro' | 'pin';
  /** 点击瞬间合成图（含已提交标注，不含工具栏等界面装饰） */
  image: ImageRef;
  area: CaptureArea;
  /** 仅由动作内「截图 Pro」步骤进入时存在；全局快捷截图可能为空 */
  originActionId?: string;
  /**
   * 运行子程序并等待结束。
   * 简写：runSp('增强图片', { strength: 0.8 })  // 当前图可省略
   * 写全：runSp('增强图片', { image: ctx.image, strength: 0.8 })
   * 公共：runSp('%%上传到图床', { note: 'toolbar' })
   */
  runSp(
    idOrOptions: string | RunSpOptions,
    inputs?: Record<string, JsInputValue>,
  ): Promise<ProgramRunResult>;
};

type CapturePostSession = 'keep' | 'confirm' | 'close';

/**
 * post.keep / confirm / close / plan 的载荷。不要直接 return 图片或普通对象。
 * 未单独指定图片的 clipboard/pin/save/launchAction 使用 replace ?? ctx.image。
 */
type CapturePostPlan = {
  /** 设为当前会话新底图；替换后清空绘制元素 / OCR 层 / 撤销栈，屏幕选区框不变 */
  replace?: ImageRef;
  clipboard?: boolean | { image?: ImageRef };
  pin?: boolean | { image?: ImageRef; showToolbar?: boolean };
  /** 首版只走现有保存对话框，不支持任意路径静默写盘 */
  save?: boolean | { prompt?: boolean; image?: ImageRef };
  /**
   * 启动动作（不等待结束）。
   * 字符串简写为动作 Id 或名称；对象可带字符串 param。
   * 教：post.confirm({ launchAction })，不要写光秃秃的 post.plan({ launchAction })。
   */
  launchAction?:
    | string
    | {
        id: string;
        param?: string;
        image?: ImageRef | null;
        area?: CaptureArea | null;
      };
  session?: CapturePostSession;
  /** 字符串简写为提示文字 */
  notification?:
    | string
    | {
        level?: 'success' | 'info' | 'warning';
        text: string;
      };
};

/** 自定义工具栏按钮。id/type 可省略；必须提供可调用的 run。 */
type CaptureToolbarCommand = {
  id?: string;
  type?: 'command';
  title?: string;
  tooltip?: string;
  /** 如 fa:Light_WandMagic */
  icon?: string;
  /**
   * 点击时执行。允许返回：
   * - undefined / post.none() / post.keep()：成功且无后处理
   * - post.error(...)：失败提示
   * - post.keep / post.confirm / post.close / post.plan：后处理计划
   * 无 await 时可不写 async；有 await ctx.runSp 时必须 async。
   */
  run(
    ctx: CaptureToolContext,
  ): Promise<CapturePostPlan | void> | CapturePostPlan | void;
};

/**
 * 脚本顶层 return 值。
 * 默认：只返回自定义命令数组 → 原工具栏 + 固定位置下拉。
 * 进阶整栏重排：数组里出现内置 id / '|'，或 { layout } / { replace: true, items }。
 */
type CaptureToolbarLayout =
  | CaptureToolbarCommand[]
  | Array<string | string[] | CaptureToolbarCommand | CaptureToolbarCommand[]>
  | {
      version?: number;
      items?: Array<
        string | string[] | CaptureToolbarCommand | CaptureToolbarCommand[]
      >;
      layout?: Array<
        string | string[] | CaptureToolbarCommand | CaptureToolbarCommand[]
      >;
      replace?: boolean;
    };

/**
 * 点击阶段由宿主注入的全局对象（布局阶段不可用）。
 * keep / confirm / close / plan / error / none 的返回值请直接 return 给 run。
 */
declare const post: {
  /** 不关窗，继续截图。 */
  keep(plan?: CapturePostPlan): CapturePostPlan;
  /** 确认结束（等同点勾）；可再 launchAction。 */
  confirm(plan?: CapturePostPlan): CapturePostPlan;
  /** 取消关闭（等同点叉）。 */
  close(plan?: CapturePostPlan): CapturePostPlan;
  /** 进阶组合；请写明 session。 */
  plan(plan: CapturePostPlan): CapturePostPlan;
  error(resultOrMessage: ProgramRunResult | string): CapturePostPlan;
  none(): CapturePostPlan;
};

// 脚本最后应 return 符合 CaptureToolbarLayout 的值
```

后处理执行顺序（与类型字段对应）：校验 → `replace` → `clipboard` → `pin` → `save` → 窗口收口 → `launchAction` → `notification`。

## 运行时行为（使用注意）

- **同一时间只跑一个自定义命令**；执行期间其它扩展按钮和会改图的内置命令会禁用，关闭 / 取消仍可用。
- 关闭截图或取消命令会尝试中断进行中的 `runSp`；已收口会话后，晚到的结果不会再改图或贴图。
- 子程序里改图后务必 `post.keep({ replace })`，否则截图界面看不到新图。
- 不要依赖布局阶段的副作用；每次点击都会重新求值脚本以找到对应 `run`。

## 常见问题

### 看不出子程序用了哪个参数

`runSp` 第二个对象的键必须和子程序输入变量同名。当前图可以省略；要看清「图进了哪个参数」时写成 `image: ctx.image`。读回结果用 `r.outputs.image`（对应输出变量 `image`）。

### 点了按钮，不知道会不会关截图窗

看你 `return` 的是哪个动词：`post.keep` 不关，`post.confirm` 确认关闭后再开动作，`post.close` 按取消关闭。不要写 `post.plan({ launchAction })` 再去猜默认值。

### 按钮点了没反应或提示失败

检查 `run` 是否 `async`、是否 `return post.keep(...)` / `post.confirm(...)` / `post.error(...)`。子程序失败时应 `if (!r.ok) return post.error(r)`，不要忽略 `r.ok`。

### `runSp` 提示缺少归属动作

说明本次截图不是由动作内步骤发起的，或未指定 `actionId`。改用公共子程序（`%%` 前缀），或改用 `launchAction` 启动完整动作。

### 自定义按钮写成了字符串不显示

布局数组里必须放入命令**对象**（变量），不能写 `'增强'` 这种字符串去引用 JS 变量。

### 和默认工具栏有何关系

未配置脚本时，截图 Pro 使用内置默认工具栏。配置脚本后：

- **只返回自定义按钮**（推荐）：默认工具栏保留，宿主在保存 / 复制前固定加入「扩展」下拉（只有一个按钮时直接放按钮）。
- **整栏重排**（数组里写了内置工具，或 `return { layout: [...] }`）：以脚本为准，宿主仍可能补上必需的关闭 / 确认等项。

### 能否自定义画笔或 OCR 浮层

首版不支持用本 API 做自定义实时画笔或替换 OCR 交互；这类能力仍走内置工具。JS 工具栏默认负责**加处理型 / 命令型按钮**；整栏重排是进阶选项。

## 相关文档

- [截图 Pro](./capture-pro.md)
- [截图与贴图概览](./index.md)
