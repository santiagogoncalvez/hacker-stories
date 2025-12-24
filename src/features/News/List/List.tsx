import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sortActionList } from '../../../utils/sortActions';
import SortProps from '../SortProps';
import SearchForm from '../../../components/forms/SearchForm';
import EmptySearchState from '../EmptySearchState';
import NewsSkeletonList from '../NewsSkeletonList';
import DisplayList from './DisplayList';
import DisplayToggle from './DisplayToggle';
import { ListProps, SortState, DisplayType } from '../../../types/types';

type ListType = 'story' | 'comment';
const getListTypeFromPath = (pathname: string): ListType =>
  pathname.startsWith('/comments') ? 'comment' : 'story';

const List = ({
  stories,
  search,
  handleMoreStories,
  onRemoveItem,
  searchAction,
  lastSearches,
}: ListProps) => {
  const { pathname } = useLocation();
  const type = getListTypeFromPath(pathname);

  const [sort, setSort] = useState<SortState>(() => ({
    sortType: type === 'story' ? 'POINTS' : 'COMMENT_TEXT',
    isReverse: type === 'story',
  }));

  useEffect(() => {
    setSort({
      sortType: type === 'story' ? 'POINTS' : 'COMMENT_TEXT',
      isReverse: type === 'story',
    });
  }, [type]);

  const sortedList = sortActionList(sort, stories.hits);
  const [display, setDisplay] = useState<DisplayType>('CARD');

  return (
    <section className="listContainer">
      <div className="listControls">
        <SearchForm
          searchInit={search}
          searchAction={searchAction}
          lastSearches={lastSearches}
        />

        <SortProps
          type={type}
          sort={sort}
          label="Sort by"
          onClick={(sortType, isReverse) => setSort({ sortType, isReverse })}
        />

        <DisplayToggle display={display} onClick={(d) => setDisplay(d)} />
      </div>

      {stories.isLoading ? (
        <NewsSkeletonList />
      ) : stories.isNoResults && stories.hits.length === 0 ? (
        <EmptySearchState
          type={type}
          sort={sort}
          setSort={setSort}
          display={display}
        />
      ) : (
        <DisplayList
          type={type}
          stories={stories}
          sort={sort}
          setSort={setSort}
          display={display}
          sortedList={sortedList}
          onRemoveItem={onRemoveItem}
          handleMoreStories={handleMoreStories}
        />
      )}
    </section>
  );
};

export default List;
