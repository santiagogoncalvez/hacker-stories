import StatusPanel from '../../../components/layout/StatusPanel.tsx';
import List from './List.tsx';
import { useStoriesContext } from '../../../hooks/useStoriesContext.tsx';
import { useFavoritesContext } from '../../../hooks/useFavoritesContext.ts';

const SharedStoriesContent = () => {
  const {
    stories,
    search,
    handleMoreStories, // Esta función debe llamar a setPageAction(page + 1)
  } = useStoriesContext();
  const { toggleFavorite } = useFavoritesContext();

  if (!stories) return null;

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

const SharedStories = () => {
  

  return (
      <SharedStoriesContent />
  );
};

export default SharedStories;
