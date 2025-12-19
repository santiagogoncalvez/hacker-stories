import SearchForm from './components/SearchForm.tsx';
import StatusPanel from './components/StatusPanle.tsx';
import { ListWithObserver } from './components/List.tsx';
import { useStories } from './hooks/useStories.ts';
import { useSearch } from './hooks/useSearch.tsx';

import './App.css';
import EmptySearchState from './components/EmptySearchState.tsx';

const App = () => {
  const { search, setSearch, handleSearchInput } = useSearch({ search: '' });

  const {
    stories,
    handleSearch,
    searchAction,
    handleRemoveStory,
    lastSearches,
    handleMoreStories,
  } = useStories({
    search,
  });

  // console.log(stories);

  const handleLastSearch = (search: string) => {
    setSearch(search);
    handleSearch(search, 0);
  };

  return (
    <div className="app">
      <h1>Hacker Stories</h1>

      <SearchForm
        search={search}
        lastSearches={lastSearches}
        onSearchInput={handleSearchInput}
        searchAction={searchAction}
        handleLastSearch={handleLastSearch}
      />

      <hr />

      {stories.isNoResults && !stories.isLoading && <EmptySearchState />}

      <ListWithObserver
        stories={stories}
        onRemoveItem={handleRemoveStory}
        handleMore={handleMoreStories}
      />

      <StatusPanel stories={stories} />
    </div>
  );
};

export default App;
