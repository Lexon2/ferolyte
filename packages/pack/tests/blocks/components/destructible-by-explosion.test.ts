import { describe, it } from 'vitest';
import { createDestructibleByExplosion } from '@artifex/pack/content/block/components/destructible-by-explosion';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDestructibleByExplosion', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDestructibleByExplosion);
  });

  it('maps boolean value', () => {
    expectComponent(createDestructibleByExplosion, false, 'minecraft:destructible_by_explosion', false);
  });

  it('returns undefined for negative explosion resistance', () => {
    expectUndefined(createDestructibleByExplosion, { explosionResistance: -1 });
  });

  it('maps explosion resistance', () => {
    expectComponent(createDestructibleByExplosion, { explosionResistance: 6 }, 'minecraft:destructible_by_explosion', {
      explosion_resistance: 6,
    });
  });
});
