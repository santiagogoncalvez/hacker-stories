import { StoriesState } from '../types/types';
import Loader from './Loader';

const StatusPanel = ({ stories }: { stories: StoriesState }) => {
  return (
    <>
      {stories.isLoading && <Loader />}
      {stories.isError && <p>Something went wrong...</p>}
    </>
  );
};

export default StatusPanel;
