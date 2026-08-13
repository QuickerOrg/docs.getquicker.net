/**
 * Warm the local-search worker after first paint so the navbar search is
 * not blocked on downloading / hydrating the lunr index.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

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
  const startSearchPrefetch = (): void => {
    void import('@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js')
      .then(({fetchIndexesByWorker}) => fetchIndexesByWorker('/', ''))
      .catch(() => undefined);
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

  scheduleIdle(() => waitForPreviews(startSearchPrefetch));
}
