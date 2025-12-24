import InputWithLabel from '../ui/InputWithLabel';
import SearchIcon from '../../assets/search.svg?react';
import HistoryIcon from '../../assets/history.svg?react';

import { useEffect, useState } from 'react';
import CloseButton from '../ui/CloseButton';

type SubmitMode = 'submit' | 'filter';

type SearchHistoryProps = {
  lastSearches: string[];
  onSelect: (value: string) => void;
};



const SearchHistory = ({
  lastSearches,
  handleRemoveLastSearch,
  onSelect,
}: SearchHistoryProps) => {
  return (
    <ul className="searchHistory">
      {lastSearches.map((search) => (
        <li key={search} className="searchHistory-option">
          <button
            type="button"
            className="searchHistory-button"
            // Cambiamos a onMouseDown para ganar la carrera contra el onBlur
            onMouseDown={(e) => {
              e.preventDefault(); // Evita que el input pierda el foco
              onSelect(search);
            }}
          >
            <HistoryIcon width={18} height={18} />
            <span>{search}</span>
          </button>

          <CloseButton
            // Cambiamos a onMouseDown aquí también
            onMouseDown={(e) => {
              e.preventDefault(); // IMPORTANTE: evita que el input dispare el onBlur
              e.stopPropagation();
              handleRemoveLastSearch(search);
            }}
            className="searchHistory-remove"
            size={18}
          />
        </li>
      ))}
    </ul>
  );
};



type SearchFormProps = {
  searchInit?: string;
  searchAction: (value: string) => void;
  lastSearches?: string[];
  placeholder?: string;
  submitMode?: SubmitMode;
};

const SearchForm = ({
  searchInit = '',
  searchAction,
  lastSearches = [],
  placeholder = 'Search hacker news...',
  submitMode = 'submit',
  handleRemoveLastSearch,
}: SearchFormProps) => {
  // local input state so user's typing is immediate and not clobbered
  const [search, setSearch] = useState(searchInit);
  const [open, setOpen] = useState(false);

  // Only apply external searchInit to local input when input is NOT focused/open.
  // This prevents flashes when navigation/pop occurs while user is interacting.
  useEffect(() => {
    if (!open) {
      // Only update if different
      if (search !== searchInit) {
        setSearch(searchInit);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = search.trim();

    // Evitar búsqueda duplicada comparando con searchInit (estado actual)
    if (value === searchInit) return;

    if (submitMode === 'submit') {
      searchAction(value);
    }

    setOpen(false);
  };

  const onSearchInput = (
    value: string | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = typeof value === 'string' ? value : value.target.value;
    setSearch(nextValue);

    if (submitMode === 'filter') {
      searchAction(nextValue);
    }
  };

  const handleLastSearch = (value: string) => {
    setSearch(value);
    searchAction(value);
    setOpen(false);
  };

  const handleClear = () => {
    setSearch('');

    if (submitMode === 'filter') {
      searchAction('');
    } else {
      // If submit mode is submit, user cleared input but didn't submit.
      // Optionally we could call searchAction('') to trigger empty search.
    }
  };

  // Filter last searches (non-empty) for the dropdown
  const filteredLastSearches = lastSearches.filter(Boolean);

  return (
    <div className="searchControls">
      <form className="searchForm" onSubmit={handleSubmit}>
        <div className="search-container">
          <InputWithLabel
            id="searchQuery"
            type="text"
            value={search}
            placeholder={placeholder}
            onInputChange={onSearchInput}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setTimeout(() => setOpen(false), 150);
            }}
          />

          {/* Clear button */}
          {search && (
            <CloseButton
              onClick={handleClear}
              className="searchClearButton"
              size={22}
            />
          )}
        </div>

        <button
          type="submit"
          className="searchControls-submitBt"
          aria-label="Submit form"
        >
          <SearchIcon />
        </button>

        {open && filteredLastSearches.length > 0 && (
          <SearchHistory
            lastSearches={filteredLastSearches}
            handleRemoveLastSearch={handleRemoveLastSearch}
            onSelect={handleLastSearch}
          />
        )}
      </form>
    </div>
  );
};

export default SearchForm;
