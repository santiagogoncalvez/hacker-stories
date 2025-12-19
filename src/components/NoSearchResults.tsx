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

export default NoSearchResults;
