// FavoritesContext.tsx
import { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites.tsx';

const FavoritesContext = createContext<ReturnType<typeof useFavorites> | null>(
  null,
);

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

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error(
      'useFavoritesContext must be used within a FavoritesProvider',
    );
  return context;
};
