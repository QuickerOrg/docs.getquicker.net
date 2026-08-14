import React, {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export type PreviewKind = 'heavy' | 'light' | 'editor';

type PreviewFallbackProps = {
  kind?: PreviewKind;
  label?: string;
  moduleKey?: string;
  failed?: boolean;
};

/** Placeholder while a docs preview chunk downloads. */
export function PreviewFallback({
  kind = 'light',
  label = '正在加载预览',
  moduleKey,
  failed = false,
}: PreviewFallbackProps): ReactNode {
  return (
    <div
      className={
        failed
          ? 'qk-docs-preview-fallback qk-docs-preview-fallback--error'
          : 'qk-docs-preview-fallback'
      }
      data-qk-preview={kind}
      data-qk-module={moduleKey || undefined}
      role={failed ? 'alert' : 'status'}
      aria-label={failed ? '预览加载失败' : label}
    />
  );
}

class LazyPreviewErrorBoundary extends Component<
  {fallback: ReactNode; children: ReactNode},
  {hasError: boolean}
> {
  state = {hasError: false};

  static getDerivedStateFromError(): {hasError: boolean} {
    return {hasError: true};
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * SSR and the hydration pass must render the same fallback. After mount,
 * open Suspense. Chunk download is kicked separately (see `warm`) so it
 * overlaps hydration instead of waiting for this effect.
 */
function AfterHydrate({
  fallback,
  errorFallback,
  children,
}: {
  fallback: ReactNode;
  errorFallback: ReactNode;
  children: ReactNode;
}): ReactNode {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return fallback;
  }
  return (
    <Suspense fallback={fallback}>
      <LazyPreviewErrorBoundary fallback={errorFallback}>
        {children}
      </LazyPreviewErrorBoundary>
    </Suspense>
  );
}

function cachedImporter<T>(
  importer: () => Promise<T>,
): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => {
    if (!promise) {
      promise = importer();
    }
    return promise;
  };
}

/**
 * Theme-level MDX components stay named globally, but their implementation
 * is an async chunk. Pages that never render the tag never download it.
 */
export function lazyMdx<P extends object>(
  importer: () => Promise<{default: ComponentType<P>}>,
  options?: {kind?: Exclude<PreviewKind, 'heavy'>},
): ComponentType<P> {
  const kind = options?.kind ?? 'light';
  const load = cachedImporter(importer);
  const LazyComp = lazy(load);

  function LazyMdxComponent(props: P): ReactNode {
    // Start the chunk during the hydration paint; do not wait for useEffect.
    if (ExecutionEnvironment.canUseDOM) {
      void load();
    }
    const fallback = <PreviewFallback kind={kind} />;
    const errorFallback = <PreviewFallback kind={kind} failed />;
    return (
      <AfterHydrate fallback={fallback} errorFallback={errorFallback}>
        <LazyComp {...props} />
      </AfterHydrate>
    );
  }

  return LazyMdxComponent;
}

type HeavyHostProps = {component: string} & Record<string, unknown>;

/** Named chunk so HTML preload / client prefetch share one file. */
export function loadHeavyPreviewHost(): Promise<{
  default: ComponentType<HeavyHostProps>;
}> {
  return loadHeavy();
}

const loadHeavy = cachedImporter(() =>
  import(
    /* webpackChunkName: "qk-heavy-preview" */
    './mdxHeavyPreviewHost'
  ) as Promise<{default: ComponentType<HeavyHostProps>}>,
);

/** Named chunk for the action-editor preview (catalog lives inside). */
export function loadActionEditorPreview(): Promise<{
  default: ComponentType<Record<string, unknown>>;
}> {
  return loadEditor();
}

const loadEditor = cachedImporter(() =>
  import(
    /* webpackChunkName: "qk-action-editor-preview" */
    '@site/src/components/ActionEditorPreview'
  ) as Promise<{default: ComponentType<Record<string, unknown>>}>,
);

/** One lazy() so step/param previews share a single async chunk. */
const HeavyPreviewHost = lazy(loadHeavy) as ComponentType<HeavyHostProps>;

const LazyActionEditor = lazy(loadEditor) as ComponentType<
  Record<string, unknown>
>;

export function lazyHeavy<P extends object>(name: string): ComponentType<P> {
  function LazyHeavyComponent(props: P): ReactNode {
    const moduleKey =
      props &&
      typeof props === 'object' &&
      'moduleKey' in props &&
      typeof (props as {moduleKey?: unknown}).moduleKey === 'string'
        ? (props as {moduleKey: string}).moduleKey
        : undefined;
    if (ExecutionEnvironment.canUseDOM) {
      void loadHeavy();
    }
    const fallback = <PreviewFallback kind="heavy" moduleKey={moduleKey} />;
    const errorFallback = (
      <PreviewFallback kind="heavy" moduleKey={moduleKey} failed />
    );
    return (
      <AfterHydrate fallback={fallback} errorFallback={errorFallback}>
        <HeavyPreviewHost
          component={name}
          {...(props as Record<string, unknown>)}
        />
      </AfterHydrate>
    );
  }
  return LazyHeavyComponent;
}

/** Action editor preview: own chunk + early warm + HTML preload marker. */
export function lazyActionEditor<P extends object>(): ComponentType<P> {
  function LazyEditorComponent(props: P): ReactNode {
    if (ExecutionEnvironment.canUseDOM) {
      void loadEditor();
    }
    const fallback = <PreviewFallback kind="editor" />;
    const errorFallback = <PreviewFallback kind="editor" failed />;
    return (
      <AfterHydrate fallback={fallback} errorFallback={errorFallback}>
        <LazyActionEditor {...(props as Record<string, unknown>)} />
      </AfterHydrate>
    );
  }
  return LazyEditorComponent;
}
