import InputWithLabel from './InputWithLabel';
import SearchIcon from '../assets/search.svg?react';
import HistoryIcon from '../assets/history.svg?react';
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
  submitMode?: SubmitMode; // 👈 NUEVO
};

const SearchForm = ({
  searchInit = '',
  searchAction,
  lastSearches = [],
  placeholder = 'Search hacker news...',
  submitMode = 'submit', // 👈 default seguro
}: SearchFormProps) => {
  const [search, setSearch] = useState(searchInit);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearch(searchInit);
  }, [searchInit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = search.trim();
    if (!value) return;

    if (submitMode === 'submit') {
      searchAction(value);
    }

    // en ambos casos cerramos UI
    setOpen(false);
  };

  const onSearchInput = (
    value: string | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = typeof value === 'string' ? value : value.target.value;

    setSearch(nextValue);

    // 🔥 filter live
    if (submitMode === 'filter') {
      searchAction(nextValue);
    }
  };

  const handleLastSearch = (value: string) => {
    setSearch(value);
    searchAction(value);
    setOpen(false);
  };

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
        </div>

        <button
          type="submit"
          className="searchControls-submitBt"
          disabled={!search.trim()}
          aria-label="Submit form"
        >
          <SearchIcon />
        </button>

        {open && lastSearches.length > 0 && (
          <SearchHistory
            lastSearches={lastSearches}
            onSelect={handleLastSearch}
          />
        )}
      </form>
    </div>
  );
};

export default SearchForm;
