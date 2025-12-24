import { HNApiStory } from '../types/types';
import axios from 'axios';
import { extractTag } from '../utils/searches';
import DOMPurify from 'dompurify';

const getPlainText = (html?: string) => {
  if (!html) return '';
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  const div = document.createElement('div');
  div.innerHTML = clean;
  return div.textContent || div.innerText || '';
};

const mapData = (data, dataType: string) => {
  if (dataType === 'story')
    return {
      hits: data.hits.map((story: HNApiStory) => ({
        title: getPlainText(story.title),
        url: story.url,
        author: story.author,
        numComments: story.num_comments,
        points: story.points,
        objectId: story.objectID,
        createdAtI: story.created_at_i,
        tags: story._tags,
      })),
      page: data.page,
      nbHits: data.nbHits,
      processingTimeMs: data.processingTimeMS,
    };

  if (dataType === 'comment')
    return {
      hits: data.hits.map((story: HNApiStory) => ({
        title: getPlainText(story.story_title),
        url: story.story_url,
        author: story.author,
        objectId: story.objectID,
        createdAtI: story.created_at_i,
        commentText: getPlainText(story.comment_text),
        tags: story._tags,
      })),
      page: data.page,
      nbHits: data.nbHits,
      processingTimeMs: data.processingTimeMS,
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
