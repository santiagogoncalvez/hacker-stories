import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BarsIcon from '../../assets/bars-3.svg?react';
import CloseIcon from '../../assets/cross.svg?react';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Bloqueo de scroll y compensación de ancho
  useEffect(() => {
    const root = document.documentElement;
    const isMobile = window.innerWidth <= 768;

    if (isOpen && isMobile) {
      const scrollBarWidth = window.innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      root.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      root.style.overflow = '';
      root.style.paddingRight = '';
    }

    return () => {
      root.style.overflow = '';
      root.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleClick = (to: string) => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: to === location.pathname ? "smooth" : "instant" });
  };

  return (
    <header className="appHeader-container">
      <div className="appHeader">
        <Link
          to="/"
          className="appTitleLink"
          onClick={() => {
            handleClick('/');
          }}
        >
          <h1>HS</h1>
        </Link>

        <button
          className="menuToggle"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? (
            <CloseIcon className="menuToggleIcon" />
          ) : (
            <BarsIcon className="menuToggleIcon" />
          )}
        </button>

        {/* El CSS maneja el display: none/flex mediante la clase .open solo en mobile */}
        <div className={`appNav-container `}>
          <nav className={`appNav `}>
            <Link
              to="/"
              onClick={() => {
                handleClick('/');
              }}
              className={`appNav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              Stories
            </Link>
            <Link
              to="/comments"
              onClick={() => {
                handleClick('/comments');
              }}
              className={`appNav-item ${location.pathname === '/comments' ? 'active' : ''}`}
            >
              Comments
            </Link>
            <Link
              to="/favorites"
              onClick={() => {
                handleClick('/favorites');
              }}
              className={`appNav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
            >
              Favorites
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
