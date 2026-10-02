# Ferolyte — guide for AI agents

Ferolyte compiles TypeScript content files into Minecraft Bedrock add-on JSON.
You write one `.ts` file per content item; `ferolyte` bundles it, evaluates the
`export default` builder and writes the JSON into the pack output.
Reference for the SDK: `llms.txt` (same folder), types and JSDoc in the `*.d.ts` files.

## File suffixes (inside `packs/BP` or `packs/RP`)

| Suffix      | Content                  | Pack | Output dir               | Factory                     |
| ----------- | ------------------------ | ---- | ------------------------ | --------------------------- |
| `.item.ts`  | item                     | BP   | `items/`                 | `createItem`                |
| `.block.ts` | block                    | BP   | `blocks/`                | `createBlock`               |
| `.se.ts`    | server (behavior) entity | BP   | `entities/`              | `createServerEntity`        |
| `.ce.ts`    | client (resource) entity | RP   | `entity/`                | `createClientEntity`        |
| `.ac.bp.ts` | animation controller     | BP   | `animation_controllers/` | `createAnimationController` |
| `.ac.rp.ts` | animation controller     | RP   | `animation_controllers/` | `createAnimationController` |
| `.att.ts`   | attachable               | RP   | `attachables/`           | `createAttachable`          |
| `.rc.ts`    | render controller(s)     | RP   | `render_controllers/`    | `createRenderController`    |
| `.recipe.ts`| recipe                   | BP   | `recipes/`               | `shapedRecipe`, `createRecipe`, … |
| `.spawn.ts` | spawn rule               | BP   | `spawn_rules/`           | `createSpawnRule`           |

Suffixes can be changed with `contentSuffixes` in `ferolyte.config.mts`. Any other
non-`.ts` file in `packs/` is copied as is. `texts/*.lang` is merged with the entries
generated from `displayName`. A file may export one builder or an array of builders.

## Rules

- Import from the package root: `import { createItem } from '@ferolyte/pack'`
  (subpaths `@ferolyte/pack/item|block|entity|molang|animation` also work). Never import
  from `content/...` paths or from convertors.
- Config keys are **camelCase** (`maxStackSize`, `lookAtPlayer`); the compiler emits the
  snake_case Minecraft names. Do not write `minecraft:` keys in typed `components`.
- Ranges (`MinMaxRange`) accept `5`, `[1, 3]` or `{ min: 1, max: 3 }`; all are emitted as `{ min, max }`.
- Typed `components`, `behaviors` and filters are **generated from the Bedrock schemas**: every key is the
  schema name in camelCase (`absorbableCauses`, `onKill`). A key that is not in the schema is an error
  ("Did you mean …") and is **not written**; a wrong value of a known field is written as given plus an error.
- Where the schema allows several shapes the SDK accepts all of them (`item: 'x:y' | { tags: '…' }`,
  `number | [a, b] | { min, max }`, a single trigger where a list is allowed).
- A component the SDK does not model yet goes into `rawComponents`
  (`{ 'namespace:component': {...} }`, emitted verbatim). Items, blocks, server entities and
  component groups support it.
- `version` fields accept any string; known values are only suggestions.
- `displayName` (a string, or `{ en_US: '...', ru_RU: '...' }`) is written to `texts/<locale>.lang`.
- Molang: prefer the immutable v2 API — ``molang`${q.isMoving} && ${v('speed')} > 1` ``,
  `q.*`, `v()`, `math.*`, `not(...)`, `assign(...)` — or plain strings. `new Molang()` is deprecated.
- Identifiers use a namespace: `myaddon:thing`. Never edit generated output in the build folder.
- Diagnostics name the file and field path: fix the reported field, do not silence them.
- Reference checks: unknown geometry / animation / render controller / texture / item icon / component group /
  event / entity property references are warnings with a "did you mean" hint (`--strict` makes them errors).
- Typed ids: every build/watch batch (and `ferolyte types`) writes `.ferolyte/types/ids.ts`; import it as
  `import { EntityId, EntityEvent, AnimationId } from '@ferolyte/ids'` instead of retyping id strings (`ItemId`, `BlockId`, `AttachableId`, `RenderControllerId`, `RecipeId`, `SpawnRuleId`, `GeometryId`, …)
  (works in `@minecraft/server` scripts too). Existing projects add `"@ferolyte/ids": ["./.ferolyte/types/ids.ts"]`
  to `compilerOptions.paths` in tsconfig (the compiler resolves the alias on its own).

## Verify your change

