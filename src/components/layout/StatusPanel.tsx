import { ListState } from '../../types/types';
// import Loader from './Loader';

const StatusPanel = ({ stories }: { stories: ListState }) => {
  return (
    <>
      {/* {stories.isLoading && <Loader />} */}
      {stories.isError && <p>Something went wrong...</p>}
    </>
  );
};

export default StatusPanel;
