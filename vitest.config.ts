import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // Since we are testing API routes with Prisma
    globals: true,
    alias: {
      '@': resolve(__dirname, './src'),
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
