# Artifex

Craft Minecraft Bedrock addons easily with TypeScript.

Artifex is a monorepo of npm packages that let you define addon content in TypeScript, compile it to vanilla Minecraft JSON, bundle scripts, and deploy to your game or a distributable `.mcaddon` archive.

## Packages

| Package                              | Description                                         | Docs                                |
| ------------------------------------ | --------------------------------------------------- | ----------------------------------- |
| [`@artifex/common`](packages/common) | Shared utilities and content foundation             | [README](packages/common/README.md) |
| [`@artifex/pack`](packages/pack)     | Content SDK — blocks, items, server/client entities | [README](packages/pack/README.md)   |
| [`@artifex/cli`](packages/cli)       | CLI compiler, watch mode, script bundling, plugins  | [README](packages/cli/README.md)    |

## Requirements

- **Node.js** >= 18

## Installation

### End-user (published packages)

Install the CLI as a dev dependency. `@artifex/pack` and `@artifex/common` are pulled in automatically.

```bash
npm install -D @artifex/cli
```

To use the content SDK directly in your project:

```bash
npm install @artifex/pack @artifex/common
```

### Monorepo development

```bash
git clone https://github.com/Lexon2/artifex.git
cd artifex
npm install   # runs postinstall → build:packages
```

## Quick start

Create `artifex.config.mts` in your project root:

```typescript
import { defineArtifexConfig } from '@artifex/cli/compiler/config/define-config';

export default defineArtifexConfig({
  profiles: {
    default: {
      packs: {
        alias: 'myaddon',
        namespace: 'myaddon',
        output: 'build',
        archive: true,
      },
    },
  },
});
```

Add TypeScript content files under `packs/`:

```
my-addon/
├── artifex.config.mts
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
npx artifex run
npx artifex watch development
```

## Project layout

| Path                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `artifex.config.mts`    | Profiles, pack settings, plugins                     |
| `packs/BP/`             | Behavior pack sources                                |
| `packs/RP/`             | Resource pack sources                                |
| `packs/scripts/main.ts` | Script entry (configurable per profile)              |
| `*.block.ts` (default)  | Block definitions → mirrored `*.json` suffix         |
| `*.item.ts` (default)   | Item definitions → mirrored `*.json` suffix          |
| `*.se.ts` (default)     | Server entity definitions → mirrored `*.json` suffix |
| `*.ce.ts` (default)     | Client entity definitions → mirrored `*.json` suffix |

Customize input suffixes via `packs.contentSuffixes` in `artifex.config.mts` (see [`packages/cli/README.md`](packages/cli/README.md)).

## Architecture

- **`@artifex/common`** — shared types, validation, diagnostics, and object utilities
- **`@artifex/pack`** — typed content builders that produce vanilla Minecraft JSON
- **`@artifex/cli`** — compiles content, copies assets, bundles scripts, and runs watch mode with live reload

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](LICENSE) for the full text.
