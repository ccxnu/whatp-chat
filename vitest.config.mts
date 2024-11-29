import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: [`tests/(unit|e2e)/**/*.test.ts`],
    root: './',
    isolate: false,
    passWithNoTests: true,
    coverage: {
      provider: 'v8'
    },
  },
  plugins:
  [
    swc.vite({ module: { type: 'es6' } })
  ],
});
