# @ferolyte/pack

## 0.4.0

### Minor Changes

- e21faeb: New content types, all generated from the Bedrock schemas and validated like components (unknown fields are reported with a hint and not written):

  - **Attachables** (`*.att.ts` → RP `attachables/`): `createAttachable`, sharing the render description (geometry, textures, materials, animations with options, scripts, render controllers) with client entities.
  - **Render controllers** (`*.rc.ts` → RP `render_controllers/`): `createRenderController`; several builders in one file are written into one JSON; Molang v2 everywhere; id prefix `controller.render.` is checked.
  - **Recipes** (`*.recipe.ts` → BP `recipes/`): `shapedRecipe`, `shapelessRecipe`, `furnaceRecipe`, `brewingMixRecipe`, `brewingContainerRecipe`, `smithingTransformRecipe`, `smithingTrimRecipe` and the `createRecipe({ type })` dispatcher. Item shorthands (`'ns:item'`, `'ns:item:2'`, `{ item, count }`, `{ tag }`), default station tags, `unlock`, and checks for the pattern against `key` (unknown symbol, unused key, at most 3×3) and empty results.
  - **Spawn rules** (`*.spawn.ts` → BP `spawn_rules/`): `createSpawnRule({ identifier, populationControl, conditions })` with generated conditions (`weight`, `densityLimit`, `herd`, `biomeFilter`, …) and the shared filter format.
  - New entry points `@ferolyte/pack/attachable`, `/render-controller`, `/recipe`, `/spawn-rule`, `/documents`.
  - `createAttachableDocument`, `createRenderControllerDocument`, `createRecipeDocument`, `createSpawnRuleDocument` mirror the JSON file 1:1 in camelCase (escape hatch); `convertDocument` is the generic runtime behind them.
  - **Client entities:** new fields `animationControllers`, `heldItemScale`, `scripts.scaleX/scaleY/scaleZ`, `scripts.hideHeldItems`; `scripts.initialize` / `preAnimation` accept Molang v2 builders.

  ### Fixes
  - `spawnEgg` was written with camelCase keys (`baseColor`, `overlayColor`, `textureIndex`) in 0.3.0, which is not valid Minecraft JSON. It now writes `base_color`, `overlay_color` and `texture_index`.

  ### Breaking changes
  - None for existing content. The low-level document factories were never released under their former names.

### Patch Changes

- Updated dependencies [e21faeb]
  - @ferolyte/common@0.4.0

## 0.3.0

### Minor Changes

- 04dadc1: **Breaking:** `components.icon` now only references an `item_texture.json` key. The compiler no longer generates or merges `textures/item_texture.json` (it is copied as a normal resource pack file), and `resolveItemIcon`, `ItemBuilder.withPackConfig` and `ItemBuilder.getItemTextureEntries` were removed. A warning is logged when an icon value is a `textures/...` path.
- 04dadc1: Molang API v2: immutable `MolangExpr` / `MolangStatement` values, the `molang` tagged template, `q.*` / `v()` / `t()` / `c()` / `math.*` namespaces, precedence-aware operators (`and`, `or`, `not`, `ternary`, ...) and statements (`assign`, `ret`, `loop`, `forEach`). The mutable `Molang` class is deprecated. The `MolangStatement` type alias was renamed to `MolangStatementInput`.
- 04dadc1: Release 0.3.0:

  - **Entry points:** `@ferolyte/pack` (everything public) plus `/item`, `/block`, `/entity`, `/molang`, `/animation`; deep `content/...` imports keep working through `./*`. Auto-import and `moduleResolution: "bundler"` now resolve correctly.
  - **New content:** animation controllers (`createAnimationController`, `defineRpState`, `defineBpState`, files `*.ac.bp.ts` / `*.ac.rp.ts`), client entity animation options (`animations: { walk: { id, speed } }`), nested entity events, `displayName` for items, blocks and server entities (generated `.lang` files), open `version` strings, more block/item/entity components, `MinMaxRange` everywhere a range is expected.
  - **Docs for humans and agents:** JSDoc generated from the Bedrock schemas, `AGENTS.md` and `llms.txt` shipped in the package.
  - **Quality:** conformance tests against the Blockception schemas; many convertor fixes found by them.

  ### Breaking changes
  - **Item `icon`** is a texture key only (`item_texture.json` key); `textures/...` paths are no longer resolved.
  - **`components` no longer accept arbitrary camelCase keys.** Custom components go in as `'namespace:name'` keys (items/blocks); anything else unmodelled goes into `rawComponents`.
  - **`displayName`** is emitted through `texts/*.lang` (key-based) instead of inline text when the build knows the identifier.
  - **Molang:** the mutable `Molang` class is deprecated in favour of the v2 API; `MolangStatement` type renamed to `MolangStatementInput`.
  - **Package layout:** files are published under `dist/`; use the package `exports` instead of direct file paths.

