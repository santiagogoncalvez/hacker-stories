
import { SortState, sort as SortType } from '../../../types/types';
import CaretIcon from '../../../assets/caret.svg?react';

type Field = {
  key: string;
  label: string;
  value: string;
  width: string;
};

type TableHeadProps = {
  sort: SortState;
  onClick: (sortType: SortType) => void;
  fields: Field[];
};

const TableHead = ({ sort, onClick, fields }: TableHeadProps) => {
  return (
    <thead className="headTable">
      <tr>
        {fields.map((field) => {
          const isActive = sort.sortType === field.value;

          return (
            <th
              key={field.key}
              scope="col"
              style={{ width: field.width }}
              data-col={field.key}
              className={isActive ? 'activeSortColumn' : ''}
            >
              {field.key === 'ACTION' ? (
                <span className="actionHead">
                  {field.label}
                  <div style={{ width: 18, height: 18 }} />
                </span>
              ) : (
                <button
                  type="button"
                  className={`listContainer__headerButton ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => onClick(field.value as SortType)}
                  aria-sort={
                    isActive
                      ? sort.isReverse
                        ? 'descending'
                        : 'ascending'
                      : 'none'
                  }
                >
                  {field.label}

                  {isActive && (
                    <CaretIcon
                      width={13}
                      height={13}
                      className="caretIcon"
                      style={{
                        transform: sort.isReverse
                          ? 'rotate(0deg)'
                          : 'rotate(-180deg)',
                      }}
                    />
                  )}
                </button>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
