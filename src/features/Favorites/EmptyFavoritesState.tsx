import StarIcon from '../../assets/star.svg?react';
import { EmptyFavoritesStateProps } from '../../types/types';



const EmptyFavoritesState = ({ type }: EmptyFavoritesStateProps) => {
  const title =
    type === 'comment'
      ? 'No favourite comments yet'
      : type === 'story'
        ? 'No favourite stories yet'
        : 'No favourites yet';

  const description =
    type === 'comment'
      ? 'You haven’t added any comments to your favourites.'
      : type === 'story'
        ? 'You haven’t added any stories to your favourites.'
        : 'You haven’t added anything to your favourites yet.';

  return (
    <div className="noResultsCard" role="status" aria-live="polite">
      <div className="noResultsContent">
        <h2 className="noResultsTitle">{title}</h2>

        <p className="noResultsDescription">{description}</p>

        <ul className="noResultsTips">
          <li>Browse stories or comments</li>
          <li className="noResultsTip">
            Click the star icon{' '}
            <span className="inlineIcon" aria-hidden="true">
              <StarIcon width={15} height={15} />
            </span>{' '}
            to save your favourites
          </li>
          <li>Come back later to find them here</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyFavoritesState;
