---
'@ferolyte/pack': minor
---

New content types, all generated from the Bedrock schemas and validated like components (unknown fields are reported with a hint and not written):

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
