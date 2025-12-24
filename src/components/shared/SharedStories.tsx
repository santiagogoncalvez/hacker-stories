import StatusPanel from '../layout/StatusPanle.tsx';
import  List  from '../../features/News/List/List.tsx';
import { useStoriesContext } from '../../hooks/useStoriesContext.tsx';

import { useFavoritesContext } from '../../context/favorites.tsx';

const SharedStories = () => {
  const {
    stories,
    search,
    handleMoreStories,
    searchAction,
    lastSearches,
    handleRemoveLastSearch,
  } = useStoriesContext();
  const { toggleFavorite } = useFavoritesContext();

  return (
    <div className="home">
      <List
        stories={stories}
        search={search}
        handleMoreStories={handleMoreStories}
        onRemoveItem={toggleFavorite}
        searchAction={searchAction}
        lastSearches={lastSearches}
        handleRemoveLastSearch={handleRemoveLastSearch}
      />
      <StatusPanel stories={stories} />
    </div>
  );
};

export default SharedStories;
