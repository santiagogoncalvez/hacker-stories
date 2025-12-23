import {
  Story,
  ItemProps,
  sort,
  ListProps,
  TableListProps,
  StoryInfoProps,
  Fields,
  DisplayType,
  DisplayProps,
  SortState,
  CommonListProps,
} from '../types/types.ts';
import ListIcon from '../assets/list.svg?react';
import { useEffect, useState } from 'react';
import { sortActionList } from '../utils/sortActions.ts';
import SortProps from './SortProps.tsx';
import RemoveIcon from '../assets/remove.svg?react';
import SquaresIcon from '../assets/squares.svg?react';
import ProfileIcon from '../assets/author.svg?react';
import CaretUnfillIcon from '../assets/caret-unfill.svg?react';
import StarIcon from '../assets/star.svg?react';

import CommentsIcon from '../assets/comments.svg?react';
import CaretIcon from '../assets/caret.svg?react';
import EndContentElement from './EndContentElement.tsx';
import NewsSkeletonList from './NewsSkeletonList.tsx';
import SearchForm from './SearchForm.tsx';

import EmptySearchState from './EmptySearchState.tsx';
import { useLocation } from 'react-router-dom';
import { useFavoritesContext } from '../context/favorites.tsx';

const formatUpdatedDate = (prefix: string, timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

  return `${prefix}${formatted}`;
};

const StoryInfo = ({ item }: StoryInfoProps) => {
  const fields = [
    { key: 'AUTHOR', value: item.author, icon: ProfileIcon },
    {
      key: 'numComments',
      value: item.numComments,
      icon: CommentsIcon,
    },
    {
      key: 'POINTS',
      value: item.points,
      icon: CaretUnfillIcon,
    },
  ];

  const mappedFields = fields.map(({ key, value, icon: Icon }) => (
    <div key={key}>
      <dt className="label">
        <Icon width={20} height={20} />
      </dt>
      <dd>{value}</dd>
    </div>
  ));

  return (
    <dl className="storyLinkInfo">
      <div>{mappedFields}</div>
      {formatUpdatedDate('Created at ', item.createdAtI)}
    </dl>
  );
};

//   const fields = [
//     { key: 'AUTHOR', label: 'Author', value: item.author, icon: ProfileIcon },
//   ];

//   const mappedFields = fields.map(({ key, value, icon: Icon }) => (
//     <div key={key}>
//       <dt className="label">{<Icon width={20} height={20} />}</dt>
//       <dd>{value}</dd>
//     </div>
//   ));

//   const cleanCommentText = DOMPurify.sanitize(item.commentText, {
//     USE_PROFILES: { html: true },
//   });

//   return (
//     <dl className="storyLinkInfo">
//       <p
//         className="storyLinkInfo commentText"
//         dangerouslySetInnerHTML={{ __html: cleanCommentText }}
//       ></p>
//       <div>{mappedFields}</div>
//       {formatUpdatedDate('Created at ', item.createdAtI)}
//     </dl>
//   );
// };

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="removeButton"
    aria-label="Remove item"
    onClick={onClick}
    title="Remove New"
    type="button"
  >
    <RemoveIcon className="removeIcon" width={22} height={22} />
  </button>
);

const AddFavouriteButton = ({
  item,
  onClick,
}: {
  item: Story;
  onClick: () => void;
}) => {
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  return (
    <button
      className="removeButton"
      aria-label="Remove item"
      onClick={() => {
        toggleFavorite(item);
      }}
      title={
        isFavorite(item.objectId) ? 'Remove to favourites' : 'Add to favourites'
      }
      type="button"
    >
      <StarIcon
        className="removeIcon"
        width={22}
        height={22}
        // TODO: agregar acá estilo toggle si esa historia está agregada a favoritos
        style={{ fill: isFavorite(item.objectId) ? '#343334' : 'none' }}
      />
    </button>
  );
};

const CommentInfo = ({ item }: StoryInfoProps) => {
  return (
    <dl className="storyLinkInfo">
      {/* HEADER: autor + fecha */}
      <div>
        <div>
          <dt className="label">
            <ProfileIcon width={20} height={20} />
          </dt>
          <dd>{item.author}</dd>
        </div>
        {formatUpdatedDate('Posted ', item.createdAtI)}
      </div>

      {/* CONTENIDO: comentario */}
      <p className="storyLinkInfo commentText">{item.commentText}</p>

      {/* CONTEXTO: link a la story */}
      {item.url ? (
        <a href={item.url} target="_blank" className="storyLink">
          Comment on: {item.title}
        </a>
      ) : (
        <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
          Comment on: {item.title}
        </p>
      )}
    </dl>
  );
};

const Item = ({ item, onRemoveItem, type }: ItemProps) => {
  const handleClick = () => {
    onRemoveItem(item);
  };
  return (
    <li className="story">
      <div className="storyLink">
        <div className="storyLinkData">
          {type === 'story' && (
            <>
              {item.url ? (
                <a href={item.url} target="_blank" className="storyLink">
                  {item.title}
                </a>
              ) : (
                <p className="storyTitle">{item.title}</p>
              )}
              <StoryInfo item={item} />
            </>
          )}

          {type === 'comment' && <CommentInfo item={item} />}
        </div>
      </div>

      {/* <RemoveButton onClick={handleClick} /> */}
      <AddFavouriteButton item={item} onClick={handleClick} />
    </li>
  );
};

const COMMENT_PREVIEW_LENGTH = 120;

type TableType = 'story' | 'comment';

