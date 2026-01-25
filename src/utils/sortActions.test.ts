// src/utils/sortActions.test.ts
import { describe, it, expect } from 'vitest';
import { sortList, sortActionList } from './sortActions';
import { Story, SortState } from '../types/types';

describe('sortActions logic', () => {
  const mockStories = [
    { objectId: '1', title: 'Zebra', author: 'B', numComments: 10, points: 5 },
    { objectId: '2', title: 'Apple', author: 'A', numComments: 2, points: 20 },
    { objectId: '3', title: 'Mango', author: 'C', numComments: 5, points: 15 },
  ] as Story[];

  describe('sortList', () => {
    it('should sort by TITLE alphabetically', () => {
      const sorted = sortList(mockStories, 'TITLE');
      expect(sorted[0].title).toBe('Apple');
      expect(sorted[2].title).toBe('Zebra');
    });

    it('should sort by POINTS numerically', () => {
      const sorted = sortList(mockStories, 'POINTS');
      expect(sorted[0].points).toBe(5);
      expect(sorted[2].points).toBe(20);
    });

    it('should handle missing titles by treating them as empty strings', () => {
      const storiesWithMissingTitle = [
        { title: 'B' },
        { title: undefined },
        { title: 'A' },
      ] as Story[];

      const sorted = sortList(storiesWithMissingTitle, 'TITLE');
      // El undefined se convierte en '' y debería quedar primero
      expect(sorted[0].title).toBeUndefined();
      expect(sorted[1].title).toBe('A');
    });
  });

  describe('sortActionList (with reverse logic)', () => {
    it('should return list in reverse order when isReverse is true', () => {
      const sortState: SortState = {
        sortType: 'TITLE',
        isReverse: true,
      };

      const sorted = sortActionList(sortState, mockStories);

      // Si TITLE normal es [Apple, Mango, Zebra], reverse es [Zebra, Mango, Apple]
      expect(sorted[0].title).toBe('Zebra');
      expect(sorted[2].title).toBe('Apple');
    });

    it('should return list in normal order when isReverse is false', () => {
      const sortState: SortState = {
        sortType: 'TITLE',
        isReverse: false,
      };

      const sorted = sortActionList(sortState, mockStories);
      expect(sorted[0].title).toBe('Apple');
    });
  });
});
