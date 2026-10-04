# @ferolyte/cli

Ferolyte CLI and pack compiler for Minecraft Bedrock addons.

Compile TypeScript content definitions to Minecraft JSON, bundle scripts, copy pack assets, and watch for changes with live reload in the game.

## Installation

```bash
npm install -D @ferolyte/cli
```

This installs `@ferolyte/common` and `@ferolyte/pack` as dependencies. The `ferolyte` binary is available via `npx ferolyte` or npm scripts.

**Requirements:** Node.js >= 18

## CLI commands

| Command                                | Description                                                          |
| -------------------------------------- | -------------------------------------------------------------------- |
| `ferolyte init <project-name> <alias>` | Scaffold a new Ferolyte project in `./<project-name>/`               |
| `ferolyte run [profile]`               | Build packs and scripts once; optionally create a `.mcaddon` archive |
| `ferolyte watch [profile]`             | Watch packs and scripts; rebuild incrementally on file changes       |
| `ferolyte check [profile]`             | Validate every content file in memory (no pack output; refreshes `.ferolyte/types/ids.ts`); exit 1 on errors |
| `ferolyte inspect <file>`              | Print the JSON a content file would produce (`--profile`, `--out`, `--compact`) |
| `ferolyte types [profile]`             | Regenerate typed ids (`.ferolyte/types/ids.ts`, imported as `@ferolyte/ids`) |

`check` also accepts `--types` (adds TypeScript errors from `tsc --noEmit`) and `--strict`. `check --json` and `run --json` print the diagnostics to stdout as
`{ file, contentType, component, fieldPath, message, severity }[]` (build logs go to stderr) and exit with `1` when at least one record has `severity: "error"`.

`run` and `watch` accept shared flags:

| Flag               | Default   | Description                             |
| ------------------ | --------- | --------------------------------------- |
| `[profile]`        | `default` | Profile name from `ferolyte.config.mts` |
| `--debug`          | `true`    | Show build progress and timing          |
| `--no-debug`       | —         | Disable build progress output           |
| `--diagnostics`    | `true`    | Enable content validation diagnostics   |
| `--no-diagnostics` | —         | Disable validation diagnostics          |
| `--quiet`          | —         | Only print errors                       |
| `--verbose`        | —         | Print output paths and full error details |
| `--strict`         | —         | Unknown references (geometry, animation, texture, events…) are errors |
| `--json`           | —         | `run` only: diagnostics as JSON on stdout (`--stats` adds timings) |

`init` flags:

| Flag           | Default | Description                             |
| -------------- | ------- | --------------------------------------- |
| `--install`    | `true`  | Run `npm install` in the new project    |
| `--no-install` | —       | Skip dependency installation after init |

## Usage examples

### CLI

```bash
# Scaffold a new project (runs npm install by default)
npx ferolyte init my-addon cool
cd my-addon
npm run dev

# Scaffold without installing dependencies
npx ferolyte init my-addon cool --no-install

# Build with the default profile
npx ferolyte run

# Build a named profile
npx ferolyte run development

# Watch for changes
npx ferolyte watch development

# Quiet build (no progress output)
npx ferolyte run --no-debug
```

### Configuration

Create `ferolyte.config.mts` in your project root. Relative imports and `tsconfig.json` path aliases are resolved via esbuild when the config is loaded, so the `.ts` extension is optional in config imports.

```typescript
import { defineFerolyteConfig } from '@ferolyte/cli/config';
import {
  defineFerolytePlugin,
  FerolytePluginApiVersion,
} from '@ferolyte/cli/plugin';

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
  plugins: [
    defineFerolytePlugin({
      name: 'my-plugin',
      apiVersion: FerolytePluginApiVersion.V1_0_0,
      afterLoad({ files }) {
        console.log(`Loaded ${files.content.length} content files`);
      },
    }),
  ],
});
```

