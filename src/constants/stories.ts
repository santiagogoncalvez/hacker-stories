import { ListState, StoriesState } from "../types/types";

export const MAX_LAST_SEARCHES = 6;
export const LAST_SEARCHES_KEY = 'hn:lastSearches';
export const SUPPORTED_DATA_TYPES = ['story', 'comment'] as const;
export const emptyList: ListState = {
  hits: [],
  page: 0,
  isLoading: false,
  isLoadingMore: false,
  isNoResults: false,
  isError: false,
  needsFetch: true,
  dataType: null,
  nbHits: 0,
  nbPages: 0, // Campo para el total de páginas
  processingTimeMs: 0,
};

export const initialState: StoriesState = {
  search: '',
  searchByType: { story: '', comment: '' },
  lastSearches: [],
  lists: {
    story: { ...emptyList, dataType: 'story' },
    comment: { ...emptyList, dataType: 'comment' },
    fallback: { ...emptyList, dataType: 'fallback' },
  },
};
