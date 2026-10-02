import { describe, expect, expectTypeOf, it } from 'vitest';

import { createBlock } from '@ferolyte/pack/content/block/create-block';
import { BlockConfig } from '@ferolyte/pack/content/block/interfaces/block-config';
import { createItem } from '@ferolyte/pack/content/item/create-item';
import { ItemConfig } from '@ferolyte/pack/content/item/interfaces/item-config';
import { ServerEntityConfig } from '@ferolyte/pack/content/server-entity/interfaces/server-entity-config';
import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';

describe('rawComponents', () => {
  it('rejects unknown camelCase components in typed `components`', () => {
    createItem({
      identifier: 'ferolyte:a',
      // @ts-expect-error unknown component must be an error
      components: { fooBar: {} },
    });
    createBlock({
      identifier: 'ferolyte:a',
      // @ts-expect-error unknown component must be an error
      components: { fooBar: {} },
    });
  });

  it('accepts namespaced custom components in item/block `components`', () => {
    const block = createBlock({
      identifier: 'ferolyte:a',
      components: { 'myaddon:sapling': { stages: 3 } },
    }).build();
    const item = createItem({
      identifier: 'ferolyte:a',
      components: { glint: true, 'myaddon:tool': {} },
    }).build();

    expect(block['minecraft:block'].components).toMatchObject({
      'myaddon:sapling': { stages: 3 },
    });
    expect(item['minecraft:item'].components).toMatchObject({
      'myaddon:tool': {},
    });
  });

  it('exposes rawComponents', () => {

    expectTypeOf<ItemConfig['rawComponents']>().not.toBeAny();
    expectTypeOf<BlockConfig['rawComponents']>().not.toBeAny();
    expectTypeOf<ServerEntityConfig['rawComponents']>().not.toBeAny();
  });

  it('merges item rawComponents into the output', () => {
    const item = createItem({
      identifier: 'ferolyte:a',
      components: { glint: true },
      rawComponents: { 'minecraft:foo': { bar: 1 } },
    }).build();

    expect(item['minecraft:item'].components).toMatchObject({
      'minecraft:glint': true,
      'minecraft:foo': { bar: 1 },
    });
  });

  it('merges block rawComponents into the output', () => {
    const block = createBlock({
      identifier: 'ferolyte:a',
      rawComponents: { 'minecraft:foo': { bar: 1 } },
    }).build();

    expect(block['minecraft:block'].components).toEqual({
      'minecraft:foo': { bar: 1 },
    });
  });

  it('merges entity and component group rawComponents', () => {
    const entity = createServerEntity({
      identifier: 'ferolyte:a',
      rawComponents: { 'minecraft:foo': { bar: 1 } },
      componentGroups: [
        { name: 'g', components: {}, rawComponents: { 'minecraft:baz': 2 } },
      ],
    } as ServerEntityConfig).build() as any;

    expect(entity['minecraft:entity'].components).toMatchObject({
      'minecraft:foo': { bar: 1 },
    });
    expect(entity['minecraft:entity'].component_groups.g).toEqual({
      'minecraft:baz': 2,
    });
  });
});
