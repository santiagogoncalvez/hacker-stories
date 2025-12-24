export const formatUpdatedDate = (prefix: string, timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
  return `${prefix}${formatted}`;
};
