import { SupportedDataType } from '../types/types';

export const getPageFromURL = (searchParams: URLSearchParams): number => {
  const p = searchParams.get('page');
  const num = p ? parseInt(p, 10) : 0;
  return isNaN(num) || num < 0 ? 0 : num;
};

export const getDataType = (path: string): SupportedDataType | null => {
  if (path === '/') return 'story';
  if (path === '/comments') return 'comment';
  return null;
};
