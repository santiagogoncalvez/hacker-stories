import { Dispatch, SetStateAction } from 'react';
import { SUPPORTED_DATA_TYPES } from '../constants/stories';

/* ================= Entidades de Datos ================= */

// Estructura de la historia procesada en la aplicación
export type Story = {
  title?: string;
  url?: string;
  author: string;
  numComments?: number;
  points?: number;
  objectId: string; // Mapeado desde objectID de la API
  createdAtI: number;
  commentText?: string;
  tags: string[];
};

// Estructura original que viene de la API de Hacker News
export type HNApiStory = {
  title: string | null;
  story_title: string | null;
  url: string | null;
  story_url: string | null;
  author: string;
  points?: number;
  num_comments?: number;
  objectID: string;
  created_at_i: number;
  _tags: string[];
  comment_text?: string;
};

/* ================= Estado y Reducer ================= */

// Tipos de ordenación disponibles
export type Sort =
  | 'TITLE'
  | 'AUTHOR'
  | 'COMMENTS'
  | 'POINTS'
  | 'COMMENT_TEXT'
  | 'CREATED_AT';

export type SortState = {
  sortType: Sort;
  isReverse: boolean;
};

// Estado para cada lista individual (story o comment)
export interface ListState {
  hits: Story[];
  page: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  isNoResults: boolean;
  isError: boolean;
  needsFetch: boolean;
  dataType: string | null;
  nbHits: number;
  nbPages: number;
  processingTimeMs: number;
}

// Estado global manejado por useStories
export interface StoriesState {
  search: string;
  searchByType: Record<string, string>;
  lastSearches: string[];
  lists: Record<string, ListState>;
}

// Acciones del Reducer (Discriminated Union)
export type StoriesAction =
  | { type: 'SET_SEARCH'; dataType?: string; payload: string }
  | { type: 'SET_LAST_SEARCHES'; payload: string[] }
  | { type: 'FETCH_INIT'; dataType: string }
  | { type: 'FETCH_MORE_INIT'; dataType: string }
  | {
      type: 'FETCH_SUCCESS';
      dataType: string;
      hits: Story[];
      page: number;
      nbHits: number;
      nbPages: number;
      processingTimeMs: number;
    }
  | { type: 'FETCH_FAILURE'; dataType: string }
  | { type: 'RESET_LIST'; dataType: string }
  | { type: 'INCREMENT_PAGE'; dataType: string }
  | { type: 'REMOVE_STORY'; dataType: string; payload: Story }
  | { type: 'SEARCH_START_RESULTS' }
  | { type: 'SEARCH_NO_RESULTS' };

/* ================= Props de Componentes ================= */

export type FavouriteFilter = 'story' | 'comment';
export type DisplayType = 'CARD' | 'LIST';

export type ListProps = {
  stories: ListState;
  search: string;
  handleMoreStories: () => void;
  onRemoveItem: (item: Story) => void;
};

export interface DisplayListProps {
  stories: ListState;
  sort: SortState;
  setSort: Dispatch<SetStateAction<SortState>>;
  display: DisplayType;
  sortedList: Story[];
  onRemoveItem: (item: Story) => void;
  handleMoreStories: () => void;
  type: FavouriteFilter;
}

export type SortPropsProps = {
  sort: SortState;
  label: string;
  onClick: (sortType: Sort, isReverse: boolean) => void;
  type: FavouriteFilter;
};

export type Field = {
  key: string;
  label: string;
  value: Sort;
};

/* ================= Contexto ================= */

export interface StoriesContextType {
  stories: ListState | null;
  search: string;
  handleMoreStories: () => void;
}

export type SearchFormProps = {
  searchInitLive?: string;
  searchActionLive?: (value: string) => void;
  // Cambiado a no opcional si se usa en el render, o añadir validación
  placeholder?: string;
  mode?: 'button' | 'live';
};

export type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  placeholder: string;
  isFocused?: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  onFocus: () => void;
  onBlur: () => void;
};

type ScrollTarget = React.RefObject<HTMLElement | null> | 'body';

export type ScrollToTopButtonProps = {
  target?: ScrollTarget;
  threshold?: number;
};

export type EmptyFavoritesStateProps = {
  type?: 'story' | 'comment';
};

export type SkeletonListProps = {
  items?: number;
};

export type NoSearchResultsProps = {
  query?: string;
};

export type NoFavoritesResultsProps = {
  filter?: 'story' | 'comment';
  query?: string;
};

export interface CommonListProps {
  list: Story[];
  type: ListType;
}

export type ListType = 'story' | 'comment';

export type FieldTableHead = {
  key: string;
  label: string;
  value: string;
  width: string;
};

export type TableHeadProps = {
  sort: SortState;
  onClick: (sortType: Sort) => void;
  fields: FieldTableHead[];
};

export type FieldTable = {
  key: string;
  label: string;
  value: string;
  width: string;
};

export type TableListProps = {
  list: Story[];
  sort: SortState;
  sortAction: (sortType: Sort) => void;
  onRemoveItem: (item: Story) => void;
  fields: FieldTable[];
  type: 'story' | 'comment';
};

/**
 * Define la estructura de los datos crudos que devuelve axios de la API.
 */
export interface ApiResponse {
  hits: HNApiStory[];
  page: number;
  nbHits: number;
  nbPages: number;
  processingTimeMS: number;
}

/**
 * Mapea los datos de la API a la estructura interna 'Story' de la aplicación.
 */

export interface ListResponse {
  /** Array de historias o comentarios ya procesados y limpios */
  hits: Story[];

  /** El número de página actual (empezando desde 0) */
  page: number;

  /** El número total de resultados encontrados en la base de datos */
  nbHits: number;
  nbPages: number;

  /** Tiempo que tardó la API en procesar la solicitud (en milisegundos) */
  processingTimeMs: number;
}

export type SupportedDataType = (typeof SUPPORTED_DATA_TYPES)[number];
