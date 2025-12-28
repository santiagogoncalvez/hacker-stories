import { createContext } from 'react';
import { useFavorites } from '../hooks/useFavorites.tsx';

// Solo exportamos el contexto para que el hook lo vea
export const FavoritesContext = createContext<ReturnType<
  typeof useFavorites
> | null>(null);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const favorites = useFavorites();
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
};
