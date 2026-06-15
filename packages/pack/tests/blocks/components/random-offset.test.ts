import { describe, it } from 'vitest';
import { createRandomOffset } from '@ferolyte/pack/content/block/components/random-offset';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRandomOffset', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRandomOffset);
  });

  it('returns undefined for invalid axis steps', () => {
    expectUndefined(createRandomOffset, { x: { steps: 'many' } });
  });

  it('maps random offset axes', () => {
    expectComponent(
      createRandomOffset,
      {
        x: { range: { min: -4, max: 4 }, steps: 9 },
        y: { range: { min: 0, max: 0 } },
      },
      'minecraft:random_offset',
      {
        x: { range: { min: -4, max: 4 }, steps: 9 },
        y: { range: { min: 0, max: 0 } },
      },
    );
  });
});
