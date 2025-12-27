import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="noResultsCard" role="status" aria-live="polite">
      <div className="noResultsContent">
        <p className="noResultsCode">404</p>
        <h2 className="noResultsTitle">Page not found</h2>

        <p className="noResultsDescription">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved or deleted.
        </p>

        <ul className="noResultsTips">
          <li>Check the URL for typos</li>
          <li>Go back to the previous page</li>
          <li>Visit our homepage for the latest news</li>
        </ul>
        <div className="noResultsAction">
          Take me back to the&nbsp;
          <Link to="/">News</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;