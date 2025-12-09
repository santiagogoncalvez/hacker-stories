import InputWithLabel from './InputWithLabel';

import SearchIcon from '../assets/search.svg?react';

type SearchFormProps = {
  search: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchAction: (formData: FormData) => void;
};

const SearchForm = ({
  search,
  onSearchInput,
  searchAction,
}: SearchFormProps) => {
  return (
    <form className="searchForm" action={searchAction}>
      <InputWithLabel
        id="searchQuery"
        type="text"
        value={search}
        placeholder={'React, Angular, Vue...'}
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!search} aria-label='Submit form'>
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchForm;
