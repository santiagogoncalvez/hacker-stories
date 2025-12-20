type Section = 'news' | 'favourites';

type HeaderProps = {
  section: Section;
  onChangeSection: (section: Section) => void;
};

const Header = ({ section, onChangeSection }: HeaderProps) => {
  return (
    <header className="appHeader">
      <div className="appHeader-left">
        <span className="appTitle">
          <strong>HS</strong>
        </span>
      </div>

      <nav className="appNav">
        <button
          className={`appNav-item ${section === 'news' ? 'active' : ''}`}
          onClick={() => onChangeSection('news')}
        >
          News
        </button>

        <button
          className={`appNav-item ${section === 'favourites' ? 'active' : ''}`}
          onClick={() => onChangeSection('favourites')}
        >
          Favourites
        </button>
      </nav>
    </header>
  );
};

export default Header;
