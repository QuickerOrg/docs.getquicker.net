import {useCallback, useEffect, useRef} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import {
  createHashRedirectTracker,
  type HashRouteGroup,
} from './resolveHashRedirect';

type Props = {
  fromPath: string;
  routes?: readonly HashRouteGroup[];
  aliases?: Readonly<Record<string, string>>;
  defaultTo?: string;
};

/** Redirects legacy section hashes to split/archived pages without breaking external links. */
export default function HashRedirect({fromPath, routes = [], aliases, defaultTo}: Props) {
  const {pathname, hash} = useLocation();
  const history = useHistory();
  const trackerRef = useRef<ReturnType<typeof createHashRedirectTracker> | null>(null);
  if (!trackerRef.current) {
    trackerRef.current = createHashRedirectTracker();
  }

  const applyRedirect = useCallback(
    (currentPath: string, currentHash: string) => {
      const result = trackerRef.current!.next({
        pathname: currentPath,
        hash: currentHash,
        fromPath,
        routes,
        aliases,
        defaultTo,
      });
      if (!result) {
        return;
      }
      history.replace(result.target);
      if (result.isSamePage && result.targetId) {
        window.requestAnimationFrame(() => {
          document.getElementById(result.targetId)?.scrollIntoView();
        });
      }
    },
    [fromPath, routes, aliases, defaultTo, history],
  );

  useEffect(() => {
    applyRedirect(pathname, hash);
  }, [pathname, hash, applyRedirect]);

  useEffect(() => {
    const onHashChange = () => {
      trackerRef.current?.reset();
      applyRedirect(window.location.pathname, window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [applyRedirect]);

  return null;
}
