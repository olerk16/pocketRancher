import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env': {},
    'process.platform': null,
    'process.version': null,
  },
  base: '',
  publicDir: 'public',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    cors: true,
    fs: {
      strict: false
    }
  }
});