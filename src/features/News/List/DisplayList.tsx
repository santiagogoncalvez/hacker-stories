import NewsSkeletonList from '../NewsSkeletonList'; // adjust if path differs
import CommonList from './CommonList';
import TableList from './TableList';
import EndContentElement from '../EndContentElement';
import { TABLE_FIELDS } from '../../../constants/tableFields';



const DisplayList = ({
  stories,
  sort,
  setSort,
  display,
  sortedList,
  onRemoveItem,
  handleMoreStories,
  type,
}: DLProps) => {
  if (stories.isLoading) return <NewsSkeletonList />;

  if (stories.isNoResults && stories.hits.length === 0) return null;

  

  return (
    <>
      {stories.hits.length > 0 && display === 'CARD' && (
        <CommonList list={sortedList} onRemoveItem={onRemoveItem} type={type} />
      )}

      {stories.hits.length > 0 && display === 'LIST' && (
        <TableList
          list={sortedList as Story[]}
          sort={sort}
          onRemoveItem={onRemoveItem}
          sortAction={(sortType) => {
            const isReverse =
              sort.sortType === sortType ? !sort.isReverse : false;
            setSort({ sortType, isReverse });
          }}
          fields={TABLE_FIELDS[type]}
          type={type}
        />
      )}

      {stories.hits.length > 0 && (
        <EndContentElement stories={stories} handleMore={handleMoreStories} />
      )}
    </>
  );
};

export default DisplayList;
