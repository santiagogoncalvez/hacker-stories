import * as Ariakit from '@ariakit/react';
import { useEffect, useRef, useState } from 'react';
import SearchIcon from '../../assets/search.svg?react';
import CloseButton from '../ui/CloseButton';

const MAX_LAST_SEARCHES = 5;

type SearchFormProps = {
  searchInit?: string;
  searchAction: (value: string) => void;
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

  const [draft, setDraft] = useState(searchInit);
  const userDraftRef = useRef(searchInit);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastSearchRef = useRef<string>(searchInit);

  // Referencia para manipular el foco del input manualmente si es necesario
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(searchInit);
    userDraftRef.current = searchInit;
    setActiveIndex(null);
    lastSearchRef.current = searchInit;
  }, [searchInit]);

  const store = Ariakit.useComboboxStore({
    value: draft,
    setValue: (value) => {
      setDraft(value);
      userDraftRef.current = value;
      setActiveIndex(null);
    },
    autoSelect: false,
  });

  const executeSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === lastSearchRef.current) return;
    lastSearchRef.current = trimmed;
    searchAction(trimmed);
  };

  useEffect(() => {
    if (mode === 'live' && activeIndex === null) {
      executeSearch(draft);
    }
  }, [draft, mode, activeIndex]);

  // --- LÓGICA DE LIMPIEZA CORREGIDA ---
  const handleClearInput = () => {
    // 1. Limpiar estados locales
    setDraft('');
    userDraftRef.current = '';
    setActiveIndex(null);

    // 2. Limpiar store de Ariakit
    store.setValue('');

    // 3. Forzar apertura del popup (para mostrar historial)
    store.setOpen(true);

    // 4. Asegurar foco (por si acaso)
    inputRef.current?.focus();

    if (mode === 'live') {
      executeSearch('');
    }
  };

  const moveDown = () => {
    if (items.length === 0) return;
    if (activeIndex === null) {
      setActiveIndex(0);
    } else if (activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(null);
    }
  };

  const moveUp = () => {
    if (items.length === 0) return;
    if (activeIndex === null) {
      setActiveIndex(items.length - 1);
    } else if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(null);
    }
  };

  const resetToUserDraft = () => {
    setActiveIndex(null);
    setDraft(userDraftRef.current);
  };

  const commitSearch = (value: string) => {
    userDraftRef.current = value;
    setDraft(value);
    setActiveIndex(null);
    executeSearch(value);
    store.setOpen(false);
  };

  const displayedDraft =
    activeIndex === null ? userDraftRef.current : items[activeIndex];

  return (
    <form
      className="searchForm"
      onSubmit={(e) => {
        e.preventDefault();
        commitSearch(displayedDraft);
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
          ref={inputRef} // Vinculamos la ref
          store={store}
          id="searchQuery"
          placeholder={placeholder}
          value={displayedDraft}
          onChange={(e) => {
            const val = e.target.value;
            setDraft(val);
            userDraftRef.current = val;
            setActiveIndex(null);
          }}
          onKeyDown={(e) => {
            const isOpen = store.getState().open;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!isOpen) {
                store.setOpen(true);
                return;
              }
              moveDown();
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!isOpen) {
                store.setOpen(true);
                return;
              }
              moveUp();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              resetToUserDraft();
              store.setOpen(false);
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              commitSearch(displayedDraft);
            }
          }}
          style={{ width: '100%', paddingRight: draft ? '40px' : '10px' }}
        />

        {/* Botón de cruz para limpiar */}
        {draft && (
          <CloseButton
            // Usamos onMouseDown con preventDefault para evitar perder el foco del input
            onMouseDown={(e) => {
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
              data-active-item={activeIndex === index || undefined}
              onClick={() => commitSearch(item)}
            >
              <div className="searchHistory-button">{item}</div>
              <CloseButton
                onMouseDown={(e) => {
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
