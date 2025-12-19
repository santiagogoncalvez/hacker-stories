import { StoriesState, StoriesAction } from '../types/types.ts';

export const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT': {
      return { ...state, isLoading: true, isError: false };
    }
    case 'STORIES_FETCH_MORE_INIT': {
      return { ...state, isLoadingMore: true, isError: false };
    }
    case 'STORIES_FETCH_SUCCESS':
      if (state.isLoadingMore) {
        return {
          ...state,
          isLoading: false,
          isLoadingMore: false,
          data: {
            hits: [...state.data.hits, ...action.payload.hits], // concatena
            page: action.payload.page,
          },
        };
      }
      return {
        ...state,
        isLoading: false,
        data: action.payload, // reemplaza solo si es fetch inicial
      };

    case 'STORIES_FETCH_FAILURE': {
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    }

    case 'REMOVE_STORY': {
      return {
        ...state,
        data: {
          ...state.data,
          hits: state.data.hits.filter(
            (story) => action.payload.objectId != story.objectId,
          ),
        },
      };
    }

    case 'SEARCH_NO_RESULTS': {
      return {
        ...state,
        isNoResults: true,
      };
    }

    case 'SEARCH_START_RESULTS': {
      return {
        ...state,
        isNoResults: false,
      };
    }

    default: {
      throw new Error();
    }
  }
};
