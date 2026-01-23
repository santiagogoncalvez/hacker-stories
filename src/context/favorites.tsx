import { useFavorites } from '../hooks/useFavorites';
import { FavoritesContext } from './createFavoritesContext';

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const favorites = useFavorites();
  return <FavoritesContext value={favorites}>{children}</FavoritesContext>;
};
