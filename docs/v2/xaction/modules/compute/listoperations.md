---
title: "列表操作"
description: "对列表变量进行添加、删除等操作"
slug: "/v2/xaction/modules/listoperations"
sidebar_label: "列表操作"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:listOperations"
comments: true
moduleKey: "sys:listOperations"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "927dd176368c5595cd1e4cf32a079b0c5f3bcd9ace2d1ec1695cda2352e4f823"
legacyDocId: 2132007
legacyContentUpdatedAt: "2022-07-06T05:37:04.000Z"
---

# 列表操作

对列表变量进行添加、删除等操作

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:listOperations`
- 分类：计算与比较（`Compute`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 操作类型 | `Enum` | none | 是 | `Input` |  |  |
| `list` | 列表 | `List` |  | 否 | `UseVarOnly` |  | 要操作的列表变量 |
| `list2` | 列表2 | `List` |  | 否 | `UseVarOrInput` | 仅：concat | 要拼接的列表 |
| `pos` | 序号 | `Integer` | 0 | 否 | `UseVarOrInput` | 仅：getAt, insertAt, setAt, removeAt, sub | 目标元素的序号，从0开始。负值表示从后向前的第几个。 |
| `length` | 长度 | `Integer` | 1 | 否 | `UseVarOrInput` | 仅：sub | 操作元素的数量 |
| `item` | 值 | `Text` |  | 否 | `UseVarOrInput` | 仅：append, insertAt, setAt, remove, removeAllByValue, indexOf, filterByDefault, filterByContains, filterByStarts, filterByEnds | 要插入或更新的值，或筛选关键词 |
| `orderByScore` | 按匹配程度排序 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：filterByDefault | 筛选结果按匹配程度倒序排列 |
| `pattern` | 正则表达式 | `Text` |  | 否 | `UseVarOrInput` | 仅：removeByMatch, removeByNotMatch, filterByRegex | 要匹配的正则表达式。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | 结果 | `Any` | 仅：getAt, sortAsc, sortAscNature, sortDesc, sub, concat, distinct, filterByRegex, filterByDefault, filterByContains, filterByStarts, filterByEnds, FileSizeAsc, FileSizeDesc, CreationTimeDesc, CreationTimeAsc, LastAccessTimeDesc, LastAccessTimeAsc, LastWriteTimeDesc, LastWriteTimeAsc | 操作后的输出（取的元素值、排序、切片或拼接后的列表等） |
| `isEmpty` | 是否为空 | `Boolean` |  | 空返回true，非空返回false |
| `length` | 列表长度 | `Integer` |  | 列表包含的元素数量，截断或拼接后输出结果列表的长度 |
| `index` | 序号 | `Integer` | 仅：indexOf | 值在列表里的序号，-1表示不存在 |
| `filterOutItems` | 剩余项列表 | `Any` | 仅：filterByRegex, filterByDefault, filterByContains, filterByStarts, filterByEnds | 不符合筛选条件的项的列表 |

## 选项值

### `type` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `none` | 无操作（仅用于获取列表信息） |  |
| `getAt` | 读取某位置元素 |  |
| `append` | 添加元素到末尾 |  |
| `insertAt` | 插入元素 |  |
| `setAt` | 设置/更新某序号元素 |  |
| `remove` | 去除元素(指定值，有多个时去除第一个) |  |
| `removeAllByValue` | 去除元素(指定值，有多个时去除全部) |  |
| `removeAt` | 去除元素(指定位置) |  |
| `removeByMatch` | 去除元素(匹配正则表达式的项) |  |
| `removeByNotMatch` | 去除元素(不匹配正则表达式的项) |  |
| `clear` | 清空列表 |  |
| `sortAsc` | 排序A-Z（输出到结果） |  |
| `sortDesc` | 排序Z-A（输出到结果） |  |
| `sortAscNature` | 自然排序A-Z（输出到结果） |  |
| `FileSizeAsc` | 排序文件列表：文件大小（从小到大） |  |
| `FileSizeDesc` | 排序文件列表：文件大小（从大到小） |  |
| `CreationTimeDesc` | 排序文件列表：创建时间（从新到旧） |  |
| `CreationTimeAsc` | 排序文件列表：创建时间（从旧到新） |  |
| `LastAccessTimeDesc` | 排序文件列表：最后访问时间（从晚到早） |  |
| `LastAccessTimeAsc` | 排序文件列表：最后访问时间（从早到晚） |  |
| `LastWriteTimeDesc` | 排序文件列表：最后写入时间（从晚到早） |  |
| `LastWriteTimeAsc` | 排序文件列表：最后写入时间（从早到晚） |  |
| `reverse` | 倒置 |  |
| `sub` | 截取（输出到结果） |  |
| `concat` | 拼接（输出到结果） |  |
| `distinct` | 去除重复（输出到结果） |  |
| `indexOf` | 获取值的序号 |  |
| `filterByRegex` | 筛选（正则,输出到结果） |  |
| `filterByDefault` | 筛选（模糊匹配,输出到结果） |  |
| `filterByContains` | 筛选（包含） |  |
| `filterByStarts` | 筛选（开始） |  |
| `filterByEnds` | 筛选（结束） |  |
{/* xaction-metadata:end */}

对列表变量的项进行添加、删除等操作。



![](./img/listoperations-001-d57f385831.png)



## 参数

【列表】要操作的列表变量。

如果仅用于输出内容，这里也可以直接使用多行文本的方式构建临时列表。

【操作类型】对列表进行的操作，可选值为：

-   无操作（仅用于获取列表信息）
-   读取某位置元素：按序号取出某个元素的值放入“结果”输出。
-   添加元素到末尾：添加元素到列表的末尾。“列表”参数为变量时有效。
-   插入元素：将元素插入到“序号”指定的位置。该位置原来的项向后移动。
-   设置/更新某序号元素：将指定需要的元素替换为指定的值。
-   去除元素(指定值)：根据值从列表中去除指定的文本元素。
-   去除元素(指定位置)：去除指定位置的元素。
-   去除元素(匹配正则表达式的项)：去除所有符合正则表达式的元素。

-   如输入列表&#123;1, 12, 1234, 0&#125;，正则表达式：1 → 输出列表&#123;0&#125;

-   去除元素(不匹配正则表达式的项)：去除所有不符合正则表达式的元素。
-   清空列表：将列表中的所有元素去除。
-   排序A-Z（输出到结果）：将列表排序后输出到“结果”输出中。此操作不会修改修改输入的被排序的列表。
-   排序Z-A（输出到结果）：按相反顺序排序。排序后输出到“结果”输出中。此操作不会修改修改输入的被排序的列表。
-   自然排序A-Z（输出到结果）：使用类似于资源管理器中的文件名排序相似的方式排序文本列表。通常用以解决文件名排序时2在11前面的问题。
-   倒置：将列表元素前后顺序颠倒。
-   截取（输出到结果）：取元素的一部分。从“序号”开始，取“长度”参数中指定的个数构成一个新的列表，返回到“结果”输出。“是否为空”“列表长度”返回新列表的信息。
-   拼接（输出到结果）：将“列表”和“列表2”拼接成一个新的列表，返回到“结果”输出。“是否为空”“列表长度”返回新列表的信息。
-   去除重复（输出到结果）：去除列表中的重复项，将结果列表返回到“结果”输出。“是否为空”“列表长度”返回新列表的信息。
-   获取值的序号：根据指定的值，返回其所在列表中的序号（从0开始）；如果值不存在列表中，则返回-1；
-   筛选（正则,输出到结果）：根据给出的正则表达式筛选列表。筛选后生成的新列表输出到“结果”中。“是否为空”和“列表长度”为新列表的信息。
-   筛选（默认,输出到结果）：根据指定的“值”筛选列表，支持字符匹配、拼音匹配等默认筛选方式。筛选后生成的新列表输出到“结果”中。“是否为空”和“列表长度”为新列表的信息。



【列表2】进行“拼接”操作时，拼接到列表末尾的另一个列表。

【序号】目标元素的序号，从0开始。**负值**表示从后向前的第几个。（适用于“读取某位置元素”“插入元素”“设置/更新某序号元素”，“去除元素(指定位置)”，“截取”等操作类型）

【长度】操作元素的数量。（适用于“截取”等操作类型）

【值】要插入或更新的值。（适用于“添加元素到末尾”，“插入元素”，“设置/更新某序号元素”，“去除元素(指定值)”）

【正则表达式】要匹配的正则表达式。（适用于“去除元素(匹配正则表达式的项)”，“去除元素(不匹配正则表达式的项)”）



## 输出

【是否为空】“列表”是否为空（没有元素）

【列表长度】“列表”包含的元素数量，截断或拼接后输出结果列表的长度。

【结果】操作后的输出（取的元素值、排序、切片或拼接后的列表等）。操作类型中包含“（输出到结果）”的操作，都会将处理后的列表输出到此处指定的变量中。





## 更新历史

-   1.1.8 增加筛选功能和获取值的序号功能。
