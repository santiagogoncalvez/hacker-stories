import InputWithLabel from './InputWithLabel';

import SearchIcon from '../../public/search.svg?react';

const SearchForm = ({ search, handleSearchInput, action }) => {
  return (
    <form className="searchForm" action={action}>
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
