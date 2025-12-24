import InputWithLabel from '../ui/InputWithLabel';
import SearchIcon from '../../assets/search.svg?react';
import HistoryIcon from '../../assets/history.svg?react';
import CrossIcon from '../../assets/cross.svg?react';

import { useEffect, useState } from 'react';

type SubmitMode = 'submit' | 'filter';

type SearchHistoryProps = {
  lastSearches: string[];
  onSelect: (value: string) => void;
};

const SearchHistory = ({ lastSearches, onSelect }: SearchHistoryProps) => {
  return (
    <ul className="searchHistory">
      {lastSearches.map((search) => (
        <li key={search} className="searchHistory-option">
          <button
            type="button"
            className="searchHistory-button"
            onClick={() => onSelect(search)}
          >
            <HistoryIcon width={18} height={18} />
            <span>{search}</span>
          </button>
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
            <button
              type="button"
              className="searchClearButton"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <CrossIcon widtgh={22} height={22} style={{ strokeWidth: '2' }} />
            </button>
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
            onSelect={handleLastSearch}
          />
        )}
      </form>
    </div>
  );
};

export default SearchForm;
