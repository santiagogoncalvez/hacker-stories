import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDataType } from '../utils/urlHelpers';
import { Sort } from '../types/types';

export function useStoryParams() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const pathname = location.pathname;
  const dataType = getDataType(pathname) || 'story';
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 0;
  const sort = (searchParams.get('sort') || 'RELEVANCE') as Sort;

  const searchAction = useCallback(
    (term: string) => {
      const trimmed = term.trim();

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (trimmed) next.set('query', trimmed);
        else next.delete('query');

        next.delete('page');
        next.delete('sort');

        return next;
      });
    },
    [setSearchParams],
  );

  const searchLiveAction = useCallback(
    (term: string) => {
      const trimmed = term.trim();

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (trimmed) next.set('query', trimmed);
        else next.delete('query');

        next.delete('page');

        return next;
      });
    },
    [setSearchParams],
  );

  const setPageAction = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (newPage > 0) next.set('page', newPage.toString());
        else next.delete('page');

        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const setSortAction = useCallback(
    (newSort: Sort) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (newSort && newSort !== 'RELEVANCE') {
          next.set('sort', newSort);
        } else {
          next.delete('sort');
        }

        next.delete('page');

        return next;
      }, { replace: true });
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
    sort,
    searchAction,
    searchLiveAction,
    setPageAction,
    setSortAction,
    resetParams,
    setSearchParams,
  };
}
