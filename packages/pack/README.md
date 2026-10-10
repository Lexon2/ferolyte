# @ferolyte/pack

**The Ferolyte content SDK: Minecraft Bedrock blocks, items, entities and animation controllers in TypeScript.**

Component types are generated from the Bedrock JSON schemas and checked against Mojang's official schemas and
the vanilla `bedrock-samples`. You get autocompletion and JSDoc for every vanilla component, and the builders
emit exactly the JSON the game accepts. They validate it on the way out.

```bash
npm install @ferolyte/pack      # usually installed with @ferolyte/cli
```

Requires Node.js ≥ 18. AI agents: read [AGENTS.md](AGENTS.md) and [llms.txt](llms.txt), shipped in the package.

## Imports

```ts
import { createItem, createBlock, createServerEntity, createClientEntity } from '@ferolyte/pack';
import { createAnimationController, defineRpState } from '@ferolyte/pack/animation';
import { molang, q, v, math, not } from '@ferolyte/pack/molang';
```

Entry points: `@ferolyte/pack`, `/item`, `/block`, `/entity` (server + client), `/molang`, `/animation`, `/attachable`, `/render-controller`, `/recipe`, `/spawn-rule`.
Both `moduleResolution: "bundler"` (the `ferolyte init` template) and `"node"` work (as does `"nodenext"`; a test checks all three).

## Rules of the config

- **camelCase names of the vanilla fields.** `maxStackSize` → `max_stack_size`, `lookAtPlayer` →
  `minecraft:behavior.look_at_player`. Every field has JSDoc with its `@minecraft` name.
- **Every shape the game accepts.** Single value or list, string or object (e.g. an item descriptor
  `{ tags: "q.all_tags('minecraft:is_shovel')" }`). Ranges accept `5`, `[1, 3]` or `{ min: 1, max: 3 }`.
- **Unknown fields are errors and are not written.** A typo never reaches the game, and you get a
  *did you mean* suggestion. `snake_case` keys get a hint to use camelCase.
- **Version-aware.** Components and fields removed or added in later format versions are reported for
  your `version` (e.g. `pushable` → `pushableByEntity` / `pushableByBlock` from 1.26.10). Deprecated ones
  warn and are marked `@deprecated` in your editor.
- **Format version.** Without `version` the file is written as `1.21.70` (items, server entities, blocks; blocks follow the profile
  `minGameVersion` from 1.26.40 on), `1.10.0` (client entities, attachables, render controllers, animation controllers), `1.20.10`
  (recipes) or `1.8.0` (spawn rules). The profile `minGameVersion` (default `1.26.20`) is the version that version-gated fields are checked
  against; it does not change the version of items and entities. Namespaced custom components need `version: '1.21.90'` or newer
  (older files get a warning).
- **Escape hatches:**
  - `'namespace:name': {...}` in item/block `components` for custom components;
  - `rawComponents` for anything written verbatim.

## Content

With `@ferolyte/cli`, every content file `export default`s a builder or an array of builders.

### Item: `packs/BP/items/golden_apple.item.ts`

```ts
import { createItem } from '@ferolyte/pack';

export default createItem({
  identifier: 'myaddon:golden_apple',
  components: {
    displayName: { en_US: 'Golden Apple', ru_RU: 'Золотое яблоко' }, // → texts/*.lang
    icon: 'myaddon:golden_apple',                                     // key in RP textures/item_texture.json
    food: { nutrition: 4, saturationModifier: 1.2 },
    'myaddon:glow': { strength: 2 },                                  // custom component
  },
});
```

An array works too: `export default ids.map((identifier) => createItem({ identifier, … }))`.

### Block: `packs/BP/blocks/ore.block.ts`

```ts
import { createBlock } from '@ferolyte/pack';

export default createBlock({
  identifier: 'myaddon:ore',
  components: {
    displayName: 'Ore',
    destructibleByMining: {
      secondsToDestroy: 3,
      itemSpecificSpeeds: [{ item: { tags: "q.all_tags('minecraft:is_pickaxe')" }, destroySpeed: 1 }],
    },
  },
});
```

