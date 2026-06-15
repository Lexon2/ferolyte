import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@ferolyte/common': path.resolve(__dirname, 'packages/common'),
      '@ferolyte/cli': path.resolve(__dirname, 'packages/cli'),
      '@ferolyte/events': path.resolve(__dirname, 'packages/events'),
      '@ferolyte/pack': path.resolve(__dirname, 'packages/pack'),
      '@ferolyte/world': path.resolve(__dirname, 'packages/world'),
      '@ferolyte/utils': path.resolve(__dirname, 'packages/utils'),
    },
  },
  test: {
    include: ['packages/pack/tests/**/*.test.ts', 'packages/cli/**/*.test.ts'],
  },
});
