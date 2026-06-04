import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollBehavior = 'auto' | 'smooth';

export function useScrollToTopOnRouteChange(
  behavior: ScrollBehavior = 'auto',
  enabled = true,
) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!enabled) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [pathname, behavior, enabled]);
}
