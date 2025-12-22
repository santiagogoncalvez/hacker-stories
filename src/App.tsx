import Header from './components/Header';
import News from './pages/News';
import { StoriesProvider } from './context/stories';
import { Route, Routes } from 'react-router-dom';
import { useScrollToTopOnRouteChange } from './hooks/useScrollToTopOnRouteChange';

const App = () => {
  useScrollToTopOnRouteChange();


  return (
    <StoriesProvider>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" Component={News} />
          <Route path="/comments" Component={News} />
          <Route path="/favourites" Component={() => <h1>Favourites</h1>} />

          <Route path="*" Component={() => <h1>404</h1>} />
        </Routes>
      </div>
    </StoriesProvider>
  );
};

export default App;
