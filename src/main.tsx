import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Supports weights 100-900
import '@fontsource-variable/inter/wght.css';
import App from './App.tsx';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Opcional: evita recargas al cambiar de ventana
      retry: 1, // Opcional: reintentar 1 vez si falla
    },
  },
});

// if ('scrollRestoration' in window.history) {
//   window.history.scrollRestoration = 'manual';
// }

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
);
