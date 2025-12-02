import RemoveIcon from '../../public/remove.svg?react';

const Item = ({ item, removeItem }) => {
  const handleClick = (event) => {
    event.preventDefault();
    removeItem(item);
  };

  return (
    <li className="story">
      <a href={item.url} target="_blank" className="storyLink">
        <div className="storyLinkData">
          <span className="storyLinkText">{item.title}</span>
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
        </div>

        <button className="removeButton" onClick={handleClick}>
          <RemoveIcon className="removeIcon" width={30} height={30} />
        </button>
      </a>
    </li>
  );
};

export default Item;
