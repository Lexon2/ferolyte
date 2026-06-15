import { describe, it } from 'vitest';
import { createCompostable } from '@ferolyte/pack/content/item/convertors/components/compostable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCompostable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCompostable);
  });

  it('returns undefined for out of range chance', () => {
    expectUndefined(createCompostable, { compostingChance: 0 });
  });

  it('maps composting chance', () => {
    expectComponent(
      createCompostable,
      { compostingChance: 65 },
      'minecraft:compostable',
      {
        composting_chance: 65,
      },
    );
  });
});
