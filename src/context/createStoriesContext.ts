import { StoriesContextType } from './../types/types';
import { createContext } from 'react';

export const StoriesContext = createContext<StoriesContextType | undefined>(
  undefined,
);
