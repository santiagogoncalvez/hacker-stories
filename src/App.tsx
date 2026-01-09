import Header from './components/layout/Header';
import News from './pages/News';
import { StoriesProvider } from './context/stories';
import { FavoritesProvider } from './context/favorites';
import { Route, Routes } from 'react-router-dom';
import { useScrollToTopOnRouteChange } from './hooks/useScrollToTopOnRouteChange';
import Comments from './pages/Comments';
import "./styles/App.css";
import Favorites from './pages/Favorites';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';

const App = () => {
  useScrollToTopOnRouteChange();
  

  return (
    <FavoritesProvider>
      <StoriesProvider>
        <div className="app">
          <Header />

          <Routes>
            <Route path="/" Component={News} />
            <Route path="/comments" Component={Comments} />
            <Route path="/favourites" Component={Favorites} />

            <Route path="*" Component={NotFound} />
          </Routes>

          <ScrollToTopButton />
          <Toaster position='top-right' />
        </div>
      </StoriesProvider>
    </FavoritesProvider>
  );
};

export default App;
