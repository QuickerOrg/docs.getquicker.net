import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..', '..');
const docsRoot = path.join(repositoryRoot, 'docs', 'v2', 'xaction');
const dataRoot = path.join(repositoryRoot, 'data', 'xaction');

function normalize(value) {
  return value.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

function readText(filePath) {
  return normalize(fs.readFileSync(filePath, 'utf8'));
}

function collectFiles(directory, predicate) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  const result = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      result.push(fullPath);
    }
  }
  return result;
}

function fail(errors, message) {
  errors.push(message);
}

function main() {
  const errors = [];
  const catalogPath = path.join(dataRoot, 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    throw new Error('缺少 data/xaction/catalog.json，请先运行 docs:xaction:sync。');
  }
  const catalog = JSON.parse(readText(catalogPath));
  if (catalog.schemaVersion !== 1) {
    fail(errors, `不支持的 catalog schemaVersion：${catalog.schemaVersion}`);
  }
  if (catalog.moduleCount !== catalog.modules.length) {
    fail(errors, 'catalog.moduleCount 与 modules 数量不一致。');
  }
  const changesPath = path.join(dataRoot, 'changes.json');
  if (!fs.existsSync(changesPath)) {
    fail(errors, '缺少 data/xaction/changes.json。');
  } else {
    const changes = JSON.parse(readText(changesPath));
    if (changes.schemaVersion !== 1 || changes.toGeneratedAt !== catalog.generatedAt) {
      fail(errors, 'changes.json 与当前 catalog 不一致。');
    }
  }

  const pageByKey = new Map();
  for (const filePath of collectFiles(docsRoot, (value) => value.endsWith('.md'))) {
    const content = readText(filePath);
    if (content.includes('images/')) {
      fail(errors, `${path.relative(repositoryRoot, filePath)} 仍包含旧 images/ 路径。`);
    }
    for (const match of content.matchAll(/!\[[^\]]*\]\((\.\/img\/[^)\s]+)(?:\s+[^)]*)?\)/g)) {
      const imagePath = path.resolve(path.dirname(filePath), match[1]);
      if (!fs.existsSync(imagePath)) {
        fail(errors, `${path.relative(repositoryRoot, filePath)} 引用不存在的图片 ${match[1]}。`);
      }
    }
    const key = content.match(/^moduleKey:\s*["']?([^"'\n]+)["']?$/m)?.[1];
    if (!key) {
      continue;
    }
    if (pageByKey.has(key)) {
      fail(errors, `模块 ${key} 存在重复页面。`);
      continue;
    }
    pageByKey.set(key, filePath);
    if (content.includes('xaction-metadata:')) {
      fail(errors, `${key} 仍含旧的 xaction-metadata 标记，请运行 docs:xaction:rewrite-meta。`);
    }
    if (content.includes('metadataHash:')) {
      fail(errors, `${key} 仍含已废弃的 metadataHash。`);
    }
    const metaTag = content.match(/<XActionModuleMeta\s+moduleKey="([^"]+)"\s*\/>/);
    if (!metaTag) {
      fail(errors, `${key} 缺少 <XActionModuleMeta moduleKey="..." />。`);
    } else if (metaTag[1] !== key) {
      fail(errors, `${key} 的组件 moduleKey=${metaTag[1]} 与 front matter 不一致。`);
    }
  }

  for (const module of catalog.modules) {
    if (!pageByKey.has(module.key)) {
      fail(errors, `缺少模块页面：${module.key}`);
    }
    const moduleDataPath = path.join(
      dataRoot,
      'modules',
      `${module.key.replace(/[^A-Za-z0-9_.-]+/g, '_')}.json`,
    );
    if (!fs.existsSync(moduleDataPath)) {
      fail(errors, `缺少单模块机器数据：${module.key}`);
    } else {
      const single = JSON.parse(readText(moduleDataPath));
      if (single.key !== module.key) {
        fail(errors, `${path.relative(repositoryRoot, moduleDataPath)} 的模块 Key 不一致。`);
      }
    }
  }
  for (const key of pageByKey.keys()) {
    if (!catalog.modules.some((module) => module.key === key)) {
      fail(errors, `页面对应的模块已不在 catalog 中：${key}`);
    }
  }

  const landingPath = path.join(docsRoot, 'index.md');
  if (!fs.existsSync(landingPath)) {
    fail(errors, '缺少组合动作首页 docs/v2/xaction/index.md。');
  } else {
    const landing = readText(landingPath);
    if (!landing.includes('<XActionLanding')) {
      fail(errors, '组合动作首页缺少 <XActionLanding />。');
    }
    if (!landing.includes(`moduleCount={${catalog.moduleCount}}`)) {
      fail(errors, `组合动作首页 moduleCount 与 catalog.moduleCount=${catalog.moduleCount} 不一致。`);
    }
  }

  if (errors.length > 0) {
    console.error(`组合动作文档校验失败，共 ${errors.length} 项：`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `组合动作文档校验通过：${catalog.modules.length} 个模块页面，${pageByKey.size} 个模块 Key。`,
  );
}

main();
