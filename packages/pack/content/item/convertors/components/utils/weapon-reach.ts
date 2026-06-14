import { ItemKineticWeaponConditions, ItemWeaponReachRange } from '../../../types/item-weapon-reach';

export const convertWeaponReach = (
  reach?: ItemWeaponReachRange,
): { min?: number; max?: number } | undefined => {
  if (reach === undefined) {
    return undefined;
  }

  const result: { min?: number; max?: number } = {};

  if (reach.min !== undefined) {
    result.min = reach.min;
  }

  if (reach.max !== undefined) {
    result.max = reach.max;
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

export const convertKineticWeaponConditions = (
  conditions?: ItemKineticWeaponConditions,
): Record<string, number> | undefined => {
  if (conditions === undefined) {
    return undefined;
  }

  const result: Record<string, number> = {};

  if (conditions.maxDuration !== undefined) {
    result.max_duration = conditions.maxDuration;
  }

  if (conditions.minRelativeSpeed !== undefined) {
    result.min_relative_speed = conditions.minRelativeSpeed;
  }

  if (conditions.minSpeed !== undefined) {
    result.min_speed = conditions.minSpeed;
  }

  return Object.keys(result).length > 0 ? result : undefined;
};
