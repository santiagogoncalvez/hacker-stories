export type Story = {
  title: string;
  url: string;
  author: string;
  numComments: number;
  points: number;
  objectId: string;
};

export type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
};
type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Story[];
};
type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
};
type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};
export type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

export type StoriesState = {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
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
};