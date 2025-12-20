type Callback = () => void;

import { useEffect, useRef } from 'react';
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};
export const useIntersectionObserver = (
  callback: Callback,
) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    if (targetRef.current) observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
      observer.disconnect();
    };
  }, [callback]);

  return targetRef;
};

export default useIntersectionObserver;