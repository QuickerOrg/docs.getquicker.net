export type HashRouteGroup = {
  to: string;
  hashes: readonly string[];
};

export type HashRedirectInput = {
  pathname: string;
  hash: string;
  fromPath: string;
  routes?: readonly HashRouteGroup[];
  aliases?: Readonly<Record<string, string>>;
  defaultTo?: string;
};

export type HashRedirectResult = {
  sourceId: string;
  targetPath: string;
  targetId: string;
  target: string;
  isSamePage: boolean;
};

export function encodeTarget(target: string): string;
export function resolveHashRedirect(input: HashRedirectInput): HashRedirectResult | null;
export function createHashRedirectTracker(): {
  reset(): void;
  next(input: HashRedirectInput): HashRedirectResult | null;
};
