import { useEffect, useState } from 'react';

// Definimos la estructura de nuestro Set serializado
interface SerializedSet {
  __type: 'Set';
  value: unknown[];
}

function serialize(value: unknown) {
  if (value instanceof Set) {
    return { __type: 'Set', value: Array.from(value) };
  }
  return value;
}

function deserialize(value: unknown): unknown {
  // Comprobamos si es un objeto válido y tiene la marca __type
  if (
    typeof value === 'object' &&
    value !== null &&
    '__type' in value &&
    'value' in value
  ) {
    // Usamos un "Type Cast" seguro a nuestra interfaz en lugar de 'any'
    const obj = value as unknown as SerializedSet;

    if (obj.__type === 'Set' && Array.isArray(obj.value)) {
      return new Set(obj.value);
    }
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
      // Manejo de error silencioso o log
    }
  }, [key, state]);

  return [state, setState];
}
