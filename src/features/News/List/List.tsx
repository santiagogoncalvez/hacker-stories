import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sortActionList } from '../../../utils/sortActions';
import SortProps from '../SortProps';
import SearchForm from '../../../components/forms/SearchForm';
import NewsSkeletonList from '../NewsSkeletonList';
import DisplayList from './DisplayList';
import DisplayToggle from './DisplayToggle';
import {
  ListProps,
  DisplayType,
  ListType,
  Sort,
  SortState,
} from '../../../types/types';
import SearchMeta from './SearchMeta';
import { NoSearchResults } from '../NoSearchResults';
import { useStoriesContext } from '../../../hooks/useStoriesContext';
import { useStoryParams } from '../../../hooks/useStoryParams';

const getListTypeFromPath = (pathname: string): ListType =>
  pathname.startsWith('/comments') ? 'comment' : 'story';

const List = ({
  stories,
  search,
  handleMoreStories,
  onRemoveItem,
}: ListProps) => {
  const { pathname } = useLocation();
  const type = getListTypeFromPath(pathname);

  const { handleSortChange } = useStoriesContext();
  const { sort, setSortAction } = useStoryParams();

  const sortedList =
    sort !== 'DATE' && sort !== 'RELEVANCE'
      ? sortActionList(
          {
            sortType: sort,
            isReverse: false,
          },
          stories.hits,
        )
      : stories.hits;
  const [display, setDisplay] = useState<DisplayType>('CARD');

  const handleChangeSort = (sortType: Sort) => {
    // setSort({ sortType, isReverse });
    handleSortChange(sortType);
  };

  return (
    <section className="listContainer">
      <div className="listControls">
        <SearchForm
          placeholder={
            type === 'story' ? 'Search stories...' : 'Search comments...'
          }
        />

        <SortProps
          type={type}
          sort={{
            sortType: sort,
            isReverse: false,
          }}
          label="Sort by"
          onClick={handleChangeSort}
        />

        <DisplayToggle display={display} onClick={(d) => setDisplay(d)} />
      </div>

      <SearchMeta
        nbHits={stories.nbHits || 0}
        processingTimeMs={stories.processingTimeMs || 0}
        isLoading={stories.isLoading}
      />

      {stories.isLoading ? (
        <NewsSkeletonList />
      ) : stories.isNoResults && stories.hits.length === 0 ? (
        <NoSearchResults query={search} />
      ) : (
        <>
          <DisplayList
            type={type}
            stories={stories}
            sort={{
              sortType: sort,
              isReverse: false,
            }}
            setSort={(sort: SortState) => {
              setSortAction(sort.sortType);
            }}
            display={display}
            sortedList={sortedList}
            onRemoveItem={onRemoveItem}
            handleMoreStories={handleMoreStories}
          />
        </>
      )}
    </section>
  );
};

export default List;
