import RemoveIcon from '../../../assets/remove.svg?react';
import StarIcon from '../../../assets/star.svg?react';
import { Story } from '../../../types/types';
import { useFavoritesContext } from '../../../hooks/useFavoritesContext';

export const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="removeButton"
    aria-label="Remove item"
    onClick={onClick}
    title="Remove New"
    type="button"
  >
    <RemoveIcon className="removeIcon" width={22} height={22} />
  </button>
);

export const FavouriteButton = ({ item }: { item: Story }) => {
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  const favorite = isFavorite(item.objectId);

  return (
    <button
      className="removeButton"
      aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
      onClick={() => toggleFavorite(item)}
      title={favorite ? 'Remove from favourites' : 'Add to favourites'}
      type="button"
    >
      <StarIcon
        className="removeIcon"
        width={22}
        height={22}
        style={{ fill: favorite ? '#343334' : 'none' }}
      />
    </button>
  );
};
