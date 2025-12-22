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
  StoriesState,
} from '../types/types.ts';
import ListIcon from '../assets/list.svg?react';
import { memo, useEffect, useState } from 'react';
import { sortActionList, sortList } from '../utils/sortActions.ts';
import SortProps from './SortProps.tsx';
import RemoveIcon from '../assets/remove.svg?react';
import SquaresIcon from '../assets/squares.svg?react';
import ProfileIcon from '../assets/author.svg?react';
import CaretUnfillIcon from '../assets/caret-unfill.svg?react';
import CommentsIcon from '../assets/comments.svg?react';
import CaretIcon from '../assets/caret.svg?react';
import EndContentElement from './EndContentElement.tsx';
import NewsSkeletonList from './NewsSkeletonList.tsx';
import SearchForm from './SearchForm.tsx';
import NoSearchResults from './NoSearchResults.tsx';
import { useStoriesContext } from '../hooks/useStoriesContext.tsx';
import EmptySearchState from './EmptySearchState.tsx';
import { useSortList } from '../hooks/useSortLIst.tsx';
import DOMPurify from 'dompurify';
import { useLocation } from 'react-router-dom';
import { set } from 'lodash';

const stripHtml = (html = ''): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

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
  >
    <RemoveIcon className="removeIcon" width={22} height={22} />
  </button>
);

const CommentInfo = ({ item }: StoryInfoProps) => {
  const cleanCommentText = DOMPurify.sanitize(item.commentText, {
    ALLOWED_TAGS: ['p', 'pre', 'code', 'em', 'strong', 'a', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'rel', 'target'],
  });

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
      <p
        className="storyLinkInfo commentText"
        dangerouslySetInnerHTML={{ __html: cleanCommentText }}
      />

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

      <RemoveButton onClick={handleClick} />
    </li>
  );

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

      <RemoveButton onClick={handleClick} />
    </li>
  );
};

const fields: Fields = [
  {
    key: 'TITLE',
    label: 'Title',
    value: 'TITLE',
    width: '60%',
  },
  {
    key: 'AUTHOR',
    label: 'Author',
    value: 'AUTHOR',
    width: '10%',
  },
  {
    key: 'numComments',
    label: 'Comments',
    value: 'COMMENTS',
    width: '10%',
  },
  {
    key: 'POINTS',
    label: 'Points',
    value: 'POINTS',
    width: '10%',
  },

  //! Parche: arreglar el estilo del head 'actions
  {
    key: 'ACTIONS',
    label: 'Actions',
    value: 'NONE',
    width: '10%',
  },
];

const COMMENT_DISABLED_VALUES = ['POINTS', 'COMMENTS'] as const;

const STORY_FIELDS = [
  { key: 'TITLE', label: 'Title', value: 'TITLE', width: '40%' },
  { key: 'AUTHOR', label: 'Author', value: 'AUTHOR', width: '20%' },
  { key: 'COMMENTS', label: 'Comments', value: 'COMMENTS', width: '10%' },
  { key: 'POINTS', label: 'Points', value: 'POINTS', width: '10%' },
];

const COMMENT_FIELDS = [
  {
    key: 'COMMENT_TEXT',
    label: 'Comment',
    value: 'COMMENT_TEXT',
    width: '50% ',
  },
  {
    key: 'AUTHOR',
    label: 'Author',
    value: 'AUTHOR',
    width: '15%',
  },
  {
    key: 'CREATED_AT',
    label: 'Date',
    value: 'CREATED_AT',
    width: '10%',
  },
  {
    key: 'STORY_TITLE',
    label: 'Story',
    value: 'STORY_TITLE',
    width: '5%',
  },

  {
    key: 'ACTION',
    label: 'Action',
    value: '',
    width: '5%',
  },
];

