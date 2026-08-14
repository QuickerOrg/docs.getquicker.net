/**
 * After build, preload preview JS on HTML pages that SSR a matching fallback
 * so chunks download in parallel with main.js (before React.lazy mounts).
 */
const fs = require('fs');
const path = require('path');

function walkHtmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, out);
      continue;
    }
    if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function findNamedChunk(jsDir, prefix, marker) {
  if (!fs.existsSync(jsDir)) {
    return null;
  }
  const named = fs
    .readdirSync(jsDir)
    .find((name) => name.startsWith(prefix) && name.endsWith('.js'));
  if (named) {
    return named;
  }
  if (!marker) {
    return null;
  }
  for (const name of fs.readdirSync(jsDir)) {
    if (!name.endsWith('.js')) {
      continue;
    }
    const text = fs.readFileSync(path.join(jsDir, name), 'utf8');
    if (text.includes(marker)) {
      return name;
    }
  }
  return null;
}

function hasPreviewMarker(html, kind) {
  return (
    html.includes(`data-qk-preview="${kind}"`) ||
    html.includes(`data-qk-preview=${kind}`)
  );
}

function injectPreload(html, href) {
  if (html.includes(href)) {
    return html;
  }
  const tag = `<link rel="preload" href="${href}" as="script" />`;
  const unquoted = '<script src=/assets/js/runtime';
  if (html.includes(unquoted)) {
    return html.replace(unquoted, `${tag}<script src=/assets/js/runtime`);
  }
  const quoted = '<script src="/assets/js/runtime';
  if (html.includes(quoted)) {
    return html.replace(quoted, `${tag}<script src="/assets/js/runtime`);
  }
  return html.replace('</head>', `${tag}</head>`);
}

module.exports = function prefetchPreviewsPlugin() {
  return {
    name: 'qk-prefetch-previews',
    async postBuild({outDir}) {
      const jsDir = path.join(outDir, 'assets', 'js');
      const heavyChunk = findNamedChunk(
        jsDir,
        'qk-heavy-preview.',
        'qk-chunk:heavy-preview',
      );
      const editorChunk = findNamedChunk(jsDir, 'qk-action-editor-preview.');
      let heavyPatched = 0;
      let editorPatched = 0;
      for (const file of walkHtmlFiles(outDir)) {
        let html = fs.readFileSync(file, 'utf8');
        let changed = false;
        if (heavyChunk && hasPreviewMarker(html, 'heavy')) {
          const next = injectPreload(html, `/assets/js/${heavyChunk}`);
          if (next !== html) {
            html = next;
            changed = true;
            heavyPatched += 1;
          }
        }
        if (editorChunk && hasPreviewMarker(html, 'editor')) {
          const next = injectPreload(html, `/assets/js/${editorChunk}`);
          if (next !== html) {
            html = next;
            changed = true;
            editorPatched += 1;
          }
        }
        if (changed) {
          fs.writeFileSync(file, html);
        }
      }
      console.log(
        `[qk-prefetch-previews] heavy=${heavyChunk || 'none'} (${heavyPatched}), editor=${editorChunk || 'none'} (${editorPatched})`,
      );
    },
  };
};