- 04dadc1: Entity (components, behaviors, filters), item and block (components, traits) types, key renaming and validation are now **generated from the Bedrock schemas** (`npm run codegen`, patches for fields missing upstream). Every shape Minecraft accepts can be written (e.g. `destructibleByMining.itemSpecificSpeeds[].item = { tags: '…' }`, single values where lists are allowed, `breeds_with` maps, new 1.26.40/1.26.50 fields).

  ### Breaking changes
  - **Invalid content is reported instead of silently dropped.** Unknown fields are an error with a "Did you mean" hint and are not written; invalid values of known fields are written as given plus an error; unknown component keys are errors (only namespaced `ns:name` custom components pass through).
  - **Legacy SDK aliases are gone, the schema names are used:** `damageAbsorption.causes` → `absorbableCauses`, `blockPlacer.useOn` takes block descriptors, `apply_knockback_rules` `scalePreviousVelocity`/angle scales and `ranged_attack` `attackRadius*` are no longer mapped, removed `projectile` root fields are not emitted.
  - **Removed helpers/exports:** `convertWeaponReach`, `convertKineticWeaponConditions`, `ItemWeaponReachRange`/`ItemKineticWeaponConditions`, the per-component `create*` functions for blocks and items, the per-test filter interfaces' hand-written convertors, `entity*ConvertorsFactory`. Typed component interfaces keep their names (the `Item*Component` aliases still exist); `LootComponent` of blocks is exported as `BlockLootComponent` from the root barrel.
  - **Marker components** (`fireImmune`, …) accept `{}`, `true` or `{ value: false }` (omits the component); components whose schema is `boolean | {}` keep a bare boolean.
  - **Ranges:** a plain number stays a number where Minecraft accepts a range; other forms are written in the shape the schema asks for.
  - **Block traits:** `states`/`yRotation` are aliases of `enabledStates`/`yRotationOffset` (exactly one of the two spellings per trait).

### Patch Changes

- Updated dependencies [04dadc1]
- Updated dependencies [04dadc1]
  - @ferolyte/common@0.3.0

## 0.2.3

### Patch Changes

- 41d6998: Allow custom item tags in `createTags` instead of rejecting tags outside the vanilla allowlist. Only non-empty string validation remains.
- Updated dependencies [41d6998]
  - @ferolyte/common@0.2.3

## 0.2.2

### Patch Changes

- Fix CLI crash on startup (`ferolyte watch`, `ferolyte run`, etc.) caused by stale relative paths to `package.json` in `cli/index.ts` and `cli/commands/init.ts` after moving from `dist/cli/` to co-located `cli/` layout. Extend `verify:cli` to validate `createRequire()` paths in the published package.
- Updated dependencies
  - @ferolyte/common@0.2.2

## 0.2.1

### Patch Changes

- 7f15b27: Fix missing `compiler/scripts/*.js` in the published CLI package. The build script and `.npmignore` were skipping any `scripts/` directory, so `watch-esbuild.js` and related runtime modules were not compiled or published. Add `verify:cli` to catch broken relative imports and missing tarball files before release.
- Updated dependencies [7f15b27]
  - @ferolyte/common@0.2.1

## 0.2.0

### Minor Changes

- **Package layout:** `@ferolyte/common`, `@ferolyte/pack`, and `@ferolyte/cli` now ship compiled files next to their source structure (no `dist/` folder).
- **Scaffold:** new projects get Ferolyte path mappings without `/dist` in `tsconfig.json`.

### Patch Changes

- Updated dependencies [96c2946]
  - @ferolyte/common@0.2.0

## 0.1.0

### Major Changes

- Initial project setup

### Patch Changes

- Updated dependencies
  - @ferolyte/common@0.1.0
