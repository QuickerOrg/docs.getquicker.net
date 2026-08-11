---
title: "提取JSON内容"
description: "提取Json文本中的信息"
slug: "/v2/xaction/modules/jsonextract"
sidebar_label: "提取JSON内容"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:jsonExtract"
comments: true
moduleKey: "sys:jsonExtract"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113782
legacyContentUpdatedAt: "2022-03-11T14:45:55.000Z"
---

# 提取JSON内容

提取Json文本中的信息

## 当前模块定义

<XActionModuleMeta moduleKey="sys:jsonExtract" />

用于从JSON格式的数据中提取需要的值。

json是一种轻量级的数据交换格式。通常用于网络数据交换或配置文件存储等场景。

本模块使用[Json.Net](https://www.newtonsoft.com/json)组件的 [JToken.SelectToken](https://www.newtonsoft.com/json/help/html/SelectToken.htm) 和 JToken.SelectTokens 方法实现。深入使用请参考此组件的相关文档。

<ModuleParamPreview moduleKey="sys:jsonExtract" />

## 参数

### 输入

【输入】要提取信息的json数据 或 JToken对象。

【提取路径n】一次可以提取5项信息，对每一项指定要提取的JsonPath。

Quicker在内部将先使用[JToken.SelectToken()](https://www.newtonsoft.com/json/help/html/SelectToken.htm)方法提取单个值的内容，失败时尝试使用[JToken.SelectTokens()](https://www.newtonsoft.com/json/help/html/Overload_Newtonsoft_Json_Linq_JToken_SelectTokens.htm)方法提取列表类型的内容。

(1.30.14+) 对于明确需要提取数组/列表类型的结果的情况，可以在路径上增加前缀`list:`强制使用数组方式提取。

#### 路径参数的格式

格式1：使用“属性.子属性\[序号\].子子属性”的层级式路径。如：

-   Manufacturers\[0\].Name
-   Manufacturers\[0\].Products\[0\].Price
-   Manufacturers\[1\].Products\[0\].Name

格式2：使用JSONPath。

### 输出

【值n】根据路径n所提取到的内容。请确保输出的内容与变量类型兼容。

【根对象】输入的所有内容解析后生成JToken对象。当需要提取更多的内容时，可以将此对象输出到变量，然后使用更多的Json提取模块提取内容，也可以在表达式中使用JToken对象提取内容。

说明

## 高级

### 表达式替代用法

通过`JsonConvert.DeserializeObject({JSON字符串})`这个函数可以将字符串转化为Jtoken，然后通过`{JToken}["path1"]["path2"]`即可获取内容。

### JToken说明

[JToken对象使用方法](/v2/xaction/modules/chromecontrol)

## 示例

示例动作：[https://getquicker.net/Sharedaction?code=05d33931-477a-4c18-a917-08d7b30d7779](https://getquicker.net/Sharedaction?code=05d33931-477a-4c18-a917-08d7b30d7779)

json数据：

&#123;
  'Stores': \[
    'Lambton Quay',
    'Willis Street'
  \],
  'Manufacturers': \[
    &#123;
      'Name': 'Acme Co',
      'Products': \[
        &#123;
          'Name': 'Anvil',
          'Price': 50
        &#125;
      \]
    &#125;,
    &#123;
      'Name': 'Contoso',
      'Products': \[
        &#123;
          'Name': 'Elbow Grease',
          'Price': 99.95
        &#125;,
        &#123;
          'Name': 'Headlight Fluid',
          'Price': 4
        &#125;
      \]
    &#125;
  \],
  'City': 'BeiJing',
  'Dot.Name': 'Hello'
&#125;

| **要提取的内容** | **路径** | **值** |
| --- | --- | --- |
| City | City | 文本:<br />Beijig |
| Stores | Stores | 列表：<br />'Lambton Quay',<br />   'Willis Street' |
| 第一个Manufacturer的Name | Manufacturers\[0\].Name | 文本：<br />Acme Co |
| 所有Products的name列表 | $..Products\[\*\].Name | 列表：<br />'Anvil'<br />'Elbow Grease'<br />'Headlight Fluid' |
| 所有Manufacture对象的列表 | Manufacturers | 对象列表，可以使用“每个”模块循环处理每一项。 |
| Dot.Name的值（Key含有点） | \['Dot.Name'\] | Hello |

## 更新历史

-   1.4.18 当提取的数据为复杂类型时，返回原始JToken对象。

## 参考资料

-   [https://www.newtonsoft.com/json/help/html/SelectToken.htm](https://www.newtonsoft.com/json/help/html/SelectToken.htm)
-   JsonPath教程：[https://blog.csdn.net/koflance/article/details/63262484](https://blog.csdn.net/koflance/article/details/63262484)
