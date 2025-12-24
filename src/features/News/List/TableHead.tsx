import React from 'react';
import { SortState, sort, Fields } from '../../../types/types';
import CaretIcon from '../../../assets/caret.svg?react';

type TableHeadProps = {
  sort: SortState;
  onClick: (sortType: sort) => void;
  fields: Fields;
};

const TableHead = ({ sort, onClick, fields }: TableHeadProps) => {
  return (
    <thead className="headTable">
      <tr>
        {fields.map((field) => {
          if (field.key === 'ACTION') {
            return (
              <th key={field.key} scope="col" style={{ width: field.width }}>
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
                onClick={() => onClick(field.value as sort)}
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

export default React.memo(TableHead);
