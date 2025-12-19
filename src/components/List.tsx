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
import { memo, useState } from 'react';
import { sortList } from '../utils/sortActions.ts';
import SortProps from './SortProps.tsx';
import RemoveIcon from '../assets/remove.svg?react';
import SquaresIcon from '../assets/squares.svg?react';
import ProfileIcon from '../assets/author.svg?react';
import CaretUnfillIcon from '../assets/caret-unfill.svg?react';
import CommentsIcon from '../assets/comments.svg?react';
import CaretIcon from '../assets/caret.svg?react';
import EndContentElement from './EndContentElement.tsx';

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
    { key: 'AUTHOR', label: 'Author', value: item.author, icon: ProfileIcon },
    {
      key: 'numComments',
      label: 'Comments',
      value: item.numComments,
      icon: CommentsIcon,
    },
    {
      key: 'POINTS',
      label: 'Points',
      value: item.points,
      icon: CaretUnfillIcon,
    },
  ];

  const mappedFields = fields.map(({ key, value, icon: Icon }) => (
    <div key={key}>
      <dt className="label">{<Icon width={20} height={20} />}</dt>
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

const Item = ({ item, onRemoveItem }: ItemProps) => {
  const handleClick = () => {
    onRemoveItem(item);
  };

  return (
    <li className="story">
      <div className="storyLink">
        <div className="storyLinkData">
          <a href={item.url} target="_blank" className="storyLink">
            {item.title}
          </a>
          <StoryInfo item={item} />
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

const TableHead = ({
  sort,
  onClick,
}: {
  sort: SortState;
  onClick: (sort: sort) => void;
}) => {
  return (
    <thead className="headTable">
      <tr>
        {fields.map((field) => {
          return (
            <th key={field.key} scope="col" style={{ width: field.width }}>
              <button
                onClick={() => {
                  if (field.key === 'ACTIONS') return;
                  onClick(field.value);
                }}
                style={{
                  color:
                    sort.sortType == field.value
                      ? 'var(--secondary)'
                      : 'var(--black)',
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
                className={field.key}
              >
                {field.label}
                {sort.sortType == field.value ? (
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
                  <div
                    style={{ display: 'flex', width: '18px', height: '18px' }}
                  ></div>
                )}
              </button>
            </th>
          );
        })}
        {/* <th className="actions" scope="col" style={{ width: '10%'}}>
        Actions
        </th> */}
      </tr>
    </thead>
  );
};

const TableList = ({
  list,
  sort,
  onRemoveItem,
  sortAction,
}: TableListProps) => {
  return (
    <table>
      <TableHead sort={sort} onClick={sortAction} />

      <tbody>
        {list.map((item: Story) => {
          const handleClick = () => {
            onRemoveItem(item);
          };
          return (
            <tr key={item.objectId}>
              <th>
                <a href={item.url} target="_blank">
                  {item.title}
                </a>
              </th>
              <td>{item.author}</td>
              <td>{item.numComments}</td>
              <td>{item.points}</td>
              <td>
                <RemoveButton onClick={handleClick} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CommonList = ({ list, onRemoveItem }: CommonListProps) => (
  <ul className="news">
    {list.map((item: Story) => (
      <Item key={item.objectId} item={item} onRemoveItem={onRemoveItem} />
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

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = useState<SortState>({
    sortType: 'POINTS',
    isReverse: true,
  });
  const [display, setDisplay] = useState<DisplayType>('CARD');

  const hasNews = list?.length > 0;

  if (!hasNews) return;

  const sortedList = sort.isReverse
    ? sortList(list, sort.sortType).reverse()
    : sortList(list, sort.sortType);

  return (
    <section className="listContainer">
      <div className="listControls">
        <SortProps
          sort={sort}
          label="Sort by"
          onClick={(sortType, isReverse) => {
            setSort({ ...sort, sortType: sortType, isReverse });
          }}
        />

        <Display
          display={display}
          onClick={(display: DisplayType) => {
            setDisplay(display);
          }}
        />
      </div>

      {display === 'CARD' && (
        <CommonList list={sortedList} onRemoveItem={onRemoveItem} />
      )}

      {display === 'LIST' && (
        <TableList
          list={sortedList}
          sort={sort}
          onRemoveItem={onRemoveItem}
          sortAction={(sortType) => {
            const isReverse = sort.sortType === sortType && !sort.isReverse;
            setSort({ ...sort, sortType: sortType, isReverse: isReverse });
          }}
        />
      )}
    </section>
  );
};

type ListWithObserverProps = {
  stories: StoriesState;
  onRemoveItem: (item: Story) => void;
  handleMore: () => void;
};

const ListWithObserver = memo(
  ({
    stories,
    onRemoveItem,
    handleMore,
  }: ListWithObserverProps) => {
    const render = !stories.isNoResults && stories.data.hits.length > 0;
    if (!render) return null;

    return (
      <div>
        {!stories.isLoading && (
          <div>
            <List list={stories.data.hits} onRemoveItem={onRemoveItem} />
            <EndContentElement
              stories={stories}
              handleMore={handleMore}
            />
          </div>
        )}
      </div>
    );
  },
);

export { ListWithObserver };
