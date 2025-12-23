import { Story, sort } from '../types/types';
import { sortBy } from 'lodash';

type SortActions = {
  TITLE: (list: Story[]) => Story[];
  AUTHOR: (list: Story[]) => Story[];
  COMMENTS: (list: Story[]) => Story[];
  POINTS: (list: Story[]) => Story[];
};

const sortActions: SortActions = {
  TITLE: (list: Story[]) =>
    sortBy(list, (item) => item.title?.toLowerCase() ?? ''),
  AUTHOR: (list: Story[]) =>
    sortBy(list, (item) => item.author?.toLowerCase() ?? ''),
  COMMENTS: (list: Story[]) => sortBy(list, 'numComments'),
  POINTS: (list: Story[]) => sortBy(list, 'points'),
  COMMENT_TEXT: (list: Story[]) =>
    sortBy(list, (item) => item.commentText?.toLowerCase() ?? ''),
  CREATED_AT: (list: Story[]) => sortBy(list, 'createdAtI'),
};

export function sortList(list: Story[], sort: sort) {
  const action = sortActions[sort];
  return action ? action(list) : list;
}

export const sortActionList = (sort, list) => {
  return sort.isReverse
    ? sortList(list, sort.sortType).reverse()
    : sortList(list, sort.sortType);
};
