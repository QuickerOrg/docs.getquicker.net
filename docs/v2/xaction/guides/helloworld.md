---
title: 第一个组合动作
description: 新建组合动作，用「提示消息」在桌面显示 Hello, World!，并保存后从面板运行。
slug: "/v2/xaction/guides/helloworld"
sidebar_label: 第 1 课：弹出提示
sidebar_position: 20
quickerDocKey: "xaction/guides/helloworld"
comments: true
docStatus: reviewed
legacyDocId: 2097579
legacyContentUpdatedAt: "2021-12-30T10:41:30.000Z"
---

# 第一个组合动作

这一课只做一件事：运行动作后，桌面出现 **Hello, World!**。不涉及变量和分支。做完你就知道：新建、拖模块、填参数、保存、运行。

## 新建组合动作

1. 用鼠标中键弹出面板（默认方式；可在设置里更改）。
2. 切到**全局区**，或上下文区末尾的 **通用**，这样在哪个程序里都能点到这个练习动作。
3. 点 **创建动作** 磁贴，或点区域右上角的加号；也可以在空白处右键。
4. 选 **新建组合动作**。

<ContextMenuPreview
  openPath={['新建组合动作']}
  items={[
    {label: '运行其它动作', icon: 'fa:Light_PlayCircle:#6aaded'},
    {label: '新建组合动作', icon: 'fa:Light_ProjectDiagram:#6aaded'},
    {type: 'separator'},
    {label: '模拟输入', icon: 'fa:Light_Keyboard:#6aaded', children: [{label: '…'}]},
    {label: '运行或打开', icon: 'fa:Light_FolderOpen:#6aaded', children: [{label: '…'}]},
    {label: '常用功能', icon: 'fa:Light_Star:#6aaded', children: [{label: '…'}]},
  ]}
/>

会打开组合动作编辑器：左栏是模块工具箱，中间是步骤列表，右侧是变量和动作外观。完整说明见 [动作编辑器](/v2/xaction/concepts/xaction-editor)。

还没想好放哪个场景，可以先把动作放到左侧 [暂存区](/v2/what's-new/new-main-win/action-drafts.md)，确认后再保留到场景。

## 加上「提示消息」

1. 在左侧工具箱找到 **基础** 分类，或按 `Ctrl+F` 搜索「提示」。
2. 把 **提示消息** 拖到中间的步骤列表（也可以双击模块，加到列表末尾）。
3. 在 **消息内容** 里填写 `Hello, World!`，点步骤窗口的保存。

<ActionEditorPreview
  focus="toolbox"
  toolboxTab="basic"
  toolboxSearch="提示"
  toolboxSelected="sys:notify"
  actionTitle="Hello World"
  actionDescription="桌面提示 Hello, World!"
  caption="将「提示消息」拖到步骤列表（示意，悬停可暂停）"
  data={{steps: []}}
  dragDemo={{
    moduleKey: 'sys:notify',
    targetSlot: 'steps',
    afterData: {
      steps: [
        {
          key: 'sys:notify',
          inputs: {msg: 'Hello, World!', type: 'Info'},
        },
      ],
    },
  }}
/>

参数窗里主要看这两项即可：

<ModuleParamPreview
  moduleKey="sys:notify"
  values={{type: 'Info', msg: 'Hello, World!'}}
  focusKeys={['type', 'msg']}
/>

**类型** 选 **信息**（默认）。其它类型只是颜色不同；需要用户点「是 / 否」时才用 [弹窗提示或确认](/v2/xaction/modules/msgbox)，不要用提示消息。

## 保存并运行

1. 在编辑器里给动作起名，例如 `Hello World`。
2. 点工具条 **保存**。
3. 关掉编辑器，弹出面板，单击这个动作。

桌面底部居中会出现一条提示，几秒后自己消失：

<NotifyToastPreview message="Hello, World!" />

也可以不关编辑器，直接点中间工具条的 **运行**。适合改完马上试；涉及往窗口打字或改文件时，注意当前前台窗口是不是你想操作的那个。

完成后的步骤就是这一条：

<StepProgramView
  caption="Hello World"
  data={{
    steps: [
      {
        key: 'sys:notify',
        inputs: {msg: 'Hello, World!', type: 'Info'},
      },
    ],
  }}
/>

## 还可以：用文本窗口显示

提示消息会自己消失。若希望文字留在一个窗口里，到 **文本处理** 分类把 **文本窗口** 再拖进来。

窗口里的文本填 `Hello, World!`，标题填动作名。

<TextWindowPreview
  title="Hello World"
  text="Hello, World!"
  showLineNum={false}
/>

文本窗口适合看较长结果；提示消息适合「已经做完了」这类短反馈。两个模块可以同时放在一个动作里，按步骤顺序先后出现。

## 限制与排障

- 拖入模块后如果没弹出参数窗，双击步骤再打开。
- 运行了但看不到提示：确认步骤没有被停用；个别情况下提示会不出现，重启 Quicker 后再试。说明见 [提示消息](/v2/xaction/modules/notify)。
- 面板上找不到刚保存的动作：看它是在当前场景、暂存区，还是别的分组。V2 里「放在哪个场景」和「动作内容」是分开的。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/guides/selected-text',
      label: '第 2 课：处理选中文字',
      description: '取词、转大写、写回窗口',
    },
    {
      href: '/v2/xaction/modules/notify',
      label: '提示消息',
      description: '类型、位置、保持秒数',
    },
    {
      href: '/v2/xaction/modules/showtext',
      label: '文本窗口',
      description: '用独立窗口显示较长文本',
    },
    {
      href: '/v2/xaction/concepts/xaction-editor',
      label: '动作编辑器',
      description: '工具箱、搜索和保存',
    },
  ]}
/>
