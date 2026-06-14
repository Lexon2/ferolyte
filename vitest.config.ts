import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@artifex/common': path.resolve(__dirname, 'packages/common'),
      '@artifex/cli': path.resolve(__dirname, 'packages/cli'),
      '@artifex/events': path.resolve(__dirname, 'packages/events'),
      '@artifex/pack': path.resolve(__dirname, 'packages/pack'),
      '@artifex/world': path.resolve(__dirname, 'packages/world'),
      '@artifex/utils': path.resolve(__dirname, 'packages/utils'),
    },
  },
  test: {
    include: [
      'packages/pack/tests/**/*.test.ts',
      'packages/cli/**/*.test.ts',
    ],
  },
});
