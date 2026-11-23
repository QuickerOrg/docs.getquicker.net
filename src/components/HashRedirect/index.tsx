import {useEffect, useRef} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';

type HashRouteGroup = {
  to: string;
  hashes: readonly string[];
};

type Props = {
  fromPath: string;
  routes?: readonly HashRouteGroup[];
  aliases?: Readonly<Record<string, string>>;
};

function encodeTarget(target: string): string {
  const hashIdx = target.indexOf('#');
  if (hashIdx === -1) return target;
  const page = target.slice(0, hashIdx);
  const id = target.slice(hashIdx + 1);
  return `${page}#${encodeURIComponent(id)}`;
}

/** Redirects legacy section hashes to split/archived pages without breaking external links. */
export default function HashRedirect({fromPath, routes = [], aliases}: Props) {
  const {pathname, hash} = useLocation();
  const history = useHistory();
  const redirectedId = useRef<string | null>(null);

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/$/, '') || '/';
    const normalizedFrom = fromPath.replace(/\/$/, '') || '/';
    if (normalizedPath !== normalizedFrom || !hash || hash === '#') {
      return;
    }
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    if (redirectedId.current === id) {
      return;
    }
    const aliasTarget = aliases?.[id];
    if (aliasTarget) {
      redirectedId.current = id;
      history.replace(encodeTarget(aliasTarget));
      return;
    }
    for (const group of routes) {
      if (group.hashes.includes(id)) {
        redirectedId.current = id;
        history.replace(`${group.to}#${encodeURIComponent(id)}`);
        return;
      }
    }
  }, [pathname, hash, fromPath, routes, aliases, history]);

  return null;
}
