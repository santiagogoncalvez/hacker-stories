import { REDUCER_TYPES } from '../constants/reducerTypes.js';

export const storiesReducer = (state, action) => {
    switch (action.type) {
        case REDUCER_TYPES.SET_STORIES: {
            return action.payload;
        }
        case REDUCER_TYPES.REMOVE_STORY: {
            return state.filter((story) => action.payload.objectID != story.objectID);
        }
        default: {
            throw new Error();
        }
    }
};