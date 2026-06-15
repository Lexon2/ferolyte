import { describe, it } from 'vitest';
import { createLoot } from '@ferolyte/pack/content/block/components/loot';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLoot', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLoot);
  });

  it('returns undefined for empty string', () => {
    expectUndefined(createLoot, '');
  });

  it('maps loot table path', () => {
    expectComponent(
      createLoot,
      'loot_tables/blocks/test_block.json',
      'minecraft:loot',
      'loot_tables/blocks/test_block.json',
    );
  });
});
