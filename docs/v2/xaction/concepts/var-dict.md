---
title: "词典类型"
description: "词典类型的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/concepts/var-dict"
sidebar_position: 70
quickerDocKey: "xaction/concepts/var-dict"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 1402045
legacyContentUpdatedAt: "2025-09-28T15:04:27.000Z"
---

词典类型用于存储 “键-值”对 类型的数据。





**参考**

*词典类型在内部使用 Dictionary&lt;string, Object&gt; 实现。*

*键（Key）：为C#的String类型*

*值（Value）：为C#的Object类型。Object为所有c#类型的基类，可以存储任何类型的内容。*




## 变量定义

### 默认值的定义/赋值操作里的文本写法

词典变量默认值可以使用两种方式写：

-   简单模式：每行一个键值对， 格式为 Key:Value，例如：

<VariableDefPreview
  name="词典变量"
  typeLabel="词典"
  defaultValue={"a:aaaa\nb:bbbb\nc:cccc"}
/>

定义了一个词典变量，初始化后包含3个“键-值”对。第一个键为“a”，值为“aaaa”；第二个键为“**b**”，值为“bbbb”；第一个键为“c”，值为“cccc”。



-   Json格式：

<VariableDefPreview
  name="dict"
  typeLabel="词典"
  defaultValue={'{\n  "Name": "张三",\n  "Age": 30\n}'}
/>

也可用「赋值」模块把 JSON 文本写入词典变量（示意）：

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '{\n  "Name": "张三"\n}'}}
  outputVars={{output: 'dict'}}
/>




## 转换

### 将词典转换为Json文本

（1）使用“赋值”模块将词典变量赋值给文本变量即可自动转换。

<ModuleParamPreview
  moduleKey="sys:assign"
  focusKeys={['input', 'output']}
  values={{input: '{dict}'}}
  outputVars={{output: 'text'}}
/>

（2）使用表达式:

```csharp
$= JsonConvert.SerializeObject({词典变量})
```






## 相关操作模块

-   [词典操作](/v2/xaction/modules/dictoperations)




## 注意事项

-   关于比较两个词典键值对的值：
    词典变量类型在内部对应于C#的Dictionary&lt;string, object&gt;类型。值类型为object，可以保存各类对象。因此，不能直接比较词典的两个值是否相同，如 $= &#123;dict&#125;\["key1"\] == &#123;dict&#125;\["key2"\] ，这种情况下是两个object类型的比较，会使用引用比较，即使两个值是相同的字符串，也会得到False的结果。应强制转换类型或使用ToString()方法统一转换为文本后进行比较。 [参考](https://github.com/cuiliang/Quicker/issues/2231)

## 更新历史

-   20250928 增加注意事项内容。
