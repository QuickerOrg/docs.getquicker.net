---
title: "调试运行组合动作"
description: "调试运行会记录每步输入输出并打开 HTML 日志；也可只跑选中的步骤。"
slug: "/v2/xaction/concepts/debug"
sidebar_position: 160
quickerDocKey: "xaction/concepts/debug"
comments: true
docStatus: reviewed
legacyDocId: 2565739
legacyContentUpdatedAt: "2023-08-16T01:04:04.000Z"
---

# 调试运行组合动作

调试运行（1.1.0+）会记下每一步的输入、输出和错误，方便定位问题。日志是 HTML，跑完后用默认浏览器打开（建议 Chrome；IE 不支持页内交互）。

## 怎么启动

- 动作上右键选调试运行。
- 面板或悬浮按钮上 **右侧 Shift + 点击**（也可用来调自定义右键菜单）。
- 命令行：`quicker:debugaction:动作id/名称/动作库ID`。
- 用 [运行其他动作](/v2/xaction/modules/runaction) 勾选调试模式，适合调菜单参数。

<ModuleParamPreview
  moduleKey="sys:runAction"
  values={{debug: 'true'}}
  focusKeys={['actionId', 'inputParam', 'debug']}
/>

<ContextMenuPreview
  openPath={['调试运行']}
  items={[
    {label: '运行', icon: 'fa:Light_Play:#39b54d'},
    {label: '调试运行', icon: 'fa:Light_Bug:#f5b042'},
    {type: 'separator'},
    {label: '编辑'},
    {label: '分享'},
  ]}
/>

也可以给某个动作打开自动调试（1.38.43+）：之后无论怎么触发都走调试。同一时间只能开一个；再点一次菜单关掉；重启 Quicker 也会失效。

<ContextMenuPreview
  openPath={['信息', '开启自动调试']}
  tooltip="自动以调试模式运行此动作"
  items={[
    {label: '编辑', icon: 'fa:Light_Pen:#1296db'},
    {label: '调试运行', icon: 'fa:Light_Play:#f5b042'},
    {label: '设置', icon: 'fa:Light_Cog:#1296db', children: [{label: '…'}]},
    {label: '悬浮', icon: 'fa:Light_UfoBeam:#1296db', children: [{label: '…'}]},
    {label: '分享', icon: 'fa:Light_ShareAlt:#1296db', children: [{label: '…'}]},
    {type: 'separator'},
    {label: '复制', icon: 'fa:Light_Copy:#1296db'},
    {label: '剪切', icon: 'fa:Light_Cut:#1296db'},
    {label: '删除', icon: 'fa:Light_Times:#f44336', danger: true},
    {
      label: '信息',
      icon: 'fa:Light_InfoCircle:#1296db',
      children: [
        {label: '设置快捷键', icon: 'fa:Light_Keyboard:#1296db'},
        {label: '导出动作', icon: 'fa:Light_FileExport:#1296db'},
        {
          label: '开启自动调试',
          icon: 'fa:Light_Play:#1296db',
          tooltip: '自动以调试模式运行此动作',
        },
        {label: '动作数据', icon: 'fa:Light_Database:#1296db'},
      ],
    },
  ]}
/>

编辑器里点工具条的调试钮，或右键运行按钮。只跑一段：选中步骤后右键 **运行(_R)**（旧版是按住 Shift 再点运行）。

<ActionEditorPreview caption="编辑器里运行 / 调试" focus="steps" showRun />

<ContextMenuPreview
  openPath={['运行(_R)']}
  items={[
    {label: '复制(_C)', icon: 'fa:Light_Copy:#6aaded'},
    {label: '剪切(_X)', icon: 'fa:Light_Cut:#6aaded'},
    {type: 'separator'},
    {label: '运行(_R)', icon: 'fa:Light_Play:#f5b042'},
    {label: '停用/取消停用(_P)', icon: 'fa:Light_Ban:#E00000'},
  ]}
>
  <StepProgramView
    selectedIndexes={[1, 2]}
    data={{
      steps: [
        {key: 'sys:getSelectedText', outputs: {output: 'text'}},
        {key: 'sys:stringProcess', inputs: {data: '{text}', method: 'toUpper'}, outputs: {output: 'text'}},
        {key: 'sys:notify', inputs: {msg: '{text}'}},
      ],
    }}
  />
</ContextMenuPreview>

## 日志长什么样

文件分文件头和步骤列表。

![](./img/debug-006-8b12230f68.png)

文件头：展开/折叠全部、Windows 与 Quicker 版本、动作 ID、动作库 ID、log 路径、在资源管理器中定位、复制文件。

![](./img/debug-007-41dce12a8b.png)

每一步有步骤头（耗时毫秒、序号、名称、摘要）和详情。点序号可在编辑器里定位；点步骤头折叠详情。

![](./img/debug-009-938add2b0c.png)

详情里 `[in]` / `[out]` 分别是输入和输出。输入方式显示为【变量 名】或【值/表达式】（悬停可看原始表达式）。

![](./img/debug-010-32d9747588.png)

转成 HTML 时内容可能有出入，只供参考。要原始值请另写到文件。

步骤多时先折叠：折叠后底色发灰；点名称展开；双击前面黄线也可折起来。

![](./img/debug-013-7bac30c0d7.png)

分享日志前去掉敏感信息。

## 跳过部分步骤

步骤组和「运行子程序」可以设成不写入调试细节，复杂动作会清爽很多。

<PreviewMarks
  marks={[{key: 'skipWhenDebugging', label: '减少不必要的调试输出'}]}
>
  <ModuleParamPreview
    moduleKey="sys:group"
    scrollBody={false}
    focusKeys={['skipErr', 'skipWhenDebugging', 'useMultiThread']}
    values={{skipWhenDebugging: 'true'}}
  />
</PreviewMarks>

<PreviewMarks
  marks={[{key: 'skipDebugOutput', label: '不输出子程序内部调试信息'}]}
>
  <ModuleParamPreview
    moduleKey="sys:subprogram"
    scrollBody={false}
    focusKeys={['subProgram', 'skipDebugOutput', 'stopIfFail']}
    values={{
      subProgram: 'epub获取信息',
      skipDebugOutput: 'false',
    }}
  />
</PreviewMarks>

## 限制与排障

- 日志请用现代浏览器打开。
- 自动调试同时只能开一个动作，重启后失效。
- HTML 里的值可能被转义或截断，不要当精确数据源。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/xaction-editor',
      label: '动作编辑器的使用',
      description: '运行 / 调试按钮和快捷键',
    },
    {
      href: '/v2/xaction/concepts/quicker_in_param',
      label: '为动作传递参数',
      description: '带参数调试',
    },
    {
      href: '/v2/xaction/modules/runaction',
      label: '运行其他动作',
      description: '勾选调试模式去调别的动作',
    },
  ]}
/>
