---
'@ferolyte/pack': patch
'@ferolyte/cli': minor
'@ferolyte/common': patch
---

Content SDK fixes:

- **Bare Molang queries** (`q.isMoving`, `q.allAnimationsFinished`, …) no longer fail with "could not be cloned": every builder's `cloneConfig()` copies plain data and keeps Molang values by reference (`cloneConfig` helper in `@ferolyte/common`). `client entity` `scripts.animate` also accepts them in the types.
- **Block states** accept lists of integers or booleans (one type per state, 1–16 unique values), as vanilla does; mixed types, fractions, duplicates and long lists get a clear error.
- **Entity events** with `stopMovement` set to one flag or `{}` are written (only the given flags); an event that cannot be converted is now an error naming it instead of silently disappearing.
- **Typed ids:** `check` refreshes `.ferolyte/types/ids.ts`; a missing ids file is bootstrapped first (placeholder ids), so content that imports ids of other content, even mutually, builds from a clean project in one `check` / `run`; when ids change after a pass, only the files that import them are evaluated again (no extra pass otherwise). New ids `BpAnimationId` and `BpAnimationControllerId` (`AnimationId` / `AnimationControllerId` stay resource pack ids).
- **Exports:** `EntityComponentGroup` and `EntityEvents` types from `@ferolyte/pack` and `@ferolyte/pack/entity`.
- **Integer fields:** generated types carry an `@integer` note, and the validator says "Must be an integer (whole number)" (`knockbackRoar`, …).
- **Format versions:** namespaced custom components in files written with a `format_version` older than 1.21.90 get a warning that names the fix (`version: '1.21.90'`); the docs state the default version of every content type and what `minGameVersion` does. The default output version is unchanged.
