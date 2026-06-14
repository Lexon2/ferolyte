import { describe, it } from 'vitest';
import { createDamageAbsorption } from '@artifex/pack/content/item/convertors/components/damage-absorption';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDamageAbsorption', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDamageAbsorption);
  });

  it('returns undefined for empty causes', () => {
    expectUndefined(createDamageAbsorption, { causes: [] });
  });

  it('returns undefined for invalid cause', () => {
    expectUndefined(createDamageAbsorption, { causes: ['invalid'] });
  });

  it('maps valid causes', () => {
    expectComponent(createDamageAbsorption, { causes: ['fire', 'lava'] }, 'minecraft:damage_absorption', {
      absorbable_causes: ['fire', 'lava'],
    });
  });
});
