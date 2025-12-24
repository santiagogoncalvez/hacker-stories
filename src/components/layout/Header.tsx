import { Link, useLocation } from 'react-router-dom';

const getPath = () => useLocation().pathname;

const Header = () => {
  return (
    <header className="appHeader-container">
      <div className="appHeader">
        <Link to="/" className="appTitleLink">
          <h1>HS</h1>
        </Link>

        <nav className="appNav">
          <Link
            to="/"
            className={`appNav-item ${getPath() === '/' ? 'active' : ''}`}
          >
            News
          </Link>
          <Link
            to="/comments"
            className={`appNav-item ${getPath() === '/comments' ? 'active' : ''}`}
          >
            Comments
          </Link>

          <Link
            to="/favourites"
            className={`appNav-item ${getPath() === '/favourites' ? 'active' : ''}`}
          >
            Favourites
          </Link>
        </nav>
      </div>
      <hr />
    </header>
  );
};

export default Header;
