import { useStories } from '../hooks/useStories';
import { sortActionList } from '../utils/sortActions';
import { DisplayList } from './List';
import {NoSearchResults} from './NoSearchResults';

const EmptySearchState = ({ sort, setSort, display }) => {
  const { stories, handleRemoveStory, handleMoreStories } = useStories('');

  const sortedList = sortActionList(sort, stories.hits);

  return (
    <>
      <NoSearchResults />
      <h2 className="popularStoriesTitle">Popular stories</h2>

      <DisplayList
        stories={stories}
        sort={sort}
        setSort={setSort}
        display={display}
        sortedList={sortedList}
        onRemoveItem={handleRemoveStory}
        handleMoreStories={handleMoreStories}
      />
    </>
  );
};


export default EmptySearchState;