```bash
npx ferolyte check            # validates every content file in memory, nothing is written
npx ferolyte check --json     # [{ file, contentType, component, fieldPath, message, severity }]
npx ferolyte check --types --json  # also runs the project TypeScript (tsc --noEmit); TS errors appear as contentType "typescript", fieldPath "line:col"
npx ferolyte inspect packs/BP/items/golden_apple.item.ts   # prints the JSON that would be emitted
npx ferolyte run --json       # real build, same JSON report on stdout
```

`check` and `run --json` exit with 1 when there is at least one `error`; warnings do not fail.
Run `ferolyte check --types --json` before finishing: esbuild does not type-check, so only `--types` reports the TypeScript errors your editor shows. Config written in vanilla snake_case (`height_offset_range`) produces a warning with the camelCase name to use.
Read the JSON, fix `error` records first (`file` + `fieldPath` point to the field), run again.

## Canonical examples

Item — `packs/BP/items/golden_apple.item.ts`

```ts
import { createItem } from '@ferolyte/pack';

export default createItem({
  identifier: 'myaddon:golden_apple',
  components: {
    displayName: 'Golden Apple',
    icon: 'golden_apple', // key in textures/item_texture.json
    maxStackSize: 16,
    food: { nutrition: 4, saturationModifier: 1.2 },
  },
});
```

Block — `packs/BP/blocks/custom.block.ts`

```ts
import { createBlock } from '@ferolyte/pack';

export default createBlock({
  identifier: 'myaddon:custom_block',
  components: { displayName: 'Custom Block', friction: 0.6 },
});
```

Server entity — `packs/BP/entities/cow.se.ts`

```ts
import { createServerEntity } from '@ferolyte/pack';

export default createServerEntity({
  identifier: 'myaddon:cow',
  components: {
    health: { value: 10, max: 10 },
    movement: { value: 0.25 },
    behaviors: {
      lookAtPlayer: { priority: 8, lookDistance: 20, probability: 0.02 },
    },
  },
  componentGroups: [{ name: 'despawn', components: { instantDespawn: {} } }],
});
```

Typed properties, events and component groups — `packs/BP/entities/zombie.se.ts`

```ts
import { createServerEntity, defineServerEntity, props, type PropertiesOf } from '@ferolyte/pack';

const zombie = defineServerEntity({
  identifier: 'myaddon:zombie',
  properties: { 'myaddon:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' } },
  componentGroups: [{ name: 'myaddon:angry', components: { instantDespawn: {} } }],
  events: {
    'myaddon:become_angry': {
      add: { componentGroups: ['myaddon:angry'] },   // only declared groups
      setProperty: { 'myaddon:state': 'angry' },     // only 'idle' | 'angry'
    },
    'myaddon:calm_down': { trigger: 'myaddon:become_angry' }, // only declared events
  },
  components: { timer: { time: 30, timeDownEvent: 'myaddon:calm_down' } },
});

export default createServerEntity(zombie);
export type ZombieProps = PropertiesOf<typeof zombie>; // { 'myaddon:state': 'idle' | 'angry' }
// Molang: props(zombie).state is query.property('myaddon:state')
```

Names are inferred as literals (no `as const`); a typo in a group / event / property value is a compile error.
Configs that declare no `events` / `componentGroups` / `properties` stay unrestricted. Events that target other
entities (`target: 'other'`) and `minecraft:*` events are not restricted.

Attachable — `packs/RP/attachables/sword.att.ts` (same render description as `.ce.ts`)

```ts
import { createAttachable, q } from '@ferolyte/pack';

export default createAttachable({
  identifier: 'myaddon:sword',
  item: { 'myaddon:sword': q.isOwnerIdentifierAny('minecraft:player') },
  geometry: 'geometry.myaddon.sword',
  textures: 'textures/myaddon/sword',
  materials: 'entity_alphatest',
  animations: { hold: { id: 'animation.myaddon.sword.hold', speed: 2 } }, // patched clone, source untouched
  scripts: { animate: ['hold'] },
  renderControllers: ['controller.render.myaddon.sword'],
});
```

Render controller — `packs/RP/render_controllers/sword.rc.ts` (several builders in a file -> one JSON)

```ts
import { createRenderController, q } from '@ferolyte/pack';

export default [
  createRenderController({
    id: 'controller.render.myaddon.sword',
    geometry: 'Geometry.default',
    materials: [{ '*': 'Material.default' }],
    textures: ['Texture.default'],
    partVisibility: [{ '*': true }, { blade: q.isSneaking }],
  }),
];
```

