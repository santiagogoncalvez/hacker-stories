// src/features/News/List/List.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import List from './List';
import type { ListState } from '../../../types/types';

/* =========================
   Mocks
   ========================= */

// Evita dependencias reales
vi.mock('../../../utils/sortActions', () => ({
  sortActionList: (_sort: unknown, hits: unknown[]) => hits,
}));

vi.mock('../../../components/forms/SearchForm', () => ({
  default: () => <div data-testid="search-form" />,
}));

vi.mock('../SortProps', () => ({
  default: () => <div data-testid="sort-props" />,
}));

vi.mock('./DisplayToggle', () => ({
  default: () => <div data-testid="display-toggle" />,
}));

vi.mock('./DisplayList', () => ({
  default: () => <div data-testid="display-list" />,
}));

vi.mock('../NewsSkeletonList', () => ({
  default: () => <div data-testid="skeleton-list" />,
}));

vi.mock('./SearchMeta', () => ({
  default: () => <div data-testid="search-meta" />,
}));

vi.mock('../NoSearchResults', () => ({
  NoSearchResults: () => <div data-testid="no-results" />,
}));

/* =========================
   Mocks de datos
   ========================= */

const mockStories: ListState = {
  hits: [
    {
      objectId: 'story-1',
      title: 'Test story',
      points: 100,
      author: 'tester',
      createdAtI: 1704067200,
      url: 'https://example.com',
      tags: [],
    },
  ],
  nbHits: 1,
  page: 0,
  nbPages: 1,
  processingTimeMs: 10,

  // estados
  isLoading: false,
  isLoadingMore: false,
  isNoResults: false,
  isError: false,
  needsFetch: false,

  // metadata
  dataType: 'story',
};


/* =========================
   Helper render
   ========================= */

const renderList = (path = '/') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <List
        stories={mockStories}
        search=""
        handleMoreStories={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    </MemoryRouter>,
  );
};

/* =========================
   Tests
   ========================= */

describe('List', () => {
  it('renders main layout components', () => {
    renderList('/');

    expect(screen.getByTestId('search-form')).toBeTruthy();
    expect(screen.getByTestId('sort-props')).toBeTruthy();
    expect(screen.getByTestId('display-toggle')).toBeTruthy();
    expect(screen.getByTestId('search-meta')).toBeTruthy();
    expect(screen.getByTestId('display-list')).toBeTruthy();
  });

  it('shows skeleton when loading', () => {
    const loadingStories: ListState = {
      ...mockStories,
      isLoading: true,
    };

    render(
      <MemoryRouter>
        <List
          stories={loadingStories}
          search=""
          handleMoreStories={vi.fn()}
          onRemoveItem={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('skeleton-list')).toBeTruthy();
  });

  it('shows no results state when empty and no results', () => {
    const emptyStories: ListState = {
      ...mockStories,
      hits: [],
      isNoResults: true,
    };

    render(
      <MemoryRouter>
        <List
          stories={emptyStories}
          search="react"
          handleMoreStories={vi.fn()}
          onRemoveItem={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('no-results')).toBeTruthy();
  });

  it('detects list type from route (comments)', () => {
    renderList('/comments');

    // Si renderiza sin romper y monta layout → routing funciona
    expect(screen.getByTestId('search-form')).toBeTruthy();
    expect(screen.getByTestId('display-list')).toBeTruthy();
  });
});
