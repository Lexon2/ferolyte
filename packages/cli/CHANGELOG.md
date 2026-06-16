# @ferolyte/cli

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
