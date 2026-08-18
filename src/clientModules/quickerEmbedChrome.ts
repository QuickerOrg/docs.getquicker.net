/**
 * Compact chrome when docs are shown inside Quicker (iframe or ?embed=1).
 * The same flag is applied in ssrTemplate before first paint.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function shouldUseEmbedChrome(): boolean {
  try {
    if (window.self !== window.top) {
      return true;
    }
    return new URLSearchParams(window.location.search).get('embed') === '1';
  } catch {
    return true;
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
