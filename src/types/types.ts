import { Dispatch, SetStateAction } from 'react';

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
  searchAction: (searchTerm: string, dataType?: string) => void;
  onRemoveItem: (item: Story) => void;
  handleMoreStories: () => void;
  lastSearches: string[];
  handleRemoveLastSearch: (term: string) => void;
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
  lastSearches: string[];
  searchAction: (term: string) => void;
  handleMoreStories: () => void;
  handleRemoveStory: (item: Story) => void;
  handleRemoveLastSearch: (term: string) => void;
}