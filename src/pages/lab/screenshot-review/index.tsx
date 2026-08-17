import type {ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ModuleParamPreview from '@site/src/components/ModuleParamPreview';
import NotifyToastPreview from '@site/src/components/NotifyToastPreview';
import MsgBoxPreview from '@site/src/components/MsgBoxPreview';
import ChoiceListPreview from '@site/src/components/ChoiceListPreview';
import ContextMenuPreview from '@site/src/components/ContextMenuPreview';
import VariableDefPreview from '@site/src/components/VariableDefPreview';
import StepProgramView from '@site/src/components/StepProgramView';
import WaitWinPreview from '@site/src/components/WaitWinPreview';
import CoordDiagram from '@site/src/components/CoordDiagram';
import ClickIndicatorPreview from '@site/src/components/ClickIndicatorPreview';
import UserInputPreview from '@site/src/components/UserInputPreview';
import TableFieldPreview, {
  type TableFieldDefinition,
} from '@site/src/components/TableFieldPreview';
import ActionEditorPreview from '@site/src/components/ActionEditorPreview';
import TextWindowPreview from '@site/src/components/TextWindowPreview';
import ReportProgressPreview from '@site/src/components/ReportProgressPreview';
import ExpressionAssistPreview from '@site/src/components/ExpressionAssistPreview';
import SearchBoxPreview from '@site/src/components/SearchBoxPreview';
import ElseToggleMenuDemo from '@site/src/components/ContextMenuPreview/ElseToggleMenuDemo';
import PreviewMarks from '@site/src/components/PreviewMarks';
import styles from './styles.module.css';
type ReviewItem = {
  id: string;
  /** orphan = leftover screenshot; direct = MDX-authored preview with no img. */
  source?: 'orphan' | 'direct';
  page: string;
  pageUrl: string;
  title: string;
  moduleKey: string;
  image: string;
  imageName: string;
  component: string;
  decidedComponent?: string;
  /** How the orphan was paired to a page preview. */
  pairConfidence?: string;
  /** preview = safe to render; page-ref = open real doc (avoid wrong props). */
  renderMode?: 'preview' | 'page-ref' | 'direct';
  props: Record<string, string>;
  /** Ambiguous page-ref: live props from same-type instances on the page. */
  candidates?: Array<{props: Record<string, string>; snippet: string}>;
  sourceSnippet: string;
};

type Catalog = {
  generatedAt: string;
  count: number;
  byComponent: Record<string, number>;
  bySource?: {orphan: number; direct: number};
  items: ReviewItem[];
};

type CollapsedEntry = {at: string; note?: string};
type ReviewState = {
  updatedAt: string;
  collapsed: Record<string, CollapsedEntry>;
};

const DEFAULT_API = 'http://127.0.0.1:3920';

type FilterMode = 'pending' | 'collapsed' | 'all';
type SourceMode = 'all' | 'orphan' | 'direct';
type MediaMode = 'all' | 'gif' | 'static';

function itemSource(item: ReviewItem): 'orphan' | 'direct' {
  if (item.source === 'direct' || !item.image) return 'direct';
  return 'orphan';
}

function itemMedia(item: ReviewItem): 'gif' | 'static' | 'none' {
  if (!item.image) return 'none';
  return /\.gif$/i.test(item.image) || /\.gif$/i.test(item.imageName) ? 'gif' : 'static';
}

/** Directory chips: docs/v2/xaction/{concepts|guides|modules/...} */
function dirKeyForItem(item: ReviewItem): string {
  const p = (item.page || item.image || '').replaceAll('\\', '/');
  const m = /^(docs\/v2\/xaction\/(?:concepts|guides|modules(?:\/[^/]+)?))/i.exec(p);
  if (m) return m[1]!;
  const docs = /^(docs\/[^/]+)/i.exec(p);
  return docs?.[1] || '其它';
}

function resolveApiBase(configured?: string): string {
  if (typeof window === 'undefined') return configured || DEFAULT_API;
  const params = new URLSearchParams(window.location.search);
  return params.get('api') || configured || DEFAULT_API;
}

function readUrlFilters(): {media: MediaMode; dir: string; query: string} {
  if (typeof window === 'undefined') {
    return {media: 'all', dir: '', query: ''};
  }
  const params = new URLSearchParams(window.location.search);
  const mediaRaw = params.get('media');
  const media: MediaMode =
    mediaRaw === 'gif' || mediaRaw === 'static' ? mediaRaw : 'all';
  return {
    media,
    dir: params.get('dir') || '',
    query: params.get('q') || '',
  };
}

function writeUrlFilters(next: {media: MediaMode; dir: string; query: string}): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (next.media === 'all') params.delete('media');
  else params.set('media', next.media);
  if (!next.dir) params.delete('dir');
  else params.set('dir', next.dir);
  if (!next.query.trim()) params.delete('q');
  else params.set('q', next.query.trim());
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', url);
}

