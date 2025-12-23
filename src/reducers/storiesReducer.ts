import { StoriesAction, StoriesState } from '../types/types';

export const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  const { dataType } = action;

  switch (action.type) {
    case 'RESET_LIST':
      return {
        ...state,
        search: '',
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            hits: [],
            page: 0,
            isLoading: false,
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
      return {
        ...state,
        lists: {
          ...state.lists,
          [dataType]: {
            ...state.lists[dataType],
            hits:
              state.lists[dataType].page === 0
                ? action.hits // fetch inicial o reset
                : [...state.lists[dataType].hits, ...action.hits], // concatenar para "more"
            page: action.page,
            isLoading: false,
            isLoadingMore: false,
            isNoResults: action.hits.length === 0,
            isError: false,
            needsFetch: false,
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
            needsFetch: true, // permite fetch de la siguiente página
          },
        },
      };

    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload,
        lists: {
          story: { ...state.lists.story, hits: [], page: 0, needsFetch: true },
          comment: {
            ...state.lists.comment,
            hits: [],
            page: 0,
            needsFetch: true,
          },
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

    default:
      throw new Error('Unhandled action type');
  }
};
