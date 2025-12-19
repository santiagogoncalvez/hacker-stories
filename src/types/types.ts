export type Story = {
  title: string;
  url: string;
  author: string;
  numComments: number;
  points: number;
  objectId: string;
  createdAtI: number;
};

export type sort = 'TITLE' | 'AUTHOR' | 'COMMENTS' | 'POINTS' | 'NONE';

export type SortState = {
  sortType: sort;
  isReverse: boolean;
};

export type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

export type Data = {
  hits: Story[];
  page: number;
};

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
};
type StoriesFetchInitMoreAction = {
  type: 'STORIES_FETCH_MORE_INIT';
};
type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Data;
};
type PopularStoriesFetchSuccessAction = {
  type: 'POPULAR_STORIES_FETCH_SUCCESS';
  payload: Data;
};
type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
};
type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};

type SearchStartResults = {
  type: 'SEARCH_START_RESULTS';
};
type SearchNoResults = {
  type: 'SEARCH_NO_RESULTS';
};

export type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchInitMoreAction
  | StoriesFetchSuccessAction
  | PopularStoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction
  | SearchStartResults
  | SearchNoResults;

export type StoriesState = {
  data: Data;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  isNoResults: boolean;
};

export type HNApiStory = {
  title: string | null;
  story_title: string | null;
  url: string | null;
  story_url: string | null;
  author: string;
  points: number;
  num_comments: number;
  objectID: string;
  created_at_i: number;
};

export type ListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
  // lastItemRef: React.RefObject<HTMLDivElement>;
};
export type CommonListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
};

export type TableListProps = {
  list: Story[];
  sort: SortState;
  onRemoveItem: (item: Story) => void;
  sortAction: (sort: sort) => void;
};

export type StoryInfoProps = {
  item: Story;
};

export type Field = {
  key: string;
  label: string;
  value: sort;
  width?: string;
};

export type fieldDisplay = {
  label: string;
  value: DisplayType;
};

export type Fields = {
  key: string;
  label: string;
  value: sort;
  width?: string;
}[];

export type sortActionsType = {
  TITLE: (list: Story[]) => Story[];
  AUTHOR: (list: Story[]) => Story[];
  COMMENTS: (list: Story[]) => Story[];
  POINTS: (list: Story[]) => Story[];
};

export type DisplayType = 'CARD' | 'LIST';

export type SortPropsProps = {
  sort: SortState;
  label: string;
  onClick: (sortType: sort, isReverse: boolean) => void;
};

export type DisplayProps = {
  display: DisplayType;
  label?: string;
  onClick: (displayType: DisplayType) => void;
};
