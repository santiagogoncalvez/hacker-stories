import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'; // Única línea nueva
import { getAsyncStories } from '../services/getAsyncStories';
import { getUrl } from '../constants/apiEndpoints';
import { emptyList, SUPPORTED_DATA_TYPES } from '../constants/stories';

interface UseStoriesProps {
  dataType: string;
  query: string;
  page: number;
}

export function useStories({ dataType, query, page }: UseStoriesProps) {
  const queryClient = useQueryClient(); // Nuevo: para poder resetear
  const isInitialFetch = useRef(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['stories', dataType, query],
    queryFn: async ({ pageParam = 0 }) => {
      if (!SUPPORTED_DATA_TYPES.includes(dataType)) return emptyList;

      // --- TU LÓGICA ACUMULATIVA (INTACTA) ---
      if (pageParam === 0 && page > 0 && isInitialFetch.current) {
        isInitialFetch.current = false;

        const targetPageRes = await getAsyncStories({
          url: getUrl(query, page, dataType),
        });

        if (
          !targetPageRes ||
          !targetPageRes.hits ||
          targetPageRes.hits.length === 0
        ) {
          return targetPageRes ?? { ...emptyList, page };
        }

        const previousPagesIndices = Array.from({ length: page }, (_, i) => i);
        const results = await Promise.all(
          previousPagesIndices.map((p) =>
            getAsyncStories({ url: getUrl(query, p, dataType) }),
          ),
        );

        const allHits = [
          ...results.flatMap((r) => r?.hits || []),
          ...targetPageRes.hits,
        ];

        return { ...targetPageRes, hits: allHits, page };
      }

      // --- TU CARGA NORMAL (INTACTA) ---
      const res = await getAsyncStories({
        url: getUrl(query, pageParam, dataType),
      });

      isInitialFetch.current = false;
      return res ?? { ...emptyList, page: pageParam };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.nbPages && lastPage.hits.length > 0
        ? lastPage.page + 1
        : undefined,
    initialPageParam: 0,
    enabled: !!dataType,
    refetchOnWindowFocus: false,
  });

  // --- LÓGICA DE RESET AÑADIDA ---
  useEffect(() => {
    // Si la URL se queda limpia, reseteamos el caché de TanStack explícitamente
    if (query === '' && page === 0) {
      queryClient.resetQueries({ queryKey: ['stories', dataType, ''] });
    }
    // Mantenemos tu reseteo del flag de carga acumulativa
    isInitialFetch.current = true;
  }, [query, dataType, page, queryClient]);

  // --- TU REACTIVIDAD AL PAGE (INTACTA) ---
  useEffect(() => {
    const lastLoadedPage = data?.pages[data.pages.length - 1]?.page ?? 0;
    if (page > lastLoadedPage && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [page, data, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // --- TU FORMATEO DE DATA (INTACTA) ---
  const stories = useMemo(() => {
    if (!data) return { ...emptyList, isLoading };

    const allHits = data.pages.flatMap((p) => p.hits);
    const lastPageInfo = data.pages[data.pages.length - 1];

    return {
      hits: allHits,
      page: lastPageInfo.page,
      nbPages: lastPageInfo.nbPages,
      nbHits: lastPageInfo.nbHits,
      isLoading: false,
      isLoadingMore: isFetchingNextPage,
      isError,
      isNoResults: allHits.length === 0 && !isLoading,
    };
  }, [data, isLoading, isFetchingNextPage, isError]);

  return { stories, hasNextPage };
}
