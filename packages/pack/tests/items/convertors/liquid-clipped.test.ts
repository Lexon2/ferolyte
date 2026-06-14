import { describe, expect, it } from 'vitest';
import { createLiquidClipped } from '@artifex/pack/content/item/convertors/components/liquid-clipped';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLiquidClipped', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLiquidClipped);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createLiquidClipped, 'invalid');
  });

  it('maps valid boolean to minecraft:liquid_clipped', () => {
    expectComponent(createLiquidClipped, true, 'minecraft:liquid_clipped', true);
    expectComponent(createLiquidClipped, false, 'minecraft:liquid_clipped', false);
  });
});
