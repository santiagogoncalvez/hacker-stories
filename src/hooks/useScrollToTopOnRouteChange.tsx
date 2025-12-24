import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Solo se ejecutará cuando el pathname cambie (ej: de / a /comments)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]); // 👈 Eliminamos 'search' y 'hash'
}
