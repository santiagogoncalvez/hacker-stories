import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';

const App = () => {
  const [section, setSection] = useState<'news' | 'favourites'>('news');
  
  return (
    <div className='app'>
      <Header section={section} onChangeSection={setSection} />

      <Home />
    </div>
  );
};

export default App;
