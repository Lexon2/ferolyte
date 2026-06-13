import { describe, it } from 'vitest';
import { createDurability } from '@artifex/pack/content/item/convertors/components/durability';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDurability', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDurability);
  });

  it('returns undefined for invalid maxDurability', () => {
    expectUndefined(createDurability, { maxDurability: 0 });
  });

  it('maps durability with damage chance', () => {
    expectComponent(createDurability, {
      maxDurability: 100,
      damageChance: { min: 10, max: 50 },
    }, 'minecraft:durability', {
      max_durability: 100,
      damage_chance: { min: 10, max: 50 },
    });
  });
});
