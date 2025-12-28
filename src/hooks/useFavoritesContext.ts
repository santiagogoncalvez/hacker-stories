import { useContext } from 'react';
import { FavoritesContext } from '../context/favorites';

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavoritesContext debe usarse dentro de FavoritesProvider',
    );
  }

  // Al llegar aquí, TS sabe que no es null,
  // pero ReturnType<typeof useFavorites> | null sigue siendo la firma original.
  return context as NonNullable<typeof context>;
};