function imgUrl(api: string, imagePath: string): string {
  return `${api}/api/img?path=${encodeURIComponent(imagePath)}`;
}

function PageRefPane({item}: {item: ReviewItem}): ReactNode {
  const candidates = item.candidates || [];
  const [idx, setIdx] = useState(0);
  const active = candidates[idx];
  const previewItem: ReviewItem = {
    ...item,
    props: active?.props || item.props || {},
    sourceSnippet: active?.snippet || '',
    renderMode: 'preview',
  };

  return (
    <div className={styles.pageRefBox}>
      <p>
        同页有多份同类型组件，账本无法唯一配对。请对照左侧原图，在下方候选里点选匹配项（或打开文档）。
      </p>
      {candidates.length > 0 ? (
        <>
          <div className={styles.candidateBar} role="tablist" aria-label="同页候选组件">
            {candidates.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === idx}
                className={i === idx ? styles.candidateActive : styles.candidateBtn}
                onClick={() => setIdx(i)}
              >
                候选 {i + 1}
              </button>
            ))}
          </div>
          <div className={styles.preview}>
            <PreviewForItem item={previewItem} />
          </div>
          {active?.snippet ? (
            <details className={styles.snippetDetails}>
              <summary>候选 MDX</summary>
              <pre className={styles.snippet}>{active.snippet}</pre>
            </details>
          ) : null}
        </>
      ) : (
        <p className={styles.muted}>本页未解析到同类型实例 props，请直接打开文档对照。</p>
      )}
      <a className={styles.link} href={item.pageUrl} target="_blank" rel="noreferrer">
        打开 {item.pageUrl}
      </a>
      <iframe
        className={styles.pageFrame}
        src={item.pageUrl}
        title={`${item.title} 文档页`}
        loading="lazy"
      />
    </div>
  );
}

