import { useEffect, useReducer, useRef, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { storiesReducer } from '../reducers/storiesReducer';
import { getAsyncStories } from '../services/getAsyncStories';
import { getUrl } from '../constants/apiEndpoints';
import { Story, ListState, StoriesState } from '../types/types';

const MAX_LAST_SEARCHES = 6;
const LAST_SEARCHES_KEY = 'hn:lastSearches';
const SUPPORTED_DATA_TYPES = ['story', 'comment'] as const;
type SupportedDataType = (typeof SUPPORTED_DATA_TYPES)[number];

/* ================= Helpers fuera del componente ================= */

const getLastSearchesFromStorage = (): string[] => {
  try {
    const raw = localStorage.getItem(LAST_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getPageFromURL = (searchParams: URLSearchParams): number => {
  const p = searchParams.get('page');
  const num = p ? parseInt(p, 10) : 0;
  return isNaN(num) || num < 0 ? 0 : num;
};

const getDataType = (path: string): SupportedDataType | null => {
  if (path === '/') return 'story';
  if (path === '/comments') return 'comment';
  return null;
};

const computeLastSearches = (term: string, currentList: string[]) => {
  const normalized = term.trim();
  const lower = normalized.toLowerCase();
  const filtered = currentList.filter((s) => s.toLowerCase() !== lower);
  return [normalized, ...filtered].slice(0, MAX_LAST_SEARCHES);
};

const emptyList: ListState = {
  hits: [],
  page: 0,
  isLoading: false,
  isLoadingMore: false,
  isNoResults: false,
  isError: false,
  needsFetch: true,
  dataType: null,
  nbHits: 0,
  nbPages: 0, // Campo para el total de páginas
  processingTimeMs: 0,
};

const initialState: StoriesState = {
  search: '',
  searchByType: { story: '', comment: '' },
  lastSearches: [],
  lists: {
    story: { ...emptyList, dataType: 'story' },
    comment: { ...emptyList, dataType: 'comment' },
    fallback: { ...emptyList, dataType: 'fallback' },
  },
};

export function useStories(initialSearch = '') {
  const location = useLocation();
  const { pathname, search: locationSearch } = location;
  const [, setSearchParams] = useSearchParams();
  const dataType = getDataType(pathname);

  const initialUrlParams = useMemo(
    () => new URLSearchParams(locationSearch),
    [locationSearch],
  );
  const currentUrlQuery = initialUrlParams.get('query') ?? '';

  const [state, dispatch] = useReducer(storiesReducer, {
    ...initialState,
    search: currentUrlQuery || initialSearch,
    searchByType: dataType
      ? { [dataType]: currentUrlQuery }
      : { story: '', comment: '' },
    lastSearches: getLastSearchesFromStorage(),
  } as StoriesState);

  // SOLUCIÓN AL WARNING: Memorizamos activeList para que su referencia sea estable
  const activeList = useMemo(() => {
    return dataType ? state.lists[dataType] : { ...emptyList };
  }, [dataType, state.lists]);

  const prevDataTypeRef = useRef<string | null>(null);

  /* 1. Sync URL Query -> State Search */
  useEffect(() => {
    if (
      !dataType ||
      !(SUPPORTED_DATA_TYPES as readonly string[]).includes(dataType)
    )
      return;

    const params = new URLSearchParams(locationSearch);
    const urlQuery = params.get('query') ?? '';

    if (state.searchByType[dataType] !== urlQuery) {
      dispatch({ type: 'SET_SEARCH', dataType, payload: urlQuery });
      if (urlQuery) {
        dispatch({
          type: 'SET_LAST_SEARCHES',
          payload: computeLastSearches(urlQuery, state.lastSearches),
        });
      }
    }
  }, [dataType, locationSearch, state.searchByType, state.lastSearches]);

  // Extraemos solo lo que necesitamos para las dependencias
  const { page, needsFetch, nbPages, isLoading, isLoadingMore } = activeList;

  /* ... resto del archivo sin cambios ... */

  /* 2. Sync URL Page -> State (Corrección automática) */
  useEffect(() => {
    if (!dataType || isLoading || isLoadingMore) return;

    const params = new URLSearchParams(locationSearch);
    const rawUrlPage = getPageFromURL(params);
    const TECHNICAL_LIMIT = 49;

    const maxAllowedPage =
      nbPages && nbPages > 0
        ? Math.min(TECHNICAL_LIMIT, nbPages - 1)
        : TECHNICAL_LIMIT;

    // 1. CORRECCIÓN: Si la página es inválida, redirigimos y SALIMOS del efecto
    if (rawUrlPage > maxAllowedPage) {
      setSearchParams(
        (prev) => {
          prev.set('page', maxAllowedPage.toString());
          return prev;
        },
        { replace: true }, // Esto reemplaza la entrada inválida en el historial
      );
      return; // Importante: detenemos la ejecución para evitar despachar INCREMENT_PAGE
    }

    // 2. Lógica incremental: Solo se ejecuta si la página ya está validada arriba
    if (rawUrlPage > page) {
      dispatch({ type: 'INCREMENT_PAGE', dataType });
    } else if (rawUrlPage < page) {
      dispatch({ type: 'RESET_LIST', dataType });
    }
  }, [
    dataType,
    locationSearch,
    page,
    nbPages,
    isLoading,
    isLoadingMore,
    setSearchParams,
  ]);

  /* ... resto del archivo sin cambios ... */

  /* 3. FETCHING LOGIC */
  useEffect(() => {
    if (!dataType || !needsFetch) return;

    let ignore = false;

    dispatch({
      type: page === 0 ? 'FETCH_INIT' : 'FETCH_MORE_INIT',
      dataType,
    });

    getAsyncStories({ url: getUrl(state.search, page, dataType) })
      .then((res) => {
        if (ignore) return;
        dispatch({
          type: 'FETCH_SUCCESS',
          dataType,
          hits: res?.hits ?? [],
          page: res?.page ?? 0,
          nbHits: res?.nbHits ?? 0,
          nbPages: res?.nbPages ?? 0,
          processingTimeMs: res?.processingTimeMs ?? 0,
        });
      })
      .catch(() => {
        if (ignore) return;
        dispatch({ type: 'FETCH_FAILURE', dataType });
      });

    return () => {
      ignore = true;
    };
    // Dependemos de 'page' y 'needsFetch', no del objeto activeList entero
  }, [dataType, state.search, page, needsFetch]);

  /* 4. Reset al cambiar de sección */
  useEffect(() => {
    const prev = prevDataTypeRef.current;
    if (prev && dataType && prev !== dataType) {
      const params = new URLSearchParams(window.location.search);

      if (!params.has('query')) {
        dispatch({ type: 'SET_SEARCH', dataType, payload: '' });
      } else {
        dispatch({
          type: 'SET_SEARCH',
          dataType,
          payload: params.get('query') || '',
        });
      }

      dispatch({ type: 'RESET_LIST', dataType: dataType || '' });
    }
    prevDataTypeRef.current = dataType;
  }, [dataType]);

  /* Persistencia */
  useEffect(() => {
    localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(state.lastSearches));
  }, [state.lastSearches]);

  /* ACCIONES */
  const searchAction = useCallback(
    (term: string) => {
      const value = term.trim();
      setSearchParams((prev) => {
        prev.set('query', value);
        prev.delete('page');
        return prev;
      });
    },
    [setSearchParams],
  );

  const handleMoreStories = useCallback(() => {
    if (!dataType) return;
    setSearchParams((prev) => {
      prev.set('page', (activeList.page + 1).toString());
      return prev;
    });
  }, [dataType, activeList.page, setSearchParams]);

  const handleRemoveStory = useCallback(
    (item: Story) => {
      if (dataType) dispatch({ type: 'REMOVE_STORY', dataType, payload: item });
    },
    [dataType],
  );

  const handleRemoveLastSearch = useCallback(
    (term: string) => {
      dispatch({
        type: 'SET_LAST_SEARCHES',
        payload: state.lastSearches.filter((s) => s !== term),
      });
    },
    [state.lastSearches],
  );

  return {
    stories: activeList,
    search: state.search,
    lastSearches: state.lastSearches,
    searchByType: state.searchByType,
    searchAction,
    handleMoreStories,
    handleRemoveStory,
    handleRemoveLastSearch,
  };
}
