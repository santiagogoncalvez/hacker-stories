import { useContext } from 'react';
import { StoriesContext } from '../context/createStoriesContext';

export const useStoriesContext = () => {
  const context = useContext(StoriesContext);

  if (context === undefined)
    throw new Error('useStoriesContext must be used within a StoriesProvider');

  return context;
};
