---
'@ferolyte/cli': patch
---

**Faster builds** (`run`, `check`, `watch`), same output byte for byte:

- Pack JSON is parsed with the native `JSON.parse` first; `jsonc-parser` only runs for files with comments, trailing commas or
  errors (and `__proto__` keys), so error messages are unchanged. Copying, the registry scan and JSON imports are faster.
- The pack file scan behind reference checks and generated ids (`.ferolyte/types/ids.ts`) lists, stats and reads files in
  parallel instead of one by one (registry order and diagnostics order unchanged). Also shortens every `watch` batch.
- The dependency graph of a content pass resolves esbuild's import graph once per pass instead of once per entry
  (was quadratic in the number of content files).
- Commands are loaded on use: `run`, `check`, `inspect` and `types` no longer load the project scaffolding, the file watcher and
  the WebSocket hub (about 90 fewer modules per process). `getMinecraftHub` is still exported from
  `compiler/scripts/start-minecraft-server`.
- Output files are written with one `mkdir` per folder instead of one per file (a folder removed in between is created again).
