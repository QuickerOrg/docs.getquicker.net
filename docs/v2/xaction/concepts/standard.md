---
title: "复杂动作的编程约定"
description: "选择动作文件的存放位置：动作专属本机数据目录、用户文档和临时目录，以及备份、分享与删除清理的边界。"
slug: "/v2/xaction/concepts/standard"
sidebar_position: 180
quickerDocKey: "xaction/concepts/standard"
comments: true
docStatus: reviewed
legacyDocId: 30775973
legacyContentUpdatedAt: "2021-01-27T03:04:42.000Z"
---

# 复杂动作的编程约定

动作需要保存配置、缓存、数据库或下载的依赖时，建议使用 **2.3.13 新增的“动作数据文件夹”**。这是按动作 ID 分配的本机目录，方便作者统一存放文件，也让用户删除动作时能一并清理。

用户希望长期保留的导出文件、报告和作品，仍应放在用户选择的位置或 Windows 文档目录。不要把所有文件都放进可能随动作删除的数据目录。

## 选择存放位置

| 文件用途 | 建议位置 | 注意事项 |
|---|---|---|
| 动作专用配置、数据库、缓存、下载的依赖 | 动作数据文件夹 | 本机持久保存；用户删除动作时可一并回收 |
| 用户生成的报告、导出文件、作品 | 用户选择的位置，或文档目录下的 `Quicker\动作名` | 应由用户决定保留与删除，不随动作清理 |
| 本次运行的中间文件 | 临时目录；脚本动作可用 `qk.Files.GetRunTempDirectory()` | 脚本运行临时目录在运行结束后自动清理 |
| 少量选项、开关、上次输入 | [动作状态](/v2/xaction/concepts/store-settings) | 不必为少量设置单独维护文件 |

## 动作数据文件夹

### 设计目的与路径

过去作者通常自行选择目录，容易出现动作改名后找不到原文件、不同动作重名冲突、删除动作后文件散落等问题。专属目录用 **本机动作 ID** 定位，不依赖标题或动作库 ID。

普通环境中的路径为：

```text
%LOCALAPPDATA%\Quicker\action-data\<动作ID>
```

例如 `C:\Users\Alice\AppData\Local\Quicker\action-data\12345678-1234-1234-1234-123456789abc`。输出是完整路径，末尾不带 `\`。请通过步骤或 API 获取，不要把示例用户名、ID 或目录硬编码进动作。

- 同一动作 ID 的改名、移动和更新继续使用原目录。
- 复制为新动作、产生新 ID 时使用新目录，原文件不会自动复制过去。
- 同一动作的多个并发实例共用目录；作者需要处理文件覆盖和并发读写。
- 目录属于当前 Windows 用户的本机数据，不按 Quicker 账号另行分隔；它不是账号之间的安全隔离区。

### 在组合动作中获取和使用

1. 添加 [获取系统或动作信息](/v2/xaction/modules/getsysinfo) 步骤。
2. 将 **动作数据文件夹** 输出保存到文本变量，例如 `actionDataDir`。
3. 用 [文件操作](/v2/xaction/modules/fileoperation) 的“创建文件夹”操作创建该目录。**获取路径不会自动创建目录**。
4. 在目录下按用途分层，例如 `config.json`、`cache`、`downloads`，再用文件步骤读写。

<ModuleParamPreview
  moduleKey="sys:getSysInfo"
  outputVars={{actionDataDirectory: 'actionDataDir'}}
  focusKeys={['actionDataDirectory']}
/>

例如，获取路径为 `…\action-data\<动作ID>` 后，把配置写入该目录下的 `config.json`。先检查文件是否存在：不存在时使用初始配置，存在时读取；不要每次运行都覆盖用户已保存的配置。

内部和公共子程序使用调用方动作的目录，没有独立的数据目录。公共子程序被不同动作调用时，得到各调用方的目录；若需要共享数据，应另行设计共享位置。缺少有效动作 ID 的上下文无法获取此路径，会报错。

### 在脚本中获取

新脚本动作用以下 API 获取路径，再显式创建：

```csharp
string directory = qk.Files.GetActionDataDirectory();
qk.Files.CreateDirectory(directory);
```

以上为放在脚本入口内的 API 片段。取路径本身不需文件能力授权，创建、读取和写入仍遵循文件能力授权。详情见 [qk.Files](/v2/script-action/api/files#filesgetactiondatadirectory)。

旧版 C# 步骤可添加 `using Quicker.Public.Extensions;`，再调用 `context.GetActionDataDirectory()`。它同样只返回路径。

### 分享、同步和备份

**目录中的文件不随动作分享、同步，也不包含在“全部数据备份”中。** 动作状态的导出同样不会打包这些文件。换电脑时，应单独备份和迁移需要保留的文件。

分享动作时，请注明最低需要 **Quicker 2.3.13**，并说明首次运行需要创建哪些文件、下载哪些依赖、数据是否需要手动备份。不要假定作者电脑上已有的文件会自动出现在接收者电脑上。

已有动作过去写在文档目录或其他位置的文件，不会自动迁入新目录。调整旧动作时，先检查旧位置；迁移前备份，明确覆盖规则，并在确认新位置可用后再决定是否清理旧文件。

### 删除与恢复

在界面中删除动作时，如果发现对应数据目录，确认框会提供 **同时清理动作数据文件夹**，默认勾选，并显示目录及文件统计。

- 保持勾选：实际删除动作后，将对应目录移到 **Windows 回收站**。
- 取消勾选：只删除动作，保留目录。
- 取消整个确认框：不删除动作或目录。
- 只移除动作位置或移动动作，不会清理目录；同步、后台及 Agent 删除也保留目录。

清理只处理约定目录，不会追踪动作过去在其他位置保存的文件。目录被占用或清理失败时，请按提示手动检查；不会改为永久删除。

**动作回收站和 Windows 回收站是两回事。恢复动作不会自动恢复文件**，还需要到 Windows 回收站手动还原目录。若恢复或复制后的动作 ID 改变，应重新获取路径，并手动迁移所需文件。

## 用户文档与导出文件

需要用户长期保留的文件，可继续使用 **Windows 个人文档目录 `\Quicker\动作名\`**，或让用户自行选择保存位置。需要时再分子目录，文件夹名不必和动作标题完全一致。

用 [获取系统路径](/v2/xaction/modules/getfolderpath) 拿“我的文档”的实际路径：

<ModuleParamPreview
  moduleKey="sys:getFolderPath"
  values={{folder: 'MyDocuments'}}
  outputVars={{path: 'docsRoot'}}
  focusKeys={['folder', 'path']}
/>

然后拼 `$$\Quicker\你的动作名\`。

## 限制与排障

- 不要把用户数据写进 Quicker 安装目录，更新或重装会丢。
- 动作名做文件夹时避开 `\ / : * ? " < > |`。
- 分享动作时提醒用户：数据在他们自己的文档目录里，不会跟着动作走。
- 找不到动作数据文件夹时，先检查是否已经创建；仅获取输出不会在磁盘上生成目录。
- 旧版不支持新增输出和 API。回退不会自动删除已有目录，但依赖它们的动作需在 2.3.13 或更新版本运行。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getsysinfo',
      label: '获取系统或动作信息',
      description: '获取动作数据文件夹完整路径。',
    },
    {
      href: '/v2/xaction/modules/getfolderpath',
      label: '获取系统路径',
      description: 'MyDocuments 等特殊目录',
    },
    {
      href: '/v2/xaction/concepts/store-settings',
      label: '在动作中存储用户设置',
      description: '少量选项用状态，而不是文件',
    },
  ]}
/>
