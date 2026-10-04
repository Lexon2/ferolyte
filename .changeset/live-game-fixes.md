---
'@ferolyte/pack': minor
'@ferolyte/cli': minor
'@ferolyte/common': patch
---

Fixes found by testing generated content in the game (Minecraft 1.26.50 – 1.26.52):

- **`blockPlacer.useOn`** takes block names and descriptors like `placement_filter`: `useOn: ['minecraft:farmland']` is written as is (it used to be rejected).
- **Boolean `boneVisibility`** is typed as a Molang string; a boolean value (JS users, old projects) is written as `'true'` / `'false'` with a warning that names the bone, so the block is valid for the game.
- **Block `components.tags` changes output:** with a written `format_version` of 1.26.20 or newer it is `"minecraft:tags": [...]` (the `tag:<name>` keys are rejected there); older versions keep `tag:<name>`. `rawComponents['minecraft:tags']` still wins. The block default version follows `minGameVersion` from 1.26.40 on.
- **`redstoneProducer.stronglyPoweredFace`** is one face (`'up' | 'down' | 'north' | 'south' | 'east' | 'west'`), as the game requires; a one-element list is unwrapped with a warning, a longer list is an error.
- **No false "unknown terrain texture key" warnings** for vanilla keys (`stone`, `planks`, …) and vanilla item atlas keys; the key lists are generated from the vanilla resource pack samples (`npm run schemas:vanilla-keys`).
- **New reference checks (warnings):** block `loot` paths, `geometry.culling` and `geometry.cullingShape` that no file of the pack declares (`loot_tables`, `block_culling/*.json`, `shapes/*.json`).
- **`spawnEggName`** on server entities names the spawn egg separately from `displayName` (unset: unchanged behaviour).
- Codegen: patches may use `$set` (JSON pointer replace); all patches are registered before any component is resolved, so components that `$ref` another component file see its patch.
