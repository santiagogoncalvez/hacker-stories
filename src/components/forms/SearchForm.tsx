import * as Ariakit from '@ariakit/react';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import SearchIcon from '../../assets/search.svg?react';
import CloseButton from '../ui/CloseButton';
import { SearchFormProps } from '../../types/types';
import { useStoryParams } from '../../hooks/useStoryParams';
import { LAST_SEARCHES_KEY } from '../../constants/stories';
import { computeLastSearches } from '../../utils/searches';

export default function SearchForm({
  placeholder = 'Search...',
  mode = 'button',
  searchActionLive,
  searchInitLive,
}: SearchFormProps) {
  const { query: searchInit, searchAction } = useStoryParams();
  const effectiveInit = mode === 'live' ? (searchInitLive ?? '') : searchInit;

  const [lastSearches, setLastSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem(LAST_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const handleRemoveLastSearch = (term: string) => {
    setLastSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const MAX_LAST_SEARCHES = 5;
  const items = lastSearches
    .filter((s) => typeof s === 'string' && s.trim() !== '')
    .slice(0, MAX_LAST_SEARCHES);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null); // Referencia al form para el click outside
  const userTypedValue = useRef(effectiveInit);
  const lastSearchRef = useRef<string>(effectiveInit);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const store = Ariakit.useComboboxStore({
    defaultValue: effectiveInit,
    setValue: (newValue: string) => {
      if (mode === 'live' && activeIndex === null) {
        executeSearch(newValue);
      }
    },
  });

  // NUEVO: Listener para cerrar cuando se clickea fuera o se pierde el foco de la ventana
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        store.setOpen(false);
      }
    };

    const handleWindowBlur = () => {
      store.setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [store]);

  useEffect(() => {
    store.setValue(effectiveInit);
    userTypedValue.current = effectiveInit;
    lastSearchRef.current = effectiveInit;
    setActiveIndex(null);
  }, [effectiveInit, store]);

  const executeSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === lastSearchRef.current) return;
    lastSearchRef.current = trimmed;

    if (mode === 'live' && searchActionLive) {
      searchActionLive(trimmed);
      return;
    } else {
      searchAction(trimmed);
    }

    // Esta parte solo se ejecutará si NO es modo live
    if (trimmed) {
      setLastSearches((prev) => {
        const next = computeLastSearches(trimmed, prev);
        localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(next));
        return next;
      });
    }
  };

  const handleClearInput = () => {
    store.setValue('');
    userTypedValue.current = '';
    setActiveIndex(null);
    store.setOpen(true);
    inputRef.current?.focus();
    if (mode === 'live') executeSearch('');
  };

  const commitSearch = (value: string) => {
    executeSearch(value);
    store.setOpen(false);
    setActiveIndex(null);
    setTimeout(() => inputRef.current?.blur(), 0);
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
      ref={formRef}
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
          className={mode === 'live' ? 'live' : ''}
          placeholder={placeholder}
          onFocus={() => {
            if (items.length > 0) store.setOpen(true);
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

      {mode === 'button' && (
        <button
          type="submit"
          className="searchControls-submitBt"
          aria-label="Search"
        >
          <SearchIcon width={18} height={18} />
        </button>
      )}

      {items.length > 0 && mode === 'button' && (
        <Ariakit.ComboboxPopover
          store={store}
          portal={false}
          className="searchHistory"
          hideOnInteractOutside={true} // Refuerzo de Ariakit
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
