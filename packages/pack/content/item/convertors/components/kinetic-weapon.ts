import { ItemKineticWeaponComponent } from '../../interfaces/components/kinetic-weapon';
import {
  convertKineticWeaponConditions,
  convertWeaponReach,
} from './utils/weapon-reach';

/**
 * Creates a kinetic_weapon component for Minecraft items
 * @param options The kinetic weapon options
 * @returns The kinetic_weapon component in Minecraft format or undefined if validation fails
 */
export const createKineticWeapon = (
  options?: ItemKineticWeaponComponent,
): { 'minecraft:kinetic_weapon': Record<string, unknown> } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  const reach = convertWeaponReach(options.reach);
  if (reach !== undefined) {
    result.reach = reach;
  }

  const creativeReach = convertWeaponReach(options.creativeReach);
  if (creativeReach !== undefined) {
    result.creative_reach = creativeReach;
  }

  const damageConditions = convertKineticWeaponConditions(options.damageConditions);
  if (damageConditions !== undefined) {
    result.damage_conditions = damageConditions;
  }

  const knockbackConditions = convertKineticWeaponConditions(
    options.knockbackConditions,
  );
  if (knockbackConditions !== undefined) {
    result.knockback_conditions = knockbackConditions;
  }

  const dismountConditions = convertKineticWeaponConditions(
    options.dismountConditions,
  );
  if (dismountConditions !== undefined) {
    result.dismount_conditions = dismountConditions;
  }

  if (options.damageModifier !== undefined) {
    if (typeof options.damageModifier !== 'number') {
      console.error('Damage modifier must be a number');

      return undefined;
    }
    result.damage_modifier = options.damageModifier;
  }

  if (options.damageMultiplier !== undefined) {
    if (typeof options.damageMultiplier !== 'number') {
      console.error('Damage multiplier must be a number');

      return undefined;
    }
    result.damage_multiplier = options.damageMultiplier;
  }

  if (options.delay !== undefined) {
    if (typeof options.delay !== 'number') {
      console.error('Delay must be a number');

      return undefined;
    }
    result.delay = options.delay;
  }

  if (options.hitboxMargin !== undefined) {
    if (typeof options.hitboxMargin !== 'number') {
      console.error('Hitbox margin must be a number');

      return undefined;
    }
    result.hitbox_margin = options.hitboxMargin;
  }

  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return {
    'minecraft:kinetic_weapon': result,
  };
};
