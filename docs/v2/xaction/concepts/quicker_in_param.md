---
title: "为动作传递参数"
description: "从命令行、运行其他动作、热键或右键菜单给动作传参，用 quicker_in_param 读取。"
slug: "/v2/xaction/concepts/quicker_in_param"
sidebar_position: 150
quickerDocKey: "xaction/concepts/quicker_in_param"
comments: true
docStatus: reviewed
legacyDocId: 4237196
legacyContentUpdatedAt: "2024-01-18T09:50:23.000Z"
---

# 为动作传递参数

可以像命令行一样给动作传参数（1.4.8+）：传入要处理的数据，或告诉动作走哪条分支。

## 怎么传入

**外部调用**（见 [Quicker 启动协议](https://getquicker.net/kc/manual/doc/quicker-starter)）：

```text
quicker:runaction:动作名称或ID或动作库ID 参数内容
quicker:runaction:动作名称或ID或动作库ID?参数内容
```

空格或问号后面是参数，可以有空格，不能有换行。用名称调用时名称不能重复、中间不能有空格。

**动作里调其它动作**：用 [运行其他动作](/v2/xaction/modules/runaction) 的「输入参数」。

<ModuleParamPreview
  moduleKey="sys:runAction"
  values={{type: 'StartAction', actionId: '目标动作', inputParam: 'hello', debug: 'false'}}
  focusKeys={['actionId', 'inputParam', 'debug']}
/>

**扩展热键 / 文本指令 / 轮盘**：配置项里可以写参数。正则文本指令会把匹配到的内容当参数。

**自定义右键菜单**：点菜单等于运行动作并传入该项的参数。见 [自定义右键菜单](/v2/xaction/concepts/action-custom-context-menu)。

## 怎么读取

**方式 1**：读内置变量 `{quicker_in_param}`。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {quicker_in_param} == "settings"'}}
  focusKeys={['condition']}
/>

**方式 2**：在 [获取选中的文本](/v2/xaction/modules/get_selected_text) 勾选「如果为动作传递了参数，使用参数值作为获取的结果」。没有参数时仍读选区；有参数时把参数当选区。适合既支持选中文字、又支持文本指令把匹配结果送进来。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  values={{useActionParam: 'true'}}
  focusKeys={['useActionParam']}
  outputVars={{output: 'text'}}
/>

## 直接写入变量（1.41.0+）

QueryString，并带 `write_to_vars=true`：

```text
quicker:runaction:动作id或不重复的名称?write_to_vars=true&text=Hello&变量名=URL编码的值
```

或把含 `"write_to_vars": true` 的 JSON 做 URL 编码后当参数。

## 返回值

被调动作若要回结果，用 [停止动作/结束子程序](/v2/xaction/modules/stop) 的「返回值」。

<ModuleParamPreview
  moduleKey="sys:stop"
  focusKeys={['return']}
/>

## 调试传参

新建一个动作，用「运行其他动作」填目标、参数，勾选调试模式，再跑这个包装动作。详见 [调试运行](/v2/xaction/concepts/debug)。

## 限制与排障

- 用名称调用时不能重名、名称里不能有空格。
- 参数不能含换行。
- 右键菜单的参数要足够特殊，避免和正常传入的数据撞车。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/runaction',
      label: '运行其他动作',
      description: '动作之间传参',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '自定义右键菜单',
      description: '菜单项就是在传参',
    },
    {
      href: '/v2/xaction/concepts/debug',
      label: '调试运行组合动作',
      description: '带参数调试',
    },
    {
      href: '/v2/xaction/modules/get_selected_text',
      label: '获取选中的文本',
      description: '参数可充当选区',
    },
  ]}
/>
