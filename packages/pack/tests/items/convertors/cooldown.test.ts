import { describe, it } from 'vitest';
import { createCooldown } from '@artifex/pack/content/item/convertors/components/cooldown';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCooldown', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCooldown);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createCooldown, { category: 'pearl', duration: 20, type: 'invalid' });
  });

  it('maps valid cooldown', () => {
    expectComponent(createCooldown, { category: 'ender_pearl', duration: 20, type: 'use' }, 'minecraft:cooldown', {
      category: 'ender_pearl',
      duration: 20,
      type: 'use',
    });
  });
});
