# Contributing

## Setup

```bash
npm ci            # also builds the packages (postinstall)
npx vitest run    # tests (sources, never dist/)
npx tsc -p packages/pack/tsconfig.json --noEmit
```

## Schema-driven SDK types (codegen)

Entity, filter, item and block components are **generated** from the pinned
[Blockception schemas](https://github.com/Blockception/Minecraft-bedrock-json-schemas) into
`packages/pack/content/generated/<area>/` (TypeScript interfaces with JSDoc, exact camelCase → snake_case
key maps, precompiled ajv validators, a registry). Do not edit those files.

```bash
npm run codegen         # fetch schemas (pinned commit) + regenerate
npm run codegen:check   # CI: fails when generated/ is out of date
npm run roundtrip       # vanilla corpus + schema variants → docs/roadmap/roundtrip-report.md
npm run schemas         # SDK output vs the Blockception schemas (T00 report)
```

Where things live:

| What | Where |
| --- | --- |
| Generator | `scripts/schemas/codegen.mjs`, `scripts/schemas/codegen/{schema-tree,emit,area}.mjs` |
| Runtime (normalize → rename → validate → diagnostics) | `packages/pack/content/generated/runtime.ts`, `key-map.ts` |
| Fields/components missing upstream | `scripts/schemas/patches/<area>/...` (RFC 7396 merge patches) |
| SDK sugar (`icon: 'key'`, `tags: [...]`, `displayName`) | `content/item/overrides.ts`, `content/block/overrides.ts` |
| Legacy SDK keys | `scripts/schemas/patches/<area>/sdk-names.json` |

### Adding or fixing a field

1. Reproduce it with `npm run roundtrip` (the report lists the failing path with a minimal JSON), or write the
   vanilla JSON in a test.
2. Add a patch under `scripts/schemas/patches/`:
   - `entity/components/<file>.json` / `entity/behaviors/<file>.json`, `item/components/…`, `block/components/…`,
     `block/traits/…`, `filters/<test>.json`: merged into the raw upstream file, so `$ref`s resolve like the original ones.
     Extensions: `{"$append": [...]}` appends to an array (e.g. a new `oneOf` branch), `{"$stripKeys": ["pattern"]}`
     removes keywords everywhere in the file, `null` deletes a key.
   - A whole new component: a patch file with `"x-new-component": "minecraft:name"` and the schema as body.
   - Shared upstream files (item descriptor, enums): `shared/<path under source/>`.
3. `npm run codegen`, then `npx vitest run`. Commit the regenerated files with the patch.
4. Drop the entry from `packages/pack/tests/roundtrip/known-gaps.json` (every remaining gap needs a reason in
   `known-gaps.reasons.json`).

Component lifecycle markers in a patch (all re-checked by the generator):

- `"x-free-form": "<reason>"`: genuinely free-form component, keys are written as is (camelCase keys warn).
- `"x-deprecated": { "reason": "…" }`: TS `@deprecated` + warning, the component **is written**. Use it when removal is only suspected
  (e.g. missing from the official schemas).
- `"x-removed": { "since": "1.26.10", "replacement": [...] }` + `"x-evidence"`: error and **not written** from that format version on.
  Allowed only with proof: `node scripts/schemas/removal-evidence.mjs <component>` computes `since` from the vanilla corpus (first corpus
  format version that no longer uses the component while a replacement is used); the generator fails when the patch disagrees.

Official Mojang schemas (`Mojang/bedrock-samples/metadata/json_schemas`) are used to find what the game accepts:

```bash
npm run schemas:official          # presence report + classified differences (docs/roadmap/official-diffs.json)
npm run schemas:official:patches  # regenerate scripts/schemas/patches/official/** (official-only components/fields, field markers) + codegen
```

Field level markers (in a property of a patch): `x-since` (introduced in a format version: warning below, still written), `x-deprecated` (warning, written),
`x-removed` + `x-evidence` (error + not written from `since`; only with the official per-version history / vanilla corpus as proof).
`packages/pack/tests/schema/ignored-diffs.json` lists the remaining differences that are intentionally kept, with a reason (checked by `official-diffs.test.ts`).

Whole documents (attachables, render controllers, recipes, spawn rules): each is an area with one `document` entry
(`generated/<area>/documents.ts`, `documentRegistry` in `content/documents/convert-document.ts`); `convertDocument(kind, config, ctx)` runs the same
normalize → rename → validate pipeline over the whole file. Patches mirror the source layout:
`scripts/schemas/patches/<area>/source/<path under the source folder>.json` (wrapper keys get SDK names with `"x-sdk-name": "attachable"`;
`minecraft:` keys inside a document are named like the component areas). Spawn rule conditions are also a component area
(`spawnRuleConditionRegistry`). The round-trip checks whole vanilla documents of these kinds plus client entities and animation controllers
(`tests/roundtrip/documents.ts`). Adding a content type: a `documentArea(...)` call in `codegen.mjs`, an entry in `DocumentConfigs`/`documentRegistry`,
`CONTENT_METADATA`, the cli suffix registry, `content.factory.ts`.

Rules of the generated pipeline: unknown fields are reported (did-you-mean) and **not written**; invalid values of
known fields are written as given plus an error; `oneOf` is validated as `anyOf`; free-form maps are never renamed.

## Release

Changesets (`npx changeset`) describe user-facing changes; list breaking changes explicitly.
