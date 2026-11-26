---
title: "表达式高级话题"
description: "复杂表达式、F1 切换、补全与测试、布尔助手，以及 _context / _eval。"
slug: "/v2/xaction/concepts/expression-adv"
sidebar_position: 130
quickerDocKey: "xaction/concepts/expression-adv"
comments: true
docStatus: reviewed
legacyDocId: 49033656
legacyContentUpdatedAt: "2023-10-07T00:29:12.000Z"
---

# 表达式高级话题

基础语法见 [表达式](/v2/xaction/concepts/expression)。本页讲复杂写法、编辑辅助和内置对象。

## 简单 vs 复杂

**简单表达式**：相当于赋值语句等号右边，如 `$= {数字变量} + 1`、`$= {数字变量} > 10`。

**复杂表达式**：相当于一个会 `return` 的方法：

```csharp
$=
if ({number1} > {number2})
{
  return "较大值为number1:" + {number1};
}else{
  return "较大值为number2:" + {number2};
}
```

## 辅助编写

参数框里按 **F1** 在原始值、`$$`、`$=` 之间切换，见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)。

### 补全与验证

补全会提示关键词和变量方法。默认使用在线服务，需要联网；也可以在“设置 → 动作设计 → 代码补全服务”中选择本地补全。提示仅供参考，以实际运行为准。

![](./img/expression-adv-001-e21604f457.gif)

开启补全：

![](./img/expression-adv-002-7e8a5da993.png)

若要在本机补全，先点击“安装 / 检查更新”安装独立组件，再勾选“使用本地补全服务”并保存。安装组件本身不会自动启用本地模式。本地模式可使用“额外引用目录”中的 `*.dll` 和同名 `*.xml` 文档；未安装组件或组件故障时，不会自动把代码发送给在线服务。

关闭“使用本地补全服务”时，在线补全会向服务器发送正在编辑的代码、变量类型和默认 `using`；在线服务只支持预置类库，不读取或上传额外引用目录。补全服务选项、额外引用目录和默认 `using` 只保存在本机，不参与同步。

### 表达式测试

在代码编辑窗口写表达式时，右侧会列出用到的变量和当前计算结果，可改变量值看结果变化。

![](./img/expression-adv-003-93f06d88cb.png)

### 布尔表达式助手

「如果」等布尔参数右侧的铅笔可打开助手。

<ExpressionAssistPreview
  variable="count"
  operation="大于"
  paramTitle="比较值"
  paramValue="10"
/>

![](./img/expression-adv-005-6e6b36ac6c.png)

## 内置对象

### `_context`：动作上下文

用来读动作信息；必要时也能改变量，但不建议——改了的值不好调试。

![](./img/expression-adv-006-7d646baacf.png)

属性：`ActionId`、`ActionTitle`、`IsRootContext`（是否主程序上下文；每个子程序运行时有自己的上下文）。

| 方法 | 作用 |
| --- | --- |
| SetVarValue / GetVarValue | 写 / 读变量 |
| TryGetValue | 没有该变量时返回默认值 |
| IsVarExists | 变量是否存在 |
| GetRootContext | 主程序上下文 |
| GetParentContext | 上一级子程序或主程序 |
| RunSp | 跑子程序 |
| WriteState / ReadState | 动作状态 |
| WriteCache / ReadCache | 对象缓存（动作结束后仍留在内存，退出 Quicker 失效） |
| UpdateVariablesFromDict | 用词典更新变量，键是变量名 |
| UpdateVariablesFromJson | 用 JSON 键值更新变量 |

搜索框触发的动作可用 `$=_context.ExtraData?.ActiveWindowBeforeSearch` 取搜索窗出现前的活动窗口句柄。

<a id="开发中读取动作的只读信息" />

### 读取动作的只读信息 {/* #237--读取动作的只读信息 */}

通过运行上下文的独立只读属性获取当前动作信息：

| 属性 | 内容 |
| --- | --- |
| `_context.ActionId` | 动作 ID，字符串 |
| `_context.ActionTitle` | 动作标题 |
| `_context.ActionIcon` | 动作图标描述 |
| `_context.ActionDescription` | 动作说明 |

例如给子程序传递当前动作图标：

```csharp
$=_context.ActionIcon
```

读取主程序信息时，使用 `$=_context.GetRootContext().ActionIcon` 等属性。它们只读取运行中的动作，不查找其他动作，也不能通过赋值修改动作库。要根据 ID 查询另一动作，使用[Quicker 操作 · 根据 ID 获取动作信息](/v2/xaction/modules/quickeroperations#根据id获取动作信息)。

图标与说明属性最低需要 2.3.8。早期 `_context.Action.*` 写法的迁移注意事项见[升级与回退](/v2/migration/upgrade-and-rollback)。

### `_eval`

用来注册表达式里额外的类型，见 [Eval-expression 文档](https://eval-expression.net/)。要单独一步先注册，后面的步骤才能用。

### `_qk`

内置功能封装。

## 引擎已注册的类型

初始注册：

```csharp
EvalManager.DefaultContext.RegisterType(
                typeof(Regex),
                typeof(Path),
                typeof(System.Linq.Enumerable),
                typeof(JsonConvert),
                typeof(JArray),
                typeof(JObject),
                typeof(JToken),
                typeof(DateTime),
                typeof(CommonExtensions)
                );
```

另外还能用一部分引擎内部类型，例如 `System.IO.File` / `Directory`、`StringBuilder`、`Process`、`Encoding`、`DataTable` / `DataRow` 等。

## 限制与排障

- 补全失败先检查网络，再以实际运行为准。
- 不要在表达式里改变量，除非没有别的办法。
- `_eval` 注册的类型只对后续步骤生效。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '基础语法和运算符',
    },
    {
      href: '/v2/xaction/concepts/edit-step-param',
      label: '选择或输入步骤参数',
      description: 'F1 切换模式',
    },
    {
      href: '/v2/xaction/concepts/subprogram',
      label: '子程序',
      description: '_context 在子程序里各有一份',
    },
  ]}
/>

## 历史版本相关变化

以下为与本页相关的重要变化，当前用法以正文为准。

- [2.3.8](/release-notes#238--动作隐藏远程目录删除与表达式兼容)：动作图标和说明改用上下文独立只读属性，替代早期 Action 对象入口。
- [2.2.21](/release-notes#2221--代码补全与动作面板)：提供可选的本地代码补全服务。

更早记录与完整修复列表见[更新记录](/release-notes)。
