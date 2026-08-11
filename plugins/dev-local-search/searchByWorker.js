// @ts-nocheck
import lunr from 'lunr';
import stemmerSupport from 'lunr-languages/lunr.stemmer.support';
import multiLang from 'lunr-languages/lunr.multi';
import {searchIndexUrl, language} from '@generated/@easyops-cn/docusaurus-search-local/default/generated-constants.js';
import {lunrLanguageZh} from '@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh';
import {tokenize} from '@easyops-cn/docusaurus-search-local/dist/client/client/utils/tokenize';
import {smartQueries} from '@easyops-cn/docusaurus-search-local/dist/client/client/utils/smartQueries';
import {SearchDocumentType} from '@easyops-cn/docusaurus-search-local/dist/client/shared/interfaces';
import {sortSearchResults} from '@easyops-cn/docusaurus-search-local/dist/client/client/utils/sortSearchResults';
import {processTreeStatusOfSearchResults} from '@easyops-cn/docusaurus-search-local/dist/client/client/utils/processTreeStatusOfSearchResults';

const cache = new Map();

function ensureLunrPlugins() {
  if (lunr.zh) {
    return;
  }
  stemmerSupport(lunr);
  lunrLanguageZh(lunr);
  multiLang(lunr);
}

async function loadIndexes(baseUrl, searchContext) {
  const cacheKey = `${baseUrl}${searchContext}`;
  let promise = cache.get(cacheKey);
  if (!promise) {
    promise = (async () => {
      ensureLunrPlugins();
      const url = `${baseUrl}${searchIndexUrl.replace(
        '{dir}',
        searchContext ? `-${searchContext.replace(/\//g, '-')}` : '',
      )}`;
      const fullUrl = new URL(url, location.origin);
      if (fullUrl.origin !== location.origin) {
        throw new Error('Unexpected version url');
      }
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Search index HTTP ${response.status}`);
      }
      const json = await response.json();
      if (!Array.isArray(json) || json.length === 0) {
        return {wrappedIndexes: [], zhDictionary: []};
      }
      const wrappedIndexes = json.map(({documents, index}, type) => ({
        type,
        documents,
        index: lunr.Index.load(index),
      }));
      const zhDictionary = new Set();
      for (const item of json) {
        const inverted = item?.index?.invertedIndex;
        if (!Array.isArray(inverted)) {
          continue;
        }
        for (const tuple of inverted) {
          const term = tuple?.[0];
          if (typeof term === 'string' && /\p{Unified_Ideograph}/u.test(term[0] || '')) {
            zhDictionary.add(term);
          }
        }
      }
      return {
        wrappedIndexes,
        zhDictionary: Array.from(zhDictionary),
      };
    })().catch((error) => {
      console.error('[dev-local-search] failed to load index', error);
      cache.delete(cacheKey);
      return {wrappedIndexes: [], zhDictionary: []};
    });
    cache.set(cacheKey, promise);
  }
  return promise;
}

export async function fetchIndexesByWorker(baseUrl, searchContext) {
  await loadIndexes(baseUrl, searchContext);
}

export async function searchByWorker(baseUrl, searchContext, input, limit) {
  const rawTokens = tokenize(input, language);
  if (rawTokens.length === 0) {
    return [];
  }
  const {wrappedIndexes, zhDictionary} = await loadIndexes(baseUrl, searchContext);
  if (wrappedIndexes.length === 0) {
    return [];
  }
  const queries = smartQueries(rawTokens, zhDictionary);
  const results = [];
  search: for (const {term, tokens} of queries) {
    for (const {documents, index, type} of wrappedIndexes) {
      results.push(
        ...index
          .query((query) => {
            for (const item of term) {
              query.term(item.value, {
                wildcard: item.wildcard,
                presence: item.presence,
                ...(item.editDistance ? {editDistance: item.editDistance} : null),
              });
            }
          })
          .slice(0, limit)
          .filter((result) => !results.some((item) => item.document.i.toString() === result.ref))
          .slice(0, limit - results.length)
          .map((result) => {
            const document = documents.find((doc) => doc.i.toString() === result.ref);
            return {
              document,
              type,
              page:
                type !== SearchDocumentType.Title &&
                wrappedIndexes[0].documents.find((doc) => doc.i === document.p),
              metadata: result.matchData.metadata,
              tokens,
              score: result.score,
            };
          }),
      );
      if (results.length >= limit) {
        break search;
      }
    }
  }
  sortSearchResults(results);
  processTreeStatusOfSearchResults(results);
  return results;
}
