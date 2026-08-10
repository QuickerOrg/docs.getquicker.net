/**
 * Strip legacy metadata markers / metadataHash; keep a single
 * <XActionModuleMeta moduleKey="..." /> on each module page.
 *
 * Usage: node tools/xaction-docs/rewrite-meta.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {
  createReference,
  ensureModuleMetaComponent,
  stripLegacyMetadataMarkers,
} from './sync.mjs';

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

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content.replace(/\r\n/g, '\n'), 'utf8');
}

function collectFiles(directory, predicate) {
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

function main() {
  const catalog = JSON.parse(readText(path.join(dataRoot, 'catalog.json')));
  const byKey = new Map(catalog.modules.map((module) => [module.key, module]));
  let updated = 0;
  let skipped = 0;

  for (const filePath of collectFiles(docsRoot, (value) => value.endsWith('.md'))) {
    const content = readText(filePath);
    const moduleKey = content.match(/^moduleKey:\s*["']?([^"'\n]+)["']?$/m)?.[1];
    if (!moduleKey) {
      continue;
    }
    if (!byKey.has(moduleKey)) {
      console.warn(`跳过 ${path.relative(repositoryRoot, filePath)}：catalog 无 ${moduleKey}`);
      skipped += 1;
      continue;
    }

    let next = stripLegacyMetadataMarkers(content);
    next = next.replace(/^metadataHash: .*\n/m, '');
    next = ensureModuleMetaComponent(next, moduleKey);
    // If an old marked block left a duplicate heading+component, collapse to one.
    const reference = createReference({key: moduleKey});
    if ((next.match(/## 当前模块定义/g) || []).length > 1) {
      next = next.replace(/## 当前模块定义\n\n<XActionModuleMeta moduleKey="[^"]+" \/>\n+/g, '');
      next = ensureModuleMetaComponent(next, moduleKey);
    }
    if (!next.includes(reference.split('\n').pop())) {
      next = ensureModuleMetaComponent(next, moduleKey);
    }
    if (next !== content) {
      writeText(filePath, next);
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  console.log(`已改写 ${updated} 个模块页；未改 ${skipped}。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
