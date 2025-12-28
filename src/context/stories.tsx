import { createContext, ReactNode } from 'react';
import { useStories } from '../hooks/useStories';
import { StoriesContextType } from '../types/types';
// import { StoriesContextType } from '../types/types';



// Inicializamos con el tipo o undefined
export const StoriesContext = createContext<StoriesContextType | undefined>(
  undefined,
);

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const {
    stories,
    search,
    lastSearches,
    searchAction,
    handleMoreStories,
    handleRemoveStory, // Este es el handleRemoveStory que disparaba el dispatch
    handleRemoveLastSearch,
  } = useStories('');

  // El value ahora coincide perfectamente con StoriesContextType
  const value: StoriesContextType = {
    stories,
    search,
    lastSearches,
    searchAction,
    handleMoreStories,
    handleRemoveStory,
    handleRemoveLastSearch,
  };

  return (
    <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>
  );
};
