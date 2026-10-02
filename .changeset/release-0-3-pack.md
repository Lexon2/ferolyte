---
'@ferolyte/pack': minor
---

Roadmap work T00-F6 and release preparation:

- **Entry points:** `@ferolyte/pack` (everything public) plus `/item`, `/block`, `/entity`, `/molang`, `/animation`; deep `content/...` imports keep working through `./*`. Auto-import and `moduleResolution: "bundler"` now resolve correctly.
- **New content:** animation controllers (`createAnimationController`, `defineRpState`, `defineBpState`, files `*.ac.bp.ts` / `*.ac.rp.ts`), client entity animation options (`animations: { walk: { id, speed } }`), nested entity events, `displayName` for items, blocks and server entities (generated `.lang` files), open `version` strings, more block/item/entity components, `MinMaxRange` everywhere a range is expected.
- **Docs for humans and agents:** JSDoc generated from the Bedrock schemas, `AGENTS.md` and `llms.txt` shipped in the package.
- **Quality:** conformance tests against the Blockception schemas; many convertor fixes found by them.

### Breaking changes

- **Item `icon`** is a texture key only (`item_texture.json` key); `textures/...` paths are no longer resolved (T03).
- **`components` no longer accept arbitrary keys.** Put components the SDK does not model into `rawComponents` (`{ 'namespace:name': {...} }`) (T05).
- **`displayName`** is emitted through `texts/*.lang` (key-based) instead of inline text when the build knows the identifier (F1).
- **Molang:** the mutable `Molang` class is deprecated in favour of the v2 API; `MolangStatement` type renamed to `MolangStatementInput`.
- **Package layout:** files are published under `dist/`; use the package `exports` instead of direct file paths.
