import { stories as initialStories } from '../constants/stories';

export const getAsyncStories = () => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve({ data: { stories: initialStories } });
      reject();
    }, 2000),
  );
};