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

export const getLastSearches = (urls: string[]) => {
  const formattedUrls = urls.map(extractSearchTerm);
  const map = new Map();

  for (const item of formattedUrls) {
    if (item === '') continue;
    const key = item.toLowerCase();
    map.delete(key);
    map.set(key, item);
  }

  return Array.from(map.values()).slice(-6, -1).reverse();
};
