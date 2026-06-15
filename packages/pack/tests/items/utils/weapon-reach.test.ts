import { describe, expect, it } from 'vitest';
import {
  convertKineticWeaponConditions,
  convertWeaponReach,
} from '@ferolyte/pack/content/item/convertors/components/utils/weapon-reach';

describe('convertWeaponReach', () => {
  it('returns undefined when input is missing', () => {
    expect(convertWeaponReach()).toBeUndefined();
  });

  it('maps min and max', () => {
    expect(convertWeaponReach({ min: 1, max: 3 })).toEqual({ min: 1, max: 3 });
  });
});

describe('convertKineticWeaponConditions', () => {
  it('returns undefined when input is missing', () => {
    expect(convertKineticWeaponConditions()).toBeUndefined();
  });

  it('maps condition fields to snake_case', () => {
    expect(
      convertKineticWeaponConditions({
        maxDuration: 5,
        minRelativeSpeed: 0.5,
        minSpeed: 1,
      }),
    ).toEqual({
      max_duration: 5,
      min_relative_speed: 0.5,
      min_speed: 1,
    });
  });
});
