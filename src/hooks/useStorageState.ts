import { useEffect, useState } from 'react';

function serialize(value: unknown) {
  if (value instanceof Set) {
    return { __type: 'Set', value: Array.from(value) };
  }
  return value;
}

function deserialize(value: unknown) {
  if (
    typeof value === 'object' &&
    value !== null &&
    '__type' in value &&
    (value as any).__type === 'Set'
  ) {
    return new Set((value as any).value);
  }
  return value;
}

export function useStorageState<T>(
  key: string,
  initialState: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialState;

      return deserialize(JSON.parse(stored)) as T;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(serialize(state)));
    } catch {
      // manejo opcional
    }
  }, [key, state]);

  return [state, setState];
}
