import { describe, it } from 'vitest';
import { createFood } from '@artifex/pack/content/item/convertors/components/food';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFood', () => {
  it('returns empty food for empty options', () => {
    expectComponent(createFood, {}, 'minecraft:food', {});
  });

  it('returns undefined for negative nutrition', () => {
    expectUndefined(createFood, { nutrition: -1 });
  });

  it('maps food properties', () => {
    expectComponent(createFood, {
      nutrition: 4,
      saturationModifier: 0.3,
      canAlwaysEat: true,
      usingConvertsTo: 'test:bowl',
    }, 'minecraft:food', {
      nutrition: 4,
      saturation_modifier: 0.3,
      can_always_eat: true,
      using_converts_to: 'test:bowl',
    });
  });
});
