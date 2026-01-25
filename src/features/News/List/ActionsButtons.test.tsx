import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavouriteButton } from './ActionButtons';
import { Story } from '../../../types/types';

// 🔧 Mock del hook del contexto
const toggleFavoriteMock = vi.fn();
const isFavoriteMock = vi.fn();

vi.mock('../../../hooks/useFavoritesContext', () => ({
  useFavoritesContext: () => ({
    toggleFavorite: toggleFavoriteMock,
    isFavorite: isFavoriteMock,
  }),
}));

// 🔧 Story mock mínimo y correcto
const mockStory: Story = {
  objectId: 'story-1',
  title: 'Test story',
  author: 'author',
  points: 10,
  createdAtI: 1700000000,
  url: 'https://example.com',
  tags: [],
};

describe('FavouriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button to add to favourites when item is not favorite', () => {
    isFavoriteMock.mockReturnValue(false);

    render(<FavouriteButton item={mockStory} />);

    const button = screen.getByRole('button', {
      name: /add to favourites/i,
    });

    expect(button).toBeTruthy();
  });

  it('renders button to remove from favourites when item is favorite', () => {
    isFavoriteMock.mockReturnValue(true);

    render(<FavouriteButton item={mockStory} />);

    const button = screen.getByRole('button', {
      name: /remove from favourites/i,
    });

    expect(button).toBeTruthy();
  });

  it('calls toggleFavorite with item when clicked', () => {
    isFavoriteMock.mockReturnValue(false);

    render(<FavouriteButton item={mockStory} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toggleFavoriteMock).toHaveBeenCalledTimes(1);
    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockStory);
  });
});
