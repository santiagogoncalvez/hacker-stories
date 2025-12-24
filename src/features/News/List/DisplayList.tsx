import NewsSkeletonList from '../NewsSkeletonList'; // adjust if path differs
import CommonList from './CommonList';
import TableList from './TableList';
import EndContentElement from '../EndContentElement';

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

  // fields definitions kept here so TableList is generic
  const TABLE_FIELDS = {
    story: [
      { key: 'TITLE', label: 'Title', value: 'TITLE', width: '40%' },
      { key: 'AUTHOR', label: 'Author', value: 'AUTHOR', width: '20%' },
      { key: 'COMMENTS', label: 'Comments', value: 'COMMENTS', width: '10%' },
      { key: 'POINTS', label: 'Points', value: 'POINTS', width: '10%' },
      { key: 'ACTION', label: 'Action', value: '', width: '5%' },
    ],
    comment: [
      {
        key: 'COMMENT_TEXT',
        label: 'Comment',
        value: 'COMMENT_TEXT',
        width: '50%',
      },
      { key: 'AUTHOR', label: 'Author', value: 'AUTHOR', width: '15%' },
      { key: 'CREATED_AT', label: 'Date', value: 'CREATED_AT', width: '10%' },
      { key: 'STORY_TITLE', label: 'Story', value: 'TITLE', width: '10%' },
      { key: 'ACTION', label: 'Action', value: '', width: '5%' },
    ],
  };

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
