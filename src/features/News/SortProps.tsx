import { useEffect, useRef, useState } from 'react';
import { Field, SortPropsProps } from '../../types/types';
import Caret from '../../assets/caret.svg?react';

const ALL_FIELDS: Record<string, Field> = {
  // STORY
  TITLE_ASC: { key: 'TITLE_ASC', label: 'Title (A-Z)', value: 'TITLE' },
  TITLE_DESC: { key: 'TITLE_DESC', label: 'Title (Z-A)', value: 'TITLE' },

  AUTHOR_ASC: { key: 'AUTHOR_ASC', label: 'Author (A-Z)', value: 'AUTHOR' },
  AUTHOR_DESC: { key: 'AUTHOR_DESC', label: 'Author (Z-A)', value: 'AUTHOR' },

  COMMENTS_DESC: {
    key: 'COMMENTS_DESC',
    label: 'Most comments',
    value: 'COMMENTS',
  },
  COMMENTS_ASC: {
    key: 'COMMENTS_ASC',
    label: 'Fewest comments',
    value: 'COMMENTS',
  },

  POINTS_DESC: {
    key: 'POINTS_DESC',
    label: 'Most points',
    value: 'POINTS',
  },
  POINTS_ASC: {
    key: 'POINTS_ASC',
    label: 'Least points',
    value: 'POINTS',
  },

  // COMMENT
  COMMENT_ASC: {
    key: 'COMMENT_ASC',
    label: 'Comment (A-Z)',
    value: 'COMMENT_TEXT',
  },
  COMMENT_DESC: {
    key: 'COMMENT_DESC',
    label: 'Comment (Z-A)',
    value: 'COMMENT_TEXT',
  },

  DATE_DESC: {
    key: 'DATE_DESC',
    label: 'Newest',
    value: 'CREATED_AT',
  },
  DATE_ASC: {
    key: 'DATE_ASC',
    label: 'Oldest',
    value: 'CREATED_AT',
  },

  STORY_ASC: {
    key: 'STORY_ASC',
    label: 'Story title (A-Z)',
    value: 'STORY_TITLE',
  },
  STORY_DESC: {
    key: 'STORY_DESC',
    label: 'Story title (Z-A)',
    value: 'STORY_TITLE',
  },
};

const FIELDS_BY_TYPE: Record<'story' | 'comment', Field[]> = {
  story: [
    ALL_FIELDS.POINTS_DESC,
    ALL_FIELDS.POINTS_ASC,
    ALL_FIELDS.COMMENTS_DESC,
    ALL_FIELDS.COMMENTS_ASC,
    ALL_FIELDS.TITLE_ASC,
    ALL_FIELDS.TITLE_DESC,
    ALL_FIELDS.AUTHOR_ASC,
    ALL_FIELDS.AUTHOR_DESC,
  ],

  comment: [
    ALL_FIELDS.COMMENT_ASC,
    ALL_FIELDS.COMMENT_DESC,
    ALL_FIELDS.AUTHOR_ASC,
    ALL_FIELDS.AUTHOR_DESC,
    ALL_FIELDS.DATE_DESC,
    ALL_FIELDS.DATE_ASC,
    ALL_FIELDS.STORY_ASC,
    ALL_FIELDS.STORY_DESC,
  ],
};


const SortProps = ({
  sort,
  label,
  type = 'story',
  onClick,
}: SortPropsProps) => {
  const [open, setOpen] = useState(false);

  // 2. Creamos una referencia para el contenedor principal
  const sortRef = useRef<HTMLDivElement>(null);

  const visibleFields = FIELDS_BY_TYPE[type];
  const direction = sort.isReverse ? 'DESC' : 'ASC';

  const currentOption = visibleFields.find(
    (f) => f.value === sort.sortType && f.key.endsWith(`_${direction}`),
  );

  // 3. Efecto para detectar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el menú está abierto y el clic NO fue dentro de sortRef, cerramos
      if (
        open &&
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    // Escuchamos el evento mousedown (más rápido que click)
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiamos el evento al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]); // Se vuelve a ejecutar cuando 'open' cambia

  return (
    // 4. Asignamos la ref al div principal
    <div className="sortProps" ref={sortRef}>
      <button
        className="sortProps-openButton"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <span className="sortProps-label">{label}</span>:{' '}
          <span className="sortProps-sortType">
            {currentOption?.label ?? 'Default'}
          </span>
        </div>

        <Caret
          width={13}
          height={13}
          style={{
            color: 'var(--dark-gray)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease', // Opcional: suaviza el giro
          }}
        />
      </button>

      {open && (
        <div className="sortProps-options">
          {visibleFields.map((field) => {
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
                {field.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortProps;