Traits, states and permutations are supported, including the 1.26.40+ `multiBlock` trait and its rules: the game
needs block `version` 1.26.40+ (older formats need the Upcoming Creator Features toggle), a `movable` component, and
`placementFilter` only in the base components (never in a permutation); `check` reports each case.
`materialInstances.*.ambientOcclusion` takes a boolean or an exponent (0-10). The game requires a number from block
format 1.26.20, so a boolean is written as `1` / `0` there.

### Server entity: `packs/BP/entities/zombie.se.ts`

`createServerEntity` accepts any config, including one assembled from helpers. Declare it with
`defineServerEntity` to have events, component groups and property values checked as literals:

```ts
import { createServerEntity, defineServerEntity, props } from '@ferolyte/pack';

const zombie = defineServerEntity({
  identifier: 'myaddon:zombie',
  properties: { 'myaddon:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' } },
  componentGroups: [{ name: 'angry', components: { movement: { value: 0.35 } } }],
  events: {
    'myaddon:become_angry': {
      sequence: [
        { add: { componentGroups: ['angry'] } },          // 'angry' must be a declared group
        { setProperty: { 'myaddon:state': 'angry' } },    // 'idle' | 'angry'
      ],
    },
  },
  components: {
    health: { value: 20, max: 20 },
    timer: { time: [5, 10], timeDownEvent: { event: 'myaddon:become_angry' } },
    behaviors: { lookAtPlayer: { priority: 7, lookDistance: 6 } },
  },
});

export default createServerEntity(zombie);
export const zombieProps = props(zombie); // zombieProps.state → query.property('myaddon:state')
```

`PropertiesOf<typeof zombie>` gives `{ 'myaddon:state': 'idle' | 'angry' }` for your scripts.

### Client entity: `packs/RP/entity/zombie.ce.ts`

```ts
import { createClientEntity } from '@ferolyte/pack';

export default createClientEntity({
  identifier: 'myaddon:zombie',
  geometry: 'geometry.myaddon.zombie',
  textures: 'textures/entity/zombie',
  materials: { default: 'entity_alphatest' },
  animations: {
    walk: { id: 'animation.myaddon.zombie.walk', speed: 'query.modified_move_speed' },
    idle: 'animation.myaddon.zombie.idle',
  },
  scripts: {
    initialize: ['v.speed = 0'],                 // the trailing ';' is added for you
    animate: ['idle', { walk: 'q.is_moving' }],
  },
});
```

Animation **options** (`speed` → `anim_time_update`) patch a clone of the animation under its own id. Your
`.animation.json` (as exported by Blockbench) stays untouched and reusable.

### Animation controllers: `*.ac.rp.ts` / `*.ac.bp.ts`

```ts
import { createAnimationController, defineRpState, not, q } from '@ferolyte/pack';

const idle = defineRpState({ animations: ['idle'], transitions: [{ walk: q.isMoving }] });
const walk = defineRpState({ animations: ['walk'], transitions: [{ idle: not(q.isMoving) }], blendTransition: 0.2 });

export default createAnimationController({
  id: 'controller.animation.myaddon.zombie.move',
  initialState: 'idle',
  states: { idle, walk }, // reusable across controllers; unknown transition targets are errors
});
```

Use `defineBpState` for behavior-pack controllers. `onEntry` / `onExit` there accept commands (`/say hi`) and
events (`@s myaddon:event`).

### Attachable: `packs/RP/attachables/ruby_sword.att.ts`

```ts
import { createAttachable } from '@ferolyte/pack';

export default createAttachable({
  identifier: 'myaddon:ruby_sword',
  geometry: 'geometry.myaddon.ruby_sword',
  textures: 'textures/myaddon/ruby_sword',
  materials: 'entity_alphatest',
  renderControllers: ['controller.render.myaddon.ruby_sword'],
});
```

### Render controller: `packs/RP/render_controllers/ruby_sword.rc.ts`

A file may export several builders, they are written into one JSON:

