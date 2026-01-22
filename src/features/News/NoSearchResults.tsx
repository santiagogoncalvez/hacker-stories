import { Link, useLocation } from 'react-router-dom';
import { NoFavoritesResultsProps, NoSearchResultsProps } from '../../types/types';




const NoSearchResults = ({ query }: NoSearchResultsProps) => {
  const location = useLocation();

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

        {/* Botón de acción principal para volver al inicio */}
        <div className="noResultsAction">
          You could try exploring&nbsp;
          {location.pathname === '/' ? <Link to="/">Stories</Link> : <Link to="/comments">Comments</Link>}
        </div>
      </div>
    </div>
  );
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

export { NoSearchResults, NoFavoritesResults };
