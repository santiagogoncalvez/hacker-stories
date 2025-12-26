import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import BarsIcon from '../../assets/bars-3.svg?react';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="appHeader-container">
      <div className="appHeader">
        <Link to="/" className="appTitleLink" onClick={closeMenu}>
          <h1>HS</h1>
        </Link>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="menuToggle"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <BarsIcon className="menuToggleIcon" />
        </button>

        {/* Nav */}
        <nav className={`appNav ${isOpen ? 'open' : ''}`}>
          <Link
            to="/"
            onClick={closeMenu}
            className={`appNav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            News
          </Link>

          <Link
            to="/comments"
            onClick={closeMenu}
            className={`appNav-item ${location.pathname === '/comments' ? 'active' : ''}`}
          >
            Comments
          </Link>

          <Link
            to="/favourites"
            onClick={closeMenu}
            className={`appNav-item ${location.pathname === '/favourites' ? 'active' : ''}`}
          >
            Favourites
          </Link>
        </nav>
      </div>
      {/* <hr /> */}
    </header>
  );
};

export default Header;
