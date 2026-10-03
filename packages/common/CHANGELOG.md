# @ferolyte/common

## 0.5.0

### Patch Changes

- 21b50c7: Content SDK fixes:

  - **Bare Molang queries** (`q.isMoving`, `q.allAnimationsFinished`, …) no longer fail with "could not be cloned": every builder's `cloneConfig()` copies plain data and keeps Molang values by reference (`cloneConfig` helper in `@ferolyte/common`). `client entity` `scripts.animate` also accepts them in the types.
  - **Block states** accept lists of integers or booleans (one type per state, 1–16 unique values), as vanilla does; mixed types, fractions, duplicates and long lists get a clear error.
  - **Entity events** with `stopMovement` set to one flag or `{}` are written (only the given flags); an event that cannot be converted is now an error naming it instead of silently disappearing.
  - **Typed ids:** `check` refreshes `.ferolyte/types/ids.ts`; a missing ids file is bootstrapped first (placeholder ids), so content that imports ids of other content, even mutually, builds from a clean project in one `check` / `run`; when ids change after a pass, only the files that import them are evaluated again (no extra pass otherwise). New ids `BpAnimationId` and `BpAnimationControllerId` (`AnimationId` / `AnimationControllerId` stay resource pack ids).
  - **Exports:** `EntityComponentGroup` and `EntityEvents` types from `@ferolyte/pack` and `@ferolyte/pack/entity`.
  - **Integer fields:** generated types carry an `@integer` note, and the validator says "Must be an integer (whole number)" (`knockbackRoar`, …).
  - **Format versions:** namespaced custom components in files written with a `format_version` older than 1.21.90 get a warning that names the fix (`version: '1.21.90'`); the docs state the default version of every content type and what `minGameVersion` does. The default output version is unchanged.

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
