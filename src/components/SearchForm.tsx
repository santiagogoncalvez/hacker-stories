import InputWithLabel from './InputWithLabel';
import SearchIcon from '../assets/search.svg?react';
import HistoryIcon from '../assets/history.svg?react';
import { useState } from 'react';
import { useStoriesContext } from '../hooks/useStoriesContext';

type SearchFormProps = {
  search: string;
  lastSearches: string[];
  onSearchInput: (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ) => void;
  searchAction: (value: string) => void;
  handleLastSearch: (search: string) => void;
};

type SearchHistoryProps = {
  lastSearches: string[];
  onSelect: (value: string) => void;
};

const SearchHistory = ({ lastSearches, onSelect }: SearchHistoryProps) => {
  return (
    <ul className="searchHistory">
      {lastSearches.map((search) => {
        // if (!search) return;
        return (
          <li key={search} className="searchHistory-option">
            <button
              type="button"
              className="searchHistory-button"
              onClick={() => {
                onSelect(search);
              }}
            >
              <HistoryIcon width={18} height={18} />
              <span>{search}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};


const SearchForm = ({searchInit}) => {
  const [search, setSearch] = useState(searchInit);
  const [open, setOpen] = useState(false);

  const { searchAction, lastSearches } = useStoriesContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    searchAction(search);
    setOpen(false);
  };

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOpen(true);
  };

  const handleLastSearch = (term: string) => {
    setSearch(term);
    searchAction(term);
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
            placeholder="Search hacker news..."
            onInputChange={onSearchInput}
            onFocus={() => setOpen(true)}
            onBlur={() =>{}}
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
