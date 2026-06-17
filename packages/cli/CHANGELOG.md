# @ferolyte/cli

## 0.2.3

### Patch Changes

- 41d6998: Allow custom item tags in `createTags` instead of rejecting tags outside the vanilla allowlist. Only non-empty string validation remains.
- Updated dependencies [41d6998]
  - @ferolyte/common@0.2.3
  - @ferolyte/pack@0.2.3

## 0.2.2

### Patch Changes

- Fix CLI crash on startup (`ferolyte watch`, `ferolyte run`, etc.) caused by stale relative paths to `package.json` in `cli/index.ts` and `cli/commands/init.ts` after moving from `dist/cli/` to co-located `cli/` layout. Extend `verify:cli` to validate `createRequire()` paths in the published package.
- Updated dependencies
  - @ferolyte/common@0.2.2
  - @ferolyte/pack@0.2.2

## 0.2.1

### Patch Changes

- 7f15b27: Fix missing `compiler/scripts/*.js` in the published CLI package. The build script and `.npmignore` were skipping any `scripts/` directory, so `watch-esbuild.js` and related runtime modules were not compiled or published. Add `verify:cli` to catch broken relative imports and missing tarball files before release.
- Updated dependencies [7f15b27]
  - @ferolyte/common@0.2.1
  - @ferolyte/pack@0.2.1

## 0.2.0

### Minor Changes

- **Config loading:** `ferolyte.config.mts` is now bundled via esbuild before import. Relative imports and `tsconfig.json` path aliases resolve correctly without requiring `.ts` extensions.
- **Package layout:** `@ferolyte/common`, `@ferolyte/pack`, and `@ferolyte/cli` now ship compiled files next to their source structure (no `dist/` folder).

### Patch Changes

- Updated dependencies [96c2946]
  - @ferolyte/common@0.2.0
  - @ferolyte/pack@0.2.0

## 0.1.0

### Major Changes

- Initial project setup

### Patch Changes

- Updated dependencies
  - @ferolyte/common@0.1.0
  - @ferolyte/pack@0.1.0
