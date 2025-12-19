import { HNApiStory } from '../types/types';
import axios from 'axios';

export const getAsyncStories = async ({ url }: { url: string }) => {
  if (url === '') return null;
  try {
    const result = await axios.get(url);
    const data = result.data;

    return {
      hits: data.hits.map((story: HNApiStory) => ({
        title: story.title || story.story_title,
        url: story.url || story.story_url,
        author: story.author,
        numComments: story.num_comments,
        points: story.points,
        objectId: story.objectID,
        createdAtI: story.created_at_i,
      })),
      page: data.page,
    };
  } catch {
    throw new Error('Errror fetching news of Hacker News');
  }
};
