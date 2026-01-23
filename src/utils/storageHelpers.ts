import { LAST_SEARCHES_KEY } from '../constants/stories';

export const getLastSearchesFromStorage = (): string[] => {
  try {
    const raw = localStorage.getItem(LAST_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
