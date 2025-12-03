import { StoriesState, StoriesAction } from '../types/types.ts';

export const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT': {
      return { ...state, isLoading: true, isError: false };
    }
    case 'STORIES_FETCH_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    }
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
        data: state.data.filter(
          (story) => action.payload.objectId != story.objectId,
        ),
      };
    }
    default: {
      throw new Error();
    }
  }
};
