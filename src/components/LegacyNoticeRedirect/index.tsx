import {useEffect, useRef} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';

/** Keep version links shared before the installation page was shortened. */
export default function LegacyNoticeRedirect({hashes}: {hashes: readonly string[]}) {
  const {pathname, hash} = useLocation();
  const history = useHistory();
  const redirectedId = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.replace(/\/$/, '') !== '/important-notice') {
      return;
    }
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    if (hashes.includes(id) && redirectedId.current !== id) {
      // A lazy route may keep this page mounted during the transition.
      redirectedId.current = id;
      history.replace(`/v2/migration/upgrade-and-rollback#${encodeURIComponent(id)}`);
    }
  }, [pathname, hash, hashes, history]);

  return null;
}
