import NewsSkeletonList from '../NewsSkeletonList'; // adjust if path differs
import CommonList from './CommonList';
import TableList from './TableList';
import EndContentElement from '../EndContentElement';
import { TABLE_FIELDS } from '../../../constants/tableFields';
import { DisplayListProps } from '../../../types/types';

const DisplayList = ({
  stories,
  sort,
  setSort,
  display,
  sortedList,
  onRemoveItem,
  handleMoreStories,
  type,
}: DisplayListProps) => {
  if (stories.isLoading) return <NewsSkeletonList />;

  if (stories.isNoResults && stories.hits.length === 0) return null;

  return (
    <>
      {stories.hits.length > 0 && display === 'CARD' && (
        <CommonList list={sortedList} type={type} />
      )}

      {stories.hits.length > 0 && display === 'LIST' && (
        <TableList
          list={sortedList}
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
      {console.log(stories)}
      {stories.hits.length > 0 &&
        stories.page < 49 &&
        stories.page < stories.nbPages - 1 &&
        stories.hits.length < stories.nbHits && (
          <EndContentElement stories={stories} handleMore={handleMoreStories} />
        )}
    </>
  );
};

export default DisplayList;
