import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const entry = {
  index: resolve(import.meta.dirname, 'src/index.ts'),
  'components/button/index': resolve(import.meta.dirname, 'src/components/button/index.ts'),
  'components/input/index': resolve(import.meta.dirname, 'src/components/input/index.ts'),
  'components/textarea/index': resolve(import.meta.dirname, 'src/components/textarea/index.ts'),
  'components/select/index': resolve(import.meta.dirname, 'src/components/select/index.ts'),
  'components/checkbox/index': resolve(import.meta.dirname, 'src/components/checkbox/index.ts'),
  'components/radio/index': resolve(import.meta.dirname, 'src/components/radio/index.ts'),
  'components/switch/index': resolve(import.meta.dirname, 'src/components/switch/index.ts'),
  'components/badge/index': resolve(import.meta.dirname, 'src/components/badge/index.ts'),
  'components/alert/index': resolve(import.meta.dirname, 'src/components/alert/index.ts'),
  'components/card/index': resolve(import.meta.dirname, 'src/components/card/index.ts'),
  'components/progress/index': resolve(import.meta.dirname, 'src/components/progress/index.ts'),
  'components/spinner/index': resolve(import.meta.dirname, 'src/components/spinner/index.ts'),
  'components/accordion/index': resolve(import.meta.dirname, 'src/components/accordion/index.ts'),
  'components/avatar/index': resolve(import.meta.dirname, 'src/components/avatar/index.ts'),
  'components/breadcrumb/index': resolve(import.meta.dirname, 'src/components/breadcrumb/index.ts'),
  'components/config-provider/index': resolve(import.meta.dirname, 'src/components/config-provider/index.ts'),
  'components/dialog/index': resolve(import.meta.dirname, 'src/components/dialog/index.ts'),
  'components/divider/index': resolve(import.meta.dirname, 'src/components/divider/index.ts'),
  'components/dropdown-menu/index': resolve(import.meta.dirname, 'src/components/dropdown-menu/index.ts'),
  'components/empty-state/index': resolve(import.meta.dirname, 'src/components/empty-state/index.ts'),
  'components/pagination/index': resolve(import.meta.dirname, 'src/components/pagination/index.ts'),
  'components/popover/index': resolve(import.meta.dirname, 'src/components/popover/index.ts'),
  'components/skeleton/index': resolve(import.meta.dirname, 'src/components/skeleton/index.ts'),
  'components/tabs/index': resolve(import.meta.dirname, 'src/components/tabs/index.ts'),
  'components/toast/index': resolve(import.meta.dirname, 'src/components/toast/index.ts'),
  'components/tooltip/index': resolve(import.meta.dirname, 'src/components/tooltip/index.ts'),
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
