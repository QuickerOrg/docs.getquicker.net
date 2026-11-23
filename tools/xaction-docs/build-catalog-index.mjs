import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..', '..');
const dataRoot = path.join(repositoryRoot, 'data', 'xaction');

export function buildCatalogIndex(catalog) {
  return {
    schemaVersion: catalog.schemaVersion ?? 1,
    generatedAt: catalog.generatedAt ?? '',
    moduleCount: catalog.moduleCount ?? (catalog.modules?.length ?? 0),
    categories: catalog.categories ?? [],
    modules: (catalog.modules ?? []).map((mod) => ({
      key: mod.key,
      name: mod.name,
      ...(mod.description ? {description: mod.description} : {}),
      category: mod.category,
    })),
  };
}

export function writeCatalogIndex(catalogPath = path.join(dataRoot, 'catalog.json'), outPath = path.join(dataRoot, 'catalog-index.json')) {
  const raw = fs.readFileSync(catalogPath, 'utf8').replace(/^\uFEFF/, '');
  const catalog = JSON.parse(raw);
  const index = buildCatalogIndex(catalog);
  const json = JSON.stringify(index, null, 2) + '\n';
  fs.writeFileSync(outPath, json, 'utf8');
  return index;
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  const index = writeCatalogIndex();
  console.log(`已生成 data/xaction/catalog-index.json：${index.modules.length} 个模块。`);
}
