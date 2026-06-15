# Ferolyte

Craft Minecraft Bedrock addons easily with TypeScript.

Ferolyte is a monorepo of npm packages that let you define addon content in TypeScript, compile it to vanilla Minecraft JSON, bundle scripts, and deploy to your game or a distributable `.mcaddon` archive.

## Goals

Ferolyte is built around a few core ideas:

- **TypeScript templating** — reuse addon logic through TypeScript templates and builders instead of copying raw JSON. Compose blocks, items, and entities with typed helpers from `@ferolyte/pack`.
- **Content and scripts together** — unify content definitions and `@minecraft/server` scripts in one TypeScript project with shared tooling, path aliases, and identifiers so behavior pack JSON and scripts stay in sync.
- **Incremental builds** — Ferolyte tracks a dependency graph and rebuilds only the changed file (plus its dependents) during watch mode, instead of re-copying the whole pack on every save.
- **Dev tools out of the box** — watch mode includes a WebSocket reload server on port `8080`. Run `ferolyte watch development`, type `/connect localhost:8080` in-game once, and script changes trigger `reload` automatically — no manual `/reload` needed.

See [Watch and live reload](#watch-and-live-reload) below for the WebSocket workflow.

## Packages

| Package                               | Description                                         | Docs                                |
| ------------------------------------- | --------------------------------------------------- | ----------------------------------- |
| [`@ferolyte/common`](packages/common) | Shared utilities and content foundation             | [README](packages/common/README.md) |
| [`@ferolyte/pack`](packages/pack)     | Content SDK — blocks, items, server/client entities | [README](packages/pack/README.md)   |
| [`@ferolyte/cli`](packages/cli)       | CLI compiler, watch mode, script bundling, plugins  | [README](packages/cli/README.md)    |

## Requirements

- **Node.js** >= 18

## Installation

### End-user (published packages)

Install the CLI as a dev dependency. `@ferolyte/pack` and `@ferolyte/common` are pulled in automatically.

```bash
npm install -D @ferolyte/cli
```

To use the content SDK directly in your project:

```bash
npm install @ferolyte/pack @ferolyte/common
```

### Monorepo development

```bash
git clone https://github.com/Lexon2/ferolyte.git
cd ferolyte
npm install   # runs postinstall → build:packages
```

## Quick start

Scaffold a new project:

```bash
npx ferolyte init my-addon myalias
cd my-addon
npm run dev
```

Or configure manually — create `ferolyte.config.mts` in your project root:

```typescript
import { defineFerolyteConfig } from '@ferolyte/cli/compiler/config/define-config';

export default defineFerolyteConfig({
  profiles: {
    default: {
      packs: {
        alias: 'myaddon',
        namespace: 'myaddon',
        output: 'build',
        archive: true,
      },
    },
    development: {
      packs: {
        alias: 'myaddon',
        namespace: 'myaddon',
        output: 'minecraft-dev',
      },
      scripts: {
        entry: 'packs/scripts/main.ts',
      },
    },
  },
});
```

The `default` profile builds to `./build` and can produce a `.mcaddon` archive. The `development` profile deploys to the game's development pack folders for local iteration.

Add TypeScript content files under `packs/`:

```
my-addon/
├── ferolyte.config.mts
└── packs/
    ├── BP/
    │   └── blocks/custom.block.ts
    ├── RP/
    │   └── entity/custom-cow.ce.ts
    └── scripts/
        └── main.ts
```

Build once or watch for changes:

```bash
npx ferolyte run
npx ferolyte watch development
```

### Watch and live reload

1. Run `npx ferolyte watch development` — packs deploy to the `minecraft-dev` output preset and a WebSocket server starts on port `8080`.
2. In Minecraft Bedrock, connect once: `/connect localhost:8080`
3. Edit scripts — changes are bundled and the game reloads automatically. Edit content `.ts` files — only the affected JSON is rebuilt incrementally on disk.

For output presets, plugins, and full configuration options, see [`packages/cli/README.md`](packages/cli/README.md).

## Project layout

| Path                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `ferolyte.config.mts`   | Profiles, pack settings, plugins                     |
| `packs/BP/`             | Behavior pack sources (content `.ts` and assets)     |
| `packs/RP/`             | Resource pack sources (content `.ts` and assets)     |
| `packs/scripts/main.ts` | Script entry (configurable per profile)              |
| `*.block.ts` (default)  | Block definitions → mirrored `*.json` suffix         |
| `*.item.ts` (default)   | Item definitions → mirrored `*.json` suffix          |
| `*.se.ts` (default)     | Server entity definitions → mirrored `*.json` suffix |
| `*.ce.ts` (default)     | Client entity definitions → mirrored `*.json` suffix |

Non-`.ts` assets (textures, lang files, manifests, etc.) are copied into the output packs automatically.

Customize input suffixes via `packs.contentSuffixes` in `ferolyte.config.mts` (see [`packages/cli/README.md`](packages/cli/README.md)).

## Architecture

- **`@ferolyte/common`** — shared types, validation, diagnostics, and object utilities
- **`@ferolyte/pack`** — typed content builders that produce vanilla Minecraft JSON (see [Molang and content API](packages/pack/README.md))
- **`@ferolyte/cli`** — compiles content, copies assets, bundles scripts, and runs watch mode with live reload. Extend the pipeline with plugin hooks via `defineFerolytePlugin` — see [plugin system](packages/cli/README.md#plugin-system).

## Status

Ferolyte is still in active development. APIs and behavior may change, and bugs are possible. Report issues on [GitHub](https://github.com/Lexon2/ferolyte/issues).

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](LICENSE) for the full text.
