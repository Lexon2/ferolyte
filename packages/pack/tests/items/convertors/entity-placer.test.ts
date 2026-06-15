import { describe, expect, it } from 'vitest';
import { createEntityPlacer } from '@ferolyte/pack/content/item/convertors/components/entity-placer';
import { expectUndefined } from '../helpers/assert-component';

describe('createEntityPlacer', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createEntityPlacer);
  });

  it('returns undefined for empty entity', () => {
    expectUndefined(createEntityPlacer, { entity: '' });
  });

  it('maps entity placer fields', () => {
    expect(
      createEntityPlacer({
        entity: 'minecraft:cow',
        dispenseOn: ['stone'],
        useOn: ['grass'],
      }),
    ).toEqual({
      'minecraft:entity_placer': {
        entity: 'minecraft:cow',
        dispense_on: ['stone'],
        use_on: ['grass'],
      },
    });
  });
});
