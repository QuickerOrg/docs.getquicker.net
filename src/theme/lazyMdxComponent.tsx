import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, {
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from 'react';

/** Placeholder while a docs preview chunk downloads. */
export function PreviewFallback(): ReactNode {
  return (
    <div
      className="qk-docs-preview-fallback"
      role="status"
      aria-label="正在加载预览"
    />
  );
}

/**
 * Theme-level MDX components stay named globally, but their implementation
 * is an async chunk. Pages that never render the tag never download it.
 *
 * SSR emits the same fallback as the first client paint to avoid hydration
 * mismatch (Docusaurus uses renderToString, which cannot wait on React.lazy).
 */
export function lazyMdx<P extends object>(
  importer: () => Promise<{default: ComponentType<P>}>,
): ComponentType<P> {
  const LazyComp = lazy(importer);

  function LazyMdxComponent(props: P): ReactNode {
    if (!ExecutionEnvironment.canUseDOM) {
      return <PreviewFallback />;
    }
    return (
      <Suspense fallback={<PreviewFallback />}>
        <LazyComp {...props} />
      </Suspense>
    );
  }

  return LazyMdxComponent;
}

type HeavyHostProps = {component: string} & Record<string, unknown>;

/** One lazy() so catalog-coupled previews share a single async chunk. */
const HeavyPreviewHost = lazy(
  () => import('./mdxHeavyPreviewHost'),
) as ComponentType<HeavyHostProps>;

export function lazyHeavy<P extends object>(name: string): ComponentType<P> {
  function LazyHeavyComponent(props: P): ReactNode {
    if (!ExecutionEnvironment.canUseDOM) {
      return <PreviewFallback />;
    }
    return (
      <Suspense fallback={<PreviewFallback />}>
        <HeavyPreviewHost
          component={name}
          {...(props as Record<string, unknown>)}
        />
      </Suspense>
    );
  }
  return LazyHeavyComponent;
}
