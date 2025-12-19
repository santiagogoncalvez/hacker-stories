import { useCallback, useEffect, useReducer, useState } from 'react';
import { storiesReducer } from '../reducers/storiesReducer.ts';
import { getAsyncStories } from '../services/getAsyncStories.ts';
import { getUrl } from '../constants/apiEndpoints.ts';
import { extractPage, getLastSearches } from '../utils/searches.ts';
import { Story } from '../types/types.ts';
import { extractSearchTerm } from '../utils/searches.ts';

export function useStories({ search }: { search: string }) {
  const [urls, setUrls] = useState([getUrl(search, 0)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: {
      hits: [],
      page: 0,
    },
    isLoading: false,
    isLoadingMore: false,
    isNoResults: false,
    isError: false,
  });

  const getNews = useCallback(async ({ urls }: { urls: string[] }) => {
    console.log("getNews");
    if (!urls) return;
    if (urls[urls.length - 2] === urls[urls.length - 1]) return;

    const lastUrl = urls[urls.length - 1];
    extractPage(lastUrl) === 0
      ? dispatchStories({ type: 'STORIES_FETCH_INIT' })
      : dispatchStories({ type: 'STORIES_FETCH_MORE_INIT' });

    try {
      let data = await getAsyncStories({ url: lastUrl });

      // Esto funciona ya que la última url es la que no tiene resultados, entonces como no se actualiza la ultima url, siempre va a dar sin resultados hasta que cambie la búsqueda.
      // Para mejorar esto
      if (data?.hits.length === 0) {
        dispatchStories({ type: 'SEARCH_NO_RESULTS' });
      } else {
        dispatchStories({ type: 'SEARCH_START_RESULTS' });
      }

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: data || {
          hits: [],
          page: 0,
        },
      });
    } catch (e) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, []);

  // Hacer petición de datos de historias
  useEffect(() => {
    getNews({ urls });
  }, [urls, getNews]);

  const handleSearch = (searchTerm: string, page: number) => {
    const newUrl = getUrl(searchTerm, page);
    setUrls(urls.concat(newUrl));
  };
  const searchAction = () => {
    handleSearch(search, 0);
  };
  const handleRemoveStory = (item: Story) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };
  const handleMoreStories = () => {
    const lastUrl = urls[urls.length - 1];
    const search = extractSearchTerm(lastUrl);
    handleSearch(search, stories.data.page + 1);
  };

  const lastSearches = getLastSearches(urls);

  return {
    urls,
    setUrls,
    stories,
    dispatchStories,
    handleSearch,
    searchAction,
    handleRemoveStory,
    handleMoreStories,
    lastSearches,
  };
}
