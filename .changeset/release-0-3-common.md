---
'@ferolyte/common': minor
---

Shared foundations for the 0.3.0 line:

- `LooseString` (open string unions that keep autocomplete) and open `version` strings.
- Localization: `LocalizedString` (`string | Record<locale, string>`) used by `displayName`.
- Content diagnostics: `ContentDiagnosticRecord`, `setContentDiagnosticSink` and `reportContentFailure` (machine-readable output for `ferolyte check` / `run --json`); new content types `animation-controller-bp` / `animation-controller-rp`.
- Package layout: build output now lives in `dist/` (the sources are no longer published next to compiled files).

### Breaking changes

- **Package layout:** the published files are under `dist/`. Import through the package `exports` (`@ferolyte/common/<path>`); direct file paths such as `node_modules/@ferolyte/common/<file>.js` no longer exist.
