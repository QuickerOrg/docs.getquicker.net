/**
 * After build, preload qk-heavy-preview.js on HTML pages that SSR a heavy
 * preview fallback so the chunk downloads in parallel with main.js.
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

function findHeavyChunk(jsDir) {
  if (!fs.existsSync(jsDir)) {
    return null;
  }
  const named = fs
    .readdirSync(jsDir)
    .find((name) => name.startsWith('qk-heavy-preview.') && name.endsWith('.js'));
  if (named) {
    return named;
  }
  for (const name of fs.readdirSync(jsDir)) {
    if (!name.endsWith('.js')) {
      continue;
    }
    const text = fs.readFileSync(path.join(jsDir, name), 'utf8');
    if (text.includes('qk-chunk:heavy-preview')) {
      return name;
    }
  }
  return null;
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
      const chunk = findHeavyChunk(path.join(outDir, 'assets', 'js'));
      if (!chunk) {
        return;
      }
      const href = `/assets/js/${chunk}`;
      let patched = 0;
      for (const file of walkHtmlFiles(outDir)) {
        const html = fs.readFileSync(file, 'utf8');
        if (!html.includes('data-qk-preview="heavy"') && !html.includes("data-qk-preview=heavy")) {
          continue;
        }
        const next = injectPreload(html, href);
        if (next !== html) {
          fs.writeFileSync(file, next);
          patched += 1;
        }
      }
      console.log(
        `[qk-prefetch-previews] preload ${chunk} on ${patched} HTML pages`,
      );
    },
  };
};
