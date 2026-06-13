import { describe, it } from 'vitest';
import { createTick } from '@artifex/pack/content/block/components/tick';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createTick', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createTick);
  });

  it('returns undefined for invalid interval range', () => {
    expectUndefined(createTick, { intervalRange: [10, 5] });
  });

  it('maps tick fields', () => {
    expectComponent(createTick, { looping: true, intervalRange: [10, 20] }, 'minecraft:tick', {
      looping: true,
      interval_range: [10, 20],
    });
  });
});
