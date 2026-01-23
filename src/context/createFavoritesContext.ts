import { createContext } from 'react';
import { useFavorites } from '../hooks/useFavorites.tsx';

export const FavoritesContext = createContext<ReturnType<
  typeof useFavorites
> | null>(null);
