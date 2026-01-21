import { useEffect } from 'react';
import StatusPanel from '../layout/StatusPanle.tsx';
import List from '../../features/News/List/List.tsx';
import { useStoriesContext } from '../../hooks/useStoriesContext';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import { StoriesProvider } from '../../context/stories.tsx';
import { useStoryParams } from '../../hooks/useStoryParams';

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
  const { dataType, query, page } = useStoryParams();

  // Reset al cambiar de sección (ej: de Story a Comment)
  useEffect(() => {
    // Solo reseteamos si entramos a una sección limpia o cambiamos tipo
    // pero NO cuando cambia la query o la page dentro de la misma sección
  }, [dataType]);

  return (
    <StoriesProvider query={query} page={page} dataType={dataType}>
      <SharedStoriesContent />
    </StoriesProvider>
  );
};

export default SharedStories;
