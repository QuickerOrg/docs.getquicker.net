/**
 * Development-only local search:
 * - Build a lunr index from docs Markdown (no production HTML needed)
 * - Serve it at /search-index.json
 * - Alias the search theme so the client actually queries in NODE_ENV=development
 */
const fs = require('fs');
const path = require('path');
const {
  aliasedSitePathToRelativePath,
  createSlugger,
  DEFAULT_PARSE_FRONT_MATTER,
  parseMarkdownFile,
} = require('@docusaurus/utils');
const {
  buildIndex,
} = require('@easyops-cn/docusaurus-search-local/dist/server/server/utils/buildIndex');

const SEARCH_INDEX_OPTIONS = {
  language: ['en', 'zh'],
  removeDefaultStopWordFilter: [],
  removeDefaultStemmer: false,
};

function condenseMarkdown(text) {
  return text
    .replace(/^import\s.+$/gm, ' ')
    .replace(/^export\s.+$/gm, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<([A-Z][A-Za-z0-9.]*)\b[^>]*\/>/g, ' ')
    .replace(/<([A-Z][A-Za-z0-9.]*)\b[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[^\n]*\n?/g, ' ').replace(/```/g, ' '),
    )
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSections(content, pageTitle) {
  const slugger = createSlugger();
  const sections = [];
  let title = pageTitle;
  let hash = '';
  let buffer = [];

  const flush = () => {
    sections.push({
      title,
      hash,
      content: condenseMarkdown(buffer.join('\n')),
    });
    buffer = [];
  };

  for (const line of content.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,3})\s+(.+?)\s*$/);
    if (heading) {
      flush();
      title = heading[2]
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\{#[\w-]+\}/g, '')
        .trim();
      hash = `#${slugger.slug(title)}`;
    } else {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

function toKeywords(value) {
  if (Array.isArray(value)) {
    return value.map(String).join(', ');
  }
  return typeof value === 'string' ? value : '';
}

function collectDocs(allContent) {
  const pluginContent = allContent['docusaurus-plugin-content-docs'];
  if (!pluginContent || typeof pluginContent !== 'object') {
    return [];
  }
  const docs = [];
  for (const content of Object.values(pluginContent)) {
    const versions = content?.loadedVersions ?? [];
    for (const version of versions) {
      for (const doc of version.docs ?? []) {
        docs.push(doc);
      }
    }
  }
  return docs;
}

async function documentsFromDocs(docs, siteDir) {
  const titleDocuments = [];
  const headingDocuments = [];
  const descriptionDocuments = [];
  const keywordsDocuments = [];
  const contentDocuments = [];
  let nextId = 0;
  const nextDocId = () => {
    nextId += 1;
    return nextId;
  };

  for (const doc of docs) {
    if (doc.unlisted || doc.draft) {
      continue;
    }
    const source = typeof doc.source === 'string' ? doc.source : '';
    if (!/\.(md|mdx)$/i.test(source)) {
      continue;
    }

    let filePath;
    try {
      filePath = path.join(siteDir, aliasedSitePathToRelativePath(source));
    } catch {
      continue;
    }
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = await parseMarkdownFile({
      filePath,
      fileContent,
      parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
      removeContentTitle: false,
    });

    const pageTitle = doc.title || parsed.contentTitle || path.basename(filePath);
    const url = doc.permalink || '/';
    const description = doc.description || parsed.excerpt || '';
    const keywords = toKeywords(doc.frontMatter?.keywords ?? parsed.frontMatter.keywords);
    const titleId = nextDocId();

    titleDocuments.push({
      i: titleId,
      t: pageTitle,
      u: url,
      b: ['文档'],
    });

    if (description) {
      descriptionDocuments.push({
        i: titleId,
        t: description,
        s: pageTitle,
        u: url,
        p: titleId,
      });
    }

    if (keywords) {
      keywordsDocuments.push({
        i: titleId,
        t: keywords,
        s: pageTitle,
        u: url,
        p: titleId,
      });
    }

    for (const section of splitSections(parsed.content, pageTitle)) {
      if (section.title !== pageTitle) {
        headingDocuments.push({
          i: nextDocId(),
          t: section.title,
          u: url,
          h: section.hash,
          p: titleId,
        });
      }
      if (section.content) {
        contentDocuments.push({
          i: nextDocId(),
          t: section.content,
          s: section.title || pageTitle,
          u: url,
          h: section.hash,
          p: titleId,
        });
      }
    }
  }

  return [
    titleDocuments,
    headingDocuments,
    descriptionDocuments,
    keywordsDocuments,
    contentDocuments,
  ];
}

module.exports = function devLocalSearchPlugin(context) {
  const isProd = process.env.NODE_ENV === 'production';
  const indexFile = path.join(
    context.siteDir,
    '.cache',
    'dev-local-search',
    'search-index.json',
  );

  if (!isProd) {
    fs.mkdirSync(path.dirname(indexFile), {recursive: true});
    if (!fs.existsSync(indexFile)) {
      fs.writeFileSync(indexFile, '[]', 'utf8');
    }
  }

  return {
    name: 'dev-local-search',
    async allContentLoaded({allContent}) {
      if (isProd) {
        return;
      }

      const docs = collectDocs(allContent);
      const allDocuments = await documentsFromDocs(docs, context.siteDir);
      const searchIndex = buildIndex(allDocuments, SEARCH_INDEX_OPTIONS);
      const json = JSON.stringify(searchIndex);
      fs.mkdirSync(path.dirname(indexFile), {recursive: true});
      if (fs.existsSync(indexFile) && fs.readFileSync(indexFile, 'utf8') === json) {
        return;
      }
      fs.writeFileSync(indexFile, json, 'utf8');

      const titleCount = allDocuments[0]?.length ?? 0;
      console.log(`[dev-local-search] indexed ${titleCount} docs for npm start`);
    },
    configureWebpack(_config, isServer) {
      if (isProd || isServer) {
        return {};
      }
      return {
        resolve: {
          alias: {
            [require.resolve(
              '@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js',
            )]: path.resolve(__dirname, 'searchByWorker.js'),
            [require.resolve(
              '@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/EmptyTemplate.js',
            )]: path.resolve(__dirname, 'EmptyTemplate.js'),
          },
        },
      };
    },
  };
};
