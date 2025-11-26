import { useEffect, useReducer, useState } from 'react';
import { useStorageState } from './hooks/useStorageState';
import { stories as initialStories } from './constants/stories';
import InputWithLabel from './components/InputWithLabel.jsx';
import List from './components/List.jsx';
import { storiesReducer } from './reducers/storiesReducer.js';
import { getAsyncStories } from './services/getAsyncStories.js';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, initialStories);
  const [isLoading, setIsloading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Hacer petició de datos de historias
  useEffect(() => {
    getAsyncStories()
      .then((result) => {
        dispatchStories({ type: 'SET_STORIES', payload: result.data.stories });
        setIsloading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  // A
  const handleSearch = (event) => {
    // D
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* // B */}
      <InputWithLabel
        id="search"
        type="text"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {isLoading ? (
        <img src="/loading.gif" alt="Loading..." width="30" height="30" />
      ) : (
        <List list={searchedStories} removeItem={handleRemoveStory} />
      )}

      {isError && <p>Something went wrong...</p>}
    </>
  );
};

export default App;
