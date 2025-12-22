import StatusPanel from '../components/StatusPanle.tsx';
import { List } from '../components/List.tsx';
import ScrollToTopButton from '../components/ScrollToTopButton.tsx';
import { useStoriesContext } from '../hooks/useStoriesContext.tsx';

import '../App.css';

const News = () => {
  const { stories, search, handleRemoveStory, handleMoreStories } =
    useStoriesContext();

  return (
    <div className="home">
      <List
        stories={stories}
        search={search}
        handleMoreStories={handleMoreStories}
        onRemoveItem={handleRemoveStory}
      />
      <StatusPanel stories={stories} />
      <ScrollToTopButton />
    </div>
  );
};

export default News;
