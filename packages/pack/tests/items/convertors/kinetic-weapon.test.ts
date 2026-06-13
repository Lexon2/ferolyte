import { describe, expect, it } from 'vitest';
import { createKineticWeapon } from '@artifex/pack/content/item/convertors/components/kinetic-weapon';
import { expectUndefined } from '../helpers/assert-component';

describe('createKineticWeapon', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createKineticWeapon);
  });

  it('returns undefined for invalid damageModifier type', () => {
    expectUndefined(createKineticWeapon, { damageModifier: 'high' });
  });

  it('maps kinetic weapon fields', () => {
    expect(createKineticWeapon({
      reach: { min: 1, max: 3 },
      creativeReach: { min: 2, max: 4 },
      damageConditions: { minSpeed: 1, maxDuration: 5 },
      knockbackConditions: { minRelativeSpeed: 0.5 },
      dismountConditions: { minSpeed: 2 },
      damageModifier: 1,
      damageMultiplier: 2,
      delay: 0.1,
      hitboxMargin: 0.2,
    })).toEqual({
      'minecraft:kinetic_weapon': {
        reach: { min: 1, max: 3 },
        creative_reach: { min: 2, max: 4 },
        damage_conditions: { min_speed: 1, max_duration: 5 },
        knockback_conditions: { min_relative_speed: 0.5 },
        dismount_conditions: { min_speed: 2 },
        damage_modifier: 1,
        damage_multiplier: 2,
        delay: 0.1,
        hitbox_margin: 0.2,
      },
    });
  });
});
