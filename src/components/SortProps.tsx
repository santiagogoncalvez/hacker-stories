import { useState } from 'react';
import { SortPropsProps, Field } from '../types/types';
import Caret from '../assets/caret.svg?react';
import { transform } from 'lodash';

const fields: Array<Field> = [
  { key: 'POINTS_DESC', label: 'Most popular', value: 'POINTS' },
  { key: 'POINTS_ASC', label: 'Least popular', value: 'POINTS' },
  { key: 'COMMENTS_DESC', label: 'Most comments', value: 'COMMENTS' },
  { key: 'COMMENTS_ASC', label: 'Fewest comments', value: 'COMMENTS' },
  { key: 'TITLE_ASC', label: 'Title (A-Z)', value: 'TITLE' },
  { key: 'TITLE_DESC', label: 'Title (Z-A)', value: 'TITLE' },
  { key: 'AUTHOR_ASC', label: 'Author (A-Z)', value: 'AUTHOR' },
  { key: 'AUTHOR_DESC', label: 'Author (Z-A)', value: 'AUTHOR' },
];

const SortProps = ({ sort, label, onClick }: SortPropsProps) => {
  const [open, setOpen] = useState(false);

  // 🔹 valor derivado (NO state)
  const direction = sort.isReverse ? 'DESC' : 'ASC';

  const currentOption = fields.find(
    (f) => f.value === sort.sortType && f.key.endsWith(`_${direction}`),
  );

  return (
    <div className="sortProps">
      <button
        className="sortProps-openButton"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <span className="sortProps-label">{label}</span>:{' '}
          <span className="sortProps-sortType">{currentOption?.label}</span>
        </div>
        <Caret
          width={13}
          height={13}
          style={{
            color: 'var(--dark-gray)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div className="sortProps-options">
          {fields.map((field) => {
            const isActive =
              field.value === sort.sortType &&
              field.key.endsWith(`_${direction}`);

            return (
              <button
                key={field.key}
                className="sortProps-option"
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (isActive) return;

                  onClick(field.value, field.key.endsWith('_DESC'));
                }}
                style={{
                  backgroundColor: isActive
                    ? 'var(--secondary)'
                    : 'var(--light-primary)',
                }}
              >
                <span>{field.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortProps;