const TABLE_FIELDS: Record<TableType, Fields> = {
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

const TableHead = ({
  sort,
  onClick,
  type,
}: {
  sort: SortState;
  onClick: (sort: sort) => void;
  type: 'story' | 'comment';
}) => {
  const fields = TABLE_FIELDS[type];

  return (
    <thead className="headTable">
      <tr>
        {fields.map((field) => {
          if (field.key === 'ACTION') {
            return (
              <th key={field.key}>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: '6px',
                    height: '2.5rem',
                  }}
                >
                  {field.label}
                  <div style={{ width: 18, height: 18 }} />
                </span>
              </th>
            );
          }

          return (
            <th key={field.key} scope="col" style={{ width: field.width }}>
              <button
                type="button"
                onClick={() => onClick(field.value)}
                style={{
                  background: 'transparent',
                  padding: 0,
                  color:
                    sort.sortType === field.value
                      ? 'var(--secondary)'
                      : 'var(--black)',
                }}
              >
                {field.label}

                {sort.sortType === field.value && (
                  <CaretIcon
                    width={13}
                    height={13}
                    style={{
                      transform: sort.isReverse
                        ? 'rotate(0deg)'
                        : 'rotate(-180deg)',
                    }}
                  />
                )}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

type TableListProps = {
  list: Story[];
  sort: SortState;
  sortAction: (sort: sort) => void;
  onRemoveItem: (item: Story) => void;
  type: 'story' | 'comment';
};

const TableList = ({
  list,
  sort,
  sortAction,
  onRemoveItem,
  type = 'story',
}: TableListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <table>
      <TableHead sort={sort} onClick={sortAction} type={type} />

      <tbody>
        {list.map((item) => {
          const isExpanded = expandedId === item.objectId;

          return (
            <tr key={item.objectId}>
              {type === 'comment' ? (
                <>
                  {/* COMMENT */}
                  <td>
                    {isExpanded
                      ? item.commentText
                      : item.commentText.slice(0, 120)}
                    {item.commentText.length > 120 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.objectId)
                        }
                      >
                        {isExpanded ? 'Collapse' : '...More'}
                      </button>
                    )}
                  </td>

                  <td>{item.author}</td>
                  <td>{formatUpdatedDate('', item.createdAtI)}</td>

                  <td>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </td>
                </>
              ) : (
                <>
                  {/* STORY */}
                  <td>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </td>
                  <td>{item.author}</td>
                  <td>{item.numComments}</td>
                  <td>{item.points}</td>
                </>
              )}

              {/* ACTION */}
              <td>
                <AddFavouriteButton
                  item={item}
                  onClick={() => onRemoveItem(item)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CommonList = ({ list, onRemoveItem, type }: CommonListProps) => (
  <ul className="news">
    {list.map((item: Story) => (
      <Item
        key={item.objectId}
        item={item}
        onRemoveItem={onRemoveItem}
        type={type}
      />
    ))}
  </ul>
);

const Display = ({ display, onClick }: DisplayProps) => {
  const handleClick = (displayType: DisplayType) => {
    onClick(displayType);
  };

  return (
    <div className="display">
      <button
        className={display === 'CARD' ? 'active' : ''}
        type="button"
        onClick={() => handleClick('CARD')}
      >
        <SquaresIcon width={25} height={25} />
      </button>
      <button
        className={display === 'LIST' ? 'active' : ''}
        type="button"
        onClick={() => handleClick('LIST')}
      >
        <ListIcon width={25} height={25} />
      </button>
    </div>
  );
};

const DisplayList = ({
  stories,
  sort,
  setSort,
  display,
  sortedList,
  onRemoveItem,
  handleMoreStories,
}) => {
  // 🔹 LOADING PRIMERO
  if (stories.isLoading) {
    return <NewsSkeletonList />;
  }

  // 🔹 NO RESULTS (ya filtrado desde el padre)
  if (stories.isNoResults && stories.hits.length === 0) {
    return null;
  }

  return (
    <>
      {stories.hits.length > 0 && display === 'CARD' && (
        <CommonList
          list={sortedList}
          onRemoveItem={onRemoveItem}
          type={stories.dataType}
        />
      )}

      {stories.hits.length > 0 && display === 'LIST' && (
        <TableList
          list={sortedList}
          sort={sort}
          onRemoveItem={onRemoveItem}
          sortAction={(sortType) => {
            const isReverse =
              sort.sortType === sortType ? !sort.isReverse : false;

            setSort({
              sortType,
              isReverse,
            });
          }}
        />
      )}

      {stories.hits.length > 0 && (
        <EndContentElement stories={stories} handleMore={handleMoreStories} />
      )}
    </>
  );
};

type ListType = 'story' | 'comment';

const getListTypeFromPath = (pathname: string): ListType => {
  return pathname.startsWith('/comments') ? 'comment' : 'story';
};

const List = ({
  stories,
  search,
  handleMoreStories,
  onRemoveItem,
}: ListProps) => {
  const { pathname } = useLocation();

  // 🔹 tipo derivado UNA sola vez
  const type = getListTypeFromPath(pathname);

  const [sort, setSort] = useState<SortState>(() => ({
    sortType: type === 'story' ? 'POINTS' : 'COMMENT_TEXT',
    isReverse: type === 'story',
  }));

  // 🔹 cuando cambia el tipo, reseteamos sort coherentemente
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
        <SearchForm searchInit={search} />

        <SortProps
          type={type}
          sort={sort}
          label="Sort by"
          onClick={(sortType, isReverse) => {
            setSort({ sortType, isReverse });
          }}
        />

        <Display display={display} onClick={(display) => setDisplay(display)} />
      </div>

      {/* 🔥 ORDEN CORRECTO */}
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

export { List, CommonList, DisplayList, Display, TableList };
