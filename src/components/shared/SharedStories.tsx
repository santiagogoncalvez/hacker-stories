import StatusPanel from '../layout/StatusPanle.tsx';
import  List  from '../../features/News/List/List.tsx';
import { useStoriesContext } from '../../hooks/useStoriesContext.tsx';

import { useFavoritesContext } from '../../hooks/useFavoritesContext.ts';

const SharedStories = () => {
  const {
    stories, // Este es ListState | null
    search,
    handleMoreStories,
    searchAction,
    lastSearches,
    handleRemoveLastSearch,
  } = useStoriesContext();

  const { toggleFavorite } = useFavoritesContext();

  // GUIA DE TIPOS: Si stories es null, detenemos el renderizado.
  // A partir de aquí, TS infiere que 'stories' es de tipo 'ListState' (no null).
  if (!stories) {
    return null;
  }

  return (
    <div className="home">
      <List
        stories={stories} // TS ahora está feliz: ListState === ListState
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