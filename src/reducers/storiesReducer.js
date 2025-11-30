import { REDUCER_TYPES } from '../constants/reducerTypes.js';

export const storiesReducer = (state, action) => {
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
    case REDUCER_TYPES.SET_STORIES: {
      return { ...state, data: action.payload };
    }
    case REDUCER_TYPES.REMOVE_STORY: {
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
