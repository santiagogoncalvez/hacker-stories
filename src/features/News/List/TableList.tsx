import { useState } from 'react';
import { Story, SortState, sort } from '../../../types/types';
import TableHead from './TableHead';
import { FavouriteButton } from './ActionButtons';
import { formatUpdatedDate } from '../../../utils/formatDate';

type TableListProps = {
  list: Story[];
  sort: SortState;
  sortAction: (sortType: sort) => void;
  onRemoveItem: (item: Story) => void;
  fields: { key: string; label: string; value: string; width: string }[];
  type: 'story' | 'comment';
};

const COMMENT_PREVIEW_LENGTH = 120;

const TableList = ({
  list,
  sort,
  sortAction,
  onRemoveItem,
  fields,
  type,
}: TableListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="listContainer__tableContainer">
      <table className="listContainer__responsiveTable">
        <TableHead sort={sort} onClick={sortAction} fields={fields} />

        <tbody>
          {list.map((item) => {
            const isExpanded = expandedId === item.objectId;

            return (
              <tr
                key={item.objectId}
                className={isExpanded ? 'listContainer__rowExpanded' : ''}
              >
                {type === 'comment' ? (
                  <>
                    <td className="listContainer__cell">
                      <span
                        className={`listContainer__cellInner ${isExpanded ? 'listContainer__expanded' : ''}`}
                      >
                        {isExpanded
                          ? item.commentText
                          : item.commentText.slice(0, COMMENT_PREVIEW_LENGTH)}
                      </span>
                      {item.commentText.length > COMMENT_PREVIEW_LENGTH && (
                        <button
                          type="button"
                          className="commentExpandButton"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.objectId)
                          }
                        >
                          {isExpanded ? 'Collapse' : 'More'}
                        </button>
                      )}
                    </td>

                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        {item.author}
                      </span>
                    </td>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        {formatUpdatedDate('', item.createdAtI)}
                      </span>
                    </td>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      </span>
                    </td>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        {item.author}
                      </span>
                    </td>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        {item.numComments}
                      </span>
                    </td>
                    <td className="listContainer__cell">
                      <span className="listContainer__cellInner">
                        {item.points}
                      </span>
                    </td>
                  </>
                )}

                <td className="listContainer__cell">
                  <FavouriteButton item={item} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
