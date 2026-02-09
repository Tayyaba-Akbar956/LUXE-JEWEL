import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        '**/__tests__/**',
        '**/types/**',
        '**/interfaces/**',
        '**/constants/**',
        '**/utils/test/**',
        '**/test-utils/**',
        '**/vitest.setup.ts',
        '**/next.config.js',
        '**/postcss.config.js',
        '**/tailwind.config.js',
        '**/tsconfig.json',
        '**/package.json',
        '**/README.md',
        '**/PLACEHOLDER.md'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});