`createAttachableDocument` / `createRenderControllerDocument` / `createRecipeDocument` / `createSpawnRuleDocument` mirror the JSON file 1:1 (camelCase) when the flat form lacks a field.
The compiler checks that every `Geometry.x` / `Texture.x` / `Material.x` a render controller uses is a key of each entity / attachable that uses it.

Recipe — `packs/BP/recipes/ruby_block.recipe.ts`

```ts
import { shapedRecipe } from '@ferolyte/pack';

export default shapedRecipe({
  identifier: 'myaddon:ruby_block',
  pattern: ['###', '###', '###'],
  key: { '#': 'myaddon:ruby' }, // 'ns:item', 'ns:item:2' (data), { item, count }, { tag }
  result: 'myaddon:ruby_block',
  unlock: 'myaddon:ruby',
});
```

Output:

```json
{
  "format_version": "1.20.10",
  "minecraft:recipe_shaped": {
    "description": { "identifier": "myaddon:ruby_block" },
    "tags": ["crafting_table"],
    "unlock": [{ "item": "myaddon:ruby" }],
    "pattern": ["###", "###", "###"],
    "key": { "#": "myaddon:ruby" },
    "result": "myaddon:ruby_block"
  }
}
```

Helpers: `shapedRecipe`, `shapelessRecipe` (`ingredients`), `furnaceRecipe` (`input`, `output`, `tags`), `brewingMixRecipe`,
`brewingContainerRecipe`, `smithingTransformRecipe`, `smithingTrimRecipe`, and `createRecipe({ type: 'shaped', ... })` as one dispatcher.
The compiler reports pattern symbols missing from `key`, unused keys, patterns larger than 3×3 and empty results;
items of your own namespace must exist (vanilla ids are not checked).

Spawn rule — `packs/BP/spawn_rules/ruby_golem.spawn.ts`

```ts
import { createSpawnRule } from '@ferolyte/pack';

export default createSpawnRule({
  identifier: 'myaddon:ruby_golem', // the entity, must exist in the project
  populationControl: 'monster',
  conditions: [
    {
      spawnsOnSurface: {},
      weight: { default: 10 },
      herd: { minSize: 1, maxSize: 2 },
      biomeFilter: { test: 'has_biome_tag', value: 'plains' },
    },
  ],
});
```

Output:

```json
{
  "format_version": "1.8.0",
  "minecraft:spawn_rules": {
    "description": { "identifier": "myaddon:ruby_golem", "population_control": "monster" },
    "conditions": [
      {
        "minecraft:spawns_on_surface": {},
        "minecraft:weight": { "default": 10 },
        "minecraft:herd": { "min_size": 1, "max_size": 2 },
        "minecraft:biome_filter": { "test": "has_biome_tag", "value": "plains" }
      }
    ]
  }
}
```

Conditions are the generated spawn rule conditions (`weight`, `densityLimit`, `herd`, `heightFilter`, `biomeFilter`, …);
filters use the same format as entity filters.

Client entity — `packs/RP/entity/cow.ce.ts`

```ts
import { createClientEntity } from '@ferolyte/pack';

export default createClientEntity({
  identifier: 'myaddon:cow',
  textures: 'textures/entity/cow',
  geometry: 'geometry.cow',
  animations: {
    walk: { id: 'animation.cow.walk', speed: 'query.modified_move_speed' },
    idle: 'animation.cow.idle',
  },
});
```

Animation controller — `packs/RP/animation_controllers/move.ac.rp.ts`
(use `defineBpState` and `.ac.bp.ts` for behavior packs; RP and BP states cannot be mixed)

```ts
import { createAnimationController, defineRpState, not, q } from '@ferolyte/pack';

const idle = defineRpState({ animations: ['idle'], transitions: [{ walk: q.isMoving }] });
const walk = defineRpState({ animations: ['walk'], transitions: [{ idle: not(q.isMoving) }] });

export default createAnimationController({
  id: 'controller.animation.cow.move', // must start with `controller.animation.`
  initialState: 'idle',
  states: { idle, walk },
});
```

## Project layout

```
ferolyte.config.mts     profiles: packs { alias, namespace, output }, scripts { entry }, lang, contentSuffixes
packs/BP, packs/RP      pack sources (content files + plain JSON/texts)
packs/scripts/main.ts   Script API entry (bundled with esbuild)
```

Commands: `ferolyte run [profile]` builds once, `ferolyte watch [profile]` rebuilds on change
(and reloads scripts in game over WebSocket), `ferolyte check`, `ferolyte inspect <file>`.
