import { createContext } from 'react';
import { useStories } from '../hooks/useStories';

export const StoriesContext = createContext(null);

export const StoriesProvider = ({ children }: { children: any }) => {
  const {
    stories,
    search,
    page,
    lastSearches,
    searchAction,
    handleMoreStories,
    handleRemoveStory,
  } = useStories('');

  return (
    <StoriesContext.Provider
      value={{
        stories,
        search,
        page,
        lastSearches,
        searchAction,
        handleMoreStories,
        handleRemoveStory,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};
