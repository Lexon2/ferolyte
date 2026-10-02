---
'@ferolyte/cli': minor
---

Compiler support for attachables, render controllers, recipes and spawn rules:

- Default suffixes `.att.ts`, `.rc.ts`, `.recipe.ts`, `.spawn.ts` (configurable with `contentSuffixes`), written to RP `attachables/` and `render_controllers/`, BP `recipes/` and `spawn_rules/`; `check`, `inspect`, `run` and `watch` handle them, the build summary counts them.
- Typed ids in `@ferolyte/ids`: `AttachableId`, `RenderControllerId`, `RecipeId`, `SpawnRuleId`.
- Reference checks (warnings, errors with `--strict`, "did you mean" hints): attachable geometry / textures / animations / render controllers exist; render controller `Geometry.x` / `Texture.x` / `Material.x` keys exist in every client entity and attachable that uses the controller; recipe items and blocks of your own namespace exist; a spawn rule's entity exists.
- Animation options (`speed`, …) work in attachables as in client entities.
