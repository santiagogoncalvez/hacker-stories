// src/services/stories.test.ts
import { describe, it, expect } from 'vitest';
import { mapData } from './getAsyncStories';
import { ApiResponse, HNApiStory } from '../types/types';

describe('mapData utility', () => {
  // 1. Definimos los hits como un array de objetos parciales de HNApiStory
  // Usamos Partial<HNApiStory> para no tener que escribir las 50 propiedades de la API
  const mockHits = [
    {
      objectID: '1',
      title: 'React &amp; TypeScript',
      url: 'https://react.dev',
      author: 'dan_abramov',
      num_comments: 10,
      points: null as unknown as number, // Forzamos el null donde se espera un number para el test
      created_at_i: 1704110400,
      _tags: ['story', 'author_dan'],
    },
  ] as unknown as HNApiStory[];

  const mockApiResponse: ApiResponse = {
    hits: mockHits,
    page: 0,
    nbHits: 1,
    nbPages: 1,
    processingTimeMS: 5,
  };

  it('should transform "story" data correctly from snake_case to camelCase', () => {
    const result = mapData(mockApiResponse, 'story');

    expect(result).not.toBeNull();
    const story = result!.hits[0];

    expect(story.objectId).toBe('1');
    expect(story.numComments).toBe(10);
    expect(story.points).toBe(0); // El null de la API debe ser 0 gracias al ?? 0
  });

  it('should sanitize HTML and decode entities in titles', () => {
    const result = mapData(mockApiResponse, 'story');
    expect(result!.hits[0].title).toBe('React & TypeScript');
  });

  it('should map "comment" data type correctly', () => {
    const mockCommentHits = [
      {
        objectID: 'c1',
        comment_text: '<p>This is a <strong>comment</strong></p>',
        story_title: 'Original Title',
        story_url: 'https://original.com',
        author: 'user1',
        created_at_i: 123456789,
        _tags: ['comment'],
      },
    ] as unknown as HNApiStory[];

    const mockCommentResponse: ApiResponse = {
      hits: mockCommentHits,
      page: 0,
      nbHits: 1,
      nbPages: 1,
      processingTimeMS: 1,
    };

    const result = mapData(mockCommentResponse, 'comment');

    expect(result).not.toBeNull();
    const comment = result!.hits[0];

    expect(comment.commentText).toBe('This is a comment');
    expect(comment.title).toBe('Original Title');
  });

  it('should return null for an unknown dataType', () => {
    const result = mapData(mockApiResponse, 'invalid-type');
    expect(result).toBeNull();
  });
});
