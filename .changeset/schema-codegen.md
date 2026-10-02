---
'@ferolyte/pack': minor
---

Entity (components, behaviors, filters), item and block (components, traits) types, key renaming and validation are now **generated from the Bedrock schemas** (`npm run codegen`, patches for fields missing upstream). Every shape Minecraft accepts can be written (e.g. `destructibleByMining.itemSpecificSpeeds[].item = { tags: '…' }`, single values where lists are allowed, `breeds_with` maps, new 1.26.40/1.26.50 fields).

### Breaking changes

- **Invalid content is reported instead of silently dropped.** Unknown fields are an error with a "Did you mean" hint and are not written; invalid values of known fields are written as given plus an error; unknown component keys are errors (only namespaced `ns:name` custom components pass through).
- **Legacy SDK aliases are gone, the schema names are used:** `damageAbsorption.causes` → `absorbableCauses`, `blockPlacer.useOn` takes block descriptors, `apply_knockback_rules` `scalePreviousVelocity`/angle scales and `ranged_attack` `attackRadius*` are no longer mapped, removed `projectile` root fields are not emitted.
- **Removed helpers/exports:** `convertWeaponReach`, `convertKineticWeaponConditions`, `ItemWeaponReachRange`/`ItemKineticWeaponConditions`, the per-component `create*` functions for blocks and items, the per-test filter interfaces' hand-written convertors, `entity*ConvertorsFactory`. Typed component interfaces keep their names (the `Item*Component` aliases still exist); `LootComponent` of blocks is exported as `BlockLootComponent` from the root barrel.
- **Marker components** (`fireImmune`, …) accept `{}`, `true` or `{ value: false }` (omits the component); components whose schema is `boolean | {}` keep a bare boolean.
- **Ranges:** a plain number stays a number where Minecraft accepts a range; other forms are written in the shape the schema asks for.
- **Block traits:** `states`/`yRotation` are aliases of `enabledStates`/`yRotationOffset` (exactly one of the two spellings per trait).
