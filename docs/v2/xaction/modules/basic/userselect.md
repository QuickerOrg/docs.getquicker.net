---
title: "用户选择"
description: "请用户选择一个选项。"
slug: "/v2/xaction/modules/userselect"
sidebar_label: "用户选择"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:select"
comments: true
moduleKey: "sys:select"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1402298
legacyContentUpdatedAt: "2025-11-21T01:17:26.000Z"
---

# 用户选择

弹出一个列表窗口，等用户选出一项（或多选几项）后再继续后面的步骤。适合从常用网址、短语、日期格式里挑一个，或决定后面走哪条分支。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:select" />

## 概述

例如 [插入日期时间](https://getquicker.net/sharedaction?code=2a89f753-546d-45d0-bfd9-08d6720e1a02)：先选一种格式，再插入到当前文档。

<ChoiceListPreview
  title="请选择格式"
  options={[
    '2022-10-11',
    '2022.10.11',
    '2022/10/11',
    '2022年10月11日',
    '2022-10-11 13:53',
    '2022/10/11 13:53',
    '2022年10月11日13时53分',
    '2022-10-11 13:53:47',
    '2022/10/11 13:53:47',
    '13:53',
    '13:53:47',
  ]}
/>

单选且开启 **启用快速确认**（默认开）时，点一项就选中并关掉窗口。多选要自己点「确定」。

操作：

| | 单选 | 多选 |
| --- | --- | --- |
| 鼠标 | 左键点一项即确认 | 左键点选/取消；按住拖动可连选 |
| 键盘 | 上下移动，空格确认 | 上下移动，空格切换勾选 |
| 数字 | `Ctrl+1`…`Ctrl+9` 选对应项 | 同样切换勾选 |

任何时候可用 `Ctrl+F` 打开筛选（窗口占着焦点时）。筛选默认模糊匹配，支持拼音、不连续字符。要改成严格包含，在关键词前加 `!`，例如 `!城区`（1.39.16+）。

## 单选与多选

**类型** 决定窗口怎么选、输出什么：

- **单选**：输出文本。「选择的项(值)」是选中项的值，「索引号」从 0 起。
- **多选**：输出列表。「选择的项值列表」「索引号列表」都是列表。

<ModuleParamPreview
  moduleKey="sys:select"
  focusKeys={['type', 'textValue', 'selectedIndex', 'multiSelected', 'selectedIndexList']}
  values={{
    type: 'multi',
    prompt: '请选择',
    items: `aaa
[fa:Light_Pen:#FF0000]bbb
ccc
ddddd`,
    autoCloseSeconds: '0',
    winLocation: 'WithMouse1',
    keepLastPos: '1',
    showFilter: '0',
  }}
  outputVars={{multiSelected: 'paths', selectedIndexList: 'indexes'}}
/>

## 参数说明

### 窗口标题、提示信息和选项

左边改参数，右边是运行时窗口。标题进标题栏，选项进列表（`显示|值` 只显示左边）。

<PreviewMap
  links={[
    {from: 'prompt', to: 'prompt'},
    {from: 'items', to: 'items'},
    {from: 'note', to: 'note'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:select"
    scrollBody={false}
    focusKeys={['prompt', 'note', 'items', 'defaultValue', 'textValue']}
    values={{
      type: 'single',
      prompt: '请选择格式',
      note: '请选择一种日期格式',
      items: `2018-12-01|yyyy-MM-dd
2018-12-01 12:32|yyyy-MM-dd HH:mm
2018-12-01 12:32:33|yyyy-MM-dd HH:mm:ss
2018/12/01|yyyy/MM/dd
2018年12月01日|yyyy年MM月dd日`,
      defaultValue: 'yyyy-MM-dd',
    }}
    outputVars={{textValue: 'format'}}
  />
  <ChoiceListPreview
    title="请选择格式"
    hint="请选择一种日期格式"
    selectedIndex={0}
    options={[
      '2018-12-01',
      '2018-12-01 12:32',
      '2018-12-01 12:32:33',
      '2018/12/01',
      '2018年12月01日',
    ]}
  />
</PreviewMap>

**窗口标题**：列表窗口标题栏文字。

**提示信息**：显示在列表下方。

**选项**：每行一项。格式：

- `选项内容`：显示和值相同
- `显示文字|值`：竖线左边给人看，右边作为返回值
- `[fa:Light_Pen:#99AAFF]显示文字(Tooltip 至少 3 个字)|值`：可选图标和悬浮说明。有 Tooltip 时，`|值` 不能省

图标写法见 [在动作中使用图标](/v2/xaction/concepts/use-icon-in-actions)。

默认分隔符是 `|`。要换成分隔符，把**第一行**写成 `|=新分隔符`（前面不要空格）。插值时写成 `$$|=新分隔符`。

<PreviewMarks
  marks={[{key: 'items', label: '首行 |=&& 把分隔符改成 &&'}]}
>
  <ModuleParamPreview
    moduleKey="sys:select"
    scrollBody={false}
    focusKeys={['items']}
    values={{
      type: 'single',
      items: `|=&&
a&&b
b&&bbbb
c&&cccc`,
    }}
  />
</PreviewMarks>

选项也可以用词典：填 `$={词典变量}`。词典的键是显示文字，值是返回值。此时「选择的项(值)」是 Value，「选择的完整选项」是 Key。要反过来，先用 [词典操作](/v2/xaction/modules/dictoperations) 的「翻转键值」。

### 默认值

单选（**默认值**）：先按选项的值匹配；匹配不到再看是不是从 0 起的序号（1.1.2+）。

多选（同样叫 **默认值**）：要预选的值列表。多行文本会按自动转换当成列表。也可以把第 0 项写成 `//byIndex`，后面各项写从 0 起的序号（1.43.51+）。

### 右键 / 全局菜单

每行一项，格式仍是 `显示内容|值`。点了之后从 **选择的菜单** 输出。行首写 `[=]` 就是标题栏/底栏的全局菜单，否则是右键菜单。特别常用的全局项可在标题前加 `!`，显示成独立按钮（1.44.26+）。

<PreviewMap
  links={[{from: 'operations', to: 'operations'}]}
>
  <ModuleParamPreview
    moduleKey="sys:select"
    scrollBody={false}
    focusKeys={['operations', 'extraOperation']}
    values={{
      type: 'single',
      prompt: '请选择',
      items: `a
b
c
d`,
      operations: `[=]!按钮文字|operation
[=][fa:Solid_Pen:#FF0000]!全局按钮(tooltip 第二行)|op2
[=]更多菜单|more`,
    }}
    outputVars={{extraOperation: 'menu'}}
  />
  <ChoiceListPreview
    title="请选择"
    options={['a', 'b', 'c', 'd']}
    selectedIndex={3}
    globalButtons={['按钮文字', '全局按钮']}
    showMoreMenu
  />
</PreviewMap>

`…` 下拉可用 `Alt+M` 展开（可同时按，或先 Alt 再 M，1.44.44+）。

### 启用筛选

选项多时打开筛选。默认 **自动(选项超过10个时启用)**。预先填入的词写在 **筛选内容**。

<PreviewMap
  links={[
    {from: 'showFilter', to: 'filterContent'},
    {from: 'filterContent', to: 'filterContent'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:select"
    scrollBody={false}
    focusKeys={['showFilter', 'filterContent']}
    values={{
      type: 'single',
      prompt: '请选择 (单选)',
      showFilter: '1',
      filterContent: 'xcq',
      items: `110102 西城区
150102 新城区
320507 相城区
321302 宿城区
330103 下城区
350602 芗城区
370403 薛城区
420602 襄城区
610102 新城区`,
    }}
  />
  <ChoiceListPreview
    title="请选择 (单选)"
    filterText="xcq"
    selectedIndex={0}
    options={[
      '110102 西城区',
      '150102 新城区',
      '320507 相城区',
      '321302 宿城区',
      '330103 下城区',
      '350602 芗城区',
      '370403 薛城区',
      '420602 襄城区',
      '610102 新城区',
    ]}
  />
</PreviewMap>

上面输入 `xcq` 能筛出「西城区」等，因为筛选认拼音首字母。

**输入法状态**：控制筛选框要不要强制开/关输入法。

### 窗口位置和尺寸

**窗口位置**：跟随鼠标、屏幕各方位，或 **自定义位置**。

**最大尺寸/位置坐标**：`宽度,高度`。数字是考虑 DPI 后的逻辑像素，百分比相对所在屏幕。例如 `500,100%`。自定义位置时，这里改填 `left,top,right,bottom`。

前面加 `!` 表示固定尺寸而不是上限，例如 `!30%,80%`（1.12.21+）。

**使用上次位置**：同一动作里多次弹出时，要不要留在用户拖过的地方。

**窗口标识**：再次运行时按标识关掉旧窗口，并在原位置打开新窗口。

### 焦点和关闭

**自动关闭**：秒数，`0` 为不自动关。到点时若已有预选则保存，否则取消。

**不使用焦点**：不抢输入焦点，只能用鼠标选。

**失去焦点后关闭窗口（仅在使用焦点时有效）**：点到别处就关并取消。

**恢复活动窗口到弹出前**：选完后把焦点还回弹出前的窗口。若动作里切过别的软件，可再配合 [恢复活动窗口](/v2/xaction/modules/restoreactivewindow)。

**允许不选择任何选项时点击确定**：空选也能点确定。

**启用快速确认（点击选项后立即确认选择并关闭窗口）**：仅单选。关掉后要点「确定」才返回。

**置顶显示**：选择窗口是否总在最前。

**取消后停止**：点取消或关掉窗口后是否中止动作。默认开启。

**帮助按钮内容**：Markdown。语法见 [MdXaml 扩展说明](https://github.com/whistyun/MdXaml/wiki/How-to-use-Enhanched-syntax)。

**字体大小** / **字体名称** / **图标大小**：列表文字和图标。多个字体名用逗号分隔。

## 输出

- **是否确认**：是否选了选项或点了保存。
- **选择的项(值)**（单选）：选中项的值。
- **索引号**（单选）：从 0 起。
- **选择的项值列表** / **索引号列表**（多选）。
- **选择的菜单**：右键或全局菜单项的值。
- **选择的完整选项**：选项的原始定义；词典选项时是键。多选为列表，也可当成多行文本。
- **选择的选项标题**（单选）：给人看的那一侧。
- **筛选内容**：最后用过的筛选词。

## 使用场景

- 从一组网址、短语、软件或文件夹里挑一个再打开/发送。参考：[Quicker 网站](https://getquicker.net/sharedaction?code=131086b3-22d9-493e-4a5d-08d68595e9fd)、[快捷短语](https://getquicker.net/Sharedaction?code=66f0e5c6-1800-4073-ae9f-08d66d40bba1)、[常用软件](https://getquicker.net/Sharedaction?code=4b701d72-99fd-49c1-15f8-08d68278cc52)。
- 选出一个值，再用 [如果](/v2/xaction/modules/if) 走不同分支。参考：[示例：选择并执行动作](https://getquicker.net/Sharedaction?code=16ac0322-10c1-46b0-d7a2-08d682aaa91c)。
- 给后面步骤挑参数，例如日期格式。参考：[插入日期时间](https://getquicker.net/sharedaction?code=2a89f753-546d-45d0-bfd9-08d6720e1a02)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/use-icon-in-actions',
      label: '在动作中使用图标',
      description: '选项和图标的 fa: 写法。',
    },
    {
      href: '/v2/xaction/modules/msgbox',
      label: '弹窗提示或确认',
      description: '自定义按钮格式和这里的选项类似。',
    },
    {
      href: '/v2/xaction/modules/if',
      label: '如果',
      description: '按选择结果走不同分支。',
    },
    {
      href: '/v2/xaction/modules/dictoperations',
      label: '词典操作',
      description: '用词典生成选项，或翻转键值。',
    },
    {
      href: '/v2/xaction/modules/restoreactivewindow',
      label: '恢复活动窗口',
      description: '选择窗抢走过焦点时再还回去。',
    },
  ]}
/>

## 更新历史

- 1.1.2 增加自动关闭；默认值可用序号。
- 1.1.12 增加筛选。
- 1.6.0 增加右键菜单等。
- 1.39.16 筛选支持 `!` 严格包含。
- 20241029 完善参数说明。
- 20241213 多选可用序号预选。
- 20251020 全局菜单项可显示为按钮。
- 20251121 增加 `Alt+M` 展开全局菜单。
