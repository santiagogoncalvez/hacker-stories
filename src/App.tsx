import Header from './components/layout/Header';
import News from './pages/News';
import { FavoritesProvider } from './context/favorites';
import { Route, Routes } from 'react-router-dom';
import Comments from './pages/Comments';
import './styles/App.css';
import Favorites from './pages/Favorites';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { StoriesProvider } from './context/stories';
import { useStoryParams } from './hooks/useStoryParams';

const App = () => {
  const { dataType, query, page } = useStoryParams();

  return (
    <StoriesProvider query={query} page={page} dataType={dataType}>
      <FavoritesProvider>
        <div className="app">
          <Header />

          <div className="routes-container">
            <Routes>
              <Route path="/" Component={News} />
              <Route path="/comments" Component={Comments} />
              <Route path="/favourites" Component={Favorites} />

              <Route path="*" Component={NotFound} />
            </Routes>
          </div>

          <ScrollToTopButton />
          <Toaster position="top-right" />
        </div>
      </FavoritesProvider>
    </StoriesProvider>
  );
};

export default App;
