import { HNApiStory } from '../types/types';
import axios from 'axios';
import { extractTag } from '../utils/searches';

const mapData = (data, dataType: string) => {
  if (dataType === 'story')
    return {
      hits: data.hits.map((story: HNApiStory) => ({
        title: story.title,
        url: story.url,
        author: story.author,
        numComments: story.num_comments,
        points: story.points,
        objectId: story.objectID,
        createdAtI: story.created_at_i,
      })),
      page: data.page,
    };

  if (dataType === 'comment')
    return {
      hits: data.hits.map((story: HNApiStory) => ({
        title: story.story_title,
        url: story.story_url,
        author: story.author,
        objectId: story.objectID,
        createdAtI: story.created_at_i,
        commentText: story.comment_text,
      })),
      page: data.page,
    };
};

export const getAsyncStories = async ({ url }: { url: string }) => {
  if (url === '') return null;
  try {
    const result = await axios.get(url);
    const data = result.data;

    return mapData(data, extractTag(url));
  } catch {
    throw new Error('Errror fetching news of Hacker News');
  }
};
