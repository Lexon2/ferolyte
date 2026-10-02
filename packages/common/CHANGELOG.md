# @ferolyte/common

## 0.4.0

### Minor Changes

- e21faeb: Content metadata and diagnostic content types for the new content (`attachable`, `render-controller`, `recipe`, `spawn-rule`).

## 0.3.0

### Minor Changes

- 04dadc1: **Breaking:** `components.icon` now only references an `item_texture.json` key. The compiler no longer generates or merges `textures/item_texture.json` (it is copied as a normal resource pack file), and `resolveItemIcon`, `ItemBuilder.withPackConfig` and `ItemBuilder.getItemTextureEntries` were removed. A warning is logged when an icon value is a `textures/...` path.
- 04dadc1: Shared foundations for the 0.3.0 line:

  - `LooseString` (open string unions that keep autocomplete) and open `version` strings.
  - Localization: `LocalizedString` (`string | Record<locale, string>`) used by `displayName`.
  - Content diagnostics: `ContentDiagnosticRecord`, `setContentDiagnosticSink` and `reportContentFailure` (machine-readable output for `ferolyte check` / `run --json`); new content types `animation-controller-bp` / `animation-controller-rp`.
  - Package layout: build output now lives in `dist/` (the sources are no longer published next to compiled files).

  ### Breaking changes
  - **Package layout:** the published files are under `dist/`. Import through the package `exports` (`@ferolyte/common/<path>`); direct file paths such as `node_modules/@ferolyte/common/<file>.js` no longer exist.

## 0.2.3

### Patch Changes

- 41d6998: Allow custom item tags in `createTags` instead of rejecting tags outside the vanilla allowlist. Only non-empty string validation remains.

## 0.2.2

### Patch Changes

- Fix CLI crash on startup (`ferolyte watch`, `ferolyte run`, etc.) caused by stale relative paths to `package.json` in `cli/index.ts` and `cli/commands/init.ts` after moving from `dist/cli/` to co-located `cli/` layout. Extend `verify:cli` to validate `createRequire()` paths in the published package.

## 0.2.1

### Patch Changes

- 7f15b27: Fix missing `compiler/scripts/*.js` in the published CLI package. The build script and `.npmignore` were skipping any `scripts/` directory, so `watch-esbuild.js` and related runtime modules were not compiled or published. Add `verify:cli` to catch broken relative imports and missing tarball files before release.

## 0.2.0

### Minor Changes

- **Config loading:** `ferolyte.config.mts` is now bundled via esbuild before import. Relative imports and `tsconfig.json` path aliases resolve correctly without requiring `.ts` extensions.
- **Package layout:** `@ferolyte/common`, `@ferolyte/pack`, and `@ferolyte/cli` now ship compiled files next to their source structure (no `dist/` folder).
- **Scaffold:** new projects get Ferolyte path mappings without `/dist` in `tsconfig.json`.

## 0.1.0

### Major Changes

- Initial project setup
