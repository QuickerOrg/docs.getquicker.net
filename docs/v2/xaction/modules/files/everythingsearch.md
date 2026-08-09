---
title: "使用Everything搜索文件"
description: "调用Everything提供的接口搜索文件"
slug: "/v2/xaction/modules/everythingsearch"
sidebar_label: "使用Everything搜索文件"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:everythingsearch"
comments: true
moduleKey: "sys:everythingsearch"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "965d0464ef39708a584e528ce469eec8a474527f81a3d186bad0e4a54026b2d3"
legacyDocId: 10636154
legacyContentUpdatedAt: "2024-06-19T03:24:46.000Z"
---

# 使用Everything搜索文件

调用Everything提供的接口搜索文件

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:everythingsearch`
- 分类：系统操作（`Files`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `search` | 搜索内容 | `Text` |  | 是 | `UseVarOrInput` |  | 要搜索的内容，格式与直接在everything软件中搜索时相同。 |
| `folder` | 限定目录 | `Text` |  | 否 | `UseVarOrInput` |  | 可选。在指定目录下搜索（包含子目录）。 |
| `ext` | 扩展名 | `Text` |  | 否 | `UseVarOrInput` |  | 可选。半角分号分隔的扩展名列表。如"txt;docx;xlsx;" |
| `matchWholeFilename` | 匹配完整文件名 | `Boolean` | false | 否 | `UseVarOrInput` |  | 匹配整个文件名。0表示否，1表示是。 |
| `matchWholeWord` | 匹配整个单词 | `Boolean` | true | 否 | `UseVarOrInput` |  | 匹配整个单词。如 quicker.exe 将会匹配：quicker.exe, quicker.exe.config等。0表示否，1表示是。 |
| `matchPath` | 匹配路径 | `Boolean` | false | 否 | `UseVarOrInput` |  | 匹配路径的不同部分，而不仅是文件名。 |
| `matchCase` | 匹配大小写 | `Boolean` | false | 否 | `UseVarOrInput` |  | 是否大小写敏感。0表示否，1表示是。 |
| `useRegex` | 使用正则匹配 | `Boolean` | false | 否 | `UseVarOrInput` |  | 是否使用正则匹配。0表示否，1表示是。 |
| `maxCount` | 最大结果数量 | `Integer` | 100 | 是 | `UseVarOrInput` |  | -1表示不限制 |
| `sort` | 排序方式 | `Enum` | 1 | 是 | `UseVarOrInput` |  |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `pathList` | 路径列表 | `List` |  |  |
| `resultCount` | 结果个数 | `Integer` |  |  |
| `rawResult` | 原始结果 | `Object` |  |  |

## 选项值

### `ext` 扩展名

| Value | 名称 | 说明 |
| --- | --- | --- |
| `bat;cmd;exe;msi;msp;scr;cpl` | 可执行文件 |  |
| `c;chm;cpp;csv;cxx;doc;docm;docx;dot;dotm;dotx;h;hpp;htm;html;hxx;ini;java;lua;mht;mhtml;odt;pdf;potx;potm;ppam;ppsm;ppsx;pps;ppt;pptm;pptx;rtf;sldm;sldx;thmx;txt;vsd;wpd;wps;wri;xlam;xls;xlsb;xlsm;xlsx;xltm;xltx;xml` | 文档 |  |
| `ani;bmp;gif;ico;jpe;jpeg;jpg;pcx;png;psd;tga;tif;tiff;webp;wmf` | 图片 |  |
| `3g2;3gp;3gp2;3gpp;amr;amv;asf;avi;bdmv;bik;d2v;divx;drc;dsa;dsm;dss;dsv;evo;f4v;flc;fli;flic;flv;hdmov;ifo;ivf;m1v;m2p;m2t;m2ts;m2v;m4b;m4p;m4v;mkv;mp2v;mp4;mp4v;mpe;mpeg;mpg;mpls;mpv2;mpv4;mov;mts;ogm;ogv;pss;pva;qt;ram;ratdvd;rm;rmm;rmvb;roq;rpm;smil;smk;swf;tp;tpr;ts;vob;vp6;webm;wm;wmp;wmv` | 视频文件 |  |
| `aac;ac3;aif;aifc;aiff;au;cda;dts;fla;flac;it;m1a;m2a;m3u;m4a;mid;midi;mka;mod;mp2;mp3;mpa;ogg;ra;rmi;spc;rmi;snd;umx;voc;wav;wma;xm` | 音频文件 |  |

### `sort` 排序方式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `1` | 名称顺序 NAME_ASCENDING |  |
| `2` | 名称倒序 NAME_DESCENDING |  |
| `3` | 路径顺序 PATH_ASCENDING |  |
| `4` | 路径倒序 PATH_DESCENDING |  |
| `5` | 大小顺序 SIZE_ASCENDING |  |
| `6` | 大小倒序 SIZE_DESCENDING |  |
| `7` | 扩展名顺序 EXTENSION_ASCENDING |  |
| `8` | 扩展名倒序 EXTENSION_DESCENDING |  |
| `9` | 类型名顺序 TYPE_NAME_ASCENDING |  |
| `10` | 类型名倒序 TYPE_NAME_DESCENDING |  |
| `11` | 创建时间顺序 DATE_CREATED_ASCENDING |  |
| `12` | 创建时间倒序 DATE_CREATED_DESCENDING |  |
| `13` | 修改时间顺序 DATE_MODIFIED_ASCENDING |  |
| `14` | 修改时间倒序 DATE_MODIFIED_DESCENDING |  |
| `15` | 属性顺序 ATTRIBUTES_ASCENDING |  |
| `16` | 属性倒序 ATTRIBUTES_DESCENDING |  |
| `17` | 文件列表文件名顺序 FILE_LIST_FILENAME_ASCENDING |  |
| `18` | 文件列表文件名倒序 FILE_LIST_FILENAME_DESCENDING |  |
| `19` | 运行次数顺序 RUN_COUNT_ASCENDING |  |
| `20` | 运行次数倒序 RUN_COUNT_DESCENDING |  |
| `21` | 最后变更时间顺序 DATE_RECENTLY_CHANGED_ASCENDING |  |
| `22` | 最后变更时间倒序 DATE_RECENTLY_CHANGED_DESCENDING |  |
| `23` | 最后访问时间顺序 DATE_ACCESSED_ASCENDING |  |
| `24` | 最后访问时间倒序 DATE_ACCESSED_DESCENDING |  |
| `25` | 最后运行时间顺序 DATE_RUN_ASCENDING |  |
| `26` | 最后运行时间倒序 DATE_RUN_DESCENDING |  |
{/* xaction-metadata:end */}

【安全提示】20220908，有传说everything软件的更新服务疑似被劫持，参考： [https://www.v2ex.com/t/878475](https://www.v2ex.com/t/878475)

为安全起见，请关闭everything的自动更新服务(菜单-工具-选项-常规-启动时检查更新），如有需要，通过[https://www.voidtools.com/](https://www.voidtools.com/)手动下载版本更新。

使用本模块需要已安装和运行Everything软件1.4.1.969+或以上版本。



![](./img/everythingsearch-001-7265e3ee1c.png)



## 参数

【搜索内容】要搜索的文件名关键词。 支持的语法请参考：[https://www.voidtools.com/support/everything/searching/](https://www.voidtools.com/support/everything/searching/)

注：已知everything的sdk调用不支持宏（如`exe:``doc:`等），具体请以实际测试为准。作为变通，可以使用`ext:mp3;aac;...`的格式筛选文件类型。



【限定目录】搜索指定目录下的文件（包含子目录）。此参数的作用为在搜索内容前面增加路径限定，效果类似于：

![](./img/everythingsearch-002-607633654c.png)

注意，需要在目录路径末尾添加``字符，否则将匹配以此内容为开始的所有目录。

也可以将路径直接添加到【搜索内容】中（特别是当需要指定多个路径时，可以在搜索内容中使用这样的格式：`"C:\Program Files"|"D:\Work\" 关键词`）。



