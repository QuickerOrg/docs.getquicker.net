function normalizePath(pathname) {
  return pathname.replace(/\/$/, '') || '/';
}

function encodeTarget(target) {
  const hashIdx = target.indexOf('#');
  if (hashIdx === -1) return target;
  const page = target.slice(0, hashIdx);
  const id = target.slice(hashIdx + 1);
  return `${page}#${encodeURIComponent(id)}`;
}

function resolveHashRedirect({pathname, hash, fromPath, routes = [], aliases, defaultTo}) {
  const normalizedPath = normalizePath(pathname);
  const normalizedFrom = normalizePath(fromPath);
  if (normalizedPath !== normalizedFrom) {
    return null;
  }

  if (!hash || hash === '#') {
    if (!defaultTo) {
      return null;
    }
    const hashIdx = defaultTo.indexOf('#');
    const rawPage = hashIdx === -1 ? defaultTo : defaultTo.slice(0, hashIdx);
    const targetId = hashIdx === -1 ? '' : defaultTo.slice(hashIdx + 1);
    const targetPath = normalizePath(rawPage || normalizedFrom);
    if (targetPath === normalizedFrom && !targetId) {
      return null;
    }
    return {
      sourceId: '__default__',
      targetPath,
      targetId,
      target: encodeTarget(defaultTo),
      isSamePage: targetPath === normalizedFrom,
    };
  }

  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }

  const aliasTarget = aliases?.[id];
  if (aliasTarget) {
    const hashIdx = aliasTarget.indexOf('#');
    const rawPage = hashIdx === -1 ? aliasTarget : aliasTarget.slice(0, hashIdx);
    const targetId = hashIdx === -1 ? '' : aliasTarget.slice(hashIdx + 1);
    const targetPath = normalizePath(rawPage || normalizedFrom);
    if (targetPath === normalizedFrom && targetId === id) {
      return null;
    }
    return {
      sourceId: id,
      targetPath,
      targetId,
      target: encodeTarget(aliasTarget),
      isSamePage: targetPath === normalizedFrom,
    };
  }

  for (const group of routes) {
    if (group.hashes.includes(id)) {
      const targetPath = normalizePath(group.to);
      if (targetPath === normalizedFrom) {
        return null;
      }
      return {
        sourceId: id,
        targetPath,
        targetId: id,
        target: `${group.to}#${encodeURIComponent(id)}`,
        isSamePage: false,
      };
    }
  }

  if (defaultTo) {
    const hashIdx = defaultTo.indexOf('#');
    if (hashIdx === -1) {
      const targetBase = defaultTo.replace(/\/$/, '') || '/';
      const targetPath = normalizePath(defaultTo);
      if (targetPath === normalizedFrom) {
        return null;
      }
      return {
        sourceId: id,
        targetPath,
        targetId: id,
        target: `${targetBase}#${encodeURIComponent(id)}`,
        isSamePage: false,
      };
    }
    const rawPage = defaultTo.slice(0, hashIdx);
    const targetId = defaultTo.slice(hashIdx + 1);
    const targetPath = normalizePath(rawPage || normalizedFrom);
    if (targetPath === normalizedFrom && targetId === id) {
      return null;
    }
    return {
      sourceId: id,
      targetPath,
      targetId,
      target: encodeTarget(defaultTo),
      isSamePage: targetPath === normalizedFrom,
    };
  }

  return null;
}

function createHashRedirectTracker() {
  let activeSourceKey = null;

  return {
    reset() {
      activeSourceKey = null;
    },
    next(input) {
      const resolved = resolveHashRedirect(input);
      if (!resolved) {
        activeSourceKey = null;
        return null;
      }
      const sourceKey = `${normalizePath(input.pathname)}#${resolved.sourceId}`;
      if (activeSourceKey === sourceKey) {
        return null;
      }
      activeSourceKey = sourceKey;
      return resolved;
    },
  };
}

module.exports = {
  encodeTarget,
  resolveHashRedirect,
  createHashRedirectTracker,
};
