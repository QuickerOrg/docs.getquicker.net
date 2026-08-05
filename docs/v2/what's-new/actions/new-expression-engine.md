---
title: 全新表达式引擎
description: Quicker V2 自研 QkEval 表达式引擎的性能、诊断、现代 C# 语法和迁移兼容性说明。
sidebar_position: 10
quickerDocKey: v2/what's-new/actions/new-expression-engine
comments: true
---
# 全新自研表达式引擎 QkEval

Quicker 1.x 主要使用 Z.Expressions 计算组合动作中的表达式。V2 新增自研 QkEval，以减少运行开销，并让语法、类型环境和错误位置由 Quicker 自己控制。

在“设置 → 基础设置 → 动作”中启用新表达式引擎后，表达式只使用 QkEval，不会在失败后自动回落到 Z.Expressions。

> **警告：先测试复杂动作**
>
> 普通算术、字符串、集合和条件表达式通常可以直接使用。依赖 Z.Expressions 特有语法、动态类型推断或第三方程序集的复杂表达式，应先复制动作测试。

## 性能全面提升

下面的数据来自开发基准中的一次 Release 运行，用于展示不同表达式形态的量级差异。实际速度会受电脑、表达式、变量数量、缓存命中和被调用方法影响。

| 场景            | Z                    | QkEval            | QkEval 优势         |
| ------------- | -------------------- | ----------------- | ----------------- |
| 简单算术          | 8.438 µs / 4857 B    | 0.540 µs / 320 B  | 约快 15.6 倍，少分配 93% |
| 120 个变量仅读 2 个 | 29.252 µs / 28035 B  | 0.299 µs / 272 B  | 约快 98 倍，少分配 99%   |
| 链式成员访问        | 7.421 µs / 4785 B    | 0.849 µs / 528 B  | 约快 8.7 倍          |
| 条件与字符串方法      | 7.579 µs / 4865 B    | 1.729 µs / 952 B  | 约快 4.4 倍          |
| LINQ 100 元素   | 11.044 µs / 5627 B   | 5.626 µs / 1424 B | 约快 2 倍，少分配 75%    |
| 200 条冷表达式     | 151.286 µs / 33238 B | 8.504 µs / 2966 B | 约快 17.8 倍         |
| 5 条混合表达式      | 38.889 µs / 28948 B  | 7.230 µs / 3784 B | 约快 5.4 倍          |

## 更强的诊断能力

表达式执行失败时，QkEval 会尽量提供：

- 出错原因
- 出错的表达式片段
- 对应的行号和列号
- 暂不支持的语法类型
- 解析错误与执行错误的区别

即使表达式经过了兼容转换，错误位置也会尽量映射回用户最初输入的代码，方便在表达式编辑器中快速定位问题。



## 更全面的 C# 语法支持

相对于 Quicker 当前使用的 Z.Expressions 版本，QkEval 增加了多项现代 C# 语法支持，并改善了一些 Z 无法正确解析的标准 C# 写法。

### Switch 表达式与模式匹配

支持 C# 8 的 `switch` 表达式：

```csharp
score switch
{
    >= 90 => "优秀",
    >= 60 and < 90 => "合格",
    _ => "不合格"
}
```

同时支持：

- 常量模式
- 类型模式
- 关系模式
- 属性模式
- `and`、`or`、`not` 组合模式
- `when` 条件

```csharp
value switch
{
    string s when s.Length > 10 => "长字符串",
    string => "字符串",
    int n => n * 2,
    _ => null
}
```

### LINQ 查询语法

除了常见的方法链写法，QkEval 还支持 C# 查询语法：

```csharp
from item in items
where item.Price > 100
orderby item.Price descending
select item.Title
```

目前支持的主要查询子句包括：

- `from`
- `where`
- `select`
- `orderby`
- `let`
- 多重 `from`
- `group by`
- `join`
- `join into`
- `select into`

### 目标类型 new

当目标类型明确时，可以省略构造类型：

```csharp
List<int> numbers = new() { 1, 2, 3 };
```

也支持带构造参数：

```csharp
StringBuilder builder = new("Hello");
```

目标类型可以来自变量声明、赋值目标或对象成员。

### 集合表达式

支持新的集合表达式语法：

```csharp
int[] numbers = [1, 2, 3];
```

也支持展开已有集合：

```csharp
int[] allNumbers = [0, ..numbers, 4];
```

对于无法明确推断目标集合类型的复杂场景，建议继续使用显式数组或集合初始化器。

### Range 和 Index

支持从末尾索引以及范围截取：

```csharp
var last = text[^1];
var middle = text[1..^1];
```

目前主要支持：

- 字符串
- 一维数组
- `List<T>` 等常见列表

### 元组与解构

支持元组创建、访问和解构：

```csharp
var item = (Title: "示例", Count: 3);
var title = item.Title;
```

```csharp
var (name, count) = ("示例", 3);
```

也可以通过元组赋值交换变量：

```csharp
(a, b) = (b, a);
```

### 局部函数

支持在表达式代码中声明和调用局部函数：

```csharp
int Add(int a, int b)
{
    return a + b;
}

return Add(1, 2);
```

局部函数可以提前调用、递归调用，并访问外层变量。

### using var

支持使用 `using var` 自动释放资源：

```csharp
using var stream = new MemoryStream(data);
return stream.Length;
```

也支持传统的 `using (...) { ... }` 写法。当前主要支持实现 `IDisposable` 的同步资源。

### 更完整的字典初始化器

Z 无法正确处理部分字典初始化语法，QkEval 支持以下两种标准写法。

索引初始化器：

```csharp
new Dictionary<string, object>
{
    [".background"] = "#3ff52891",
    ["title"] = "示例"
}
```

集合初始化器：

```csharp
new Dictionary<string, int>
{
    { "a", 1 },
    { "b", 2 }
}
```

这使字典可以使用 `.background` 等无法作为匿名对象属性名的键。

### 更完整的对象初始化器组合

QkEval 支持对象初始化完成后直接继续访问成员：

```csharp
new MyItem
{
    Title = "示例"
}?.Title
```

也修复了 Z 在“单成员对象初始化器后继续执行其他语句”时可能出现的解析错误：

```csharp
var item = new MyItem { Title = "示例" };
return item.Title;
```

## 与旧表达式的兼容关系

V2 会为旧动作提供兼容类型环境和必要的语法转换，但不会无限制开放所有 .NET 类型。新动作默认使用更明确的类型和命名空间范围。

如果同一表达式在 1.x 可用、在 QkEval 中失败，请先根据错误位置检查：

1. 类型或命名空间是否在当前表达式环境中可用；
2. 是否依赖 Z.Expressions 的非标准语法；
3. 字符串索引、字典键或变量类型是否与预期一致；
4. 是否调用了 .NET Framework 中存在、但 .NET 10 已移除或行为不同的 API；
5. 表达式是否包含文件、网络、进程或其它具有副作用的调用。

不要为了让表达式“先运行起来”而把未知类型全部开放。需要额外程序集或特殊类型时，应明确添加依赖并验证安全边界。

## 回退和反馈

如果关键动作暂时无法迁移，可以先关闭“启用新表达式引擎”，让该电脑继续使用兼容表达式路径。这个开关是本机选项，不参与账号同步。

反馈问题时，请附上脱敏后的原始表达式、完整错误信息、输入变量类型，以及 1.x 与 V2 的实际结果。只有一张“运行失败”截图通常不足以判断是语法、类型环境还是运行时差异。
