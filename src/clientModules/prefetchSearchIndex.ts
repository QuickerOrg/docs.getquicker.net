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
  scheduleIdle(() => {
    void import('@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js')
      .then(({fetchIndexesByWorker}) => fetchIndexesByWorker('/', ''))
      .catch(() => undefined);
  });
}
