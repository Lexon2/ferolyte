# Ferolyte plugin for Blockbench

Opens Ferolyte client entity sources (`*.ce.ts`) in Blockbench's Bedrock entity editor.
The source is compiled with `ferolyte inspect`, so geometry, textures and animations are
resolved from the same resource pack that contains the source.

## Requirements
- Blockbench desktop app (4.8+).
- `@ferolyte/cli` with the `inspect` command (0.3.0 or newer)
  installed in the project (`node_modules/@ferolyte/cli` in a parent folder of the source). Older CLIs
  produce a dialog with the installed version and the project path.
- `node` on `PATH` (otherwise Blockbench's own runtime is used).

## Install
1. Blockbench: **File → Plugins → Load Plugin from File** and choose `ferolyte.js`.
2. Optional: **File → Settings → General → Ferolyte profile** (default `default`).

## Use
- Drag a `*.ce.ts` file into Blockbench, or **File → Import → Import Ferolyte client entity**.
  The file must live inside the resource pack's `entity` folder.
- Opening a `.geo.json` also finds client entities written as `*.ce.ts` (textures and render mode).
- Results are cached per file path and modification time; edit or touch the `.ce.ts` to refresh
  (changes in files it imports are picked up after the next edit of the `.ce.ts` itself).
- On a compile error the message is shown; if a compiled copy exists in
  `development_resource_packs` you can open it instead.

## CLI
`ferolyte inspect <file.ts> [--profile default] [--out file.json] [--compact] [--diagnostics]`
prints the JSON of one content file (array for multi-builder files) without writing outputs.
Exit codes: `0` ok, `1` build failed / no content, `2` bad usage, missing file or config.
