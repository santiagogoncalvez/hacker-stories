import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  },
});