```ts
import { createRenderController, q } from '@ferolyte/pack';

export default [
  createRenderController({
    id: 'controller.render.myaddon.ruby_sword',
    geometry: 'Geometry.default',
    materials: [{ '*': 'Material.default' }],
    textures: ['Texture.default'],
    partVisibility: [{ '*': true }, { blade: q.isSneaking }],
  }),
];
```

### Recipes: `packs/BP/recipes/ruby.recipe.ts`

```ts
import { furnaceRecipe, shapelessRecipe } from '@ferolyte/pack';

export default [
  furnaceRecipe({
    identifier: 'myaddon:smelt_ruby',
    input: 'myaddon:ruby_ore',
    output: 'myaddon:ruby',
    tags: ['furnace', 'blast_furnace'],
  }),
  shapelessRecipe({
    identifier: 'myaddon:ruby_from_block',
    ingredients: ['myaddon:ruby_block'],
    result: { item: 'myaddon:ruby', count: 9 },
  }),
];
```

`shapedRecipe`, `brewingMixRecipe`, `brewingContainerRecipe`, `smithingTransformRecipe`, `smithingTrimRecipe` and the dispatcher
`createRecipe({ type, ... })` follow the same flat form. Items are `'ns:item'`, `'ns:item:2'` (data value), `{ item, count }` or `{ tag }`.
Shaped patterns are checked against `key` (unknown symbol, unused key, at most 3×3).

### Spawn rules: `packs/BP/spawn_rules/ruby_golem.spawn.ts`

```ts
import { createSpawnRule } from '@ferolyte/pack';

export default createSpawnRule({
  identifier: 'myaddon:ruby_golem',
  populationControl: 'monster',
  conditions: [{ spawnsOnSurface: {}, weight: { default: 10 }, biomeFilter: { test: 'has_biome_tag', value: 'plains' } }],
});
```

When the flat form lacks a field, `createAttachableDocument`, `createRenderControllerDocument`, `createRecipeDocument` and
`createSpawnRuleDocument` mirror the JSON file 1:1 in camelCase (generated from the Bedrock schemas, validated the same way).
Ids of the new content are exported to `@ferolyte/ids` (`AttachableId`, `RenderControllerId`, `RecipeId`, `SpawnRuleId`).

## Molang

Immutable expressions: safe to reuse, nothing to clear.

```ts
import { assign, math, molang, not, q, v } from '@ferolyte/pack';

const speed = v('speed');
molang`${q.isMoving} && ${speed} > 1 ? ${math.clamp(speed, 0, 2)} : 0`;
// "query.is_moving && variable.speed > 1 ? math.clamp(variable.speed, 0, 2) : 0"

not(q.isOnGround);                         // "!query.is_on_ground"
q.isItemEquipped('main_hand');             // "query.is_item_equipped('main_hand')"
assign(speed, q.modifiedMoveSpeed);        // "variable.speed = query.modified_move_speed;"
```

Anything that accepts Molang also accepts a plain string. The old fluent `new Molang()` builder still works
but is deprecated.

Two mistakes the game loads without an error, so `ferolyte check` warns about them:

- `!` binds tighter than `==`, `!=`, `<`, `>`, `<=`, `>=`. `` `!${cond}` `` with `cond = "v.a == 'x'"` is written as
  `!v.a == 'x'`, which means `(!v.a) == 'x'` and is always false. Write `!(v.a == 'x')`, or `not(eq(v('a'), 'x'))`.
- A plain string passed to `not()`, `eq()` and the other builders, or interpolated into `molang`, is a Molang
  **string literal**: `not('v.a == 1')` is `!'v.a == 1'`. Wrap existing Molang source in `raw()`:
  `not(raw('v.a == 1'))` is `!(v.a == 1)`.

## How it is built

Component types, key maps and validators live in `content/generated/` and are produced from the schemas by
`npm run codegen` in the repository. Don't edit them by hand: see
[CONTRIBUTING.md](../../CONTRIBUTING.md) for schema patches and the round-trip tests.

## License

MIT © 2024 Lexon2. See [LICENSE](../../LICENSE).
