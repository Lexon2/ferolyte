# @artifex/pack

Artifex content SDK for Minecraft Bedrock addons.

Define blocks, items, and server/client entities in TypeScript. Builders convert camelCase Artifex configs into snake_case vanilla Minecraft JSON with validation and diagnostics powered by `@artifex/common`.

More content coming soon..

## Installation

```bash
npm install @artifex/pack
```

`@artifex/common` is installed automatically as a dependency.

**Requirements:** Node.js >= 18

## Feature scope

All vanilla Minecraft Bedrock components for **blocks**, **items**, and **server/client entities** are ported. In TypeScript configs they use **camelCase** (e.g. `saturationModifier`, `displayName`); builders convert them to snake_case vanilla JSON at build time.

| Content type    | Import path                             |
| --------------- | --------------------------------------- |
| Blocks          | `@artifex/pack/content/block/*`         |
| Items           | `@artifex/pack/content/item/*`          |
| Server entities | `@artifex/pack/content/server-entity/*` |
| Client entities | `@artifex/pack/content/client-entity/*` |

### Molang

Fluent builder and type constants for Bedrock Molang at `@artifex/pack/content/molang`.

Type-only imports: `@artifex/pack/content/molang/types`.

Reference: [bedrock.dev Molang docs](https://bedrock.dev/docs/stable/Molang).

```typescript
import { Molang } from '@artifex/pack/content/molang';

const expression = new Molang()
  .allAnimationsFinished
  .and
  .math('abs', 1)
  .or
  .math.randomInteger(10, 100)
  .build();
// query.all_animations_finished && math.abs(1) || math.random_integer(10, 100)
```

Named operators (`.and`, `.or`, `.eq`, …) and `.op('&&')` are both supported. Parameterized queries use `.query('is_item_equipped', 'main_hand')`.

## Usage examples

### Content files for the CLI

When used with `@artifex/cli`, content files must `export default` a builder (or array of builders). The CLI bundles each file, imports the default export, and writes the resulting JSON to the output pack.

**Block** — `packs/BP/blocks/custom.block.ts`:

```typescript
import { createBlock } from '@artifex/pack/content/block/create-block';

export default createBlock({
  identifier: 'myaddon:custom_block',
  components: { displayName: 'Custom Block', friction: 0.6 },
});
```

**Item** — `packs/BP/items/apple.item.ts`:

```typescript
import { createItem } from '@artifex/pack/content/item/create-item';

export default createItem({
  identifier: 'myaddon:golden_apple',
  components: {
    displayName: 'Golden Apple',
    food: { nutrition: 4, saturationModifier: 1.2 },
  },
});
```

**Multiple Items** — `packs/BP/items/apples.item.ts`:

```typescript
import { createItem } from '@artifex/pack/content/item/create-item';

export default [
  'myaddon:golden_apple',
  'myaddon:diamond_apple',
  'myaddon:iron_apple',
].map((identifier) =>
  createItem({
    identifier,
    components: {
      displayName: 'Golden Apple',
      icon: identifier,
      food: { nutrition: 4, saturationModifier: 1.2 },
    },
  }),
);
```

**Server entity** — `packs/BP/entities/cow.se.ts`:

```typescript
import { createServerEntity } from '@artifex/pack/content/server-entity/create-server-entity';

export default createServerEntity({
  identifier: 'myaddon:cow',
  components: {
    health: { value: 10, max: 10 },
    movement: { value: 0.25 },
    behaviors: {
      lookAtPlayer: {
        priority: 8,
        angleOfViewHorizontal: 70,
        angleOfViewVertical: 70,
        lookDistance: 20,
        probability: 0.02,
      },
    },
  },
  componentGroups: [
    {
      name: 'despawn',
      components: {
        instantDespawn: {},
      },
    },
  ],
});
```

**Client entity** — `packs/RP/entity/cow.ce.ts`:

```typescript
import { createClientEntity } from '@artifex/pack/content/client-entity/create-client-entity';

export default createClientEntity({
  identifier: 'myaddon:cow',
  description: {
    identifier: 'myaddon:cow',
    textures: { default: 'textures/entity/cow' }, // or simply `textures: 'textures/entity/cow'`
    geometry: { default: 'geometry.cow' }, // `geometry: 'geometry.cow'`
  },
});
```

## License

MIT — Copyright (c) 2024 Lexon2. See [LICENSE](../../LICENSE) for the full text.
