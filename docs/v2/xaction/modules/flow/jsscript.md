---
title: "运行Javascript代码"
description: "执行Js代码片段。代码中应包含主函数exec()，请参考文档。"
slug: "/v2/xaction/modules/jsscript"
sidebar_label: "运行Javascript代码"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:jsscript"
comments: true
moduleKey: "sys:jsscript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2577253
legacyContentUpdatedAt: "2024-07-01T23:59:07.000Z"
---

# 运行Javascript代码

在动作里跑一段 JavaScript。脚本必须提供全局函数 `exec()`，返回 `0` 表示成功，其它数字表示失败。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:jsscript" />

## 概述

1.43.7+ 使用 [Jint](https://github.com/sebastienros/jint)，语法更完整。1.43.6 及更早使用 [Jurassic](https://github.com/paulbartrum/jurassic)（ECMAScript 3 / 5）。

```javascript
// 主函数 exec()
function exec(){
 var localName = quickerGetVar('name');  // 读取name变量值, (name 是动作里的变量)
 quickerSetVar('name', 'Hello, ' + localName ); //输出修改后的值到name变量中。
 return 0; //返回0表示成功。返回其他数字表示失败。
}
```

<ModuleParamPreview moduleKey="sys:jsscript" />

## 参数说明

**脚本内容**：要运行的 JS。必须包含 `exec()`。

**允许访问.Net程序集**：初始化 Jint 时允许访问 .NET 基本类库（相当于 `new Engine(cfg => cfg.AllowClr())`）。详见 Jint 文档。1.43.7+。

**失败后停止**：失败后是否停止动作。默认开启。

## 输出

- **是否成功**：没有运行错误，且 `exec()` 返回 `0`。
- **返回值**：脚本返回的数字。

## 脚本写法

Quicker 会调用 `exec`。正常请返回数字 `0`，否则返回非 0。

1.43.7+ 还提供：

- `log('text')`：输出调试信息（仅调试运行时）
- `alert('text')`：显示提示消息

读取动作变量：

```javascript
var localVar = quickerGetVar('动作里的变量名');
```

写入动作变量：

```javascript
quickerSetVar('动作里的变量名', 新的值);
```

列表、词典传入 JS 时是副本，在 JS 里改这些对象不会影响 Quicker 变量。要写回请用 `quickerSetVar` 整份覆盖。

只支持一部分变量类型。早期版本请参考 Jurassic 文档。

## 示例动作

<StepProgramView example="acd50dea-9df0-4ed6-a3cf-08d7c216a695" />

<ShareLinkCard
  code="acd50dea-9df0-4ed6-a3cf-08d7c216a695"
  title="转换化学公式"
  description="将以ASC个是书写的化学公式转换为Unicode上下标的形式"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/csscript',
      label: '运行C#代码',
      description: '需要 .NET API 或更完整类型时用 C#。',
    },
    {
      href: '/v2/xaction/modules/pythonscript',
      label: '运行Python代码',
      description: '本机已装 Python 时跑片段。',
    },
    {
      href: '/v2/xaction/modules/runscript',
      label: '运行脚本',
      description: '写成临时文件再交给外部解释器。',
    },
  ]}
/>

## 更新历史

- 1.1.13 开始提供此模块。
- 20240702 改为 Jint；支持 `log` / `alert`。（感谢 @小布丁的大布丁）
