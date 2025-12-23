type NoSearchResultsProps = {
  query?: string;
};

const NoSearchResults = ({ query }: NoSearchResultsProps) => {
  return (
    <div className="noResultsCard" role="status" aria-live="polite">
      <div className="noResultsContent">
        <h2 className="noResultsTitle">No results found</h2>

        {query ? (
          <p className="noResultsDescription">
            We couldn’t find any results for{' '}
            <span className="noResultsQuery">"{query}"</span>.
          </p>
        ) : (
          <p className="noResultsDescription">
            We couldn’t find any matching results.
          </p>
        )}

        <ul className="noResultsTips">
          <li>Check your spelling</li>
          <li>Try different or more general keywords</li>
          <li>Use fewer filters</li>
        </ul>
      </div>
    </div>
  );
};

type NoFavoritesResultsProps = {
  filter?: 'story' | 'comment';
  query?: string;
};

const NoFavoritesResults = ({
  filter = 'story',
  query,
}: NoFavoritesResultsProps) => {
  const label = filter === 'comment' ? 'comments' : 'news';

  return (
    <div className="noResultsCard" role="status" aria-live="polite">
      <div className="noResultsContent">
        <h2 className="noResultsTitle">No favourites found</h2>

        {query ? (
          <p className="noResultsDescription">
            We couldn’t find any favourite {label} matching{' '}
            <span className="noResultsQuery">"{query}"</span>.
          </p>
        ) : (
          <p className="noResultsDescription">
            You don’t have any favourite {label} for this view.
          </p>
        )}

        <ul className="noResultsTips">
          <li>Try switching between News and Comments</li>
          <li>Remove or change filters</li>
          <li>Add favourites from the main list</li>
        </ul>
      </div>
    </div>
  );
};


export  {NoSearchResults, NoFavoritesResults};
