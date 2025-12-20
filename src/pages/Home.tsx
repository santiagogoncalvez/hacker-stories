import SearchForm from '../components/SearchForm.tsx';
import StatusPanel from '../components/StatusPanle.tsx';
import { ListWithObserver } from '../components/List.tsx';
import { useStories } from '../hooks/useStories.ts';
import { useSearch } from '../hooks/useSearch.ts';

import '../App.css';
import EmptySearchState from '../components/EmptySearchState.tsx';
import ScrollToTopButton from '../components/ScrollToTopButton.tsx';

const Home = () => {
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

  const handleLastSearch = (search: string) => {
    setSearch(search);
    handleSearch(search, 0);
  };

  return (
    <div className="home">
      <SearchForm
        search={search}
        lastSearches={lastSearches}
        onSearchInput={handleSearchInput}
        searchAction={searchAction}
        handleLastSearch={handleLastSearch}
      />

      {stories.isNoResults && !stories.isLoading && <EmptySearchState />}
      <ListWithObserver
        stories={stories}
        onRemoveItem={handleRemoveStory}
        handleMore={handleMoreStories}
      />
      <StatusPanel stories={stories} />
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
