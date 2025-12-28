import * as Ariakit from '@ariakit/react';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import SearchIcon from '../../assets/search.svg?react';
import CloseButton from '../ui/CloseButton';

const MAX_LAST_SEARCHES = 5;

type SearchFormProps = {
  searchInit?: string;
  searchAction: (value: string) => void;
  // Cambiado a no opcional si se usa en el render, o añadir validación
  handleRemoveLastSearch: (value: string) => void;
  lastSearches?: string[];
  placeholder?: string;
  mode?: 'button' | 'live';
};

export default function SearchForm({
  searchInit = '',
  searchAction,
  handleRemoveLastSearch,
  lastSearches = [],
  placeholder = 'Search...',
  mode = 'button',
}: SearchFormProps) {
  const items = lastSearches
    .filter((s) => typeof s === 'string' && s.trim() !== '')
    .slice(0, MAX_LAST_SEARCHES);

  const inputRef = useRef<HTMLInputElement>(null);
  const userTypedValue = useRef(searchInit);
  const lastSearchRef = useRef<string>(searchInit);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const store = Ariakit.useComboboxStore({
    defaultValue: searchInit,
    setValue: (newValue: string) => {
      if (mode === 'live' && activeIndex === null) {
        executeSearch(newValue);
      }
    },
  });

  useEffect(() => {
    store.setValue(searchInit);
    userTypedValue.current = searchInit;
    lastSearchRef.current = searchInit;
    setActiveIndex(null);
  }, [searchInit, store]);

  const executeSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === lastSearchRef.current) return;
    lastSearchRef.current = trimmed;
    searchAction(trimmed);
  };

  const handleClearInput = () => {
    store.setValue('');
    userTypedValue.current = '';
    setActiveIndex(null);
    store.setOpen(true);
    inputRef.current?.focus();

    if (mode === 'live') {
      executeSearch('');
    }
  };

  const commitSearch = (value: string) => {
    executeSearch(value);
    store.setOpen(false);
    setActiveIndex(null);
  };

  const moveSelection = (direction: 'up' | 'down') => {
    if (items.length === 0) return;
    let nextIndex: number | null = activeIndex;

    if (direction === 'down') {
      if (activeIndex === null) nextIndex = 0;
      else if (activeIndex < items.length - 1) nextIndex = activeIndex + 1;
      else nextIndex = null;
    } else {
      if (activeIndex === null) nextIndex = items.length - 1;
      else if (activeIndex > 0) nextIndex = activeIndex - 1;
      else nextIndex = null;
    }

    setActiveIndex(nextIndex);
    store.setValue(
      nextIndex !== null ? items[nextIndex] : userTypedValue.current,
    );
  };

  const currentStoreValue = store.useState('value');

  return (
    <form
      className="searchForm"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        commitSearch(currentStoreValue);
      }}
      style={{ position: 'relative' }}
    >
      <div
        className="search-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <Ariakit.Combobox
          ref={inputRef}
          store={store}
          id="searchQuery"
          placeholder={placeholder}
          onFocus={() => {
            if (items.length > 0) {
              store.setOpen(true);
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userTypedValue.current = e.target.value;
            setActiveIndex(null);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const isOpen = store.getState().open;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!isOpen) store.setOpen(true);
              else moveSelection('down');
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!isOpen) store.setOpen(true);
              else moveSelection('up');
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              store.setValue(userTypedValue.current);
              setActiveIndex(null);
              store.setOpen(false);
            }
          }}
          style={{
            width: '100%',
            paddingRight: currentStoreValue ? '40px' : '10px',
          }}
        />

        {currentStoreValue && (
          <CloseButton
            // Tipado del MouseEvent
            onMouseDown={(e: MouseEvent<HTMLElement>) => {
              e.preventDefault();
              e.stopPropagation();
              handleClearInput();
            }}
            size={18}
            className="searchHistory-remove"
          />
        )}
      </div>

      <button
        type="submit"
        className="searchControls-submitBt"
        aria-label="Search"
      >
        <SearchIcon width={18} height={18} />
      </button>

      {items.length > 0 && (
        <Ariakit.ComboboxPopover
          store={store}
          portal={false}
          className="searchHistory"
        >
          {items.map((item, index) => (
            <Ariakit.ComboboxItem
              key={item}
              value={item}
              className="searchHistory-option"
              focusOnHover
              data-active-item={activeIndex === index || undefined}
              onClick={() => commitSearch(item)}
            >
              <div className="searchHistory-button">{item}</div>
              <CloseButton
                // Tipado del MouseEvent
                onMouseDown={(e: MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveLastSearch(item);
                }}
                size={18}
                className="searchHistory-remove"
              />
            </Ariakit.ComboboxItem>
          ))}
        </Ariakit.ComboboxPopover>
      )}
    </form>
  );
}
