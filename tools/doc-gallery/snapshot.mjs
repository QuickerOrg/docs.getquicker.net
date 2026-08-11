/**
 * Screenshot live MDX previews and store PNGs for DocCard gallery covers.
 *
 * Requires a running docs site and Playwright:
 *   npm run start -- --host 127.0.0.1 --port 3000 --no-open
 *   npm run docs:gallery:snapshot
 *
 *   node tools/doc-gallery/snapshot.mjs --href /v2/xaction/modules/showmenu
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  GALLERY_SNAPSHOT_SELECTOR,
  hasLocalMarkdownImage,
  listPreviewDocs,
  snapshotAbs,
} from './previews.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS_DIR = path.join(ROOT, 'docs');

function parseArgs(argv) {
  const out = {base: 'http://127.0.0.1:3000', href: '', force: false};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base') out.base = argv[++i]?.replace(/\/$/, '') ?? out.base;
    else if (arg === '--href') out.href = argv[++i] ?? '';
    else if (arg === '--force') out.force = true;
  }
  return out;
}

async function launchBrowser() {
  try {
    const {chromium} = await import('playwright');
    return chromium.launch({headless: true});
  } catch {
    const {chromium} = await import('playwright-core');
    return chromium.launch({channel: 'msedge', headless: true});
  }
}

async function snapshotPage(page, base, href, dest) {
  const url = `${base}${href.startsWith('/') ? href : `/${href}`}`;
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60_000});
  await page.waitForSelector(GALLERY_SNAPSHOT_SELECTOR, {timeout: 20_000});
  const el = page.locator(GALLERY_SNAPSHOT_SELECTOR).first();
  await el.scrollIntoViewIfNeeded();
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  await el.screenshot({path: dest, animations: 'disabled'});
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let pages = listPreviewDocs(DOCS_DIR);
  if (args.href) {
    pages = pages.filter((item) => item.href === args.href);
    if (pages.length === 0) {
      throw new Error(`No preview page for --href ${args.href}`);
    }
  } else {
    pages = pages.filter((item) => {
      const raw = fs.readFileSync(item.file, 'utf8');
      if (hasLocalMarkdownImage(raw)) return false;
      return args.force || !fs.existsSync(snapshotAbs(ROOT, item.href));
    });
  }

  if (pages.length === 0) {
    process.stdout.write('doc-gallery snapshot: nothing to do.\n');
    return;
  }

  let browser;
  try {
    browser = await launchBrowser();
  } catch {
    throw new Error(
      'Playwright not found. Install with `npm i -D playwright` or capture via the running site and save under data/doc-gallery/snapshots/.',
    );
  }

  const page = await browser.newPage({viewport: {width: 1280, height: 900}, colorScheme: 'light'});
  let ok = 0;
  try {
    for (const item of pages) {
      const dest = snapshotAbs(ROOT, item.href);
      await snapshotPage(page, args.base, item.href, dest);
      ok += 1;
      process.stdout.write(`snap ${item.href} → ${path.relative(ROOT, dest)}\n`);
    }
  } finally {
    await browser.close();
  }
  process.stdout.write(`doc-gallery snapshot: ${ok} file(s).\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
