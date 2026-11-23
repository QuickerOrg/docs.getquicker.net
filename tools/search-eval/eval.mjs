#!/usr/bin/env node
/**
 * Fixed-query search evaluation for both local lunr index (`build/search-index-*.json`)
 * and the docs-service export pack (`.cache/docs-service/articles.json`).
 *
 * Usage:
 *   node tools/search-eval/eval.mjs
 *   node tools/search-eval/eval.mjs --save-baseline plans/search-eval-baseline.json
 *   node tools/search-eval/eval.mjs --compare plans/search-eval-baseline.json --strict
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');

const lunr = require(path.join(repoRoot, 'node_modules/lunr/lunr.js'));
require(path.join(repoRoot, 'node_modules/lunr-languages/lunr.stemmer.support.js'))(lunr);
require(path.join(
  repoRoot,
  'node_modules/@easyops-cn/docusaurus-search-local/dist/server/shared/lunrLanguageZh.js',
)).lunrLanguageZh(lunr);
require(path.join(repoRoot, 'node_modules/lunr-languages/lunr.multi.js'))(lunr);

const LANGUAGE = ['en', 'zh'];
const FUZZY_DISTANCE = 1;
const MAX_TERMS = 12;
const HALF_MAX_TERMS = MAX_TERMS / 2;

function normalizeUrl(raw) {
  if (!raw) return '';
  let value = String(raw).replace(/^https?:\/\/[^/]+/i, '');
  value = value.split('#')[0].split('?')[0];
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value || '/';
}

function tokenize(text) {
  return text.toLowerCase().match(/\w+|\p{Unified_Ideograph}+/gu) || [];
}

function cutZhWords(token, zhDictionary) {
  const wrappedTerms = [];
  function cut(subToken, carry) {
    let matchedLastIndex = 0;
    let matched = false;
    for (const words of zhDictionary) {
      if (subToken.substr(0, words.length) === words) {
        const nextCarry = {
          missed: carry.missed,
          term: carry.term.concat({value: words}),
        };
        if (subToken.length > words.length) cut(subToken.substr(words.length), nextCarry);
        else wrappedTerms.push(nextCarry);
        matched = true;
      } else {
        for (let lastIndex = words.length - 1; lastIndex > matchedLastIndex; lastIndex -= 1) {
          const subWords = words.substr(0, lastIndex);
          if (subToken.substr(0, lastIndex) === subWords) {
            matchedLastIndex = lastIndex;
            const nextCarry = {
              missed: carry.missed,
              term: carry.term.concat({value: subWords, trailing: true}),
            };
            if (subToken.length > lastIndex) cut(subToken.substr(lastIndex), nextCarry);
            else wrappedTerms.push(nextCarry);
            matched = true;
            break;
          }
        }
      }
    }
    if (!matched) {
      if (subToken.length > 0) {
        cut(subToken.substr(1), {missed: carry.missed + 1, term: carry.term});
      } else if (carry.term.length > 0) {
        wrappedTerms.push(carry);
      }
    }
  }
  cut(token, {missed: 0, term: []});
  return wrappedTerms
    .sort((a, b) => {
      const aMissed = a.missed > 0 ? 1 : 0;
      const bMissed = b.missed > 0 ? 1 : 0;
      if (aMissed !== bMissed) return aMissed - bMissed;
      return a.term.length - b.term.length;
    })
    .map((item) => item.term);
}

function smartTerms(tokens, zhDictionary) {
  const tokenTerms = tokens
    .map((token) =>
      /\p{Unified_Ideograph}/u.test(token) ? cutZhWords(token, zhDictionary) : [{value: token}],
    )
    .slice(0, MAX_TERMS);
  const multiples = tokenTerms.filter((t) => t.length > 1);
  let product = 1;
  let overflowed = false;
  for (const tokenTerm of multiples) {
    if (overflowed) {
      tokenTerm.splice(1, tokenTerm.length - 1);
    } else {
      if (tokenTerm.length > HALF_MAX_TERMS) tokenTerm.splice(HALF_MAX_TERMS, tokenTerm.length - HALF_MAX_TERMS);
      const nextProd = product * tokenTerm.length;
      if (nextProd >= MAX_TERMS) {
        if (nextProd > MAX_TERMS) {
          const max = Math.floor(MAX_TERMS / product);
          tokenTerm.splice(max, tokenTerm.length - max);
          product = max * product;
        } else {
          product = nextProd;
        }
        if (product > HALF_MAX_TERMS) overflowed = true;
      } else {
        product = nextProd;
      }
    }
  }
  const terms = [];
  function combine(index, carry) {
    if (index === tokenTerms.length || carry.length >= MAX_TERMS) {
      terms.push(carry.slice(0, MAX_TERMS));
      return;
    }
    for (const term of tokenTerms[index]) combine(index + 1, carry.concat(term));
  }
  combine(0, []);
  return terms;
}

function termsToQueries(terms, editDistance, maybeTyping) {
  return terms.flatMap((term) => {
    const query = {
      tokens: term.map((item) => item.value),
      term: term.map((item) => {
        const trailing = maybeTyping ? item.trailing || item.maybeTyping : item.trailing;
        const distance = editDistance > 0 && item.value.length > editDistance ? editDistance : undefined;
        return {
          value: item.value,
          presence: lunr.Query.presence.REQUIRED,
          wildcard: trailing ? lunr.Query.wildcard.TRAILING : lunr.Query.wildcard.NONE,
          editDistance: distance,
        };
      }),
    };
    if (editDistance && query.term.every((item) => !item.editDistance)) return [];
    return query;
  });
}

function smartQueries(tokens, zhDictionary) {
  const terms = smartTerms(tokens, zhDictionary);
  if (terms.length === 0) {
    return [
      {
        tokens,
        term: tokens.map((value) => ({
          value,
          presence: lunr.Query.presence.REQUIRED,
          wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
        })),
      },
    ];
  }
  for (const term of terms) term[term.length - 1].maybeTyping = true;
  const stopPipelines = [lunr.zh.stopWordFilter, lunr.stopWordFilter].filter(Boolean);
  const pipe = (term) => stopPipelines.reduce((acc, p) => acc.filter((item) => p(item.value)), term);
  const refinedTerms = [];
  const newTerms = [];
  for (const term of terms) {
    const filtered = pipe(term);
    refinedTerms.push(filtered);
    if (filtered.length < term.length && filtered.length > 0) newTerms.push(filtered);
  }
  terms.push(...newTerms);
  const extraTerms = [];
  for (const term of refinedTerms) {
    if (term.length > 2) {
      for (let i = term.length - 1; i >= 0; i -= 1) {
        extraTerms.push(term.slice(0, i).concat(term.slice(i + 1)));
      }
    }
  }
  const distanceMatrix = (tList, dist) =>
    Array.from({length: dist + 1}, (_, i) =>
      termsToQueries(tList, i).concat(
        termsToQueries(
          tList.filter((t) => {
            const tok = t[t.length - 1];
            return !tok.trailing && tok.maybeTyping;
          }),
          i,
          true,
        ),
      ),
    ).flat();
  return distanceMatrix(terms, FUZZY_DISTANCE).concat(distanceMatrix(extraTerms, FUZZY_DISTANCE));
}

function loadLunrSearch() {
  const buildDir = path.join(repoRoot, 'build');
  const sf = fs.readdirSync(buildDir).find((f) => /^search-index-.*\.json$/.test(f));
  if (!sf) throw new Error('Missing build/search-index-*.json. Run `npm run build` first.');
  const json = JSON.parse(fs.readFileSync(path.join(buildDir, sf), 'utf8'));
  const wrappedIndexes = json.map(({documents, index}, type) => ({
    type,
    documents,
    index: lunr.Index.load(index),
  }));
  const zhDictionary = new Set();
  for (const item of json) {
    for (const tuple of item?.index?.invertedIndex ?? []) {
      const term = tuple?.[0];
      if (typeof term === 'string' && /\p{Unified_Ideograph}/u.test(term[0] || '')) zhDictionary.add(term);
    }
  }
  return {wrappedIndexes, zhDictionary: Array.from(zhDictionary), searchFile: sf};
}

function queryLunr({wrappedIndexes, zhDictionary}, input, limit = 20) {
  const rawTokens = tokenize(input);
  if (rawTokens.length === 0) return [];
  const queries = smartQueries(rawTokens, zhDictionary);
  const results = [];
  search: for (const {term} of queries) {
    for (const {documents, index, type} of wrappedIndexes) {
      const hits = index
        .query((q) => {
          for (const item of term) {
            q.term(item.value, {
              wildcard: item.wildcard,
              presence: item.presence,
              ...(item.editDistance ? {editDistance: item.editDistance} : null),
            });
          }
        })
        .slice(0, limit);
      for (const r of hits) {
        if (results.some((x) => x.document.i.toString() === r.ref)) continue;
        const document = documents.find((doc) => doc.i.toString() === r.ref);
        if (!document) continue;
        results.push({
          document,
          type,
          page: type !== 0 && wrappedIndexes[0].documents.find((doc) => doc.i === document.p),
          score: r.score,
        });
        if (results.length >= limit) break search;
      }
    }
  }
  results.forEach((item, index) => {
    item.index = index;
  });
  results.sort((a, b) => {
    let aPageIdx = [1, 2, 3].includes(a.type) && a.page
      ? results.findIndex((item) => item.document === a.page)
      : a.index;
    let bPageIdx = [1, 2, 3].includes(b.type) && b.page
      ? results.findIndex((item) => item.document === b.page)
      : b.index;
    if (aPageIdx === -1) aPageIdx = a.index;
    if (bPageIdx === -1) bPageIdx = b.index;
    if (aPageIdx === bPageIdx) {
      const diff = (b.type === 0 ? 1 : 0) - (a.type === 0 ? 1 : 0);
      return diff === 0 ? a.index - b.index : diff;
    }
    return aPageIdx - bPageIdx;
  });
  const seenUrls = new Set();
  const deduped = [];
  for (const item of results) {
    const url = normalizeUrl(item.document.u);
    if (!url || seenUrls.has(url)) continue;
    seenUrls.add(url);
    deduped.push({url, title: item.page ? item.page.t : item.document.t, type: item.type, score: +item.score.toFixed(3)});
  }
  return deduped;
}

function queryArticlesPack(articles, queryText) {
  const qLower = queryText.trim().toLowerCase();
  const terms = tokenize(queryText).filter((t) => t.length >= 2 || /^[a-z0-9]+$/i.test(t));
  const zhSubTerms = new Set(terms);
  for (const t of terms) {
    if (/\p{Unified_Ideograph}/u.test(t) && t.length > 2) {
      for (let i = 0; i <= t.length - 2; i += 1) zhSubTerms.add(t.slice(i, i + 2));
    }
  }
  const tokens = Array.from(zhSubTerms);
  const scored = [];
  for (const art of articles) {
    const titleL = (art.title || '').toLowerCase();
    const descL = (art.description || '').toLowerCase();
    const kwL = (art.keywords || []).map((k) => String(k).toLowerCase());
    const mdL = (art.markdown || '').toLowerCase();
    const modKeyL = (art.moduleContract?.moduleKey || '').toLowerCase();

    let score = 0;
    if (modKeyL && modKeyL === qLower) score += 200;
    if (titleL === qLower) score += 120;
    else if (titleL.includes(qLower)) score += 60;
    if (kwL.some((k) => k === qLower)) score += 80;

    let matchedTokens = 0;
    for (const tok of tokens) {
      let hit = false;
      if (modKeyL && modKeyL.includes(tok)) { score += 30; hit = true; }
      if (titleL.includes(tok)) { score += 18; hit = true; }
      if (kwL.some((k) => k.includes(tok))) { score += 12; hit = true; }
      if (descL.includes(tok)) { score += 8; hit = true; }
      if (mdL.includes(tok)) { score += 3; hit = true; }
      if (hit) matchedTokens += 1;
    }
    if (score === 0) continue;
    score += matchedTokens * 5;
    if (art.authority && art.authority.isPrimary === false) score *= 0.55;
    if (art.contentType === 'changelog') score *= 0.85;
    scored.push({url: normalizeUrl(art.url), title: art.title, score: +score.toFixed(2)});
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

function evaluateQuery(q, hits) {
  const targets = new Set(q.targetUrls.map(normalizeUrl));
  const rankIdx = hits.findIndex((h) => targets.has(h.url));
  const rank = rankIdx === -1 ? null : rankIdx + 1;
  let passed = rank !== null && rank <= q.maxRank;
  let crowdingReason = null;
  if (q.category === 'noLegacyCrowding' && Array.isArray(q.legacyPrefixes)) {
    const legacyHits = hits
      .map((h, i) => ({...h, rank: i + 1}))
      .filter((h) => q.legacyPrefixes.some((p) => h.url.startsWith(normalizeUrl(p))));
    const topLegacy = legacyHits[0];
    if (topLegacy && (rank === null || topLegacy.rank < rank)) {
      passed = false;
      crowdingReason = `旧/非主页面 ${topLegacy.url} (rank=${topLegacy.rank}) 挤占了目标页 (rank=${rank ?? 'miss'})`;
    }
  }
  return {rank, passed, crowdingReason, top5: hits.slice(0, 5)};
}

function runEval() {
  const args = process.argv.slice(2);
  const saveIdx = args.indexOf('--save-baseline');
  const compareIdx = args.indexOf('--compare');
  const strict = args.includes('--strict');
  const savePath = saveIdx !== -1 ? args[saveIdx + 1] : null;
  const comparePath = compareIdx !== -1 ? args[compareIdx + 1] : null;

  const queriesData = JSON.parse(fs.readFileSync(path.join(scriptDir, 'queries.json'), 'utf8'));
  const lunrCtx = loadLunrSearch();
  const articlesPath = path.join(repoRoot, '.cache/docs-service/articles.json');
  const articles = fs.existsSync(articlesPath)
    ? JSON.parse(fs.readFileSync(articlesPath, 'utf8')).articles
    : [];

  const rows = [];
  for (const q of queriesData.queries) {
    const lunrHits = queryLunr(lunrCtx, q.query, 24);
    const lunrRes = evaluateQuery(q, lunrHits);
    const packHits = articles.length ? queryArticlesPack(articles, q.query) : [];
    const packRes = articles.length ? evaluateQuery(q, packHits) : null;
    rows.push({
      id: q.id,
      category: q.category,
      query: q.query,
      targetUrls: q.targetUrls,
      maxRank: q.maxRank,
      lunr: lunrRes,
      pack: packRes,
    });
  }

  const summarize = (field) => {
    const total = rows.length;
    const pass = rows.filter((r) => r[field]?.passed).length;
    const byCategory = {};
    for (const r of rows) {
      byCategory[r.category] ??= {total: 0, pass: 0};
      byCategory[r.category].total += 1;
      if (r[field]?.passed) byCategory[r.category].pass += 1;
    }
    return {total, pass, byCategory};
  };

  const report = {
    generatedAt: new Date().toISOString(),
    searchFile: lunrCtx.searchFile,
    lunrSummary: summarize('lunr'),
    packSummary: articles.length ? summarize('pack') : null,
    results: rows,
  };

  if (savePath) {
    const out = path.resolve(repoRoot, savePath);
    fs.mkdirSync(path.dirname(out), {recursive: true});
    fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log(`Saved baseline to ${path.relative(repoRoot, out)}`);
  }

  console.log(`=== Search Eval (${lunrCtx.searchFile}) ===`);
  console.log(`Lunr passed: ${report.lunrSummary.pass}/${report.lunrSummary.total}`, report.lunrSummary.byCategory);
  if (report.packSummary) {
    console.log(`Pack passed: ${report.packSummary.pass}/${report.packSummary.total}`, report.packSummary.byCategory);
  }

  let baseline = null;
  if (comparePath) {
    baseline = JSON.parse(fs.readFileSync(path.resolve(repoRoot, comparePath), 'utf8'));
    console.log(`\n=== Comparison vs ${comparePath} ===`);
    console.log(`Lunr: ${baseline.lunrSummary.pass}/${baseline.lunrSummary.total} -> ${report.lunrSummary.pass}/${report.lunrSummary.total}`);
    if (baseline.packSummary && report.packSummary) {
      console.log(`Pack: ${baseline.packSummary.pass}/${baseline.packSummary.total} -> ${report.packSummary.pass}/${report.packSummary.total}`);
    }
  }

  for (const r of rows) {
    const baseRow = baseline?.results?.find((x) => x.id === r.id);
    const lRank = r.lunr.rank ?? 'miss';
    const pRank = r.pack ? (r.pack.rank ?? 'miss') : '-';
    const bRank = baseRow ? (baseRow.lunr.rank ?? 'miss') : null;
    const status = r.lunr.passed && (!r.pack || r.pack.passed) ? 'PASS' : 'FAIL';
    const rankStr = bRank !== null ? `lunr:${bRank}->${lRank}` : `lunr:${lRank}`;
    console.log(`  [${status}] ${r.id} (${r.query}) | ${rankStr} | pack:${pRank}` +
      (r.lunr.crowdingReason ? ` | ${r.lunr.crowdingReason}` : '') +
      (r.pack?.crowdingReason ? ` | pack: ${r.pack.crowdingReason}` : ''));
  }

  if (strict) {
    const failed = rows.filter((r) => !r.lunr.passed || (r.pack && !r.pack.passed));
    if (failed.length > 0) {
      console.error(`\nStrict eval failed: ${failed.length} query/queries did not meet criteria.`);
      process.exit(1);
    }
    console.log('\nStrict eval passed: all queries met criteria.');
  }
}

runEval();
