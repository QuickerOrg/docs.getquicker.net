---
title: "停止(return)"
description: "停止动作或从子程序中返回"
slug: "/v2/xaction/modules/stop"
sidebar_label: "停止(return)"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:stop"
comments: true
moduleKey: "sys:stop"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2133611
legacyContentUpdatedAt: "2020-02-07T15:07:05.000Z"
---

# 停止(return)

停止动作或从子程序中返回

## 当前模块定义

<XActionModuleMeta moduleKey="sys:stop" />

停止动作或从子程序中返回。类似于编程语言中的**return**语句。

<ModuleParamPreview moduleKey="sys:stop" />

## 操作类型

**默认：**​

-   如果在主程序中：停止当前动作。
-   如果在启用了“忽略错误”选项的[步骤组](/v2/xaction/modules/group)中：只跳过后面的步骤，不停止动作，从此步骤组下面的模块开始执行。
-   如果在子程序中：结束当前子程序，返回到主程序中。

**​停止动作：**​

-   停止动作，即便是在子程序中使用，也会停止整个动作。

## 参数

**【标记为出错】**

用于中止子程序时，标记为子程序出错。此时如果在“[运行子程序](/v2/xaction/concepts/subprogram)”模块中选择了“失败后停止”选项，则会停止动作。

**【返回值】**

当动作被其他动作调用时，也可用于向其他动作返回执行结果信息。

<PreviewCompare
  labels={['停止(return)', '运行或停止动作']}
  caption="被调用动作里「返回值」会出现在「动作输出」。勾选「标记为出错」时，这里通常是错误消息（需同时勾选等待运行结束）。"
>
  <ModuleParamPreview
    moduleKey="sys:stop"
    focusKeys={['isError', 'return']}
    values={{isError: 'true', return: '未找到目标'}}
  />
  <ModuleParamPreview
    moduleKey="sys:runAction"
    focusKeys={['wait', 'output']}
    values={{type: 'StartAction', actionId: 'tt2020', wait: 'true'}}
    outputVars={{output: 'actionResult'}}
  />
</PreviewCompare>

当从子程序返回时，如果选择了“标记为出错”选项，则用以传递错误消息。
