---
title: "词典类型"
description: "词典存键值对；默认值可用每行 Key:Value 或 JSON；比较值时要先转成同一类型。"
slug: "/v2/xaction/concepts/var-dict"
sidebar_position: 70
quickerDocKey: "xaction/concepts/var-dict"
comments: true
docStatus: reviewed
legacyDocId: 1402045
legacyContentUpdatedAt: "2025-09-28T15:04:27.000Z"
---

# 词典类型

词典存「键 → 值」。键是文本，值可以是任意类型。

内部对应 C# `Dictionary<string, object>`。

## 默认值

**简单模式**：每行一个 `键:值`。

<VariableDefPreview
  name="词典变量"
  typeLabel="词典"
  defaultValue={"a:aaaa\nb:bbbb\nc:cccc"}
/>

上面初始化了三对：`a`→`aaaa`，`b`→`bbbb`，`c`→`cccc`。

**JSON**：

<VariableDefPreview
  name="dict"
  typeLabel="词典"
  defaultValue={'{\n  "Name": "张三",\n  "Age": 30\n}'}
/>

也可以用 [赋值](/v2/xaction/modules/assign) 把 JSON 文本写入词典：

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '{\n  "Name": "张三"\n}'}}
  outputVars={{output: 'dict'}}
/>

## 转成 JSON 文本

把词典赋给文本变量会自动序列化：

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '{dict}'}}
  outputVars={{output: 'text'}}
/>

或表达式：

```text
$= JsonConvert.SerializeObject({词典变量})
```

增删改键用 [词典操作](/v2/xaction/modules/dictoperations)。

## 限制与排障

比较两个键的值时，不要写 `$= {dict}["key1"] == {dict}["key2"]`。值是 `object`，这是引用比较，两个相同字符串也会得到假。先转成同一类型，或两边都 `.ToString()`。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/dictoperations',
      label: '词典操作',
      description: '读、写、删键',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '用 ["键"] 取值',
    },
    {
      href: '/v2/xaction/concepts/var-list',
      label: '列表类型',
      description: '只要一组字符串时用列表',
    },
  ]}
/>
