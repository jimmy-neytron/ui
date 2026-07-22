import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const entry = {
  index: resolve(import.meta.dirname, 'src/index.ts'),
  'components/button/index': resolve(import.meta.dirname, 'src/components/button/index.ts'),
  'components/input/index': resolve(import.meta.dirname, 'src/components/input/index.ts'),
  'components/textarea/index': resolve(import.meta.dirname, 'src/components/textarea/index.ts'),
  'components/select/index': resolve(import.meta.dirname, 'src/components/select/index.ts'),
  styles: resolve(import.meta.dirname, 'scripts/styles-entry.ts'),
};

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'styles.css' : 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
