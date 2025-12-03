import { useState, useEffect, useRef } from 'react';

export const useStorageState = (
  key: string,
  initialState: string,
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // console.log('useStorageState');
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};
