import { StoriesState, Story } from '../types/types';

// Discriminated Union para las acciones originales
export type StoriesAction =
  | { type: 'RESET_LIST'; dataType: string }
  | { type: 'FETCH_INIT'; dataType: string }
  | { type: 'FETCH_MORE_INIT'; dataType: string }
  | {
      type: 'FETCH_SUCCESS';
      dataType: string;
      hits: Story[];
      page: number;
      nbHits: number;
      processingTimeMs: number;
    }
  | { type: 'FETCH_FAILURE'; dataType: string }
  | { type: 'INCREMENT_PAGE'; dataType: string }
  | { type: 'SET_SEARCH'; dataType?: string; payload: string }
  | { type: 'REMOVE_STORY'; dataType: string; payload: { objectId: string } }
  | { type: 'SET_LAST_SEARCHES'; payload: string[] };

export const storiesReducer = (
  state: StoriesState,
  action: StoriesAction,
): StoriesState => {
  // Nota: No extraemos dataType aquí arriba porque no todas las acciones lo tienen.
  // TypeScript hará el "narrowing" automáticamente dentro de cada case.

  switch (action.type) {
    case 'RESET_LIST':
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.dataType]: {
            ...state.lists[action.dataType],
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
          [action.dataType]: {
            ...state.lists[action.dataType],
            isLoading: true,
            isError: false,
          },
        },
      };

    case 'FETCH_MORE_INIT':
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.dataType]: {
            ...state.lists[action.dataType],
            isLoadingMore: true,
            isError: false,
          },
        },
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.dataType]: {
            ...state.lists[action.dataType],
            hits:
              state.lists[action.dataType].page === 0
                ? action.hits
                : [...state.lists[action.dataType].hits, ...action.hits],
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
          [action.dataType]: {
            ...state.lists[action.dataType],
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
          [action.dataType]: {
            ...state.lists[action.dataType],
            page: state.lists[action.dataType].page + 1,
            needsFetch: true,
          },
        },
      };

    case 'SET_SEARCH':
      if (action.dataType) {
        return {
          ...state,
          searchByType: {
            ...state.searchByType,
            [action.dataType]: action.payload,
          },
          search: action.payload,
          lists: {
            ...state.lists,
            [action.dataType]: {
              ...state.lists[action.dataType],
              page: 0,
              needsFetch: true,
              isLoading: true,
            },
          },
        };
      }

      return {
        ...state,
        search: action.payload,
        searchByType: Object.keys(state.searchByType).reduce(
          (acc, k) => {
            acc[k] = action.payload;
            return acc;
          },
          {} as Record<string, string>,
        ),
        lists: {
          ...state.lists, // Mantenemos las otras listas si las hubiera
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
        },
      };

    case 'REMOVE_STORY':
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.dataType]: {
            ...state.lists[action.dataType],
            hits: state.lists[action.dataType].hits.filter(
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
