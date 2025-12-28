import { HNApiStory, Story } from '../types/types';
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

/**
 * Define la estructura de los datos crudos que devuelve axios de la API.
 */
interface ApiResponse {
  hits: HNApiStory[];
  page: number;
  nbHits: number;
  processingTimeMS: number;
}

/**
 * Mapea los datos de la API a la estructura interna 'Story' de la aplicación.
 */

interface ListResponse {
  /** Array de historias o comentarios ya procesados y limpios */
  hits: Story[];

  /** El número de página actual (empezando desde 0) */
  page: number;

  /** El número total de resultados encontrados en la base de datos */
  nbHits: number;

  /** Tiempo que tardó la API en procesar la solicitud (en milisegundos) */
  processingTimeMs: number;
}
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

    return mapData(data, extractTag(url));
  } catch (error) {
    throw new Error('Error fetching news from Hacker News. ' + error);
  }
};
