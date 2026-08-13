/**
 * Kick the heavy preview chunk as soon as main.js runs when the SSR HTML
 * already contains a heavy fallback (do not wait for React.lazy to mount).
 * Also start the matching module JSON so param forms do not wait on a second
 * waterfall after the host chunk.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {loadModuleDef} from '@site/data/xaction/modules-index';
import {loadHeavyPreviewHost} from '@site/src/theme/lazyMdxComponent';

function prefetchIfNeeded(): void {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  if (document.querySelector('[data-qk-preview="heavy"]')) {
    void loadHeavyPreviewHost();
  }
  document.querySelectorAll('[data-qk-module]').forEach((node) => {
    const key = node.getAttribute('data-qk-module');
    if (key) {
      void loadModuleDef(key);
    }
  });
}

prefetchIfNeeded();

export function onRouteDidUpdate(): void {
  prefetchIfNeeded();
}
