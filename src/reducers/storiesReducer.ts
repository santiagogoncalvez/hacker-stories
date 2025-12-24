import { StoriesAction, StoriesState } from '../types/types';

export const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  const { dataType } = action;

  switch (action.type) {
    case 'RESET_LIST':
      // No vaciamos hits para evitar parpadeos: marcamos la lista para re-fetch
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            // mantenemos hits hasta que llegue FETCH_SUCCESS
            page: 0,
            isLoading: true,
            isLoadingMore: false,
            isNoResults: false,
            isError: false,
            needsFetch: true,
          },
        },
      };

    case 'FETCH_INIT':
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            isLoading: true,
            isError: false,
            // don't clear hits here to avoid flicker
          },
        },
      };

    case 'FETCH_MORE_INIT':
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            isLoadingMore: true,
            isError: false,
          },
        },
      };

    case 'FETCH_SUCCESS':
      console.log(action);
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            hits:
              state.lists[dataType].page === 0
                ? action.hits // replace on page 0
                : [...state.lists[dataType].hits, ...action.hits], // concat for more
            page: action.page,
            isLoading: false,
            isLoadingMore: false,
            isNoResults: action.hits.length === 0,
            isError: false,
            needsFetch: false,
            nbHits: action.nbHits,
            processingTimeMs: action.processingTimeMs,
          },
        },
      };

    case 'FETCH_FAILURE':
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            isLoading: false,
            isLoadingMore: false,
            isError: true,
            needsFetch: false,
          },
        },
      };

    case 'INCREMENT_PAGE':
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            page: state.lists[dataType].page + 1,
            needsFetch: true,
          },
        },
      };

    case 'SET_SEARCH':
      // If dataType provided, update only that dataType and do NOT clear hits
      if (dataType) {
        return {
          ...state,
          searchByType: {
            ...state.searchByType,
            [dataType]: action.payload,
          },
          search: action.payload,
          lists: {
            ...state.lists,
            [dataType]: {
              ...state.lists[dataType],
              page: 0,
              needsFetch: true,
              isLoading: true,
              // keep hits until FETCH_SUCCESS
            },
          },
        };
      }

      // fallback: set global search and mark both main lists for fetch, but don't immediately wipe hits
      return {
        ...state,
        search: action.payload,
        searchByType: Object.keys(state.searchByType).reduce((acc, k) => {
          // @ts-ignore
          acc[k] = action.payload;
          return acc;
        }, {} as any),
        lists: {
          story: {
            ...state.lists.story,
            page: 0,
            needsFetch: true,
            isLoading: true,
          },
          comment: {
            ...state.lists.comment,
            page: 0,
            needsFetch: true,
            isLoading: true,
          },
          ...Object.keys(state.lists)
            .filter((k) => k !== 'story' && k !== 'comment')
            .reduce((acc, key) => {
              // @ts-ignore
              acc[key] = state.lists[key];
              return acc;
            }, {} as any),
        },
      };

    case 'REMOVE_STORY':
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            hits: state.lists[dataType].hits.filter(
              (story) => story.objectId !== action.payload.objectId,
            ),
          },
        },
      };

    case 'SET_LAST_SEARCHES':
      return {
        ...state,
        lastSearches: action.payload,
      };

    default:
      throw new Error('Unhandled action type');
  }
};