const TableHead = ({
  sort,
  onClick,
}: {
  sort: SortState;
  onClick: (sort: sort) => void;
}) => {
  const { pathname } = useLocation();
  const isCommentsRoute = pathname.startsWith('/comments');

  const visibleFields = isCommentsRoute ? COMMENT_FIELDS : STORY_FIELDS;

  return (
    <thead className="headTable">
      <tr>
        {visibleFields.map((field) => {
          if (field.key === 'ACTION')
            return (
              <th>
                <button
                  style={{
                    color: 'var(--black)',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                >
                  {field.label}
                </button>
              </th>
            );
          return (
            <th key={field.key} scope="col" style={{ width: field.width }}>
              <button
                onClick={() => onClick(field.value)}
                className={field.key}
                style={{
                  color:
                    sort.sortType === field.value
                      ? 'var(--secondary)'
                      : 'var(--black)',
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
              >
                {field.label}

                {sort.sortType === field.value ? (
                  <CaretIcon
                    width={13}
                    height={13}
                    style={{
                      transform: sort.isReverse
                        ? 'rotate(0deg)'
                        : 'rotate(-180deg)',
                    }}
                  />
                ) : (
                  <div style={{ width: 18, height: 18 }} />
                )}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const COMMENT_PREVIEW_LENGTH = 120;

const TableList = ({
  list,
  sort,
  onRemoveItem,
  sortAction,
}: TableListProps) => {
  const { pathname } = useLocation();
  const isCommentsRoute = pathname.startsWith('/comments');

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <table>
      <TableHead sort={sort} onClick={sortAction} />

      <tbody>
        {list.map((item: Story) => {
          const isExpanded = expandedId === item.objectId;
          const plainText = stripHtml(item.commentText || '');

          return (
            <tr
              key={item.objectId}
              className={isExpanded ? 'commentRowExpanded' : undefined}
            >
              {isCommentsRoute ? (
                <>
                  {/* COMMENT TEXT */}
                  <td className="commentTextCell">
                    <div className="commentTextWrapper">
                      {isExpanded ? (
                        <div
                          className="commentFull"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(item.commentText),
                          }}
                        />
                      ) : (
                        <span>
                          {plainText.slice(0, COMMENT_PREVIEW_LENGTH)}
                          {/* {plainText.length > COMMENT_PREVIEW_LENGTH && '…'} */}
                        </span>
                      )}

                      {plainText.length > COMMENT_PREVIEW_LENGTH && (
                        <button
                          type="button"
                          className="commentExpandButton"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.objectId)
                          }
                        >
                          {isExpanded ? 'Collapse' : '...More'}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* AUTHOR */}
                  <td>{item.author}</td>

                  {/* STORY */}
                  <td>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </td>

                  {/* DATE */}
                  <td>{formatUpdatedDate('', item.createdAtI)}</td>
                </>
              ) : (
                <>
                  <th>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </th>
                  <td>{item.author}</td>
                  <td>{item.numComments}</td>
                  <td>{item.points}</td>
                </>
              )}

              {/* ACTIONS */}
              <td>
                {/* {isCommentsRoute && isExpanded && (
                  <button
                    type="button"
                    className="commentCollapseButton"
                    onClick={() => setExpandedId(null)}
                  >
                    Collapse
                  </button>
                )} */}
                <RemoveButton onClick={() => onRemoveItem(item)} />
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

  const { pathname } = useLocation();
  const dataType = pathname === '/' ? 'story' : 'comment';
  console.log(stories);

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

const List = ({
  stories,
  search,
  handleMoreStories,
  onRemoveItem,
}: ListProps) => {
  const [sort, setSort] = useState<SortState>({
    sortType: 'POINTS',
    isReverse: true,
  });

  const { pathname } = useLocation();

  useEffect(() => {
    const newSort = pathname === '/' ? 'POINTS' : 'TITLE';
    setSort({
      sortType: newSort,
      isReverse: true,
    });
  }, [pathname]);

  const sortedList = sortActionList(sort, stories.hits);

  const [display, setDisplay] = useState<DisplayType>('CARD');

  return (
    <section className="listContainer">
      <div className="listControls">
        <SearchForm searchInit={search} />

        <SortProps
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
        <EmptySearchState sort={sort} setSort={setSort} display={display} />
      ) : (
        <DisplayList
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

export { List, CommonList, DisplayList };