【扩展名】搜索指定类型的文件。使用英文半角分号分隔多种扩展名，如`doc;docx;docm`。

此参数在内部会以`ext:doc;docx;docm`的形式添加到搜索内容中（也可以直接在【搜索内容】参数中指定）。



【匹配完整文件名】完整匹配某个指定的文件名。

此参数的内部实现为在【搜索内容】前面追加`wfn:`参数，会对整个搜索内容生效。

【匹配整个单词】匹配整个单词。例如，搜索内容为“quicker.exe”时，匹配的文件名可能为“quicker.exe”、“quicker.exe.config”等。

【匹配路径】关键词匹配路径的一部分而不仅是文件名。

【匹配大小写】搜索的内容是否大小写敏感。

【使用正则匹配】是否使用正则表达式搜索文件。

【最大结果数量】最多返回的结果数量。

【排序方式】筛选结果的排序方式。某些排序方式可能会对搜索性能有一定影响，建议测试验证。

### 输出

【是否成功】是否成功执行了搜索。

【路径列表】搜索到的文件路径的列表。

【结果个数】搜索结果的数量。

【原始结果】是一个对象列表，如果有深入的需要，可以在表达式中使用这个结果。每个对象包含这些属性：

-   FileName：文件名（C# String类型）
-   FilePath：文件完整路径
-   Modified：最后修改实际（C# DateTime类型）
-   Size：文件大小（C# long类型）







## 安装Everything的注意事项



-   下载网址：[https://www.voidtools.com/zh-cn/](https://www.voidtools.com/zh-cn/)
-   根据您的电脑操作系统，选择 **安装版64位**，或**安装版32位**
-   安装时使用默认选项。确保选择“安装Everything服务”选项。
    ![](./img/everythingsearch-003-5318c9c1a8.png)![](./img/everythingsearch-004-7c1e07ae2e.png)



已安装好的everything软件，也可以在工具-》选项 菜单中修改相关设置。

![](./img/everythingsearch-005-eafe303e17.png)

## 更新历史

-   20240619 增加说明：限定目录参数需要以``结束。
