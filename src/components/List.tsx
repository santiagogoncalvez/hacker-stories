import Item from './Item.tsx';

const NoNewsResults = () => {
  return <p>No news was found for this search.</p>;
};

const List = ({ list, removeItem }) => {
  // console.log('B:List');

  const hasNews = list?.length > 0;
  return hasNews ? (
    <ul className="news">
      {list.map((item) => (
        <Item key={item.objectId} item={item} removeItem={removeItem} />
      ))}
    </ul>
  ) : (
    <NoNewsResults />
  );
};

export default List;
