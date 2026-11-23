/**
 * Warm the local-search worker after first paint so the navbar search is
 * not blocked on downloading / hydrating the lunr index, while respecting
 * Save-Data / slow cellular connections and supporting on-demand hover/focus.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

type NetworkInfoLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function isConstrainedNetwork(): boolean {
  const nav = navigator as Navigator & {connection?: NetworkInfoLike};
  const conn = nav.connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}

function scheduleIdle(task: () => void): void {
  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: {timeout: number}) => number;
  };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(task, {timeout: 2500});
    return;
  }
  window.setTimeout(task, 1);
}

if (ExecutionEnvironment.canUseDOM && process.env.NODE_ENV === 'production') {
  let started = false;
  const startSearchPrefetch = (): void => {
    if (started) return;
    started = true;
    void import('@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js')
      .then(({fetchIndexesByWorker}) => fetchIndexesByWorker('/', ''))
      .catch(() => undefined);
  };

  const isSearchTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        '.navbar__search, [class*="searchBar"], input[type="search"], [aria-label*="Search"], [aria-label*="搜索"]',
      ),
    );
  };

  const attachInteractionPrefetch = (): void => {
    const onIntent = (event: Event): void => {
      if (!isSearchTarget(event.target)) return;
      document.removeEventListener('pointerenter', onIntent, true);
      document.removeEventListener('focusin', onIntent, true);
      startSearchPrefetch();
    };
    document.addEventListener('pointerenter', onIntent, {
      capture: true,
      passive: true,
    });
    document.addEventListener('focusin', onIntent, {
      capture: true,
      passive: true,
    });
  };

  const waitForPreviews = (task: () => void): void => {
    const root = document.getElementById('__docusaurus') ?? document.body;
    if (!document.querySelector('.qk-docs-preview-fallback')) {
      task();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.qk-docs-preview-fallback')) {
        observer.disconnect();
        task();
      }
    });
    observer.observe(root, {childList: true, subtree: true});
    window.setTimeout(() => {
      observer.disconnect();
      task();
    }, 8000);
  };

  attachInteractionPrefetch();
  if (!isConstrainedNetwork()) {
    scheduleIdle(() => waitForPreviews(startSearchPrefetch));
  }
}
