import { ReactNode, useCallback, useMemo } from 'react';
import { useStories } from '../hooks/useStories';
import { useStoryParams } from '../hooks/useStoryParams'; // Importamos el hook de URL
import { StoriesContext } from './createStoriesContext';
import { StoriesContextType } from '../types/types';

interface StoriesProviderProps {
  children: ReactNode;
  query: string;
  page: number;
  dataType: string;
}

export const StoriesProvider = ({
  children,
  query,
  page,
  dataType,
}: StoriesProviderProps) => {
  // 1. Obtenemos las acciones de la URL
  const { setPageAction } = useStoryParams();

  // 2. Obtenemos la data (que reacciona a query/page/dataType)
  const { stories, hasNextPage } = useStories({
    query,
    page,
    dataType,
  });

  // 3. AHORA: El botón "More" solo actualiza la URL
  const handleMoreStories = useCallback(() => {
    if (hasNextPage) {
      setPageAction(page + 1);
    }
  }, [hasNextPage, setPageAction, page]);

  // Memorizamos el valor para evitar re-renders innecesarios de los consumidores
  const value = useMemo(
    () => ({
      stories,
      search: query,
      handleMoreStories,
    }),
    [stories, query, handleMoreStories],
  );

  return (
    <StoriesContext value={value as StoriesContextType}>
      {children}
    </StoriesContext>
  );
};
