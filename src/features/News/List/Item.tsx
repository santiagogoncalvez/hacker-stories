import { FavouriteFilter, Story } from '../../../types/types';
import StoryInfo from './StoryInfo';
import CommentInfo from './CommentInfo';
import { memo } from 'react';
import { FavouriteButton } from './ActionButtons.tsx';

interface ItemProps {
  item: Story;
  type: FavouriteFilter;
}

const Item = ({ item, type }: ItemProps) => {
  return (
    <li className="story">
      <div className="storyLink">
        <div className="storyLinkData">
          {type === 'story' ? (
            <>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="storyLink"
                >
                  {item.title}
                </a>
              ) : (
                <p className="storyTitle">{item.title}</p>
              )}
              <StoryInfo item={item} />
            </>
          ) : (
            <CommentInfo item={item} />
          )}
        </div>
      </div>

      <FavouriteButton item={item} />
    </li>
  );
};

export default memo(Item);
