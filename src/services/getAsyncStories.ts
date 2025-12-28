import { ApiResponse, HNApiStory, ListResponse, Story } from '../types/types';
import axios from 'axios';
import { extractTag } from '../utils/searches';
import DOMPurify from 'dompurify';

/**
 * Limpia el HTML y extrae solo el texto plano.
 * Útil para títulos o comentarios que vienen con entidades HTML.
 */
const getPlainText = (html?: string): string => {
  if (!html) return '';
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  const div = document.createElement('div');
  div.innerHTML = clean;
  return div.textContent || div.innerText || '';
};

const mapData = (data: ApiResponse, dataType: string): ListResponse | null => {
  if (dataType === 'story') {
    return {
      hits: data.hits.map(
        (story: HNApiStory): Story => ({
          title: getPlainText(story.title || ''),
          url: story.url || '',
          author: story.author,
          numComments: story.num_comments ?? 0,
          points: story.points ?? 0,
          objectId: story.objectID,
          createdAtI: story.created_at_i,
          tags: story._tags,
        }),
      ),
      page: data.page,
      nbHits: data.nbHits,
      nbPages: data.nbPages,
      processingTimeMs: data.processingTimeMS,
    };
  }

  if (dataType === 'comment') {
    return {
      hits: data.hits.map(
        (story: HNApiStory): Story => ({
          title: getPlainText(story.story_title || ''),
          url: story.story_url || '',
          author: story.author,
          objectId: story.objectID,
          createdAtI: story.created_at_i,
          commentText: getPlainText(story.comment_text || ''),
          tags: story._tags,
        }),
      ),
      page: data.page,
      nbHits: data.nbHits,
      nbPages: data.nbPages,
      processingTimeMs: data.processingTimeMS,
    };
  }

  return null;
};

/**
 * Función principal para obtener historias o comentarios de forma asíncrona.
 */
export const getAsyncStories = async ({
  url,
}: {
  url: string;
}): Promise<ListResponse | null> => {
  if (url === '') return null;

  try {
    // Especificamos que axios devuelve un objeto de tipo ApiResponse
    const result = await axios.get<ApiResponse>(url);
    const data = result.data;

    // console.log(mapData(data, extractTag(url)));
    return mapData(data, extractTag(url));
  } catch (error) {
    throw new Error('Error fetching news from Hacker News. ' + error);
  }
};