See [Configuration reference](#configuration-reference) below for all options.

### Configuration reference

`defineFerolyteConfig()` wraps your config object with no runtime transformation. Select a profile with the CLI `[profile]` argument (`default` when omitted).

#### `FerolyteConfig` (root)

| Field      | Type                                    | Required | Default | Description                                                      |
| ---------- | --------------------------------------- | -------- | ------- | ---------------------------------------------------------------- |
| `profiles` | `Record<string, FerolyteProfileConfig>` | yes      | —       | Named build profiles; CLI uses `default` when no profile arg     |
| `plugins`  | `FerolytePlugin[]`                      | no       | `[]`    | Build pipeline hooks (see [Plugin system](#plugin-system) below) |

#### `FerolyteProfileConfig`

| Field      | Type                    | Required | Default               | Description                                        |
| ---------- | ----------------------- | -------- | --------------------- | -------------------------------------------------- |
| `packs`    | `FerolytePackConfig`    | yes      | —                     | Pack input/output, namespace, and content settings |
| `scripts`  | `FerolyteScriptsConfig` | no       | —                     | Script bundling; omit to use defaults              |
| `tsconfig` | `string`                | no       | `tsconfig.json` (cwd) | TS config for path aliases and content compilation |

#### `packs` (`FerolytePackConfig`)

| Field             | Type                                               | Required | Default           | Description                                                            |
| ----------------- | -------------------------------------------------- | -------- | ----------------- | ---------------------------------------------------------------------- |
| `alias`           | `string`                                           | yes      | —                 | Pack folder prefix → `{ALIAS}_BP` / `{ALIAS}_RP`                       |
| `namespace`       | `string`                                           | yes      | —                 | Content identifier namespace in output paths                           |
| `minGameVersion`  | `string`                                           | no       | `1.26.20`         | Minimum supported game version                                         |
| `output`          | `FerolytePackOutput`                               | no       | `minecraft-dev`   | Output target preset (see [Output presets](#output-presets))           |
| `input`           | `string`                                           | no       | `packs`           | Root directory containing `BP/` and `RP/`                              |
| `minifyJSON`      | `boolean`                                          | no       | `false`           | Minify all output JSON (compiled and copied)                           |
| `archive`         | `boolean`                                          | no       | `false`           | Create `{alias}.mcaddon` in the project root after a full build        |
| `contentSuffixes` | `Partial<Record<ContentType, string \| string[]>>` | no       | built-in defaults | Per-type input file suffixes (see [contentSuffixes](#contentsuffixes)) |

#### `scripts` (`FerolyteScriptsConfig`)

| Field    | Type      | Required | Default                 | Description                       |
| -------- | --------- | -------- | ----------------------- | --------------------------------- |
| `entry`  | `string`  | no       | `packs/scripts/main.ts` | esbuild entry for script bundling |
| `minify` | `boolean` | no       | `false`                 | Minify bundled script output      |

#### Output presets

The `output` field accepts one of the built-in presets. Pack folders are always named `{alias.toUpperCase()}_BP` and `{alias.toUpperCase()}_RP`.

| Preset                    | BP output location                                          | RP output location                                          |
| ------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `minecraft`               | `{minecraft}/behavior_packs/{ALIAS}_BP`                     | `{minecraft}/resource_packs/{ALIAS}_RP`                     |
| `minecraft-dev` (default) | `{minecraft}/development_behavior_packs/{ALIAS}_BP`         | `{minecraft}/development_resource_packs/{ALIAS}_RP`         |
| `minecraft-preview`       | `{minecraft-preview}/behavior_packs/{ALIAS}_BP`             | `{minecraft-preview}/resource_packs/{ALIAS}_RP`             |
| `minecraft-preview-dev`   | `{minecraft-preview}/development_behavior_packs/{ALIAS}_BP` | `{minecraft-preview}/development_resource_packs/{ALIAS}_RP` |
| `build`                   | `./build/{ALIAS}_BP`                                        | `./build/{ALIAS}_RP`                                        |

`{minecraft}` resolves to the Bedrock `com.mojang` directory under the user's Minecraft install. `{minecraft-preview}` resolves to the Preview app's `com.mojang` directory. On Windows these are typically:

- `{minecraft}` → `%AppData%/Minecraft Bedrock/users/shared/games/com.mojang`
- `{minecraft-preview}` → `%LocalAppData%/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang`

#### contentSuffixes

Map content types to input file suffixes (without `.ts`). Output JSON mirrors the matched input suffix — for example, `cow.e.bp.ts` becomes `cow.e.bp.json` when `'server-entity': ['e.bp']` is configured.

Supported keys: `block`, `item`, `server-entity`, `client-entity`.

Default suffixes when `contentSuffixes` is omitted:

| Content type    | Default suffix | Output directory           |
| --------------- | -------------- | -------------------------- |
| `block`         | `block`        | `BP/blocks/{namespace}/`   |
| `item`          | `item`         | `BP/items/{namespace}/`    |
| `server-entity` | `se`           | `BP/entities/{namespace}/` |
| `client-entity` | `ce`           | `RP/entity/{namespace}/`   |

Rules:

- Suffix values are written without `.ts` (`.ts` is appended automatically).
- Each suffix must be unique across all content types.
- Values can be a single string or an array of strings.

Example:

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

### npm scripts

```json
{
  "scripts": {
    "build": "ferolyte run",
    "dev": "ferolyte watch development"
  }
}
```

### Watch and reload workflow

1. Run `ferolyte watch development`
2. In Minecraft Bedrock, connect to the reload server: `/connect localhost:8080`
3. Edit content files or scripts — packs rebuild and the client reloads automatically

### Typical project layout

```
my-addon/
├── ferolyte.config.mts
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

`ferolyte init` generates manifests, lang files, and script entry paths aligned with the esbuild output (`scripts/{namespace}/index.js`).

### Content compilation

Bundles and imports TypeScript content files, then serializes them to vanilla JSON via `@ferolyte/pack` builders.

Default input suffixes (see [`contentSuffixes`](#contentsuffixes) in Configuration reference for customization):

| Content type  | Default input suffix | Output directory           |
| ------------- | -------------------- | -------------------------- |
| Block         | `*.block.ts`         | `BP/blocks/{namespace}/`   |
| Item          | `*.item.ts`          | `BP/items/{namespace}/`    |
| Server entity | `*.se.ts`            | `BP/entities/{namespace}/` |
| Client entity | `*.ce.ts`            | `RP/entity/{namespace}/`   |
| BP animation controller | `*.ac.bp.ts` | `BP/animation_controllers/{namespace}/` |
| RP animation controller | `*.ac.rp.ts` | `RP/animation_controllers/{namespace}/` |

Output JSON mirrors the matched input suffix. For example, `cow.e.bp.ts` becomes `cow.e.bp.json` when configured with `'server-entity': ['e.bp']`.

Content files must `export default` a `ContentBuilder` or an array of builders. They are bundled as CommonJS and evaluated in memory, so top-level `await` and `import.meta` are not available in content files.

#### Localization (`.lang`)

`displayName` of items, blocks and server entities (a string or `{ en_US: '...', ru_RU: '...' }`) is written to `RP/texts/<locale>.lang` and `languages.json`. Your own `RP/texts/*.lang` files are merged, not copied: your lines and comments are kept, your value wins on conflicts (with a warning), generated lines are appended under `## ferolyte`. Configure with `packs.lang: { defaultLocale, locales }`.

#### Blockbench

`packages/blockbench-plugin` opens `*.ce.ts` client entities in Blockbench through `ferolyte inspect`; see its README.

### Asset pipeline

- Copies non-TypeScript BP/RP assets into the output packs
- Optional JSON minification via [`packs.minifyJSON`](#packs-ferolytepackconfig)

### Script bundling

- Bundles the script entry (default [`scripts.entry`](#scripts-ferolytescriptsconfig)) with esbuild
- Watch mode runs a parallel esbuild watch alongside pack rebuilds

### Game connection (`server`)

`ferolyte watch` starts one WebSocket hub; in game run `/connect localhost:<port>` once.
Script rebuilds trigger `/reload` on **every** connected client.

```ts
profiles: {
  default: {
    // ...
    server: {
      port: 8080,               // default
      reloadOnPackChange: true, // also /reload after pack file changes
      http: { port: 8081 },     // optional HTTP API (127.0.0.1 only)
    },
  },
}
```

HTTP API (only when `server.http` is set): `GET /status` (`connected`, `clients`, `inFlight`, `lastEventSeq`,
`lastReload` = `{ seq, at, ok, trigger } | null`), `POST /command` `{command}`, `POST /scriptevent` `{id, message}`,
`GET /events?since=<seq>&limit=<n>` (the last `n` events of the `since` window), `POST /subscribe` `{eventName}`
(`event` works as an alias). Every route is JSON; plugin routes are added with `minecraft.http.route()` (see below).

#### Client policy (`server.clientPolicy`, cli 0.5)

The game allows one live `/connect` per world, so a newer connection is the live one:
`clientPolicy: 'newest'` (**default since 0.5**) sends commands without a `clientId` to the newest connection and falls back
to the older one when it disconnects. `'oldest'` keeps the behaviour of 0.4 and earlier. An explicit `clientId` always wins;
`minecraft.primaryClientId` is the connection the policy currently picks.

#### Command syntax version (`server.commandVersion`)

Every command frame carries the command syntax version in `body.version`. The hub now sends the current syntax by default
(`commandVersion: 17039360`), so `/execute as @p run say hi` works through `sendCommand`; it used to send `1`, the legacy syntax
(`/execute @p ~ ~ ~ say hi`, while `execute as @p run …` failed with `Syntax error: Unexpected "@p"`). Plugins and scripts that send
legacy syntax set `server.commandVersion: 1`. Ferolyte's own commands (`reload`, `tellraw`, `scriptevent`) are valid under both.
The frame `header.version` stays `1`.

#### Game event shapes

`subscribe PlayerMessage` delivers `event` frames whose `body` is either `{ message, sender, type }` or
`{ properties: { Message, Sender, MessageType } }` depending on the game version; `minecraft.onChat` handles both. Run
`ferolyte watch --verbose` to see the raw body of the first `PlayerMessage` of every connection, and unmatched
`commandResponse` frames. Every frame the hub sends carries `messageType: 'commandRequest'`.
Use `/connect 127.0.0.1:<port>` if `localhost` does not connect: the hub listens on IPv4 loopback.

#### Plugin access to the game (`event.minecraft`)

`afterLoad` / `afterWatchReady` events carry `event.minecraft` (undefined outside `watch`):

| Member | Since | Description |
| --- | --- | --- |
| `clients`, `sendCommand(command, { clientId?, timeoutMs? })`, `scriptEvent(id, message?, { clientId? })` | 1.1.0 | `sendCommand` resolves with `{ status, message, body? }` (`body` is the raw response body, API 1.2.0 / cli 0.5) |
| `subscribe(eventName, handler?)`, `onMessage(handler)` | 1.1.0 | Game events; every handler returns an unsubscribe function |
| `http?.route(method, path, handler)` | 1.1.0 | Present when `server.http` is enabled |
| `onReload(handler)` | 1.2.0 | `{ trigger: 'scripts' \| 'packs' \| 'manual', clientId, ok, message, at, seq }`, once per client when its `/reload` resolved or failed |
| `onCommand(handler)` | 1.2.0 | `{ command, clientId, requestId, at, result?, error? }` for **every** command, including ferolyte's own `reload` / `tellraw` |
| `onChat(handler)` | 1.2.0 | `{ clientId, sender, type, text }`: rawtext flattened (text / translate / selector / score as plain text), `§` codes removed. Subscribes to `PlayerMessage` on demand and shares it with `subscribe` |
| `primaryClientId` | 1.2.0 | The connection commands go to by default (`clientPolicy`) |

A throwing handler never affects the others (it is logged). `seq` of reload events is a per-hub counter.
`afterLoad` / `afterWatchReady` also get `server` (API 1.2.0): the effective values after defaults,
`{ port, http: false | { port, host }, reloadOnPackChange, clientPolicy, commandVersion }` (undefined outside `watch`), handy for printing the
right `/connect` hint. `afterScriptBuild({ profile, ok })` (API 1.2.0) fires after every scripts build (`ok: false` when esbuild
reported errors). Reloads are triggered by `'scripts'` (script rebuild), `'packs'` (`reloadOnPackChange`) or `'manual'`.

#### HTTP routes of plugins

```ts
import { defineFerolytePlugin, FerolytePluginApiVersion, httpResponse } from '@ferolyte/cli/plugin';

export const bridge = defineFerolytePlugin({
  name: 'bridge',
  apiVersion: FerolytePluginApiVersion.V1_2_0,
  afterWatchReady({ minecraft }) {
    minecraft?.http?.route('GET', '/api/*', ({ path, headers, signal }) => {
      signal.addEventListener('abort', () => { /* the client went away */ });
      return path === '/api/known' ? { ok: true } : httpResponse(404, { error: 'unknown route' });
    });
  },
});
```

- `route()` **replaces** an existing route, built-in ones included (this is how a plugin keeps an older response shape);
  the override is logged once per path with `--verbose`.
- A path ending in `/*` is a **prefix route**: the handler gets the full `request.path`. An exact route wins over a prefix
  route; of several prefixes the longest wins.
- Handlers receive `headers` (lower-cased names) and `signal`, an `AbortSignal` that aborts when the socket closes before the
  response is written (stop long polling there).
- `httpResponse(status, body?)` (exported from `@ferolyte/cli/plugin`) is the supported way to set a status. Any other return
  value is a `200` JSON body. For compatibility an object with nothing but a numeric `status` and/or a `body` is still read as an
  envelope when no `httpResponse` marker is present; a payload like `{ status: 'ok' }` is sent as is.

### Plugin system

Define plugins with `defineFerolytePlugin()` and hook into the build lifecycle:

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
| `afterScriptBuild` | After every scripts build (`{ profile, ok }`, API 1.2.0)      |
| `beforeStop`      | Once on shutdown (Ctrl+C, SIGTERM, error, end of `run`); 5 s timeout |

#### API versions

`apiVersion` is `1.0.0`, `1.1.0` or `1.2.0` (`FerolytePluginApiVersion.V1_2_0`, cli 0.5: reload / command / chat taps, `server` in events,
`httpResponse`, `afterScriptBuild`). Newer members exist at runtime for every version; plugins declaring `1.1.0` keep working unchanged.

#### Cleaning up (API 1.1.0)

`afterLoad` and `afterWatchReady` events carry a `signal: AbortSignal` that is aborted when
Ferolyte stops. `beforeStop({ profile, reason })` runs once per plugin (`reason` is
`'signal' | 'error' | 'build-end'`); errors are logged and a hook that takes longer than 5 s is skipped.
Use `apiVersion: FerolytePluginApiVersion.V1_1_0` to opt in (`1.0.0` plugins keep working).

```ts
import { spawn, type ChildProcess } from 'child_process';

let child: ChildProcess | undefined;

export const serverPlugin = defineFerolytePlugin({
  name: 'dev-server',
  apiVersion: FerolytePluginApiVersion.V1_1_0,
  afterWatchReady({ signal }) {
    child = spawn('node', ['server.js'], { stdio: 'inherit', signal });
  },
  beforeStop() {
    child?.kill();
  },
});
```

When [`packs.archive`](#packs-ferolytepackconfig) is `true`, a `{alias}.mcaddon` file is created in the project root after a full build.

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](../../LICENSE) for the full text.
