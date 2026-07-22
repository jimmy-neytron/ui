import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(import.meta.dirname, 'playground'),
  plugins: [vue()],
  resolve: {
    alias: {
      '@compact-ui': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: resolve(import.meta.dirname, 'playground-dist'),
    emptyOutDir: true,
  },
});
