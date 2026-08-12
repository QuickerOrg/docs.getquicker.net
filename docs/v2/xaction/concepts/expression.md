---
title: "表达式"
description: "参数以 $= 开头时按表达式计算或比较；插值只负责拼文本。"
slug: "/v2/xaction/concepts/expression"
sidebar_position: 120
quickerDocKey: "xaction/concepts/expression"
comments: true
docStatus: reviewed
legacyDocId: 3932143
legacyContentUpdatedAt: "2023-10-08T07:46:06.000Z"
---

# 表达式

在输入框**最前面**写 `$=`，后面就是表达式。用来比较、运算，把结果交给参数。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {count} > 2'}}
  focusKeys={['condition']}
/>

拼接文本用 [$$ 插值](/v2/xaction/concepts/interpolation)；要计算或比较，用 `$=`。

1.9.5 起内部是 [Eval-expression](https://eval-expression.net/)（支持 Lambda）；更早版本是 DynamicExpresso。

若要输出以 `$=` 开头的纯文本，写 `$="$=ABC"`。



## 表达式基础

表达式是由一个或多个操作数（变量或常量）以及零个或多个运算符组成的序列，其结果为一个值。例如：

-   **$**\=5
-   **$**\=&#123;秒数&#125;\*1000
-   **$**\="你好，" + &#123;姓名&#125;
-   **$**\=&#123;次数&#125; &gt; 5
-   **$**\=&#123;选项&#125; == "选项1"



### 常量

表达式中不变的内容称作常量。

-   布尔常量：true  false
-   数字常量：10   50.1
-   文本常量使用**英文半角双引号**包围："China"
-   字符常量： 'A'  'c'



#### 转义字符

在文本或字符的常量值中，可以使用转义字符表示特殊符号。支持的转义字符：

-   `\'` - 单引号 single quote, needed for character literals
-   `\"` - 双引号 double quote, needed for string literals
-   `\` - 斜线 backslash
-   `\n` - 换行 New line (character 10)
-   `\r` - 回车 Carriage return (character 13)
-   `\t` - Tab跳格 Horizontal tab (character 9)



### 变量

表达式中值会动态变化的内容称作为变量，如前面例子中的&#123;秒数&#125;，&#123;姓名&#125;，&#123;次数&#125;和&#123;选项&#125;，它们的变量名是固定的，但值是动态变化的。更多内容请阅读[变量](/v2/xaction/concepts/variables)。



### 启用表达式

在输入框的开始处写 `$=`（且只在开始处写）作为开关，后面写表达式。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {选项} == "选项1"'}}
  focusKeys={['condition']}
/>



### 在表达式中使用变量

与插值写法类似，表达式中使用 **&#123;变量名&#125;** 的方式表示动作中的变量。注意变量名需要以英文字母或汉字开始，不能以数字开始，不能包含特殊符号。

表达式编辑框里输入 `{` 后会列出当前动作的变量；可按名字或拼音筛选，用 Tab、回车或空格填入高亮项。补全动画见 [表达式高级话题](/v2/xaction/concepts/expression-adv)。



### 表达式的运算结果

根据表达式的实际计算内容，其结果可能是文本/数字/日期/布尔等类型。应尽量使表达式的结果的类型与动作模块参数类型相同。

如果参数的类型与表达式结果的不同，Quicker将尝试自动转换（如将文本转换为数字等）。



### 表达式支持的数据类型(C#)



| 类型 | 值 | 备注 |
| --- | --- | --- |
| bool 布尔 | true/false |  |
| char 字符 | 'A' | 单引号包围的单个字符。如可用于判断文本内容的第1个字符是不是'A':<br />$= &#123;文本变量&#125;\[0\] == 'A' |
| string 字符串 | "Quicker Is Cool!" | 半角双引号包围的一串文本。等同于Quicker的文本变量类型。 |
| Int16 UInt16 Int32 int UInt32 Int64 long UInt64  <br />Single Double double Decimal decimal <br />各种数字类型 | 123<br />123.45 | Quicker的小数数字类型变量在内部使用c#的double类型，整数数字使用long类型。 |
| DateTime TimeSpan 时间日期、时间间隔类型 | 2020-2-20 20:20:20 | Quicker日期时间类型变量内部使用c# DateTime类型。 |
| Guid 唯一ID | 0C024548-D718-4CDD-BC73-87D21AC1A183 |  |
| [Math 数学类](https://docs.microsoft.com/en-us/dotnet/api/system.math?view=netcore-3.1)<br />[Random 随机数类](https://docs.microsoft.com/en-us/dotnet/api/system.random?view=netcore-3.1)<br />Convert  数据类型转换类 |  | 提供一些可用的函数对常量或变量进行计算或类型转换。 |
| [Path 静态类](https://docs.microsoft.com/en-us/dotnet/api/system.io.path) |  | 用于处理文件路径。 |
| [Regex 正则表达式处理类](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regex) |  | 用于正则相关处理。 |





## 表达式进阶

### 运算符

*注：以下部分内容摘录自*[*https://www.runoob.com/csharp/csharp-regular-expressions.html*](https://www.runoob.com/csharp/csharp-regular-expressions.html) *有删改。*



#### 算术运算符

下表显示了 C# 支持的所有算术运算符。假设变量 **A** 的值为 10，变量 **B** 的值为 20，则：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| + | 把两个操作数相加<br />把两个字符串相加 | A + B 将得到 30<br />"Hello " + &#123;Name&#125; |
| \- | 从第一个操作数中减去第二个操作数 | A - B 将得到 -10 |
| \* | 把两个操作数相乘 | A \* B 将得到 200 |
| / | 分子除以分母 | B / A 将得到 2 |
| % | 取模运算符，整除后的余数 | B % A 将得到 0 |



#### 关系运算符

下表显示了 C# 支持的所有关系运算符。假设变量 **A** 的值为 10，变量 **B** 的值为 20，则：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| \== | 检查两个操作数的值是否相等，如果相等则条件为真。 | (A == B) 不为真。 |
| != | 检查两个操作数的值是否相等，如果不相等则条件为真。 | (A != B) 为真。 |
| \&gt; | 检查左操作数的值是否大于右操作数的值，如果是则条件为真。 | (A &gt; B) 不为真。 |
| &lt; | 检查左操作数的值是否小于右操作数的值，如果是则条件为真。 | (A &lt; B) 为真。 |
| \&gt;= | 检查左操作数的值是否大于或等于右操作数的值，如果是则条件为真。 | (A &gt;= B) 不为真。 |
| &lt;= | 检查左操作数的值是否小于或等于右操作数的值，如果是则条件为真。 | (A &lt;= B) 为真。 |



#### 逻辑运算符

下表显示了 C# 支持的所有逻辑运算符。假设变量 **A** 为布尔值 true，变量 **B** 为布尔值 false，则：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| && | 称为逻辑与运算符。如果两个操作数都非零，则条件为真。 | (A && B) 为假。<br />例如：（数字是否在0和10之间）<br />$= &#123;数字&#125; &gt; 0 && &#123;数字&#125; &lt; 10 |
| \|\| | 称为逻辑或运算符。如果两个操作数中有任意一个非零，则条件为真。 | (A \|\| B) 为真。<br />例如：（文本为AAA、BBB、CCC中的任意一个）<br />$= &#123;变量&#125; == "AAA" \|\| &#123;变量&#125; =="BBB" \|\| &#123;变量&#125; = "CCC" |
| ! | 称为逻辑非运算符。用来逆转操作数的逻辑状态。如果条件为真则逻辑非运算符将使其为假。 | !(A && B) 为真。 |



#### 位运算符

位运算符作用于位，并逐位执行操作。&、 | 和 ^ 的真值表如下所示：

| p | q | p & q | p \| q | p ^ q |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 |



#### 条件运算符?:     

*写法：条件* **?** *条件成立时返回的值* **:**  *条件不成立返回**的值，例如：*

-   取两个变量的最大值： $= &#123;a&#125; &gt; &#123;b&#125; ? &#123;a&#125; : &#123;b&#125;
-   取3个变量的最大值：$= &#123;a&#125; &gt; &#123;b&#125; ? (&#123;a&#125; &gt; &#123;c&#125; ? &#123;a&#125; : &#123;c&#125; ): (&#123;b&#125; &gt; &#123;c&#125; ? &#123;b&#125; : &#123;c&#125; )



#### 运算符的优先级

遵循c#语言的语法，请参考：[https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/index#code-try-0](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/index#code-try-0)



一般的：

-   括号具有更高的优先级  (2+3)\*5 的值为25。
-   乘除优先级大于加减。 2+3\*5 的值为17。
-   加减的优先级大于比较。 2+4 &gt; 5 的值为true。





### 调用变量（或常量的）属性或方法

变量或常量，在c#内部都是某种对象，每种对象会支持一些c#的属性或方法函数。调用方法一般为：

-   属性： &#123;变量&#125;.属性名
-   变量实例方法： &#123;变量&#125;.方法名(参数列表)
-   类型的静态方法：类型名.方法名(参数列表)



#### 文本类型的常用属性和方法

更详细的说明请参考：[https://docs.microsoft.com/zh-cn/dotnet/api/system.string?view=netframework-4.8#methods](https://docs.microsoft.com/zh-cn/dotnet/api/system.string?view=netframework-4.8)

| 属性或方法 | 说明 | 示例 |
| --- | --- | --- |
| Length | 取文本内容的长度 | &#123;文本变量&#125;.Length   取变量的值的长度<br />"Quicker".Length    取常量的值的长度 |
| Contains(string) | 检查文本是否包含指定的内容。返回布尔值 | &#123;文本变量&#125;.Contains("Quicker") |
| StartsWith(string) | 检查文本是否以指定内容开头 | &#123;文本变量&#125;.StartsWith("http")检查是否http开头 |
| EndsWith(string) | 检查文本是否以指定内容结束 | &#123;文本变量&#125;.EndsWith('A') |
| IndexOf(string)<br />IndexOf(char) | 检查指定内容在文本中的位置。 |  |
| LastIndexOf(string)<br />LastIndexOf(char) | 指定的内容在文本中最后出现的文字 |  |
| PadLeft(int,char) | 返回一个新字符串，该字符串通过在此实例中的字符左侧填充指定的 Unicode 字符来达到指定的总长度，从而使这些字符右对齐。 | &#123;文本变量&#125;.PadLeft(20, '0') |
| Replace(string, string) | 替换内容 | &#123;文本变量&#125;.Replace("Qk", "Quicker") |
| Split(char\[\])<br />Split(string\[\], StringSplitOptions) | 拆分文本为列表 | &#123;文本内容&#125;.Split(' ')  使用空格将文本拆分成列表；<br />&#123;文本内容&#125;.**Split**('，','。') 使用中文逗号和句号拆分为列表；<br />&#123;文本内容&#125;.**Split**(**new** string\[\] **&#123; "\\r\\n" &#125;**,StringSplitOptions.RemoveEmptyEntries) 按回车换行拆分为列表。<br />  <br />StringSplitOptions.RemoveEmptyEntries选项表示去除空元素，也可使用StringSplitOptions.None保留空元素。 |
| Substring(int 开始位置)<br />Substring(int 开始,int 长度) | 截取从指定位置开始的一部分文本 | &#123;str&#125;.Substring(&#123;str&#125;.Length-2) 取文本的末尾2个字符。<br />&#123;str&#125;.Substring(0,&#123;str&#125;.Length-5)从0开始截取，去掉后5位字符，如123456789 将剩余1234 |
| ToLower()<br />ToUpper() | 转换为小写或大写格式。 |  |
| Trim()<br />TrimStart()<br />TrimEnd() | 移除开始和/或结束的空白字符。 |  |
| \[序号\] | 取第几个字符 | &#123;文本变量&#125;\[0\] == 'Q'    判断文本的第一个字符是否为Q |
| Regex.Match<br />正则提取 | 正则提取内容 | Regex.Match(**&#123;文本变量&#125;**, "正则表达式").ToString()  因为返回是Regex类 所以需要转换成文本 【正则表达式\\代表转义需要写成\\\\如：\\d需要写成\\\\d，如果正则内容带"双引号也需要转义\\"】 |
| Regex.IsMatch<br />正则判断 | 正则判断内容并返回布尔值 | Regex.IsMatch(**&#123;文本变量&#125;**, "正则表达式")例如：Regex.IsMatch(**&#123;后缀名&#125;**, ".\*?\\\\.(png\|jpg\|bmp\|gif)") 判断后缀是否为图片返回True或者False |
| Regex.Replace<br />正则替换 | 正则替换内容 | Regex.Replace(**&#123;文本变量&#125;**, "正则表达式", "替换内容") 返回是文本所以不需要转换 |
| Regex.Split<br />正则拆分 | 正则拆分内容为列表 | Regex.Split(**&#123;文本变量&#125;**,"正则表达式")<br />例子:拆分回车换行<br />Regex.Split(**&#123;文本变量&#125;**,@"\\r\\n") |
| JsonConvert.DeserializeObject() | 将字符串解析为JToken | JsonConvert.DeserializeObject(&#123;JSON字符串&#125;) |



#### 词典的常用属性和方法

| 属性或方法 | 说明 | 示例 |
| --- | --- | --- |
|  | 获取某个键的值 | $= &#123;词典变量&#125;\["键名"\]<br />词典变量的值是c#的Object类型，因此不能直接将其内容和别的文本进行比较，需要先转换成string类型或使用String.Equals函数进行比较，如：$= ((string)&#123;词典A&#125;\["Key1"\]) == "abc"，<br />或$= &#123;词典A&#125;\["Key1"\].ToString() == "abc"，<br />或 $**\=** String.Equals(&#123;词典A&#125;\["Key1"\],&#123;词典B&#125;\["Key1"\]) |
| ContainsKey() | 是否包含某个键 | $= &#123;词典变量&#125;.ContainsKey("键") |
| Keys | 获取所有键的列表 | $= &#123;词典变量&#125;.Keys |
| Values | 获取所有值的列表 | $= &#123;词典变量&#125;.Values |
| JsonConvert.SerializeObject() | 词典序列化json字符串 | $=JsonConvert.SerializeObject(&#123;词典变量&#125;) |



#### 列表的常用属性和方法

| 属性或方法 | 说明 | 示例 |
| --- | --- | --- |
|  | 获取某个值 | $=&#123;列表变量&#125;\[序号\]，<br />序号从0开始。如果使用数字变量指定序号，需要(int)强制类型转换，如：&#123;列表变量&#125;\[(int)&#123;序号变量&#125;\] |
| Contains() | 是否包含某项 | $= &#123;列表变量&#125;.Contains("某项内容") |
| String.Join() | 合并列表为文本 | $= String.Join("分隔符", &#123;列表变量&#125;) |
| IndexOf() | 某一项的序号。从0开始，不存在的话返回-1. | $= &#123;列表变量&#125;.IndexOf("某项内容") |
| Count() | 返回列表的长度（含有的元素个数） | $= &#123;列表变量&#125;.Count() |



#### 用户分享（[链接](https://getquicker.net/QA/Question/1811)）

在这个帖子里有不少用户分享了一些常用的表达式。



#### 数学计算

数学除了可以直接使用普通的计算表达式外，还可以使用c#的静态类Math。

可以在表达式中直接使用的常量:

-   Math.E   自然对数底
-   Math.PI  π

如，求圆的面积 `$= Math.PI * {R} * {R}`



可以在表达式中使用Math的静态方法。更多请参考：[https://docs.microsoft.com/zh-cn/dotnet/api/system.math?view=netframework-4.8#methods](https://docs.microsoft.com/zh-cn/dotnet/api/system.math?view=netframework-4.8)

如：求2的指定次方： `$= Math.Pow(2, {次数})`



Quicker中的数字类型变量在内部为C#语言的double类型，整数数字类型在内部为c#的long型。





### 转换值的类型

-   数字-&gt;文本：可以使用.ToString()。 如 $= &#123;数字变量&#125;.ToString()
-   文本-&gt;小数数字：可以使用double.Parse(string)。 如 $=double.Parse(&#123;文本变量&#125;)
-   文本-&gt;整数数字:可以使用int.Parse(string)或long.Parse(string)。 如 $=int.Parse(&#123;文本变量&#125;)，也可以使用C#的**Convert类**转换数据的类型。如$= Convert.ToDouble(&#123;文本变量&#125;)

更多请参考：[https://docs.microsoft.com/en-us/dotnet/api/system.convert?view=netframework-4.8](https://docs.microsoft.com/en-us/dotnet/api/system.convert?view=netframework-4.8)





### Lambda表达式

\*本功能自1.9.5版本开始支持。

从一个例子开始：

```csharp
$= {列表变量}.Where(x => !String.IsNullOrWhiteSpace(x)).Select(x => x.Trim().ToUpper() + "_后缀").ToList()
```

说明：

-   .Where(x =&gt; !String.IsNullOrWhiteSpace(x)) 筛选掉没有可见字符的行
-   .Select(x =&gt; x.Trim().ToUpper() + "\_后缀") 处理每项

-   Trim()：去除前后的空白
-   ToUpper(): 转换为大写字母
-   +"\_后缀": 叠加其他内容

-   .ToList() 转换为列表类型



上面例子中使用了 `x => 表达式` 这样的语法，它表示对参数x做后面的处理，取其结果。

如果有多个参数，需要在参数列表两侧添加括号：`(x,y,z)` 当计算结果的逻辑比较复杂时 =&gt; 后面可以写多个c#语句并使用&#123;&#125;包围起来。



下面是几个例子：

-   给列表的每项添加序号：

```csharp
$= {list}
.Select((x,index) => {
  var temp = x.ToUpper().Trim();
  temp = index.ToString() + ": " + temp;
  return temp;
})
.ToList()
```

-   将词典转换为“用户选择”模块的可选值格式：

```csharp
$= {dict}.Select(x => x.Value.ToString() + "|" + x.Key).ToList()
```

-   将词典转换为Cookie数据格式：

```csharp
$= String.Join(" ", {dict}.Select(x => x.Key+ "=" + x.Value +";"))
```

-   将数字内容的列表按数字大小排序：

```csharp
$= {list}.Select(x => Convert.ToInt32(x))
.OrderBy(x => x)
.Select(x => x.ToString())
.ToList()
```

-   将两个同样长度的列表的每个元素横向合并：

```csharp
$= {list1}.Select((x,index) => x + {list2}[index]).ToList()
```





<StepProgramView example="acf2fc09-3753-4b67-d714-08d827485760" />

<ShareLinkCard
  code="acf2fc09-3753-4b67-d714-08d827485760"
  title="示例：Lambda表达式"
/>

关于Lambda，请参考：[https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/statements-expressions-operators/lambda-expressions](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/statements-expressions-operators/lambda-expressions)

Select()/Where()/ToList() 是C#中[System.Linq.Enumerable](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable?view=netcore-3.1)静态类下的扩展函数。





## 与[插值](/v2/xaction/concepts/interpolation)方式的比较

-   插值的作用是将变量的值插入到一段文本中。其结果也是一段文本。
-   插值将直接将变量的内容转换成文本插入当前位置，而在表达式中，将使用变量本身参与运算，不再转换成文本。
-   在需要接收布尔类型值的参数中（例如，在“如果”模块），插值后的结果文本会被作为一个表达式进行解析，转换为布尔值。

-   比较字符串时，插值方式使用单引号包围两个被比较的字符串。



- 使用表达式时，变量名不要加单引号；文本常量用英文双引号。

<ModuleParamPreview
  moduleKey="sys:if"
  values={{condition: '$= {选项} == "选项1"'}}
  focusKeys={['condition']}
/>



-   在需要比较、计算的场景下，应该使用**$**\=表达式的写法。



|  | **插值** | **表达式** |
| --- | --- | --- |
| 启动指令 | 参数的开始加**$$** | 参数的开始加**$**\= |
| 主要用途 | 拼接文本 | 计算、比较，或较为复杂的变量操作 |
| 实现方式 | 将变量的值插入到文本中，组合成一段大的文本。 | 将Quicker变量使用c#语言变量的方式进行处理。<br />  <br />支持变量原始对象的c#方法和属性调用。<br />比较一个文本不为空并且长度超过5：<br />$= !String.IsNullOrEmpty(&#123;thePath&#125;) && &#123;thePath&#125;.Length &gt; 5 |
| 优缺点 | 优点：<br />-   拼接文本比较方便<br />缺点：<br />-   功能比较受限 | 优点：<br />-   可以使用变量自身的c#属性和方法；<br />-   功能强大； |



示例：

|  | 插值 | 表达式 |
| --- | --- | --- |
| 组合文本 | $$ 你好， &#123;name&#125;<br />*将&#123;name&#125;的值替换到文本中* | $= "你好," + &#123;name&#125;<br />*相当于两个文本对象相加* |
| 比较大小 | $$ &#123;数字变量&#125; &gt; 5<br />*插值后进行解析，仅在部分模块中支持。* | $= &#123;数字变量&#125; &gt; 5 |





## 表达式的辅助编写

自 1.24.27 起提供自动补全和语法校验。补全出现后用方向键选择，`Tab` 或回车确认。需联网；提示仅供参考，以实际运行为准。补全录屏与设置开关见 [表达式高级话题](/v2/xaction/concepts/expression-adv)。

## 限制与排障

- `$=` 必须在整段最前面。
- 想输出字面 `$=` 时写 `$="$=ABC"`，不要指望关掉表达式。
- 词典值是 `object`，比较前先转成同一类型。
- 列表下标用整数变量时要 `(int){序号}`。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/expression-adv',
      label: '表达式高级话题',
      description: '复杂表达式、补全、_context',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '只拼文本时用 $$',
    },
    {
      href: '/v2/xaction/concepts/edit-step-param',
      label: '选择或输入步骤参数',
      description: 'F1 切到 $=',
    },
  ]}
/>
