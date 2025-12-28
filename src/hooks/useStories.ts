import { useEffect, useReducer, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { storiesReducer } from '../reducers/storiesReducer';

import { getAsyncStories } from '../services/getAsyncStories';
import { getUrl } from '../constants/apiEndpoints';
import { Story, ListState } from '../types/types';

const MAX_LAST_SEARCHES = 6; // Porque una búsqueda puede ser vacía y tienen que estar.
const LAST_SEARCHES_KEY = 'hn:lastSearches';

const SUPPORTED_DATA_TYPES = ['story', 'comment'] as const;
type SupportedDataType = (typeof SUPPORTED_DATA_TYPES)[number];

/* ================= Helpers ================= */

interface StoriesState {
  search: string;
  searchByType: Record<string, string>;
  lastSearches: string[];
  lists: Record<string, ListState>;
}

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

/* ================= Initial state ================= */

const emptyList = {
  hits: [],
  page: 0,
  isLoading: false,
  isLoadingMore: false,
  isNoResults: false,
  isError: false,
  needsFetch: true,
  dataType: null,
  nbHits: 0,
  processingTimeMs: 0,
};

const initialState = {
  search: '',
  searchByType: {
    story: '',
    comment: '',
  } as Record<string, string>,
  lastSearches: [],
  lists: {
    story: { ...emptyList, dataType: 'story' },
    comment: { ...emptyList, dataType: 'comment' },
    fallback: { ...emptyList, dataType: 'fallback' },
  },
};

const getDataType = (path: string): SupportedDataType | null => {
  if (path === '/') return 'story';
  if (path === '/comments') return 'comment';
  return null;
};

/* ================= Hook ================= */

export function useStories(initialSearch = '') {
  const location = useLocation();

  const { pathname, search: locationSearch } = location;
  const [, setSearchParams] = useSearchParams();
  const dataType = getDataType(pathname);

  // Read initial query from URL
  const initialUrlQuery = (() => {
    try {
      if (dataType && SUPPORTED_DATA_TYPES.includes(dataType)) {
        const params = new URLSearchParams(locationSearch);
        return params.get('query') ?? '';
      }
    } catch {
      // ignore
    }
    return '';
  })();

  // Initial lastSearches
  const savedLastSearches = getLastSearchesFromStorage();
  let initialLastSearches = savedLastSearches;
  // (Lógica existente de last searches...)
  if (
    dataType &&
    SUPPORTED_DATA_TYPES.includes(dataType) &&
    initialUrlQuery === ''
  ) {
    if (!initialLastSearches.includes('')) {
      initialLastSearches = ['', ...initialLastSearches].slice(
        0,
        MAX_LAST_SEARCHES,
      );
    } else {
      initialLastSearches = [
        '',
        ...initialLastSearches.filter((s) => s !== ''),
      ].slice(0, MAX_LAST_SEARCHES);
    }
  }

  const initialSearchByType: Record<string, string> = {
    story: '',
    comment: '',
  };
  if (dataType && SUPPORTED_DATA_TYPES.includes(dataType)) {
    initialSearchByType[dataType] = initialUrlQuery;
  }

  const initialSearchToUse =
    dataType && SUPPORTED_DATA_TYPES.includes(dataType)
      ? initialUrlQuery
      : initialSearch;

  const [state, dispatch] = useReducer(storiesReducer, {
    ...initialState,
    search: initialSearchToUse,
    searchByType: initialSearchByType,
    lastSearches: initialLastSearches,
  } as StoriesState);
  // console.log(state.lists);

  const activeList = dataType ? state.lists[dataType] : null;
  const prevDataTypeRef = useRef<string | null>(null);

  /* ================= Sync URL Query -> State Search ================= */

  useEffect(() => {
    if (!dataType || !SUPPORTED_DATA_TYPES.includes(dataType)) return;

    const params = new URLSearchParams(locationSearch);
    const urlSearchTerm = params.get('query') ?? '';
    const currentByType = state.searchByType?.[dataType] ?? '';

    if (currentByType !== urlSearchTerm) {
      dispatch({ type: 'SET_SEARCH', dataType, payload: urlSearchTerm });
      dispatch({
        type: 'SET_LAST_SEARCHES',
        payload: computeLastSearches(urlSearchTerm, state.lastSearches),
      });
      return;
    }

    if (state.search !== currentByType) {
      dispatch({ type: 'SET_SEARCH', dataType, payload: currentByType });
    }
  }, [dataType, locationSearch]);

  /* ================= Sync URL Page -> State Page (Paginación Deep Linking) ================= */

  useEffect(() => {
    if (!dataType || !activeList) return;

    const params = new URLSearchParams(locationSearch);
    const rawUrlPage = getPageFromURL(params);

    // 1. CORRECCIÓN SILENCIOSA: Si la página excede el límite (50)
    const API_LIMIT = 49; // Algolia usa base 0, por lo que 50 páginas son 0-49
    if (rawUrlPage > API_LIMIT) {
      const newParams = new URLSearchParams(locationSearch);
      newParams.set('page', API_LIMIT.toString());

      // Reemplazamos la URL silenciosamente
      setSearchParams(newParams, { replace: true });
      return; // Salimos para que el siguiente ciclo con la URL corregida maneje la carga
    }

    const {
      page: statePage,
      isLoading,
      isLoadingMore,
      needsFetch,
    } = activeList;

    // Evitamos conflictos si ya se está cargando algo
    if (isLoading || isLoadingMore || needsFetch) return;

    // CASO 1: URL pide una página mayor a la que tenemos.
    if (rawUrlPage > statePage) {
      dispatch({ type: 'INCREMENT_PAGE', dataType });
    }

    // CASO 2: URL pide una página menor (Usuario presionó "Atrás").
    else if (rawUrlPage < statePage) {
      dispatch({ type: 'RESET_LIST', dataType });
    }
  }, [
    dataType,
    locationSearch,
    activeList?.page,
    activeList?.isLoading,
    activeList?.isLoadingMore,
    activeList?.needsFetch,
    setSearchParams, // Añadido por buena práctica
  ]);

  /* ================= Reset on section switch ================= */

  useEffect(() => {
    const prev = prevDataTypeRef.current;

    // Comprobamos que 'prev' sea uno de los tipos soportados sin usar 'any'
    const isSupportedPrev =
      prev !== null &&
      (SUPPORTED_DATA_TYPES as readonly string[]).includes(prev);

    if (
      prev &&
      dataType &&
      prev !== dataType &&
      isSupportedPrev && // Usamos la validación segura aquí
      SUPPORTED_DATA_TYPES.includes(dataType)
    ) {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('query')) {
        dispatch({ type: 'SET_SEARCH', dataType, payload: '' });
      }
    }
    prevDataTypeRef.current = dataType ?? null;
  }, [dataType, state.lastSearches]);

  useEffect(() => {
    if (!dataType) return;
    dispatch({ type: 'RESET_LIST', dataType });
  }, [dataType]);

  /* ================= Fetching Logic ================= */

  useEffect(() => {
    if (!dataType || !activeList) return;
    if (!activeList.needsFetch) return;

    const { page } = activeList;

    dispatch({
      type: page === 0 ? 'FETCH_INIT' : 'FETCH_MORE_INIT',
      dataType,
    });

    getAsyncStories({
      url: getUrl(state.search, page, dataType),
    })
      .then((res) => {
        dispatch({
          type: 'FETCH_SUCCESS',
          dataType,
          hits: res?.hits ?? [],
          page: res?.page ?? 0,
          nbHits: res?.nbHits ?? 0,
          processingTimeMs: res?.processingTimeMs ?? 0,
        });
      })
      .catch(() => {
        dispatch({ type: 'FETCH_FAILURE', dataType });
      });
  }, [dataType, state.search, activeList?.needsFetch, activeList?.page]); // Añadido activeList?.page a dependencias para asegurar reactividad en el loop

  /* ================= Persist last searches ================= */

  useEffect(() => {
    localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(state.lastSearches));
  }, [state.lastSearches]);

  /* ================= Helpers ================= */

  const computeLastSearches = (
    term: string,
    currentList: string[] = state.lastSearches,
  ) => {
    const normalized = term === '' ? '' : term.trim();
    const lower = normalized.toLowerCase();
    const filtered = currentList.filter((s) => s.toLowerCase() !== lower);
    return [normalized, ...filtered].slice(0, MAX_LAST_SEARCHES);
  };

  /* ================= Actions ================= */

  const searchAction = (term: string) => {
    const value = term === '' ? '' : term.trim();

    // Lógica de dispatch existente...
    if (!dataType) {
      dispatch({ type: 'SET_SEARCH', payload: value });
      dispatch({
        type: 'SET_LAST_SEARCHES',
        payload: computeLastSearches(value),
      });
    } else {
      dispatch({ type: 'SET_SEARCH', dataType, payload: value });
      dispatch({
        type: 'SET_LAST_SEARCHES',
        payload: computeLastSearches(value),
      });
    }

    // Actualización de URL:
    // Usamos URLSearchParams para tener control total
    const newParams = new URLSearchParams();

    // Seteamos 'query' siempre, aunque sea string vacío.
    // Esto generará "?query=" o "?query=algo"
    newParams.set('query', value);

    // Nota: Al hacer una nueva búsqueda, NO seteamos 'page',
    // lo que implícitamente reinicia la paginación a 0 (correcto UX).

    try {
      setSearchParams(newParams);
    } catch {
      // noop
    }
  };

  const handleMoreStories = () => {
    if (!dataType || !activeList) return;

    const nextPage = activeList.page + 1;

    setSearchParams((prev: URLSearchParams) => {
      // 1. Capturamos el valor actual de query.
      // Si no existe, usamos cadena vacía '' para cumplir tu requisito anterior.
      const currentQuery = prev.get('query') ?? '';

      // 2. Creamos una instancia NUEVA y VACÍA.
      // Esto es clave: el orden de inserción aquí define el orden en la URL.
      const orderedParams = new URLSearchParams();

      // 3. Insertamos PRIMERO la query
      orderedParams.set('query', currentQuery);

      // 4. Insertamos DESPUÉS la página
      orderedParams.set('page', nextPage.toString());

      // (Opcional) Si tuvieras otros parámetros en la URL que no sean query/page
      // y quisieras conservarlos, deberías recorrer 'prev' y añadirlos aquí.
      // Por ahora, con estos dos basta.

      return orderedParams;
    });
  };

  const handleRemoveStory = (item: Story) => {
    if (!dataType) return;
    dispatch({ type: 'REMOVE_STORY', dataType, payload: item });
  };

  // NUEVA FUNCIÓN: Eliminar una búsqueda del historial
  const handleRemoveLastSearch = (term: string) => {
    const filteredSearches = state.lastSearches.filter((s) => s !== term);
    dispatch({
      type: 'SET_LAST_SEARCHES',
      payload: filteredSearches,
    });
  };

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
