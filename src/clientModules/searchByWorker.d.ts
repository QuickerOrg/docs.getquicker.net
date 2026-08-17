declare module '@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker.js' {
  export function fetchIndexesByWorker(
    baseUrl: string,
    searchContext: string,
  ): Promise<void>;
  export function searchByWorker(
    baseUrl: string,
    searchContext: string,
    input: string,
    limit: number,
  ): Promise<unknown[]>;
}
