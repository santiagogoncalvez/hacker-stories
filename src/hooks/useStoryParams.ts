import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDataType } from '../utils/urlHelpers';

export function useStoryParams() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const pathname = location.pathname;
  const dataType = getDataType(pathname) || 'story';
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 0;

  const searchAction = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      setSearchParams((prev) => {
        if (trimmed) prev.set('query', trimmed);
        else prev.delete('query');
        prev.delete('page'); // Reset siempre al buscar
        return prev;
      });
    },
    [setSearchParams],
  );

  const setPageAction = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          if (newPage > 0) prev.set('page', newPage.toString());
          else prev.delete('page');
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    dataType,
    query,
    page,
    searchAction,
    setPageAction,
    resetParams,
    setSearchParams,
  };
}
