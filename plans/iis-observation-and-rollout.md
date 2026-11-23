# IIS 正式站响应头观测报告与缓存优化预发布方案

## 1. 实测观测结果（只读采样）

在优化实施前对正式站 `https://docs.getquicker.net` 执行 `curl.exe -sI` 响应头观测：

| 请求目标 | 观测到的关键响应头 | 说明 |
| --- | --- | --- |
| `https://docs.getquicker.net/` (HTML) | `Content-Encoding: br`、`Vary: Accept-Encoding`、`ETag`、`Last-Modified` | IIS 已启用 Brotli 动态/静态压缩；**未下发 `Cache-Control` 响应头**，依赖客户端与代理启发式缓存 / 条件请求。 |
| `https://docs.getquicker.net/assets/js/main.ca27486e.js` (内容哈希 JS chunk) | `Content-Encoding: br`、`Vary: Accept-Encoding`、`ETag`、`Last-Modified` | 同上；虽然路径带内容哈希，但同样**未下发 `Cache-Control: public, max-age=31536000, immutable`**。 |

> 结论：**“仓库无 `web.config`” 不等同于 “IIS 未开启压缩或未配默认规则”**——正式 IIS 已经正常提供 Brotli 压缩（`Content-Encoding: br`）。当前真正的缺口是缺少显式 `Cache-Control` 区分（HTML 需短期协商，带哈希静态资源可长期强缓存），而非缺少压缩。

## 2. 为什么不在源码仓库直接添加 `static/web.config`

根据 IIS 配置继承模型与微软 [HTTP 500.19 配置锁定排障说明](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/site-behavior-performance/http-error-500-19-webpage)：

- 若 IIS 上层 `applicationHost.config` 已对 `<httpCompression>`、`<urlCompression>` 或特定 `<httpProtocol>/<staticContent>` 配置节设置了 `overrideModeDefault="Deny"`，随 MSDeploy 直接写入站点 `web.config` 覆盖受锁定的节点会触发全站 **HTTP 500.19 (0x80070021)**。
- 站点仓库同时发布到 Jenkins → IIS（正式站）与 Cloudflare Pages（独立预览环境），Pages 本身会按文件哈希缓存静态资源且不读取 `web.config`。强行要求两者下发完全相同的标头既无必要，也增加维护成本。

因此，本轮 **不在仓库盲目新增 `static/web.config`**，而在 IIS 运维侧按“先检查锁定状态、再预发布验证、可秒级回滚”的流程落地。

## 3. 推荐 IIS 响应策略与前置检查清单

### 前置检查（在正式 IIS 服务器 / 测试站点执行）

1. 检查 IIS 配置节锁定状态：
   ```powershell
   %windir%\system32\inetsrv\appcmd.exe list config "docs.getquicker.net" /section:system.webServer/staticContent
   %windir%\system32\inetsrv\appcmd.exe list config "docs.getquicker.net" /section:system.webServer/httpProtocol
   %windir%\system32\inetsrv\appcmd.exe list config /section:system.webServer/urlCompression
   ```
2. 确认 MSDeploy 发布配置是否启用 `DoNotDelete` 或如何保留服务器侧独立目录/子应用配置（避免每次构建覆写手动调整）。

### 推荐缓存策略（无需触碰受锁定的全局压缩配置）

- **HTML 页面**（`/`、`/**/*.html`）：`Cache-Control: no-cache`（或 `max-age=60, must-revalidate`），配合已有 `ETag` 与 `Content-Encoding: br`，确保发版后页面、导航栏与 `search-index-*.json` 引用即时更新。
- **内容哈希资源**（`/assets/**`、`search-index-*.json`）：由于 Docusaurus 已为脚本、样式及本地搜索索引文件名追加内容哈希，可配置 `Cache-Control: public, max-age=31536000, immutable`。
- **AI 索引与字体等非哈希文本**（`/llms.txt`、`/sitemap.xml`、`/robots.txt`）：`Cache-Control: public, max-age=3600`。

## 4. 预发布验证与可执行回滚方案

1. **测试环境先验**：在同宿主 IIS 或 staging 站点应用 `<location path="assets">` 的 `<staticContent><clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" /></staticContent>` 与 HTML `customHeaders` 或 IIS 管理器界面配置，确认首页、深层页、`404.html` 及 `/assets/js/*` 状态码均为 `200` / `304` 且无 `500.19`。
2. **上线后核对命令**：
   ```powershell
   curl.exe -sI https://docs.getquicker.net/ | findstr /I "HTTP/ Cache-Control Content-Encoding ETag"
   curl.exe -sI https://docs.getquicker.net/llms.txt | findstr /I "HTTP/ Cache-Control"
   ```
3. **快速回滚步骤**：
   - 保留修改前 `applicationHost.config` 及站点根目录 `web.config` 备份（`appcmd add backup pre-docs-cache`）。
   - 若出现 `500.19` 或缓存异常，立即执行 `appcmd restore backup pre-docs-cache` 或删除新增 `web.config` 节点，IIS 即刻恢复至修改前状态。
