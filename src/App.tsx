import { useCallback, useEffect, useReducer, useState } from 'react';
import { useStorageState } from './hooks/useStorageState.ts';
import List from './components/List.tsx';
import SearchForm from './components/SearchForm.tsx';
import { storiesReducer } from './reducers/storiesReducer.ts';
import { getAsyncStories } from './services/getAsyncStories.ts';
import './App.css';
import { Story, StoriesState } from './types/types.ts';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?tags=story&query=';

const API_ENDPOINT_LAST_STORIES =
  'http://hn.algolia.com/api/v1/search_by_date?tags=story';

const getSumComments = (stories: StoriesState) => {
  // console.log('C');
  return stories.data.reduce(
    (result: number, value: Story) => result + value.numComments,
    0,
  );
};

const App = () => {
  // console.log('B:App');

  const [search, setSearch] = useStorageState('search', '');

  const [url, setUrl] = useState(
    search ? `${API_ENDPOINT}${search}` : API_ENDPOINT_LAST_STORIES,
  );
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const getNews = useCallback(async ({ url }: { url: string }) => {
    if (!url) return;
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const stories = await getAsyncStories({ url });
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: stories || [],
      });
    } catch (e) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, []);

  // Hacer petición de datos de historias
  useEffect(() => {
    getNews({ url });
  }, [url, getNews]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const searchAction = () => {
    setUrl(`${API_ENDPOINT}${search}`);
  };

  const handleRemoveStory = (item: Story) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const sumComments = getSumComments(stories);

  return (
    <div className="app">
      <h1>Hacker Stories</h1>

      <div className="searchControls">
        <SearchForm
          search={search}
          handleSearchInput={handleSearchInput}
          searchAction={searchAction}
        />
      </div>

      <hr />
      {!stories.isError && (
        <p>
          <span className="label">Total comments:</span> {sumComments}
        </p>
      )}

      {stories.isLoading ? (
        <img src="/loading.gif" alt="Loading..." width="30" height="30" />
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

      {stories.isError && <p>Something went wrong...</p>}
    </div>
  );
};

export default App;
