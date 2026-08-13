import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, {
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from 'react';

export type PreviewKind = 'heavy' | 'light';

type PreviewFallbackProps = {
  kind?: PreviewKind;
  label?: string;
  moduleKey?: string;
};

/** Placeholder while a docs preview chunk downloads. */
export function PreviewFallback({
  kind = 'light',
  label = '正在加载预览',
  moduleKey,
}: PreviewFallbackProps): ReactNode {
  return (
    <div
      className="qk-docs-preview-fallback"
      data-qk-preview={kind}
      data-qk-module={moduleKey || undefined}
      role="status"
      aria-label={label}
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
      return <PreviewFallback kind="light" />;
    }
    return (
      <Suspense fallback={<PreviewFallback kind="light" />}>
        <LazyComp {...props} />
      </Suspense>
    );
  }

  return LazyMdxComponent;
}

type HeavyHostProps = {component: string} & Record<string, unknown>;

/** Named chunk so HTML preload / client prefetch share one file. */
export function loadHeavyPreviewHost(): Promise<{
  default: ComponentType<HeavyHostProps>;
}> {
  return import(
    /* webpackChunkName: "qk-heavy-preview" */
    './mdxHeavyPreviewHost'
  ) as Promise<{default: ComponentType<HeavyHostProps>}>;
}

/** One lazy() so step/param previews share a single async chunk. */
const HeavyPreviewHost = lazy(
  loadHeavyPreviewHost,
) as ComponentType<HeavyHostProps>;

export function lazyHeavy<P extends object>(name: string): ComponentType<P> {
  function LazyHeavyComponent(props: P): ReactNode {
    const moduleKey =
      props &&
      typeof props === 'object' &&
      'moduleKey' in props &&
      typeof (props as {moduleKey?: unknown}).moduleKey === 'string'
        ? (props as {moduleKey: string}).moduleKey
        : undefined;
    const fallback = <PreviewFallback kind="heavy" moduleKey={moduleKey} />;
    if (!ExecutionEnvironment.canUseDOM) {
      return fallback;
    }
    return (
      <Suspense fallback={fallback}>
        <HeavyPreviewHost
          component={name}
          {...(props as Record<string, unknown>)}
        />
      </Suspense>
    );
  }
  return LazyHeavyComponent;
}
