import { describe, it } from 'vitest';
import { createEntityFallOn } from '@ferolyte/pack/content/block/components/entity-fall-on';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createEntityFallOn', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createEntityFallOn);
  });

  it('returns undefined for negative minFallDistance', () => {
    expectUndefined(createEntityFallOn, { minFallDistance: -1 });
  });

  it('maps min fall distance', () => {
    expectComponent(
      createEntityFallOn,
      { minFallDistance: 3 },
      'minecraft:entity_fall_on',
      {
        min_fall_distance: 3,
      },
    );
  });
});
