# @ferolyte/cli

## 0.6.0

### Minor Changes

- a9eff27: **Hub commands use the current command syntax.** The hub sent every command with `body.version: 1` (legacy syntax), so `sendCommand('execute as @p run say hi')` failed with `Syntax error: Unexpected "@p"`. The default is now the current syntax (`17039360`); the new profile option `server.commandVersion` sets another value (also reported to plugins in the effective `server` info). `commandVersion` is additive for plugins.

  ### Behaviour change

  Plugins and scripts that send commands in the legacy syntax (`execute @p ~ ~ ~ say hi`) must set `server.commandVersion: 1`. Ferolyte's own commands (`reload`, `tellraw`, `scriptevent`) are valid under both versions.

- a9eff27: Fixes found by testing generated content in the game (Minecraft 1.26.50 – 1.26.52):

  - **`blockPlacer.useOn`** takes block names and descriptors like `placement_filter`: `useOn: ['minecraft:farmland']` is written as is (it used to be rejected).
  - **Boolean `boneVisibility`** is typed as a Molang string; a boolean value (JS users, old projects) is written as `'true'` / `'false'` with a warning that names the bone, so the block is valid for the game.
  - **Block `components.tags` changes output:** with a written `format_version` of 1.26.20 or newer it is `"minecraft:tags": [...]` (the `tag:<name>` keys are rejected there); older versions keep `tag:<name>`. `rawComponents['minecraft:tags']` still wins. The block default version follows `minGameVersion` from 1.26.40 on.
  - **`redstoneProducer.stronglyPoweredFace`** is one face (`'up' | 'down' | 'north' | 'south' | 'east' | 'west'`), as the game requires; a one-element list is unwrapped with a warning, a longer list is an error.
  - **No false "unknown terrain texture key" warnings** for vanilla keys (`stone`, `planks`, …) , vanilla item atlas keys and vanilla loot tables (`loot_tables/empty.json`); the lists are generated from the vanilla samples (`npm run schemas:vanilla-keys`).
  - **New reference checks (warnings):** block `loot` paths, `geometry.culling` and `geometry.cullingShape` that no file of the pack declares (`loot_tables`, `block_culling/*.json`, `shapes/*.json`).
  - **`spawnEggName`** on server entities names the spawn egg separately from `displayName` (unset: unchanged behaviour).
  - Codegen: patches may use `$set` (JSON pointer replace); all patches are registered before any component is resolved, so components that `$ref` another component file see its patch.

### Patch Changes

- Updated dependencies [a9eff27]
  - @ferolyte/pack@0.6.0
  - @ferolyte/common@0.6.0

## 0.5.0

### Minor Changes

- 21b50c7: Game hub and plugin API 1.2.0 (additive; plugins declaring `1.1.0` keep working):

  - `minecraft.onReload` (`{ trigger, clientId, ok, message, at, seq }`), `GET /status` `lastReload`/`connected`, and the `afterScriptBuild({ profile, ok })` plugin hook.
  - HTTP routes: prefix routes (`/api/*`, exact wins), `request.headers` and an abort `request.signal`, the explicit `httpResponse(status, body?)` envelope (exported from `@ferolyte/cli/plugin`), `/subscribe` accepts `event`, `/events?limit`. `route()` replacing an existing route is documented and logged once per path (`--verbose`).
  - Every frame the hub sends carries `messageType: 'commandRequest'`; `--verbose` logs the raw body of the first `PlayerMessage` per connection and unmatched `commandResponse` frames.
  - `server.clientPolicy` (`'newest'` | `'oldest'`) and `minecraft.primaryClientId`. **Behaviour change:** commands without a `clientId` now go to the newest connection by default (set `clientPolicy: 'oldest'` for the previous behaviour).
  - `MinecraftCommandResult.body` (raw response body) and `minecraft.onCommand` for every command, including the internal reload.
  - `server` (effective port, HTTP address, `reloadOnPackChange`, `clientPolicy`) on `AfterLoadEvent` / `WatchReadyEvent`, undefined outside `watch`.
  - `minecraft.onChat`: normalised chat lines (`{ clientId, sender, type, text }`) sharing the `PlayerMessage` subscription.

- 21b50c7: Content SDK fixes:

  - **Bare Molang queries** (`q.isMoving`, `q.allAnimationsFinished`, …) no longer fail with "could not be cloned": every builder's `cloneConfig()` copies plain data and keeps Molang values by reference (`cloneConfig` helper in `@ferolyte/common`). `client entity` `scripts.animate` also accepts them in the types.
  - **Block states** accept lists of integers or booleans (one type per state, 1–16 unique values), as vanilla does; mixed types, fractions, duplicates and long lists get a clear error.
  - **Entity events** with `stopMovement` set to one flag or `{}` are written (only the given flags); an event that cannot be converted is now an error naming it instead of silently disappearing.
  - **Typed ids:** `check` refreshes `.ferolyte/types/ids.ts`; a missing ids file is bootstrapped first (placeholder ids), so content that imports ids of other content, even mutually, builds from a clean project in one `check` / `run`; when ids change after a pass, only the files that import them are evaluated again (no extra pass otherwise). New ids `BpAnimationId` and `BpAnimationControllerId` (`AnimationId` / `AnimationControllerId` stay resource pack ids).
  - **Exports:** `EntityComponentGroup` and `EntityEvents` types from `@ferolyte/pack` and `@ferolyte/pack/entity`.
  - **Integer fields:** generated types carry an `@integer` note, and the validator says "Must be an integer (whole number)" (`knockbackRoar`, …).
  - **Format versions:** namespaced custom components in files written with a `format_version` older than 1.21.90 get a warning that names the fix (`version: '1.21.90'`); the docs state the default version of every content type and what `minGameVersion` does. The default output version is unchanged.

### Patch Changes

- Updated dependencies [21b50c7]
  - @ferolyte/pack@0.5.0
  - @ferolyte/common@0.5.0

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
