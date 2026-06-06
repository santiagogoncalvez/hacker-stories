import { useMemo, useState } from 'react';
import { Story, FavouriteFilter, SortState } from '../types/types';
import CommonList from '../features/News/List/CommonList';
// import Display from '../features/News/List/DisplayToggle';
import TableList from '../features/News/List/TableList';
import SortProps from '../features/News/SortProps';
import SearchForm from '../components/forms/SearchForm';
import EmptyFavoritesState from '../features/Favorites/EmptyFavoritesState';
import { sortActionList } from '../utils/sortActions';
import { useFavoritesContext } from '../hooks/useFavoritesContext';
import { NoFavoritesResults } from '../features/News/NoSearchResults';
import { TABLE_FIELDS } from '../constants/tableFields';
import { useStoryParams } from '../hooks/useStoryParams';

const FavoritesFilter = ({
  value,
  onChange,
}: {
  value: FavouriteFilter;
  onChange: (value: FavouriteFilter) => void;
}) => {
  return (
    <div className="favoritesFilter--segmented">
      <button
        type="button"
        className={value === 'story' ? 'active' : ''}
        onClick={() => onChange('story')}
      >
        Stories
      </button>

      <button
        type="button"
        className={value === 'comment' ? 'active' : ''}
        onClick={() => onChange('comment')}
      >
        Comments
      </button>
    </div>
  );
};

const Favorites = () => {
  const { favorites, removeFavorite } = useFavoritesContext();

  const {
    sort: sortParam,
    setSortAction,
    query: queryParam,
    searchLiveAction,
  } = useStoryParams();

  const [filter, setFilter] = useState<FavouriteFilter>('story');
  const [display] = useState<'CARD' | 'LIST'>('CARD');

  // 🔥 fuente única de verdad del sort UI
  const sort: SortState = useMemo(() => {
    return {
      sortType: sortParam,
      isReverse: sortParam === 'CREATED_AT' ? true : false,
    };
  }, [sortParam]);

  /* 1️⃣ Filter by type */
  const filteredByType = useMemo(() => {
    return favorites.filter((item) => item.tags.includes(filter));
  }, [favorites, filter]);

  /* 2️⃣ Search */
  const filteredBySearch = useMemo(() => {
    const query = queryParam.trim().toLowerCase();
    if (!query) return filteredByType;

    return filteredByType.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        item.commentText?.toLowerCase().includes(query),
    );
  }, [filteredByType, queryParam]);

  /* 3️⃣ Sort */
  const sortedList = useMemo(() => {
    return sortActionList(sort, filteredBySearch);
  }, [filteredBySearch, sort]);

  /* Reset al cambiar filtro */
  // useEffect(() => {
  //   setSearch('');

  //   // reset de sort según tipo
  //   if (filter === 'story') {
  //     setSortAction('POINTS');
  //   } else {
  //     setSortAction('CREATED_AT');
  //   }
  // }, [filter, setSortAction]);

  const handleRemoveItem = (item: Story) => {
    removeFavorite(item.objectId);
  };

  const hasFavoritesOfType = filteredByType.length > 0;
  const hasSearchResults = sortedList.length > 0;

  return (
    <div className="home">
      <section className="listContainer">
        {/* FILTER (siempre visible mientras haya favoritos globales) */}
        <div className="filterControls">
          <FavoritesFilter
            value={filter}
            onChange={(value: FavouriteFilter) => {
              if (value === filter) return;
              setSortAction('RELEVANCE');
              setFilter(value);
            }}
          />
        </div>

        {!hasFavoritesOfType ? (
          <EmptyFavoritesState type={filter} />
        ) : (
          <>
            {/* CONTROLS */}
            <div className="listControls">
              <SearchForm
                searchActionLive={searchLiveAction}
                searchInitLive={queryParam}
                placeholder="Filter favorites..."
                mode="live"
              />

              <div className="listControls-container">
                <SortProps
                  sort={sort}
                  label="Sort by"
                  onClick={(sortType) => setSortAction(sortType)}
                  type={filter}
                />

                {/* <Display display={display} onClick={setDisplay} /> */}
              </div>
            </div>

            {!hasSearchResults ? (
              <NoFavoritesResults filter={filter} query={queryParam} />
            ) : display === 'CARD' ? (
              <CommonList list={sortedList} type={filter} />
            ) : (
              <TableList
                list={sortedList}
                sort={sort}
                sortAction={(sortType) => setSortAction(sortType)}
                onRemoveItem={handleRemoveItem}
                type={filter}
                fields={TABLE_FIELDS[filter]}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Favorites;
