import { useMemo, useState, useEffect } from 'react';
import { Story } from '../types/types';
import CommonList from '../features/News/List/CommonList';
import Display from '../features/News/List/DisplayToggle';

import TableList from '../features/News/List/TableList';
import SortProps from '../features/News/SortProps';
import SearchForm from '../components/forms/SearchForm';
import EmptyFavoritesState from '../features/Favorites/EmptyFavoritesState';
import { sortActionList } from '../utils/sortActions';
import { useFavoritesContext } from '../context/favorites';
import { NoFavoritesResults } from '../features/News/NoSearchResults';
import { TABLE_FIELDS } from '../constants/tableFields';

type FavouriteFilter = 'story' | 'comment';

const FavouritesFilter = ({
  value,
  onChange,
}: {
  value: FavouriteFilter;
  onChange: (value: FavouriteFilter) => void;
}) => {
  return (
    <div className="favouritesFilter--segmented">
      <button
        type="button"
        className={value === 'story' ? 'active' : ''}
        onClick={() => onChange('story')}
      >
        News
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

const Favourites = () => {
  const { favorites, removeFavorite } = useFavoritesContext();

  /* UI state */
  const [filter, setFilter] = useState<FavouriteFilter>('story');
  const [display, setDisplay] = useState<'CARD' | 'LIST'>('CARD');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState({
    sortType: 'POINTS',
    isReverse: true,
  });

  /* 1️⃣ Filter by type */
  const filteredByType = useMemo(() => {
    return favorites.filter((item) => item.tags.includes(filter));
  }, [favorites, filter]);

  /* 2️⃣ Search (blindado) */
  const filteredBySearch = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return filteredByType;

    return filteredByType.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        item.commentText?.toLowerCase().includes(query),
    );
  }, [filteredByType, search]);

  /* 3️⃣ Sort */
  const sortedList = useMemo(() => {
    return sortActionList(sort, filteredBySearch);
  }, [filteredBySearch, sort]);

  /* Reset sort inválido al cambiar filtro */
  useEffect(() => {
    if (filter === 'comment') {
      setSort({ sortType: 'CREATED_AT', isReverse: true });
    }

    if (filter === 'story') {
      setSort({ sortType: 'POINTS', isReverse: true });
    }

    setSearch('');
  }, [filter]);

  const handleRemoveItem = (item: Story) => {
    removeFavorite(item.objectId);
  };

  const hasFavoritesOfType = filteredByType.length > 0;
  const hasSearchResults = sortedList.length > 0;

  return (
    <section className="listContainer">
      {/* FILTER (siempre visible mientras haya favoritos globales) */}
      <div className="filterControls">
        <FavouritesFilter value={filter} onChange={setFilter} />
      </div>

      {/* 🔴 NO hay favoritos de este tipo */}
      {!hasFavoritesOfType ? (
        <EmptyFavoritesState type={filter} />
      ) : (
        <>
          {/* CONTROLS */}
          <div className="listControls">
            <SearchForm
              searchInit={search}
              searchAction={setSearch}
              lastSearches={[]}
              placeholder="Filter favorites..."
              submitMode="filter"
            />

            <SortProps
              sort={sort}
              label="Sort by"
              onClick={(sortType, isReverse) =>
                setSort({ sortType, isReverse })
              }
              type={filter}
            />

            <Display display={display} onClick={setDisplay} />
          </div>

          {/* 🟡 Hay favoritos del tipo, pero el search no encontró nada */}
          {!hasSearchResults ? (
            <NoFavoritesResults filter={filter} query={search} />
          ) : display === 'CARD' ? (
            <CommonList
              list={sortedList}
              onRemoveItem={handleRemoveItem}
              type={filter}
            />
          ) : (
            <TableList
              list={sortedList}
              sort={sort}
              sortAction={(sortType) => {
                const isReverse =
                  sort.sortType === sortType ? !sort.isReverse : false;

                setSort({ sortType, isReverse });
              }}
              onRemoveItem={handleRemoveItem}
              type={filter}
              fields={TABLE_FIELDS[filter]}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Favourites;
