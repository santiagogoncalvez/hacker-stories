import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import SearchForm from './SearchForm';

// =========================
// Mocks
// =========================

// Mock del hook de params
const searchActionMock = vi.fn();

vi.mock('../../hooks/useStoryParams', () => ({
  useStoryParams: () => ({
    query: '',
    searchAction: searchActionMock,
  }),
}));

// Mock de localStorage
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  searchActionMock.mockClear();
});

// =========================
// Test
// =========================

describe('SearchForm', () => {
  it('renders input and submits search value', () => {
    render(<SearchForm />);

    // Input
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeTruthy();

    // Escribe texto
    fireEvent.change(input, {
      target: { value: 'react testing' },
    });

    // Botón Search (por aria-label)
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeTruthy();

    // Submit
    fireEvent.click(searchButton);

    // Ejecuta acción con el valor correcto
    expect(searchActionMock).toHaveBeenCalledTimes(1);
    expect(searchActionMock).toHaveBeenCalledWith('react testing');
  });
});
