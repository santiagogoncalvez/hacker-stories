import { Sort } from '../types/types';

const API_BASE = 'https://hn.algolia.com/api/v1';

const API_SEARCH = '/search';
const API_SEARCH_BY_DATE = '/search_by_date';

const PARAM_TAG = 'tags=';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

export const API_ENDPOINT =
  'https://hn.algolia.com/api/v1/search?tags=story&query=';

export const API_ENDPOINT_LAST_STORIES =
  'https://hn.algolia.com/api/v1/search_by_date?tags=story';

export const getUrl = (
  searchTerm: string,
  page: number,
  dataType: string,
  sort: Sort,
) => {
  const endpoint =
    sort === 'DATE'
      ? API_SEARCH_BY_DATE
      : API_SEARCH;

  return `${API_BASE}${endpoint}?${PARAM_TAG}${dataType}&${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;
};