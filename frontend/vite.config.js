import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env': {},
    'process.platform': null,
    'process.version': null,
  },
});