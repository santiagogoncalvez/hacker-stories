const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_TAG = 'tags=';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

export const API_ENDPOINT =
  'https://hn.algolia.com/api/v1/search?tags=story&query=';

export const API_ENDPOINT_LAST_STORIES =
  'http://hn.algolia.com/api/v1/search_by_date?tags=story';

export const getUrl = (searchTerm: string, page: number, dataType: string) =>
  `${API_BASE}${API_SEARCH}?${PARAM_TAG}${dataType}&${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

