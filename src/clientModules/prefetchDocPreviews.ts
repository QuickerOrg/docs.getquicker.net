/**
 * Kick preview chunks as soon as main.js runs when the SSR HTML already
 * contains fallback markers (do not wait for React.lazy / AfterHydrate).
 * Also start matching module JSON so param forms avoid a second waterfall.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {loadModuleDef} from '@site/data/xaction/modules-index';
import {
  loadActionEditorPreview,
  loadHeavyPreviewHost,
} from '@site/src/theme/lazyMdxComponent';

function prefetchIfNeeded(): void {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  if (document.querySelector('[data-qk-preview="heavy"]')) {
    void loadHeavyPreviewHost();
  }
  if (document.querySelector('[data-qk-preview="editor"]')) {
    void loadActionEditorPreview();
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
