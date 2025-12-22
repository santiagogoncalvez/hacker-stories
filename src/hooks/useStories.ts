import { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { storiesReducer } from '../reducers/storiesReducer';
import { getAsyncStories } from '../services/getAsyncStories';
import { getUrl } from '../constants/apiEndpoints';
import { StoriesState, ListState, Story } from '../types/types';
import { useStorageState } from './useStorageState';

const emptyList: ListState = {
  hits: [],
  page: 0,
  isLoading: false,
  isLoadingMore: false,
  isNoResults: false,
  isError: false,
  needsFetch: true,
  dataType: null,
};

const initialState: StoriesState = {
  search: '',
  lists: {
    story: { ...emptyList, dataType: 'story' },
    comment: { ...emptyList, dataType: 'comment' },
  },
};

export function useStories(initialSearch = '') {
  const { pathname } = useLocation();

  const dataType =
    pathname === '/' ? 'story' : pathname === '/comments' ? 'comment' : null;

  const [state, dispatch] = useReducer(storiesReducer, initialState, (s) => ({
    ...s,
    search: initialSearch,
  }));

  const activeList = dataType ? state.lists[dataType] : null;

  /* ================= Reset on route change ================= */
  useEffect(() => {
    if (!dataType) return;
    dispatch({ type: 'RESET_LIST', dataType });
  }, [dataType]);

  /* ================= Fetch ================= */
  useEffect(() => {
    if (!dataType || !activeList) return;

    if (!activeList.needsFetch) return;

    dispatch({ type: 'FETCH_INIT', dataType });

    getAsyncStories({
      url: getUrl(state.search, activeList.page, dataType),
    })
      .then((res) => {
        dispatch({
          type: 'FETCH_SUCCESS',
          dataType,
          hits: res?.hits ?? [],
          page: res?.page ?? 0,
        });
      })
      .catch(() => {
        dispatch({ type: 'FETCH_FAILURE', dataType });
      });
  }, [dataType, state.search, activeList?.needsFetch]);

  /* ================= Actions ================= */
  const searchAction = (term: string) => {
    dispatch({ type: 'SET_SEARCH', payload: term });
  };

  const handleMoreStories = () => {
    if (!dataType) return;
    dispatch({ type: 'INCREMENT_PAGE', dataType });
  };

  const handleRemoveStory = (item: Story) => {
    if (!dataType) return;
    dispatch({ type: 'REMOVE_STORY', dataType, payload: item });
  };

  return {
    stories: activeList,
    search: state.search,
    searchAction,
    handleMoreStories,
    handleRemoveStory,
  };
}
