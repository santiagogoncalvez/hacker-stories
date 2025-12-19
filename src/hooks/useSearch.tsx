import { useStorageState } from './useStorageState';

export function useSearch({ search: searchInit = '' }: { search: string }) {
  const [search, setSearch] = useStorageState(searchInit, '');

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ) => {
    setSearch(event.target.value);
  };

  return { search, setSearch, handleSearchInput };
}
