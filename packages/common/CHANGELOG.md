# @ferolyte/common

## 0.2.0

### Minor Changes

- **Config loading:** `ferolyte.config.mts` is now bundled via esbuild before import. Relative imports and `tsconfig.json` path aliases resolve correctly without requiring `.ts` extensions.
- **Package layout:** `@ferolyte/common`, `@ferolyte/pack`, and `@ferolyte/cli` now ship compiled files next to their source structure (no `dist/` folder).
- **Scaffold:** new projects get Ferolyte path mappings without `/dist` in `tsconfig.json`.

## 0.1.0

### Major Changes

- Initial project setup
