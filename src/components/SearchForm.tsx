import InputWithLabel from './InputWithLabel';

import SearchIcon from '../assets/search.svg?react';

type SearchFormProps = {
  search: string;
  handleSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  searchAction: (formData: FormData) => void;
};

const SearchForm = ({
  search,
  handleSearchInput,
  searchAction,
}: SearchFormProps) => {
  return (
    <form className="searchForm" action={searchAction}>
      <InputWithLabel
        id="searchQuery"
        type="text"
        value={search}
        placeholder={'React, Angular, Vue...'}
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!search}>
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchForm;
