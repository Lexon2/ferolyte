# @ferolyte/common

## 0.7.0

### Patch Changes

- 6231800: Fixes from the third change request (Minecraft 1.26.52):

  - **Type resolution:** the bare `@ferolyte/pack` import type-checks under `moduleResolution: "node"` (the `typesVersions` wildcard used to remap the root to `dist/dist/index.d.ts`), and `@ferolyte/common/types` resolves under `bundler` / `nodenext` (new explicit `./types` export). A test type-checks a consumer project per resolution mode (`node`, `bundler`, `nodenext`).
  - **New `check` warnings for Molang** that the game loads silently: `!` applied to one side of a comparison (`!v.a == 'x'` is `(!v.a) == 'x'`) and `!` applied to a string literal (`not('v.a == 1')` writes `!'v.a == 1'`). They are reported in every string of entities, client entities, attachables, render controllers, items, blocks and animation controllers built from `.ts`, and `--strict` makes them errors.
  - **`multiBlock` trait requirements:** an error when the block has no `movable` component (typed or `rawComponents`), an error for `placementFilter` in a permutation, and a warning naming the Upcoming Creator Features toggle when the block format is below 1.26.40 (it replaces the horizontal-direction warning there).
  - **`materialInstances.*.ambientOcclusion` changes output:** from block format 1.26.20 a boolean is written as a number (`true` → `1`, `false` → `0`), because the game rejects a boolean there. This also applies inside `itemVisual` / `embeddedVisual` and in permutations. Numbers up to 10 (the exponent) are accepted.
  - Docs: the `/connect` WebSocket lives for the game session, not per world, so `clients` can be connected without a loaded world.

## 0.6.0

### Patch Changes

- a9eff27: Fixes found by testing generated content in the game (Minecraft 1.26.50 – 1.26.52):

  - **`blockPlacer.useOn`** takes block names and descriptors like `placement_filter`: `useOn: ['minecraft:farmland']` is written as is (it used to be rejected).
  - **Boolean `boneVisibility`** is typed as a Molang string; a boolean value (JS users, old projects) is written as `'true'` / `'false'` with a warning that names the bone, so the block is valid for the game.
  - **Block `components.tags` changes output:** with a written `format_version` of 1.26.20 or newer it is `"minecraft:tags": [...]` (the `tag:<name>` keys are rejected there); older versions keep `tag:<name>`. `rawComponents['minecraft:tags']` still wins. The block default version follows `minGameVersion` from 1.26.40 on.
  - **`redstoneProducer.stronglyPoweredFace`** is one face (`'up' | 'down' | 'north' | 'south' | 'east' | 'west'`), as the game requires; a one-element list is unwrapped with a warning, a longer list is an error.
  - **No false "unknown terrain texture key" warnings** for vanilla keys (`stone`, `planks`, …) , vanilla item atlas keys and vanilla loot tables (`loot_tables/empty.json`); the lists are generated from the vanilla samples (`npm run schemas:vanilla-keys`).
  - **New reference checks (warnings):** block `loot` paths, `geometry.culling` and `geometry.cullingShape` that no file of the pack declares (`loot_tables`, `block_culling/*.json`, `shapes/*.json`).
  - **`spawnEggName`** on server entities names the spawn egg separately from `displayName` (unset: unchanged behaviour).
  - Codegen: patches may use `$set` (JSON pointer replace); all patches are registered before any component is resolved, so components that `$ref` another component file see its patch.

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
