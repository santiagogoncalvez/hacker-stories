import Item from './Item.tsx';
import { Story } from '../types/types.ts';

const NoNewsResults = () => {
  return <p>No news was found for this search.</p>;
};

type ListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
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

export default List;
