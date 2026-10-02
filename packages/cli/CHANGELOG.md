# @ferolyte/cli

## 0.4.0

### Minor Changes

- e21faeb: Compiler support for attachables, render controllers, recipes and spawn rules:

  - Default suffixes `.att.ts`, `.rc.ts`, `.recipe.ts`, `.spawn.ts` (configurable with `contentSuffixes`), written to RP `attachables/` and `render_controllers/`, BP `recipes/` and `spawn_rules/`; `check`, `inspect`, `run` and `watch` handle them, the build summary counts them.
  - Typed ids in `@ferolyte/ids`: `AttachableId`, `RenderControllerId`, `RecipeId`, `SpawnRuleId`.
  - Reference checks (warnings, errors with `--strict`, "did you mean" hints): attachable geometry / textures / animations / render controllers exist; render controller `Geometry.x` / `Texture.x` / `Material.x` keys exist in every client entity and attachable that uses the controller; recipe items and blocks of your own namespace exist; a spawn rule's entity exists.
  - Animation options (`speed`, …) work in attachables as in client entities.

### Patch Changes

- Updated dependencies [e21faeb]
- Updated dependencies [e21faeb]
  - @ferolyte/common@0.4.0
  - @ferolyte/pack@0.4.0

## 0.3.0

### Minor Changes

- 04dadc1: **Breaking:** `components.icon` now only references an `item_texture.json` key. The compiler no longer generates or merges `textures/item_texture.json` (it is copied as a normal resource pack file), and `resolveItemIcon`, `ItemBuilder.withPackConfig` and `ItemBuilder.getItemTextureEntries` were removed. A warning is logged when an icon value is a `textures/...` path.
- 04dadc1: Release 0.3.0:

  - **Faster pipeline:** one esbuild pass per change, dependency graph with a reverse index, debounced watch batches.
  - **New commands:** `ferolyte check [--json]` (validate everything in memory, exit 1 on errors), `ferolyte inspect <file>` (print the emitted JSON), `ferolyte run --json` (diagnostics as `{ file, contentType, component, fieldPath, message, severity }[]`).
  - **WebSocket hub:** one `/connect` for script reload, commands and event subscription plus an HTTP API; configured with `server`.
  - **Localization:** `texts/<locale>.lang` and `languages.json` are generated and merged with the pack's own lang files (`packs.lang`).
  - **Animation controllers** and **animation options**, JSONC support for pack JSON, plugin lifecycle (`beforeStop`, clean shutdown on Ctrl+C), Blockbench plugin for `*.ce.ts`.
  - **Scaffold:** `moduleResolution: "bundler"` tsconfig without `paths` into `node_modules`, `skipLibCheck`, project `AGENTS.md` / `CLAUDE.md`.
  - **Package layout:** build output in `dist/`, tests are no longer published; `bin` points to `dist/cli/index.js`.

  ### Breaking changes
  - **Item `icon`** is a texture key only; the compiler no longer generates or merges `textures/item_texture.json`.
  - **`components` accept only known keys**, everything else goes to `rawComponents`.
  - **Pack `texts`:** `RP/texts/*.lang` and `languages.json` are merged by the generator (user lines win, generated lines are appended under `## ferolyte`) instead of being copied as is.
  - **`watch` always starts the WebSocket server** (even without a scripts entry); `scripts/minecraft-reload-server` was replaced by the hub, port and HTTP API are set with the `server` config option.
  - **Content is bundled as CommonJS** and evaluated in memory: no top-level `await` and no `import.meta` in content files.
  - **Plugin API:** `FerolytePluginApiVersion` gained `V1_1_0` (`beforeStop`, abort `signal`, `event.minecraft`); plugins must declare a supported `apiVersion`.
  - **Config import path:** use `@ferolyte/cli/config` (the old `@ferolyte/cli/compiler/config/define-config` still works).
  - **Package layout:** files are published under `dist/`; import through the package `exports`.

### Patch Changes

- Updated dependencies [04dadc1]
- Updated dependencies [04dadc1]
- Updated dependencies [04dadc1]
- Updated dependencies [04dadc1]
- Updated dependencies [04dadc1]
  - @ferolyte/common@0.3.0
  - @ferolyte/pack@0.3.0

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
