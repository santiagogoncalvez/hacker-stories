import { toast } from 'sonner';
import { Story } from '../types/types';
import { useStorageState } from './useStorageState';

function useFavorites() {
  // Tipamos el estado inicial como un array de Story
  const [favorites, setFavorites] = useStorageState<Story[]>('favorites', []);

  const addFavorite = (item: Story) => {
    // En lugar de usar (prev) => ..., pasamos el nuevo array directamente
    const nextFavorites = [item, ...favorites];
    setFavorites(nextFavorites);
    toast.success('Added to favorites');
  };

  const removeFavorite = (id: string) => {
    // Calculamos el filtro y pasamos el resultado
    const nextFavorites = favorites.filter((f) => f.objectId !== id);
    setFavorites(nextFavorites);
    toast.success('Removed from favorites');
  };

  const isFavorite = (id: string): boolean => {
    return favorites.some((f) => f.objectId === id);
  };

  const toggleFavorite = (item: Story) => {
    if (isFavorite(item.objectId)) {
      removeFavorite(item.objectId);
    } else {
      addFavorite(item);
    }
  };

  // Selectores tipados
  const favoriteStories: Story[] = favorites.filter((item) =>
    item.tags.includes('story'),
  );

  const favoriteComments: Story[] = favorites.filter((item) =>
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
