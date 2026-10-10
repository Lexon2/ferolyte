---
'@ferolyte/pack': minor
'@ferolyte/cli': minor
'@ferolyte/common': patch
---

Fixes from the third change request (Minecraft 1.26.52):

- **Type resolution:** the bare `@ferolyte/pack` import type-checks under `moduleResolution: "node"` (the `typesVersions` wildcard used to remap the root to `dist/dist/index.d.ts`), and `@ferolyte/common/types` resolves under `bundler` / `nodenext` (new explicit `./types` export). A test type-checks a consumer project per resolution mode (`node`, `bundler`, `nodenext`).
- **New `check` warnings for Molang** that the game loads silently: `!` applied to one side of a comparison (`!v.a == 'x'` is `(!v.a) == 'x'`) and `!` applied to a string literal (`not('v.a == 1')` writes `!'v.a == 1'`). They are reported in every string of entities, client entities, attachables, render controllers, items, blocks and animation controllers built from `.ts`, and `--strict` makes them errors.
- **`multiBlock` trait requirements:** an error when the block has no `movable` component (typed or `rawComponents`), an error for `placementFilter` in a permutation, and a warning naming the Upcoming Creator Features toggle when the block format is below 1.26.40 (it replaces the horizontal-direction warning there).
- **`materialInstances.*.ambientOcclusion` changes output:** from block format 1.26.20 a boolean is written as a number (`true` → `1`, `false` → `0`), because the game rejects a boolean there. This also applies inside `itemVisual` / `embeddedVisual` and in permutations. Numbers up to 10 (the exponent) are accepted.
- Docs: the `/connect` WebSocket lives for the game session, not per world, so `clients` can be connected without a loaded world.
