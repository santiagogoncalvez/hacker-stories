// src/utils/formatDate.test.ts
import { describe, it, expect,} from 'vitest';
import { formatUpdatedDate } from './formatDate';

describe('formatUpdatedDate', () => {
  // Opción A: Forzamos una zona horaria fija para los tests (opcional pero recomendado)
  // En Node, esto se puede hacer configurando process.env.TZ = 'UTC'
  // antes de ejecutar los tests, pero vamos a ajustar el test para que sea resiliente.

  it('should format a unix timestamp correctly with the given prefix', () => {
    // Usamos las 12:00 PM (mediodía) para evitar problemas de saltos de día por zona horaria
    // 1704110400 es 01 Jan 2024 12:00:00 UTC
    const timestamp = 1704110400;
    const prefix = 'Updated: ';

    const result = formatUpdatedDate(prefix, timestamp);

    // Ahora, sin importar si estás en GMT-3 o GMT+5, el día seguirá siendo 01 Jan
    expect(result).toBe('Updated: 01 Jan 2024');
  });

  it('should work with different months and formats', () => {
    // 15 Aug 2024 al mediodía
    const timestamp = 1723723200;
    const prefix = 'Fecha: ';

    const result = formatUpdatedDate(prefix, timestamp);

    expect(result).toBe('Fecha: 15 Aug 2024');
  });

  it('should handle single digit days by padding with zero (2-digit)', () => {
    // 05 Jan 2024 al mediodía
    const timestamp = 1704456000;
    const result = formatUpdatedDate('', timestamp);

    expect(result).toBe('05 Jan 2024');
  });
});
