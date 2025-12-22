import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTopOnRouteChange() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Scroll instantáneo al top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto', // 👈 instantáneo
    });
  }, [pathname, search, hash]);
}