function PreviewForItem({item}: {item: ReviewItem}): ReactNode {
  const p = item.props || {};
  switch (item.component) {
    case 'ModuleParamPreview':
      return (
        <ModuleParamPreview
          moduleKey={p.moduleKey || item.moduleKey}
          values={safeParseJson<Record<string, string>>(p.values)}
          inputVars={safeParseJson<Record<string, string>>(p.inputVars)}
          outputVars={safeParseJson<Record<string, string>>(p.outputVars)}
          focusKeys={safeParseJson<string[]>(p.focusKeys)}
        />
      );
    case 'NotifyToastPreview':
      return (
        <NotifyToastPreview
          message={p.message || '（无文案）'}
          variant={(p.variant as 'info' | 'success' | 'warning' | 'error') || 'info'}
          styleVariant={(p.styleVariant as 'default' | 'card') || 'default'}
          showClose={p.showClose !== 'false'}
          maxLines={p.maxLines ? Number(p.maxLines) : undefined}
        />
      );
    case 'MsgBoxPreview':
      return (
        <MsgBoxPreview
          title={p.title || 'Quicker'}
          message={p.message || ''}
          icon={(p.icon as 'info' | 'question' | 'warning' | 'error' | 'none') || 'question'}
          buttons={safeParseJson<string[]>(p.buttons) ?? ['确定', '取消']}
          primaryIndex={p.primaryIndex ? Number(p.primaryIndex) : 0}
        />
      );
    case 'ChoiceListPreview':
      return (
        <ChoiceListPreview
          title={p.title || '请选择'}
          options={safeParseJson<string[]>(p.options) ?? ['（选项未解析）']}
          showIndex={p.showIndex !== 'false'}
          selectedIndex={p.selectedIndex != null ? Number(p.selectedIndex) : undefined}
          globalButtons={safeParseJson<string[]>(p.globalButtons)}
          showMoreMenu={p.showMoreMenu === 'true'}
        />
      );
    case 'ContextMenuPreview': {
      const items =
        safeParseJson<Array<Record<string, unknown>>>(p.items) ??
        ([{label: '（菜单数据未解析）'}] as Array<Record<string, unknown>>);
      return (
        <ContextMenuPreview
          openPath={safeParseJson<string[]>(p.openPath) ?? []}
          tooltip={p.tooltip}
          items={items as never}
        />
      );
    }
    case 'WaitWinPreview':
      return (
        <WaitWinPreview
          title={p.title || '完成后继续'}
          message={p.message || ''}
          progress={p.progress}
          buttons={safeParseJson<string[]>(p.buttons)}
          primaryIndex={p.primaryIndex ? Number(p.primaryIndex) : undefined}
        />
      );
    case 'CoordDiagram':
      return (
        <CoordDiagram
          width={p.width != null ? Number(p.width) : undefined}
          height={p.height != null ? Number(p.height) : undefined}
          showSecondary={p.showSecondary !== 'false'}
        />
      );
    case 'ClickIndicatorPreview':
      return (
        <ClickIndicatorPreview
          size={p.size != null ? Number(p.size) : undefined}
          color={p.color}
        />
      );
    case 'UserInputPreview':
      return (
        <UserInputPreview
          title={p.title}
          prompt={p.prompt}
          value={p.value}
          texttools={p.texttools}
          activeTool={p.activeTool}
          showHelp={p.showHelp !== 'false'}
          showToolTooltip={p.showToolTooltip !== 'false'}
          showTools={p.showTools === 'true'}
        />
      );
    case 'TableFieldPreview':
      return (
        <TableFieldPreview
          fields={safeParseJson<TableFieldDefinition[]>(p.fields)}
          field={safeParseJson<TableFieldDefinition>(p.field)}
        />
      );
    case 'VariableDefPreview':
      return (
        <VariableDefPreview
          name={p.name || 'var'}
          typeLabel={p.typeLabel || '文本'}
          remark={p.remark}
          defaultValue={normalizeDisplayString(p.defaultValue)}
        />
      );
    case 'StepProgramView':
      return (
        <StepProgramView
          caption={p.caption}
          showParams={p.showParams === 'true'}
          showIndex={p.showIndex === 'true'}
          showKey={p.showKey === 'true'}
          wheelDelay={
            p.wheelDelay === 'true'
              ? true
              : (safeParseJson(p.wheelDelay) as
                  | {from?: number; to?: number; step?: number}
                  | undefined)
          }
          data={
            safeParseJson(p.data) ?? [
              {key: item.moduleKey || 'sys:assign', note: '示意（catalog 未带完整 wire）'},
            ]
          }
        />
      );
    case 'ActionEditorPreview':
      return (
        <ActionEditorPreview
          caption={p.caption}
          focus={(p.focus as 'full' | 'toolbox' | 'steps' | 'variables' | 'appearance') || 'full'}
          toolboxTab={p.toolboxTab as never}
          toolboxSearch={p.toolboxSearch}
          toolboxSelected={p.toolboxSelected}
          actionTitle={p.actionTitle}
          actionDescription={p.actionDescription}
          showRun={p.showRun !== 'false'}
          data={safeParseJson(p.data) ?? {steps: []}}
          dragDemo={safeParseJson(p.dragDemo)}
          historyDemo={safeParseJson(p.historyDemo)}
        />
      );
    case 'TextWindowPreview':
      return (
        <TextWindowPreview
          title={p.title}
          text={p.text || '（无文案）'}
          showLineNum={p.showLineNum !== 'false'}
          showToolbar={p.showToolbar !== 'false'}
        />
      );
    case 'ReportProgressPreview':
      return (
        <ReportProgressPreview
          items={safeParseJson(p.items)}
          animate={p.animate !== 'false'}
        />
      );
    case 'ExpressionAssistPreview':
      return (
        <ExpressionAssistPreview
          variable={p.variable}
          operation={p.operation}
          paramTitle={p.paramTitle}
          paramValue={p.paramValue}
          tab={(p.tab as 'generate' | 'operators') || 'generate'}
        />
      );
    case 'SearchBoxPreview':
      return (
        <SearchBoxPreview
          mode={(p.mode as 'pick' | 'param' | 'live') || 'pick'}
          query={p.query}
          selectedAction={p.selectedAction}
          selectedIcon={p.selectedIcon}
          results={safeParseJson(p.results)}
          selectedIndex={p.selectedIndex != null ? Number(p.selectedIndex) : undefined}
          animate={p.animate !== 'false'}
        />
      );
    case 'ElseToggleMenuDemo':
      return <ElseToggleMenuDemo caption={p.caption} />;
    case 'PreviewMarks': {
      const marks =
        safeParseJson<Array<{key: string; label: string}>>(p.marks) ?? [];
      const childKey = p.moduleKey || item.moduleKey;
      return (
        <PreviewMarks marks={marks} caption={p.caption}>
          {childKey ? (
            <ModuleParamPreview
              moduleKey={childKey}
              values={safeParseJson<Record<string, string>>(p.values)}
              focusKeys={safeParseJson<string[]>(p.focusKeys)}
            />
          ) : (
            <p className={styles.muted}>PreviewMarks 缺内层 moduleKey（账本未记 imageRef/props）</p>
          )}
        </PreviewMarks>
      );
    }
    default:
      return <p className={styles.muted}>未知组件：{item.component}</p>;
  }
}

