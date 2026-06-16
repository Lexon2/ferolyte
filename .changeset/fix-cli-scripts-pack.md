---
'@ferolyte/common': patch
'@ferolyte/pack': patch
'@ferolyte/cli': patch
---

Fix missing `compiler/scripts/*.js` in the published CLI package. The build script and `.npmignore` were skipping any `scripts/` directory, so `watch-esbuild.js` and related runtime modules were not compiled or published. Add `verify:cli` to catch broken relative imports and missing tarball files before release.
