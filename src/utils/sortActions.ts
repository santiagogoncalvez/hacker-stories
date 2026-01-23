import { Story, SortState } from '../types/types'; // Asumo que 'Sort' empieza con mayúscula en tu archivo de tipos
import { sortBy } from 'lodash';

const sortActions = {
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

// 2. Tipamos el parámetro 'sort'.
// Usamos 'Sort['sortType']' para referirnos específicamente al string de la acción (e.g., 'TITLE')
export function sortList(
  list: Story[],
  sortType: SortState['sortType'],
): Story[] {
  const action = sortActions[sortType];
  return action ? action(list) : list;
}

// 3. Tipamos 'sortActionList' con el objeto Sort completo
export const sortActionList = (sort: SortState, list: Story[]): Story[] => {
  return sort.isReverse
    ? sortList(list, sort.sortType).reverse()
    : sortList(list, sort.sortType);
};
