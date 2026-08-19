/**
 * Compact site chrome only when the URL has ?embed=1 (Quicker module-help iframe).
 * Do not key off iframe: Cursor / in-app browsers also have window.self !== top.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function shouldUseEmbedChrome(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('embed') === '1';
  } catch {
    return false;
  }
}

function applyQuickerEmbedChrome(): void {
  if (shouldUseEmbedChrome()) {
    document.documentElement.setAttribute('data-qk-embed', '');
  }
}

if (ExecutionEnvironment.canUseDOM) {
  applyQuickerEmbedChrome();
}
