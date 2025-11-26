import Item from './Item.jsx';

const List = ({ list, removeItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} removeItem={removeItem} />
      ))}
    </ul>
  );
};

export default List;
