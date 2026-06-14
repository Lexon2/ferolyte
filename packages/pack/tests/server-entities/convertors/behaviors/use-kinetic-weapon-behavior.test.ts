import { describe, it } from 'vitest';

import { convertUseKineticWeaponBehavior } from '@artifex/pack/content/server-entity/convertors/behaviors/use-kinetic-weapon-behavior.convertor';

import { expectComponent, expectUndefined } from '../../helpers/assert-component';

describe('convertUseKineticWeaponBehavior', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertUseKineticWeaponBehavior);
  });

  it('returns undefined for negative priority', () => {
    expectUndefined(convertUseKineticWeaponBehavior, { priority: -1 });
  });

  it('maps use_kinetic_weapon behavior', () => {
    expectComponent(
      convertUseKineticWeaponBehavior,
      {
        priority: 1,
        speedMultiplier: 1.1,
        approachDistance: 2,
        weaponReachMultiplier: 1.5,
        requireCompletePath: true,
        attackOnce: false,
      },
      'minecraft:behavior.use_kinetic_weapon',
      {
        priority: 1,
        speed_multiplier: 1.1,
        approach_distance: 2,
        weapon_reach_multiplier: 1.5,
        require_complete_path: true,
        attack_once: false,
      },
    );
  });
});
