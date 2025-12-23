import StatusPanel from '../components/StatusPanle.tsx';
import { List } from '../components/List.tsx';
import { useStoriesContext } from '../hooks/useStoriesContext.tsx';

import { useFavoritesContext } from '../context/favorites.tsx';

const SharedStories = () => {
  const { stories, search, handleMoreStories } = useStoriesContext();
  const { toggleFavorite } = useFavoritesContext();

  return (
    <div className="home">
      <List
        stories={stories}
        search={search}
        handleMoreStories={handleMoreStories}
        onRemoveItem={toggleFavorite}
      />
      <StatusPanel stories={stories} />
    </div>
  );
};

export default SharedStories;
