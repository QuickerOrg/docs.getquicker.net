import React, {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';

export type PreviewKind = 'heavy' | 'light';

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
 * SSR and the hydration pass must render the same tree. `canUseDOM` is true
 * during hydration, so branching on it (fallback vs Suspense) trips React 19
 * error #418 and can leave the article empty. HTML preload can also resolve
 * `React.lazy` before hydrate; rendering the real component then mismatches
 * the SSR fallback. Mount first, then open the Suspense boundary.
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

/**
 * Theme-level MDX components stay named globally, but their implementation
 * is an async chunk. Pages that never render the tag never download it.
 */
export function lazyMdx<P extends object>(
  importer: () => Promise<{default: ComponentType<P>}>,
): ComponentType<P> {
  const LazyComp = lazy(importer);

  function LazyMdxComponent(props: P): ReactNode {
    const fallback = <PreviewFallback kind="light" />;
    const errorFallback = <PreviewFallback kind="light" failed />;
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
