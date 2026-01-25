import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SharedStories from './SharedStories';
import { FavoritesProvider } from '../../../context/favorites';


// Evita errores de fechas (Intl)
vi.mock('../../../utils/formatDate', () => ({
  formatUpdatedDate: () => 'Jan 2024',
}));

// Evita depender del router real
vi.mock('../../../hooks/useStoryParams', () => ({
  useStoryParams: () => ({
    query: '',
    searchAction: vi.fn(),
  }),
}));

/* =========================
   Helpers
   ========================= */

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderSharedStories = () => {
  const queryClient = createTestQueryClient();

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <SharedStories />
        </FavoritesProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

/* =========================
   Test
   ========================= */

describe('SharedStories', () => {
  it('renders search input and search button', () => {
    renderSharedStories();

    const searchInput = screen.getByPlaceholderText(/search stories/i);
    expect(searchInput).toBeTruthy();

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeTruthy();
  });
});
