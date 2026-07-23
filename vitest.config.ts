import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**/*.{ts,vue}', 'src/composables/**/*.ts'],
      exclude: ['src/components/**/*.types.ts', 'src/components/**/index.ts'],
      thresholds: { statements: 100, branches: 97.35, functions: 100, lines: 100 },
    },
  },
});
