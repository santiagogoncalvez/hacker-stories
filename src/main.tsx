import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// main.tsx o App.tsx (fuera de componentes si querés)
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
