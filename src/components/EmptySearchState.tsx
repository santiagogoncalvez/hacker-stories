import { useStories } from '../hooks/useStories';
import { ListWithObserver } from './List';
import NoSearchResults from './NoSearchResults';

const EmptySearchState = () => {
  const { stories, handleRemoveStory, handleMoreStories } = useStories({
    search: '',
  });

  return (
    <>
      <NoSearchResults />

      <section className="popularStories">
        <h3 className="popularStoriesTitle">Popular stories</h3>

        <ListWithObserver
          stories={stories}
          onRemoveItem={handleRemoveStory}
          handleMore={handleMoreStories}
        />
      </section>
    </>
  );
};

export default EmptySearchState;
