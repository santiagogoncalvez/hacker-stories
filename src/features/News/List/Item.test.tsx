import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import Item from './Item';
import { Story } from '../../../types/types';

/* =========================
   Mocks de hijos
   ========================= */

vi.mock('./StoryInfo', () => ({
  default: ({ item }: { item: Story }) => (
    <div data-testid="story-info">{item.author}</div>
  ),
}));

vi.mock('./CommentInfo', () => ({
  default: ({ item }: { item: Story }) => (
    <div data-testid="comment-info">{item.author}</div>
  ),
}));

vi.mock('./ActionButtons.tsx', () => ({
  FavouriteButton: () => <button data-testid="fav-button">fav</button>,
}));

/* =========================
   Mock base de Story
   ========================= */

const baseStory: Story = {
  objectId: 'story-1',
  title: 'Test story',
  points: 100,
  author: 'tester',
  createdAtI: 1704067200,
  url: 'https://example.com',
  tags: [],
};

/* =========================
   Tests
   ========================= */

describe('Item', () => {
  it('renders story title as link when type is story and url exists', () => {
    render(<Item item={baseStory} type="story" />);

    const link = screen.getByRole('link', { name: /test story/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');

    expect(screen.getByTestId('story-info')).toBeTruthy();
    expect(screen.getByTestId('fav-button')).toBeTruthy();
  });

  it('renders story title as text when type is story and url is missing', () => {
    const storyWithoutUrl: Story = {
      ...baseStory,
      url: '',
    };

    render(<Item item={storyWithoutUrl} type="story" />);

    const title = screen.getByText(/test story/i);
    expect(title.tagName).toBe('P');

    expect(screen.getByTestId('story-info')).toBeTruthy();
  });

  it('renders comment info when type is comment', () => {
    render(<Item item={baseStory} type="comment" />);

    expect(screen.getByTestId('comment-info')).toBeTruthy();
    expect(screen.getByTestId('fav-button')).toBeTruthy();
  });
});
