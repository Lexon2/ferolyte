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

Entry points: `@ferolyte/pack`, `/item`, `/block`, `/entity` (server + client), `/molang`, `/animation`.
Both `moduleResolution: "bundler"` (the `ferolyte init` template) and `"node"` work.

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

Traits, states and permutations are supported, including the 1.26.40+ `multiBlock` trait and its rules.

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

## How it is built

Component types, key maps and validators live in `content/generated/` and are produced from the schemas by
`npm run codegen` in the repository. Don't edit them by hand: see
[CONTRIBUTING.md](../../CONTRIBUTING.md) for schema patches and the round-trip tests.

## License

MIT © 2024 Lexon2. See [LICENSE](../../LICENSE).
