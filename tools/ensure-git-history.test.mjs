import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import test from 'node:test';
import {ensureGitHistory} from './ensure-git-history.mjs';

test('浅克隆补齐历史后，未随最新提交修改的文档保留自己的更新时间', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'quicker-doc-history-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const source = path.join(root, 'source');
  const clone = path.join(root, 'clone');
  mkdirSync(source);
  const git = (cwd, args, env = {}) => execFileSync('git', args, {
    cwd, encoding: 'utf8', env: {...process.env, ...env},
  }).trim();
  git(source, ['init']);
  git(source, ['config', 'user.name', 'Docs test']);
  git(source, ['config', 'user.email', 'docs-test@example.invalid']);
  git(source, ['config', 'commit.gpgsign', 'false']);
  writeFileSync(path.join(source, 'doc.md'), '# 文档\n');
  git(source, ['add', '.']);
  git(source, ['commit', '-m', '文档初稿'], {
    GIT_AUTHOR_DATE: '2025-01-20T02:00:00Z', GIT_COMMITTER_DATE: '2025-01-20T02:00:00Z',
  });
  const originalDate = git(source, ['log', '-1', '--format=%ct', '--', 'doc.md']);
  writeFileSync(path.join(source, 'other.txt'), '后续无关修改');
  git(source, ['add', '.']);
  git(source, ['commit', '-m', '其他修改'], {
    GIT_AUTHOR_DATE: '2026-10-14T02:00:00Z', GIT_COMMITTER_DATE: '2026-10-14T02:00:00Z',
  });
  const head = git(source, ['rev-parse', 'HEAD']);
  ensureGitHistory(source); // 完整仓库没有 origin，也不需要联网。
  assert.equal(git(source, ['rev-parse', 'HEAD']), head);
  git(root, ['clone', '--depth=1', pathToFileURL(source).href, clone]);
  assert.equal(git(clone, ['rev-parse', '--is-shallow-repository']), 'true');
  assert.notEqual(git(clone, ['log', '-1', '--format=%ct', '--', 'doc.md']), originalDate);
  ensureGitHistory(clone);
  assert.equal(git(clone, ['rev-parse', '--is-shallow-repository']), 'false');
  assert.equal(git(clone, ['log', '-1', '--format=%ct', '--', 'doc.md']), originalDate);
  assert.equal(git(clone, ['rev-parse', 'HEAD']), head);
});
