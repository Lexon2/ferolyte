# @artifex/cli

Artifex CLI and pack compiler for Minecraft Bedrock addons.

Compile TypeScript content definitions to Minecraft JSON, bundle scripts, copy pack assets, and watch for changes with live reload in the game.

## Installation

```bash
npm install -D @artifex/cli
```

This installs `@artifex/common` and `@artifex/pack` as dependencies. The `artifex` binary is available via `npx artifex` or npm scripts.

**Requirements:** Node.js >= 18

## CLI commands

| Command                               | Description                                                          |
| ------------------------------------- | -------------------------------------------------------------------- |
| `artifex init <project-name> <alias>` | Scaffold a new Artifex project in `./<project-name>/`                |
| `artifex run [profile]`               | Build packs and scripts once; optionally create a `.mcaddon` archive |
| `artifex watch [profile]`             | Watch packs and scripts; rebuild incrementally on file changes       |

`run` and `watch` accept shared flags:

| Flag               | Default   | Description                            |
| ------------------ | --------- | -------------------------------------- |
| `[profile]`        | `default` | Profile name from `artifex.config.mts` |
| `--debug`          | `true`    | Show build progress and timing         |
| `--no-debug`       | —         | Disable build progress output          |
| `--diagnostics`    | `true`    | Enable content validation diagnostics  |
| `--no-diagnostics` | —         | Disable validation diagnostics         |

`init` flags:

| Flag           | Default | Description                              |
| -------------- | ------- | ---------------------------------------- |
| `--install`    | `true`  | Run `npm install` in the new project     |
| `--no-install` | —       | Skip dependency installation after init  |

## Usage examples

### CLI

```bash
# Scaffold a new project (runs npm install by default)
npx artifex init my-addon cool
cd my-addon
npm run dev

# Scaffold without installing dependencies
npx artifex init my-addon cool --no-install

# Build with the default profile
npx artifex run

# Build a named profile
npx artifex run development

# Watch for changes
npx artifex watch development

# Quiet build (no progress output)
npx artifex run --no-debug
```

### Configuration

Create `artifex.config.mts` in your project root:

```typescript
import { defineArtifexConfig } from '@artifex/cli/compiler/config/define-config';
import {
  defineArtifexPlugin,
  ArtifexPluginApiVersion,
} from '@artifex/cli/compiler/plugins/define-plugin';

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
  plugins: [
    defineArtifexPlugin({
      name: 'my-plugin',
      apiVersion: ArtifexPluginApiVersion.V1_0_0,
      afterLoad({ files }) {
        console.log(`Loaded ${files.content.length} content files`);
      },
    }),
  ],
});
```

### Configuration

Multi-profile setup via `artifex.config.mts` and `defineArtifexConfig()`:

- **Pack settings** — alias, namespace, input/output directories, min game version, JSON minification, `.mcaddon` archive, content file suffixes
- **Script settings** — entry file, minification
- **Output targets** — `minecraft`, `minecraft-dev`, `minecraft-preview`, `minecraft-preview-dev`, `build`, or a custom path
- **Plugins** — lifecycle hooks for extending the build pipeline

### npm scripts

```json
{
  "scripts": {
    "build": "artifex run",
    "dev": "artifex watch development"
  }
}
```

### Watch and reload workflow

1. Run `artifex watch development`
2. In Minecraft Bedrock, connect to the reload server: `/connect localhost:8080`
3. Edit content files or scripts — packs rebuild and the client reloads automatically

### Typical project layout

```
my-addon/
├── artifex.config.mts
├── package.json
├── tsconfig.json
├── tsconfig.scripts.json
├── packs/
│   ├── BP/
│   │   ├── manifest.json
│   │   ├── texts/
│   │   │   ├── languages.json
│   │   │   └── en_US.lang
│   │   └── blocks/my_block.block.ts
│   ├── RP/
│   │   ├── manifest.json
│   │   ├── texts/
│   │   │   ├── languages.json
│   │   │   └── en_US.lang
│   │   └── entity/cow.ce.ts
│   └── scripts/
│       └── main.ts
└── build/              # output when `output`: 'build'
    ├── COOL_BP/
    └── COOL_RP/
```

`artifex init` generates manifests, lang files, and script entry paths aligned with the esbuild output (`scripts/{namespace}/index.js`).

### Content compilation

Bundles and imports TypeScript content files, then serializes them to vanilla JSON via `@artifex/pack` builders.

Default input suffixes:

| Content type  | Default input suffix | Output directory           |
| ------------- | -------------------- | -------------------------- |
| Block         | `*.block.ts`         | `BP/blocks/{namespace}/`   |
| Item          | `*.item.ts`          | `BP/items/{namespace}/`    |
| Server entity | `*.se.ts`            | `BP/entities/{namespace}/` |
| Client entity | `*.ce.ts`            | `RP/entity/{namespace}/`   |

Output JSON mirrors the matched input suffix. For example, `cow.e.bp.ts` becomes `cow.e.bp.json` when configured with `'server-entity': ['e.bp']`.

Configure custom suffixes per profile with `packs.contentSuffixes`:

```typescript
packs: {
  alias: 'myaddon',
  namespace: 'myaddon',
  output: 'build',
  contentSuffixes: {
    block: ['b', 'bl'],
    item: ['item'],
    'server-entity': ['e.bp'],
    'client-entity': ['entity', 'e.rp'],
  },
},
```

Suffix values are written without `.ts` (`.ts` is appended automatically). Each suffix must be unique across all content types.

Content files must `export default` a `ContentBuilder` or an array of builders.

### Asset pipeline

- Copies non-TypeScript BP/RP assets into the output packs
- Optional JSON minification for all output JSON files

### Script bundling

- Bundles the script entry (default `packs/scripts/main.ts`) with esbuild
- Watch mode runs a parallel esbuild watch alongside pack rebuilds

### Plugin system

Define plugins with `defineArtifexPlugin()` and hook into the build lifecycle:

| Hook              | When                                                           |
| ----------------- | -------------------------------------------------------------- |
| `afterLoad`       | After content and copy files are discovered                    |
| `beforeBuild`     | Before a full build starts                                     |
| `afterBuild`      | After a full build completes                                   |
| `beforeFileWrite` | Before a file is written; can transform data or skip the write |
| `afterFileAdd`    | After a file is added during watch                             |
| `afterFileUpdate` | After a file is updated during watch                           |
| `afterFileRemove` | After a file is removed during watch                           |
| `afterWatchReady` | After watch mode is ready                                      |

When `archive: true` is set, a `myaddon.mcaddon` file is created in the project root after a full build.

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](../../LICENSE) for the full text.
