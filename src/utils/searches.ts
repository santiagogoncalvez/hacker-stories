import { MAX_LAST_SEARCHES } from '../constants/stories';

export const extractSearchTerm = (url: string) => {
  const formattedUrl = new URL(url);
  const search = formattedUrl.searchParams.get('query') || '';
  return search;
};

export const extractPage = (url: string) => {
  const formattedUrl = new URL(url);
  const page = formattedUrl.searchParams.get('page') || '';
  return Number(page);
};

export const extractTag = (url: string) => {
  const formattedUrl = new URL(url);
  const tag = formattedUrl.searchParams.get('tags') || '';
  return tag;
};

export const computeLastSearches = (term: string, currentList: string[]) => {
  const normalized = term.trim();
  const lower = normalized.toLowerCase();
  const filtered = currentList.filter((s) => s.toLowerCase() !== lower);
  return [normalized, ...filtered].slice(0, MAX_LAST_SEARCHES);
};
