import { useState } from 'react';
import { Story, SortState, sort as SortType } from '../../../types/types';
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

const COMMENT_PREVIEW_LENGTH = 120;

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
                    {/* ===== TITLE ===== */}
                    {field.key === 'TITLE' && type === 'story' && (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    )}

                    {field.key === 'TITLE' && type === 'comment' && (
                      <a href={item.storyUrl} target="_blank" rel="noreferrer">
                        {item.storyTitle}
                      </a>
                    )}

                    {/* ===== COMMENT (solo columna COMMENT) ===== */}
                    {field.key === 'COMMENT_TEXT' && (
                      <>
                        <span>
                          {isExpanded
                            ? item.commentText
                            : item.commentText?.slice(
                                0,
                                COMMENT_PREVIEW_LENGTH,
                              )}
                        </span>

                        {item.commentText &&
                          item.commentText.length > COMMENT_PREVIEW_LENGTH && (
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

                    {/* ===== COMMENTS ===== */}
                    {field.key === 'COMMENTS' &&
                      type === 'story' &&
                      item.numComments}

                    {field.key === 'COMMENTS' && type === 'comment' && (
                      <>
                        <span>
                          {isExpanded
                            ? item.commentText
                            : item.commentText?.slice(
                                0,
                                COMMENT_PREVIEW_LENGTH,
                              )}
                        </span>

                        {item.commentText &&
                          item.commentText.length > COMMENT_PREVIEW_LENGTH && (
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

                    {/* ===== AUTHOR ===== */}
                    {field.key === 'AUTHOR' && item.author}

                    {/* ===== POINTS (solo stories) ===== */}
                    {field.key === 'POINTS' && type === 'story' && item.points}

                    {/* ===== CREATED AT ===== */}
                    {field.key === 'CREATED_AT' &&
                      formatUpdatedDate('', item.createdAtI)}

                    {/* ===== STORY TITLE ===== */}
                    {field.key === 'STORY_TITLE' && (
                      <a href={item.url}>{item.title}</a>
                    )}

                    {/* ===== ACTION ===== */}
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
