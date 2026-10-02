---
'@ferolyte/cli': minor
---

Roadmap work T00-F6 and release preparation:

- **Faster pipeline (T08):** one esbuild pass per change, dependency graph with a reverse index, debounced watch batches.
- **New commands:** `ferolyte check [--json]` (validate everything in memory, exit 1 on errors), `ferolyte inspect <file>` (print the emitted JSON), `ferolyte run --json` (diagnostics as `{ file, contentType, component, fieldPath, message, severity }[]`).
- **WebSocket hub (F5):** one `/connect` for script reload, commands and event subscription plus an HTTP API; configured with `server`.
- **Localization (F1):** `texts/<locale>.lang` and `languages.json` are generated and merged with the pack's own lang files (`packs.lang`).
- **Animation controllers (F4)** and **animation options (F3)**, JSONC support for pack JSON, plugin lifecycle (`beforeStop`, clean shutdown on Ctrl+C), Blockbench plugin for `*.ce.ts`.
- **Scaffold:** `moduleResolution: "bundler"` tsconfig without `paths` into `node_modules`, `skipLibCheck`, project `AGENTS.md` / `CLAUDE.md`.
- **Package layout:** build output in `dist/`, tests are no longer published; `bin` points to `dist/cli/index.js`.

### Breaking changes

- **Item `icon`** is a texture key only; the compiler no longer generates or merges `textures/item_texture.json` (T03).
- **`components` accept only known keys**, everything else goes to `rawComponents` (T05).
- **Pack `texts`:** `RP/texts/*.lang` and `languages.json` are merged by the generator (user lines win, generated lines are appended under `## ferolyte`) instead of being copied as is (F1).
- **`watch` always starts the WebSocket server** (even without a scripts entry); `scripts/minecraft-reload-server` was replaced by the hub, port and HTTP API are set with the `server` config option (F5).
- **Content is bundled as CommonJS** and evaluated in memory: no top-level `await` and no `import.meta` in content files (T08).
- **Plugin API:** `FerolytePluginApiVersion` gained `V1_1_0` (`beforeStop`, abort `signal`, `event.minecraft`); plugins must declare a supported `apiVersion` (T06, F5).
- **Config import path:** use `@ferolyte/cli/config` (the old `@ferolyte/cli/compiler/config/define-config` still works).
- **Package layout:** files are published under `dist/`; import through the package `exports`.
