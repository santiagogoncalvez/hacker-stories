import StarIcon from '../../../assets/star.svg?react';
import { Story } from '../../../types/types';
import { useFavoritesContext } from '../../../hooks/useFavoritesContext';

export const FavouriteButton = ({ item }: { item: Story }) => {
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  const favorite = isFavorite(item.objectId);

  return (
    <button
      className="removeButton"
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => toggleFavorite(item)}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      type="button"
    >
      <StarIcon
        className="removeIcon"
        width={16}
        height={16}
        style={{ fill: favorite ? '#343334' : 'none' }}
      />
    </button>
  );
};
