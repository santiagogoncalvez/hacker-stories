import { memo } from 'react';
import { StoriesState } from '../../types/types';
import Loader from '../../components/ui/Loader';
import MoreButton from './MoreButton';

const EndContentElement = memo(
  ({
    stories,
    handleMore,
  }: {
    stories: StoriesState;
    handleMore: () => void;
  }) => {
    return (
      <div className="endContentElement">
        {stories.isLoadingMore ? (
          <Loader />
        ) : (
          <MoreButton onClick={handleMore} />
        )}
      </div>
    );
  },
);

export default EndContentElement;
