<div align="center">

# Ferolyte

**Minecraft Bedrock add-ons in TypeScript: typed, validated against Mojang's schemas, and rebuilt in milliseconds.**

[![npm](https://img.shields.io/npm/v/@ferolyte/cli?label=%40ferolyte%2Fcli&color=cb3837)](https://www.npmjs.com/package/@ferolyte/cli)
[![npm](https://img.shields.io/npm/v/@ferolyte/pack?label=%40ferolyte%2Fpack&color=cb3837)](https://www.npmjs.com/package/@ferolyte/pack)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933)](https://nodejs.org)

</div>

You write blocks, items and entities as TypeScript. Ferolyte compiles them to the exact vanilla JSON Minecraft
expects, checks every field against the Bedrock schemas, and keeps your packs and `@minecraft/server`
scripts in one project, with one `/connect` for live reload.

```ts
// packs/BP/entities/zombie.se.ts
import { createServerEntity, defineServerEntity } from '@ferolyte/pack';

const zombie = defineServerEntity({
  identifier: 'myaddon:zombie',
  properties: { 'myaddon:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' } },
  componentGroups: [{ name: 'angry', components: { movement: { value: 0.35 } } }],
  events: {
    'myaddon:become_angry': {
      add: { componentGroups: ['angry'] },            // ✓ checked: the group exists
      setProperty: { 'myaddon:state': 'angry' },      // ✓ checked: 'idle' | 'angry'
    },
  },
  components: {
    health: { value: 20, max: 20 },
    behaviors: { lookAtPlayer: { priority: 7, lookDistance: 6 } },
  },
});

export default createServerEntity(zombie);
```

## Why Ferolyte

|  |  |
|---|---|
| 🧬 **Generated from the schemas** | Entity, item and block components are generated from the Bedrock JSON schemas and checked against Mojang's official schemas and the vanilla `bedrock-samples`. Types, JSDoc and validation always match what the game accepts, including 1.26.50. |
| 🛡️ **Errors before the game sees them** | Unknown fields, wrong shapes, removed components (e.g. `pushable` from 1.26.10), missing animations, geometries, texture keys or component groups are reported with the file, the field path and a *did you mean* suggestion. |
| ⚡ **Fast incremental builds** | One esbuild pass, in-memory evaluation and a real dependency graph. Editing a shared constant rebuilds exactly its dependents. Typical project: about 0.5 s cold, about 10 ms per file. |
| 🔗 **Packs and scripts together** | Generated `@ferolyte/ids` (`EntityId`, `ItemId`, `EntityEvent`, `EntityProperty`, `BlockState`, …) are shared by content and `@minecraft/server` scripts, so ids can't drift. |
| 🎮 **One connection to the game** | `/connect localhost:8080` once. Scripts reload on save, and plugins and tools use the same connection (commands, events, optional HTTP API). |
| 🤖 **Built for AI agents too** | `ferolyte check --json --types`, `ferolyte inspect <file>`, and `AGENTS.md` / `llms.txt` shipped in the package. An agent can verify its own work without opening the game. |

## Quick start

```bash
npx @ferolyte/cli init my-addon myaddon
cd my-addon
npm run dev            # ferolyte watch development
```

Then, in Minecraft (cheats on): `/connect localhost:8080`.

`init` creates the config, BP/RP manifests, a script entry, `tsconfig` and `AGENTS.md`. The `development` profile deploys
straight into the game's development pack folders; the `default` profile builds to `./build` (optionally a `.mcaddon`).

```ts
// ferolyte.config.mts
import { defineFerolyteConfig } from '@ferolyte/cli/config';

export default defineFerolyteConfig({
  profiles: {
    default: { packs: { alias: 'myaddon', namespace: 'myaddon', output: 'build', archive: true } },
    development: {
      packs: { alias: 'myaddon', namespace: 'myaddon', output: 'minecraft-dev' },
      scripts: { entry: 'packs/scripts/main.ts' },
      server: { port: 8080 },
    },
  },
});
```

## What you can write in TypeScript

| File | Becomes | Factory |
|---|---|---|
| `*.item.ts` | BP `items/` | `createItem` |
| `*.block.ts` | BP `blocks/` | `createBlock` |
| `*.se.ts` | BP `entities/` (server entity) | `createServerEntity` / `defineServerEntity` |
| `*.ce.ts` | RP `entity/` (client entity) | `createClientEntity` |
| `*.ac.bp.ts`, `*.ac.rp.ts` | `animation_controllers/` | `createAnimationController` |
| `*.att.ts` | RP `attachables/` | `createAttachable` |
| `*.rc.ts` | RP `render_controllers/` | `createRenderController` (several per file → one JSON) |
| `*.recipe.ts` | BP `recipes/` | `shapedRecipe`, `shapelessRecipe`, `furnaceRecipe`, `brewingMixRecipe`, `brewingContainerRecipe`, `smithingTransformRecipe`, `smithingTrimRecipe`, `createRecipe` |
| `*.spawn.ts` | BP `spawn_rules/` | `createSpawnRule` |

Everything else in `packs/` (textures, models, animations, sounds, `item_texture.json`, …) is copied as is; JSON with
comments is fine. `displayName` values are merged into `texts/<locale>.lang`. Suffixes are configurable.

<details>
<summary><b>Client entity with animation options</b></summary>

```ts
import { createClientEntity } from '@ferolyte/pack';

export default createClientEntity({
  identifier: 'myaddon:zombie',
  geometry: 'geometry.myaddon.zombie',
  textures: 'textures/entity/zombie',
  materials: { default: 'entity_alphatest' },
  animations: {
    // the source .animation.json stays untouched; a patched clone gets its own id
    walk: { id: 'animation.myaddon.zombie.walk', speed: 'query.modified_move_speed' },
    idle: 'animation.myaddon.zombie.idle',
  },
});
```
</details>

<details>
<summary><b>Animation controller with reusable states</b></summary>

```ts
import { createAnimationController, defineRpState, not, q } from '@ferolyte/pack';

const idle = defineRpState({ animations: ['idle'], transitions: [{ walk: q.isMoving }] });
const walk = defineRpState({
  animations: ['walk'],
  transitions: [{ idle: not(q.isMoving) }],
  blendTransition: 0.2,
});

export default createAnimationController({
  id: 'controller.animation.myaddon.zombie.move',
  initialState: 'idle',
  states: { idle, walk },
});
```
</details>

<details>
<summary><b>Molang without string soup</b></summary>

```ts
import { math, molang, q, v } from '@ferolyte/pack';

const speed = v('speed');
molang`${q.isMoving} && ${speed} > 1 ? ${math.clamp(speed, 0, 2)} : 0`;
// → "query.is_moving && variable.speed > 1 ? math.clamp(variable.speed, 0, 2) : 0"
```
</details>

## Commands

| Command | What it does |
|---|---|
| `ferolyte init <name> <alias>` | Scaffold a project |
| `ferolyte watch [profile]` | Incremental rebuilds, script bundling, live reload |
| `ferolyte run [profile]` | Build once (optionally `.mcaddon`) |
| `ferolyte check [profile]` | Validate all content in memory, nothing written (`--json`, `--types`, `--strict`) |
| `ferolyte inspect <file>` | Print the JSON a content file produces |
| `ferolyte types [profile]` | Regenerate `@ferolyte/ids` |

Build output is compact and test-friendly (`--quiet`, `--verbose`):

```
✓ build development · 0.46 s
  content 29 files → 44 json   bundle 141 ms · eval 10 ms · write 72 ms
  copy    297 files            239 ms
  ⚠ 1 warning  ✖ 0 errors
⚠ RP/entity/cow.ce.ts  animations.walk  unknown animation "animation.myaddon.cow.walk" (did you mean "animation.myaddon.cow.walk_1"?)
```

## Packages

| Package | |
|---|---|
| [`@ferolyte/cli`](packages/cli) | Compiler, watch mode, `check` / `inspect` / `types`, WebSocket hub, plugin API |
| [`@ferolyte/pack`](packages/pack) | Content SDK: generated component types, builders, Molang, animation controllers |
| [`@ferolyte/common`](packages/common) | Shared types, diagnostics and utilities |
| [`packages/blockbench-plugin`](packages/blockbench-plugin) | Open `.ce.ts` client entities directly in Blockbench |

Extend the pipeline with plugins (`defineFerolytePlugin` from `@ferolyte/cli/plugin`): file hooks, write
interception, access to the game connection and a clean shutdown signal. See the
[CLI README](packages/cli/README.md#plugin-system).

## Contributing

```bash
git clone https://github.com/Lexon2/ferolyte.git
cd ferolyte
npm install          # builds all packages
npm test
```

Component types are generated: change the generator or a schema patch, never `content/generated/` by hand.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the codegen workflow (`npm run codegen`, `codegen:check`, round-trip tests).

## Status

Ferolyte is in active development (0.x): APIs can still change between minor versions. Breaking changes are
listed in each release's changelog. Issues and ideas are welcome on
[GitHub](https://github.com/Lexon2/ferolyte/issues).

## License

MIT © 2024 Lexon2. See [LICENSE](LICENSE).
