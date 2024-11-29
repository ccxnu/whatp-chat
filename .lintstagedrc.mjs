export default {
  "**/*.{ts?(x),mts}": () => "tsc -p tsconfig.prod.json --noEmit",
  "*.{js,mjs,cjs,ts,mts}": ["npm run lint", "vitest related --run"],
}
