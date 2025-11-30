import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useStorageState } from './hooks/useStorageState';
import List from './components/List.jsx';
import SearchForm from './components/SearchForm.jsx';
import { storiesReducer } from './reducers/storiesReducer.js';
import { getAsyncStories } from './services/getAsyncStories.js';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [search, setSearch] = useStorageState('search', 'React');
  const [url, setUrl] = useState(search ? `${API_ENDPOINT}${search}` : null);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const getNews = useCallback(async ({ url }) => {
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

  const handleSearchInput = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setUrl(`${API_ENDPOINT}${search}`);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  return (
    <div className="app">
      <h1>Hacker Stories</h1>

      <div className="searchControls">
        <SearchForm
          search={search}
          handleSearchInput={handleSearchInput}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <hr />

      {stories.isLoading ? (
        <img src="/loading.gif" alt="Loading..." width="30" height="30" />
      ) : (
        <List list={stories.data} removeItem={handleRemoveStory} />
      )}

      {stories.isError && <p>Something went wrong...</p>}
    </div>
  );
};

export default App;
