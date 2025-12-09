import { Story, ItemProps } from '../types/types.ts';
import RemoveIcon from '../assets/remove.svg?react';

const StoryInfo = ({ item }: { item: Story }) => {
  return (
    <div className="storyLinkInfo">
      <div>
        <span className="label">Author: </span>
        <span>{item.author}</span>
      </div>
      <div>
        <span className="label">Comments: </span>
        <span>{item.numComments}</span>
      </div>
      <div>
        <span className="label">Points: </span>
        <span>{item.points}</span>
      </div>
    </div>
  );
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onRemoveItem(item);
  };

  return (
    <li className="story">
      <div className="storyLink">
        <div className="storyLinkData">
          <a href={item.url} target="_blank" className="storyLink">
            {item.title}
          </a>
          <StoryInfo item={item} />
        </div>
      </div>
      <button
        className="removeButton"
        aria-label="Remove item"
        onClick={handleClick}
      >
        <RemoveIcon className="removeIcon" width={30} height={30} />
      </button>
    </li>
  );
};

export default Item;
