import { useState } from 'react';
import Select, {
  components,
  ValueContainerProps,
  StylesConfig,
  DropdownIndicatorProps,
  SingleValue,
} from 'react-select';
import { Field, SortPropsProps } from '../../types/types';
import Caret from '../../assets/caret.svg?react';

const ALL_FIELDS: Record<string, Field> = {
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
  POINTS_DESC: { key: 'POINTS_DESC', label: 'Most points', value: 'POINTS' },
  POINTS_ASC: { key: 'POINTS_ASC', label: 'Least points', value: 'POINTS' },
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
  DATE_DESC: { key: 'DATE_DESC', label: 'Newest', value: 'CREATED_AT' },
  DATE_ASC: { key: 'DATE_ASC', label: 'Oldest', value: 'CREATED_AT' },
  STORY_ASC: { key: 'STORY_ASC', label: 'Story title (A-Z)', value: 'TITLE' },
  STORY_DESC: { key: 'STORY_DESC', label: 'Story title (Z-A)', value: 'TITLE' },
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

const CustomValueContainer = ({
  children,
  ...props
}: ValueContainerProps<Field, false>) => (
  <components.ValueContainer {...props}>
    <div
      style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
    >
      <span className="sortProps-label">{props.selectProps.placeholder}:</span>
      {children}
    </div>
  </components.ValueContainer>
);

const CustomDropdownIndicator = (
  props: DropdownIndicatorProps<Field, false>,
) => (
  <components.DropdownIndicator {...props}>
    <Caret
      width={12}
      height={12}
      style={{
        color: 'var(--dark-gray)',
        transform: props.selectProps.menuIsOpen
          ? 'rotate(180deg)'
          : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    />
  </components.DropdownIndicator>
);

const SortProps = ({
  sort,
  label,
  type = 'story',
  onClick,
}: SortPropsProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const options = FIELDS_BY_TYPE[type];
  const direction = sort.isReverse ? 'DESC' : 'ASC';

  const currentValue = options.find(
    (f) => f.value === sort.sortType && f.key.endsWith(`_${direction}`),
  );

  const isOptionSelected = (option: Field) => {
    return (
      option.value === sort.sortType && option.key.endsWith(`_${direction}`)
    );
  };

  const styles: StylesConfig<Field, false> = {
    control: (base, state) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      background: 'transparent',
      height: '2.5rem',
      minHeight: '2.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      outline: state.isFocused ? '2px solid #616060' : 'none',
      outlineOffset: '2px',
      borderRadius: 'var(--boder-radius-app)',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      height: '2.5rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--secondary)',
      fontWeight: 500,
      margin: '0 0 0 10px',
      position: 'static',
      transform: 'none',
      display: 'flex',
      alignItems: 'center',
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '2.5rem',
    }),
    menu: (base) => ({ ...base, margin: 0, zIndex: 9999 }),
  };

  return (
    <div className="sortProps">
      <Select<Field, false>
        instanceId="sort-select-id"
        options={options}
        value={currentValue}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        isOptionSelected={isOptionSelected}
        onChange={(opt: SingleValue<Field>) => {
          if (opt) {
            onClick(opt.value, opt.key.endsWith('_DESC'));
            setMenuIsOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !menuIsOpen) {
            setMenuIsOpen(true);
            e.preventDefault();
          }
        }}
        placeholder={label}
        className="sortProps-select-container"
        classNamePrefix="sortProps"
        isSearchable={false}
        styles={styles}
        components={{
          ValueContainer: CustomValueContainer,
          DropdownIndicator: CustomDropdownIndicator,
        }}
      />
    </div>
  );
};

export default SortProps;
