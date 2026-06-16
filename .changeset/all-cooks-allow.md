---
'@ferolyte/common': minor
'@ferolyte/pack': minor
'@ferolyte/cli': minor
---

Bundle ferolyte.config.mts with esbuild so relative imports and tsconfig path aliases work without explicit .ts extensions. Publish packages with co-located .js/.d.ts files (NestJS-style layout) instead of dist/.
