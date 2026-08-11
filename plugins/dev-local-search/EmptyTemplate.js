// @ts-nocheck
import {translate} from '@docusaurus/Translate';
import {iconNoResults} from '@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/icons';

export function EmptyTemplate() {
  return `<span class="qk-search-no-results"><span class="qk-search-no-results__icon">${iconNoResults}</span><span>${translate(
    {
      id: 'theme.SearchBar.noResultsText',
      message: 'No results',
    },
  )}</span></span>`;
}
