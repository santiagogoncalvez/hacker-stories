import { Story } from '../types/types';
import { useStorageState } from './useStorageState';

function useFavorites() {
  const [favorites, setFavorites] = useStorageState<Story[]>('favorites', []);

  const addFavorite = (item: Story) => setFavorites((prev) => [item, ...prev]);

  const removeFavorite = (id: string) =>
    setFavorites((prev) => prev.filter((f) => f.objectId !== id));

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.objectId === id);
  };

  const toggleFavorite = (item: Story) => {
    if (isFavorite(item.objectId)) {
      removeFavorite(item.objectId);
    } else {
      addFavorite(item);
    }
  };

  const favoriteStories = favorites.filter((item) =>
    item.tags.includes('story'),
  );

  const favoriteComments = favorites.filter((item) =>
    item.tags.includes('comment'),
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    favoriteStories,
    favoriteComments,
  };
}

export { useFavorites };