function safeParseJson<T>(raw: string | undefined): T | undefined {
  if (raw == null || raw === '') return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/** Undo catalog mishaps like storing `'{\\n "a": 1}'` including quotes. */
function normalizeDisplayString(raw: string | undefined): string | undefined {
  if (raw == null || raw === '') return undefined;
  const t = raw.trim();
  const quote = t[0];
  if (
    t.length >= 2 &&
    (quote === '"' || quote === "'") &&
    t[t.length - 1] === quote &&
    (t.includes('\\n') || t.includes('\n') || t.startsWith(`'{`) || t.startsWith(`"{`))
  ) {
    let out = '';
    const inner = t.slice(1, -1);
    for (let i = 0; i < inner.length; i += 1) {
      const ch = inner[i];
      if (ch !== '\\' || i + 1 >= inner.length) {
        out += ch;
        continue;
      }
      const next = inner[i + 1];
      i += 1;
      if (next === 'n') out += '\n';
      else if (next === 'r') out += '\r';
      else if (next === 't') out += '\t';
      else if (next === '\\') out += '\\';
      else if (next === quote || next === '"' || next === "'") out += next;
      else out += next;
    }
    return out;
  }
  return raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

export default function ScreenshotReviewPage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const configuredApi = siteConfig.customFields?.screenshotReviewApiBase as string | undefined;
  const api = resolveApiBase(configuredApi);
  const initialFilters = readUrlFilters();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [state, setState] = useState<ReviewState>({updatedAt: '', collapsed: {}});
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<FilterMode>('pending');
  const [sourceMode, setSourceMode] = useState<SourceMode>('all');
  const [mediaMode, setMediaMode] = useState<MediaMode>(initialFilters.media);
  const [dirFilter, setDirFilter] = useState(initialFilters.dir);
  const [query, setQuery] = useState(initialFilters.query);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const health = await fetch(`${api}/api/health`);
      setApiOk(health.ok);
      if (!health.ok) throw new Error('API health failed');
      const [catRes, stateRes] = await Promise.all([
        fetch(`${api}/api/catalog`),
        fetch(`${api}/api/state`),
      ]);
      if (!catRes.ok) throw new Error('catalog fetch failed');
      if (!stateRes.ok) throw new Error('state fetch failed');
      setCatalog(await catRes.json());
      setState(await stateRes.json());
    } catch (e) {
      setApiOk(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    writeUrlFilters({media: mediaMode, dir: dirFilter, query});
  }, [mediaMode, dirFilter, query]);

  const setCollapsed = useCallback(
    async (id: string, collapsed: boolean) => {
      setBusyId(id);
      setError('');
      try {
        const res = await fetch(`${api}/api/state/item`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id, collapsed}),
        });
        if (!res.ok) throw new Error(`persist failed (${res.status})`);
        const next = (await res.json()) as ReviewState;
        setState(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusyId(null);
      }
    },
    [api],
  );

  const rebuild = useCallback(async () => {
    setError('');
    try {
      const res = await fetch(`${api}/api/catalog?rebuild=1`);
      if (!res.ok) throw new Error('rebuild failed');
      setCatalog(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [api]);

  const collapsedCount = Object.keys(state.collapsed || {}).length;
  const dirOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of catalog?.items || []) {
      const key = dirKeyForItem(it);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'en'))
      .map(([key, count]) => ({key, count}));
  }, [catalog]);

  const filtered = useMemo(() => {
    const items = catalog?.items || [];
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const isCollapsed = Boolean(state.collapsed[it.id]);
      if (filter === 'pending' && isCollapsed) return false;
      if (filter === 'collapsed' && !isCollapsed) return false;
      if (sourceMode !== 'all' && itemSource(it) !== sourceMode) return false;
      if (mediaMode === 'gif' && itemMedia(it) !== 'gif') return false;
      if (mediaMode === 'static' && itemMedia(it) !== 'static') return false;
      if (dirFilter && dirKeyForItem(it) !== dirFilter) return false;
      if (!q) return true;
      const hay =
        `${it.title} ${it.page} ${it.pageUrl} ${it.moduleKey} ${it.image} ${it.imageName} ${it.component} ${itemSource(it)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [catalog, state.collapsed, filter, sourceMode, mediaMode, dirFilter, query]);

  return (
    <Layout title="截图 → 组件审核" description="原图与 MDX 组件并排对比">
      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>截图 → 组件审核</h1>
            <p className={styles.lead}>
              左侧原图；右侧仅在能<strong>唯一</strong>对应到页内实例时渲染组件（或缺省打开文档页对照）。
              同页多实例且账本无 <code>sourceSnippet</code> 时不再猜测配对——避免错配。勾选「已审核」写入{' '}
              <code>data/screenshot-review/state.json</code>。
            </p>
          </div>
          <div className={styles.toolbar}>
            <span
              className={apiOk ? styles.badgeOk : styles.badgeBad}
              title={api}>
              API {apiOk == null ? '…' : apiOk ? '在线' : '离线'}
            </span>
            <button type="button" className={styles.btn} onClick={() => void load()}>
              刷新
            </button>
            <button type="button" className={styles.btn} onClick={() => void rebuild()}>
              重建目录
            </button>
          </div>
        </header>

        {error ? <div className={styles.error}>{error}（请先 <code>npm run docs:review:api</code>）</div> : null}

        <div className={styles.controls}>
          <div className={styles.filters}>
            {(
              [
                ['pending', '待审'],
                ['collapsed', '已折叠'],
                ['all', '全部'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={filter === mode ? styles.chipActive : styles.chip}
                onClick={() => setFilter(mode)}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.filters}>
            {(
              [
                ['all', '全部来源'],
                ['orphan', '有原图'],
                ['direct', '直接写组件'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={sourceMode === mode ? styles.chipActive : styles.chip}
                onClick={() => setSourceMode(mode)}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.filters}>
            {(
              [
                ['all', '全部媒体'],
                ['gif', '仅 GIF'],
                ['static', '静态图'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={mediaMode === mode ? styles.chipActive : styles.chip}
                onClick={() => setMediaMode(mode)}>
                {label}
              </button>
            ))}
          </div>
          <label className={styles.dirFilter}>
            <span className={styles.dirLabel}>目录</span>
            <select
              className={styles.dirSelect}
              value={dirFilter}
              onChange={(e) => setDirFilter(e.target.value)}
              aria-label="按目录筛选">
              <option value="">全部目录</option>
              {dirOptions.map(({key, count}) => (
                <option key={key} value={key}>
                  {key.replace(/^docs\/v2\/xaction\//, '')} ({count})
                </option>
              ))}
            </select>
          </label>
          <input
            className={styles.search}
            placeholder="筛选页面 / moduleKey / 文件名…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.stats}>
            目录 {catalog?.count ?? '—'}
            {catalog?.bySource
              ? ` · 原图 ${catalog.bySource.orphan} · 直接写 ${catalog.bySource.direct}`
              : ''}{' '}
            · 已折叠 {collapsedCount} · 当前列表 {filtered.length}
            {mediaMode === 'gif' ? ' · GIF' : ''}
            {dirFilter ? ` · ${dirFilter.replace(/^docs\/v2\/xaction\//, '')}` : ''}
          </div>
        </div>

        <div className={styles.list}>
          {filtered.map((item) => {
            const collapsed = Boolean(state.collapsed[item.id]);
            if (collapsed && filter !== 'all' && filter !== 'collapsed') return null;
            if (collapsed) {
              return (
                <div key={item.id} className={styles.collapsedRow}>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked
                      disabled={busyId === item.id}
                      onChange={() => void setCollapsed(item.id, false)}
                    />
                    <span>已审核</span>
                  </label>
                  <span className={styles.collapsedMeta}>
                    {item.title} · {item.component} ·{' '}
                    {itemSource(item) === 'direct' ? '直接写组件' : item.imageName}
                    {state.collapsed[item.id]?.at
                      ? ` · ${state.collapsed[item.id].at.replace('T', ' ').slice(0, 19)}`
                      : ''}
                  </span>
                  <a className={styles.link} href={item.pageUrl}>
                    打开文档
                  </a>
                </div>
              );
            }

            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={false}
                      disabled={busyId === item.id}
                      onChange={() => void setCollapsed(item.id, true)}
                    />
                    <span>已审核（折叠）</span>
                  </label>
                  <div className={styles.cardMeta}>
                    <strong>{item.title}</strong>
                    <span className={styles.muted}>
                      {item.component}
                      {item.moduleKey ? ` · ${item.moduleKey}` : ''}
                      {itemSource(item) === 'direct' ? ' · 直接写组件' : ''}
                      {item.pairConfidence && item.pairConfidence !== 'direct'
                        ? ` · 配对:${item.pairConfidence}`
                        : ''}
                    </span>
                    {item.pairConfidence === 'page-ref' ? (
                      <span
                        className={styles.warnBadge}
                        title="同页多实例且无法唯一配对；右侧提供候选预览与文档 iframe"
                      >
                        请选候选或打开文档
                      </span>
                    ) : null}
                    <a className={styles.link} href={item.pageUrl}>
                      {item.pageUrl}
                    </a>
                  </div>
                </div>
                <div className={styles.compare}>
                  <div className={styles.pane}>
                    {itemSource(item) === 'direct' ? (
                      <>
                        <div className={styles.paneLabel}>直接写组件 · 无原图</div>
                        <div className={styles.directBox}>
                          <div>文档内直接写的预览，没有对应截图可对比。</div>
                          <a className={styles.link} href={item.pageUrl}>
                            {item.pageUrl}
                          </a>
                          <div className={styles.muted}>打开文档页查看上下文</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.paneLabel}>原图 · {item.imageName}</div>
                        <img
                          className={`${styles.shot} qk-native-img`}
                          src={imgUrl(api, item.image)}
                          alt={item.imageName}
                          loading="lazy"
                        />
                      </>
                    )}
                  </div>
                  <div className={styles.pane}>
                    <div className={styles.paneLabel}>
                      {item.renderMode === 'page-ref'
                        ? `文档页对照 · 账本类型 ${item.component}`
                        : `组件 · ${item.component}`}
                    </div>
                    <div className={styles.preview}>
                      {item.renderMode === 'page-ref' ? (
                        <PageRefPane item={item} />
                      ) : (
                        <PreviewForItem item={item} />
                      )}
                    </div>
                    {item.sourceSnippet ? (
                      <details className={styles.snippetDetails}>
                        <summary>MDX 源码片段</summary>
                        <pre className={styles.snippet}>{item.sourceSnippet}</pre>
                      </details>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
