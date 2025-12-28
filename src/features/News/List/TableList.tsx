import { useState } from 'react';
import { Story, SortState, Sort as SortType } from '../../../types/types';
import TableHead from './TableHead';
import { FavouriteButton } from './ActionButtons';
import { formatUpdatedDate } from '../../../utils/formatDate';

type Field = {
  key: string;
  label: string;
  value: string;
  width: string;
};

type TableListProps = {
  list: Story[];
  sort: SortState;
  sortAction: (sortType: SortType) => void;
  onRemoveItem: (item: Story) => void;
  fields: Field[];
  type: 'story' | 'comment';
};

// const COMMENT_PREVIEW_LENGTH = 120;

const TableList = ({
  list,
  sort,
  sortAction,
  fields,
  type,
}: TableListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="listContainer__tableContainer">
      <table
        className="listContainer__responsiveTable"
        data-active-sort={sort.sortType}
        data-type={type}
      >
        <TableHead sort={sort} onClick={sortAction} fields={fields} />

        <tbody>
          {list.map((item) => {
            const isExpanded = expandedId === item.objectId;

            return (
              <tr key={item.objectId}>
                {fields.map((field) => (
                  <td
                    key={field.key}
                    className="listContainer__cell"
                    data-col={field.key}
                  >
                    {/* COLUMNA TITLE (Híbrida) */}
                    {field.key === 'TITLE' &&
                      (item.url ? (
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      ) : (
                        <p
                          style={{
                            display: 'inline',
                            fontSize: '1.2rem',
                            fontWeight: '500',
                            color: 'var(--gray)'
                          }}
                        >
                          {item.title}
                        </p>
                      ))}

                    {/* COLUMNA COMMENT_TEXT */}
                    {field.key === 'COMMENT_TEXT' && (
                      <>
                        <span>
                          {isExpanded
                            ? item.commentText
                            : item.commentText?.slice(0, 120)}
                        </span>
                        {item.commentText && item.commentText.length > 120 && (
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
                      </>
                    )}

                    {/* COLUMNA AUTHOR */}
                    {field.key === 'AUTHOR' && item.author}

                    {/* COLUMNA POINTS */}
                    {field.key === 'POINTS' && type === 'story' && item.points}

                    {/* COLUMNA COMMENTS (Story only) */}
                    {field.key === 'COMMENTS' &&
                      type === 'story' &&
                      item.numComments}

                    {/* COLUMNA CREATED_AT */}
                    {field.key === 'CREATED_AT' &&
                      formatUpdatedDate('', item.createdAtI)}

                    {/* COLUMNA ACTION */}
                    {field.key === 'ACTION' && <FavouriteButton item={item} />}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
