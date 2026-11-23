const fs = require('node:fs');
const path = require('node:path');

function buildCompactCatalogMap(siteDir) {
  const catalogPath = path.join(siteDir, 'data', 'xaction', 'catalog.json');
  const map = new Map();
  if (!fs.existsSync(catalogPath)) return map;
  const raw = fs.readFileSync(catalogPath, 'utf8').replace(/^\uFEFF/, '');
  const catalog = JSON.parse(raw);
  for (const mod of catalog.modules ?? []) {
    if (!mod?.key) continue;
    const compact = {
      key: mod.key,
      name: mod.name ?? mod.key,
      ...(mod.description ? {description: mod.description} : {}),
      ...(mod.categoryName ? {categoryName: mod.categoryName} : {}),
      ...(mod.stepType ? {stepType: mod.stepType} : {}),
      ...(mod.isRisky ? {isRisky: true} : {}),
      inputs: (mod.inputs ?? []).map((p) => ({
        key: p.key,
        name: p.name ?? p.key,
        type: p.type ?? '',
        ...(p.required ? {required: true} : {}),
        ...(p.variableMode ? {variableMode: p.variableMode} : {}),
        ...(p.defaultValue !== undefined && p.defaultValue !== '' ? {defaultValue: p.defaultValue} : {}),
        ...(p.newStepDefaultValue !== undefined ? {newStepDefaultValue: p.newStepDefaultValue} : {}),
        ...(p.condition ? {condition: p.condition} : {}),
        ...(Array.isArray(p.validForList) ? {validForList: p.validForList} : {}),
        ...(Array.isArray(p.invalidForList) ? {invalidForList: p.invalidForList} : {}),
        ...(p.description ? {description: p.description} : {}),
      })),
      outputs: (mod.outputs ?? []).map((o) => ({
        key: o.key,
        name: o.name ?? o.key,
        type: o.type ?? '',
        ...(o.condition ? {condition: o.condition} : {}),
        ...(o.description ? {description: o.description} : {}),
      })),
      ...(mod.selections ? {selections: mod.selections} : {}),
    };
    map.set(mod.key, JSON.stringify(compact));
  }
  return map;
}

module.exports = function remarkXactionSsrMeta(options = {}) {
  const siteDir = options.siteDir ?? process.cwd();
  let compactByKey = null;

  const walk = (node, map) => {
    if (!node || typeof node !== 'object') return;
    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      node.name === 'XActionModuleMeta' &&
      Array.isArray(node.attributes)
    ) {
      const moduleKeyAttr = node.attributes.find(
        (attr) => attr?.type === 'mdxJsxAttribute' && attr.name === 'moduleKey' && typeof attr.value === 'string',
      );
      const hasSsrAttr = node.attributes.some(
        (attr) => attr?.type === 'mdxJsxAttribute' && attr.name === 'ssrMetaJson',
      );
      if (moduleKeyAttr && !hasSsrAttr) {
        const serialized = map.get(moduleKeyAttr.value);
        if (serialized) {
          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: 'ssrMetaJson',
            value: serialized,
          });
        }
      }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child, map);
      }
    }
  };

  return (tree) => {
    compactByKey ??= buildCompactCatalogMap(siteDir);
    walk(tree, compactByKey);
  };
};
