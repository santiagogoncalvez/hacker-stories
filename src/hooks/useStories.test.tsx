import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useStories } from './useStories';
import { getAsyncStories } from '../services/getAsyncStories';
import { emptyList } from '../constants/stories';

vi.mock('../services/getAsyncStories', () => ({
  getAsyncStories: vi.fn(),
}));

vi.mock('../constants/apiEndpoints', () => ({
  getUrl: (query: string, page: number, dataType: string) =>
    `${dataType}-${query}-${page}`,
}));

const mockGetAsyncStories = getAsyncStories as unknown as ReturnType<
  typeof vi.fn
>;

// Wrapper para React Query (uno nuevo por test)
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useStories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs the initial fetch and returns formatted stories', async () => {
    mockGetAsyncStories.mockResolvedValueOnce({
      hits: [{ objectId: '1', title: 'Story 1' }],
      page: 0,
      nbPages: 2,
      nbHits: 1,
    });

    const { result } = renderHook(
      () =>
        useStories({
          dataType: 'story',
          query: 'react',
          page: 0,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.stories.isLoading).toBe(false);
    });

    expect(result.current.stories.hits).toHaveLength(1);
    expect(result.current.stories.hits[0].title).toBe('Story 1');
    expect(result.current.hasNextPage).toBe(true);
    expect(mockGetAsyncStories).toHaveBeenCalledTimes(1);
  });

  it('accumulates results when page > 0', async () => {
    mockGetAsyncStories
      .mockResolvedValueOnce({
        hits: [{ objectId: '1' }],
        page: 0,
        nbPages: 3,
        nbHits: 3,
      })
      .mockResolvedValueOnce({
        hits: [{ objectId: '2' }],
        page: 1,
        nbPages: 3,
        nbHits: 3,
      });

    const { result, rerender } = renderHook(
      ({ page }) =>
        useStories({
          dataType: 'story',
          query: 'react',
          page,
        }),
      {
        wrapper: createWrapper(),
        initialProps: { page: 0 },
      },
    );

    await waitFor(() => {
      expect(result.current.stories.isLoading).toBe(false);
    });

    rerender({ page: 1 });

    await waitFor(() => {
      expect(result.current.stories.hits).toHaveLength(2);
    });

    expect(result.current.stories.hits.map((h) => h.objectId)).toEqual([
      '1',
      '2',
    ]);
  });

  it('Reset the cache when query is empty and page is 0', async () => {
    mockGetAsyncStories.mockResolvedValue({
      hits: [{ objectId: '1' }],
      page: 0,
      nbPages: 1,
      nbHits: 1,
    });

    const { rerender } = renderHook(
      ({ query }) =>
        useStories({
          dataType: 'story',
          query,
          page: 0,
        }),
      {
        wrapper: createWrapper(),
        initialProps: { query: 'react' },
      },
    );

    await waitFor(() => {
      expect(mockGetAsyncStories).toHaveBeenCalled();
    });

    const callsBeforeReset = mockGetAsyncStories.mock.calls.length;

    rerender({ query: '' });

    await waitFor(() => {
      expect(mockGetAsyncStories.mock.calls.length).toBeGreaterThan(
        callsBeforeReset,
      );
    });
  });


  it('Returns emptyList if the fetch fails or there is no data', async () => {
    mockGetAsyncStories.mockResolvedValueOnce(null);

    const { result } = renderHook(
      () =>
        useStories({
          dataType: 'story',
          query: 'react',
          page: 0,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.stories.isLoading).toBe(false);
    });

    expect(result.current.stories.hits).toEqual(emptyList.hits);
    expect(result.current.hasNextPage).toBe(false);
  });
});
