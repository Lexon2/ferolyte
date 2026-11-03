---
'@ferolyte/cli': patch
---

**Faster builds** (`run`, `check`, `watch`), same output byte for byte:

- Pack JSON is parsed with the native `JSON.parse` first; `jsonc-parser` only runs for files with comments, trailing commas or
  errors (and `__proto__` keys), so error messages are unchanged. Copying, the registry scan and JSON imports are faster.
- The pack file scan behind reference checks and generated ids (`.ferolyte/types/ids.ts`) lists, stats and reads files in
  parallel instead of one by one (registry order and diagnostics order unchanged). Also shortens every `watch` batch.
