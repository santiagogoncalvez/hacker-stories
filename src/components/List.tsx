import { Story, ItemProps } from '../types/types.ts';
import RemoveIcon from '../assets/remove.svg?react';

type ListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
};


const NoNewsResults = () => {
  return <p>No news was found for this search.</p>;
};

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


const List = ({ list, onRemoveItem }: ListProps) => {
  // console.log('B:List');

  const hasNews = list?.length > 0;
  return hasNews ? (
    <ul className="news">
      {list.map((item: Story) => (
        <Item key={item.objectId} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  ) : (
    <NoNewsResults />
  );
};

export {Item, List};
