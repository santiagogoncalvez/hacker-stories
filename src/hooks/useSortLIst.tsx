import { useMemo } from 'react';
import { sortList } from '../utils/sortActions';
import { SortState, Story } from '../types/types';

const useSortList = ({ sort, list }: { sort: SortState; list: Story[] }) => {
  const sortedList = useMemo(() => {
    const sorted = sortList(list, sort.sortType);
    return sort.isReverse ? [...sorted].reverse() : sorted;
  }, [list, sort]);

  return { sortedList };
};

export { useSortList };
