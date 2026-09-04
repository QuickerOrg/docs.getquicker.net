import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const [quickerRoot, installerRoot] = process.argv.slice(2);
assert.ok(quickerRoot && installerRoot, '用法：node tools/bridge-docs/check-sources.mjs <Quicker 根目录> <QuickerInstaller 根目录>');
const readJson = (file) => JSON.parse(fs.readFileSync(new URL(`../../data/bridges/${file}`, import.meta.url), 'utf8'));
const source = readJson('source.json');
const {bridges} = readJson('catalog.json');
for (const [root, commit] of [[quickerRoot, source.quickerCommit], [installerRoot, source.installerCommit]]) {
  assert.equal(execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(), commit, '源码提交已变化，需要重新核验和导出');
}
for (const evidence of source.files) {
  const root = evidence.repository === 'Quicker' ? quickerRoot : installerRoot;
  const data = fs.readFileSync(path.join(root, evidence.path));
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'), evidence.sha256, `事实源已变化：${evidence.path}`);
}
for (const bridge of bridges) {
  const evidence = source.hosts.find((item) => item.connectionId === bridge.connectionId);
  assert.ok(evidence, `缺少 ${bridge.connectionId} 源码证据`);
  const adapter = fs.readFileSync(path.join(quickerRoot, evidence.adapter), 'utf8');
  assert.ok(adapter.includes(`ConnectionId = "${bridge.connectionId}"`));
  const execute = fs.readFileSync(path.join(quickerRoot, evidence.execute), 'utf8');
  if (evidence.routing === 'pid-start-time') {
    assert.match(execute, /process\.StartTime/);
    assert.match(execute, /new ThirdPartyCommandTarget\(target\.ProcessId,/);
  } else if (evidence.routing === 'hwnd-component') {
    assert.match(execute, /Target\.WindowHandle == windowHandle/);
    assert.match(execute, /ResolveTargetComponent/);
  } else {
    assert.match(execute, /new ThirdPartyCommandTarget\(\)/);
    assert.match(adapter, /sessions\.Length > 1/);
    assert.equal(execute.includes('ActiveWindowHwnd'), evidence.routing === 'foreground-unique');
  }
  if (bridge.componentId) {
    const pack = fs.readFileSync(path.join(quickerRoot, evidence.package), 'utf8');
    assert.ok(pack.includes(bridge.componentId));
    const install = fs.readFileSync(path.join(installerRoot, evidence.installer), 'utf8');
    assert.ok(install.includes(bridge.componentId), `安装器缺少 ${bridge.componentId}`);
  } else {
    const viewModel = fs.readFileSync(path.join(installerRoot, evidence.installer), 'utf8');
    assert.ok(viewModel.includes('AddWpsWebManagement'));
  }
}
console.log('三仓事实核验通过：提交、源文件哈希、16 个连接标识、安装映射与路由分组。');
