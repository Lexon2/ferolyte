import { describe, it } from 'vitest';
import { createDamage } from '@artifex/pack/content/item/convertors/components/damage';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDamage', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDamage);
  });

  it('returns undefined for negative value', () => {
    expectUndefined(createDamage, -1);
  });

  it('maps valid damage value', () => {
    expectComponent(createDamage, 5, 'minecraft:damage', 5);
    expectComponent(createDamage, 0, 'minecraft:damage', 0);
  });
});
