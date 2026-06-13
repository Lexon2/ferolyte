import { ItemPiercingWeaponComponent } from '../../interfaces/components/piercing-weapon';
import { convertWeaponReach } from './utils/weapon-reach';

/**
 * Creates a piercing_weapon component for Minecraft items
 * @param options The piercing weapon options
 * @returns The piercing_weapon component in Minecraft format or undefined if validation fails
 */
export const createPiercingWeapon = (
  options?: ItemPiercingWeaponComponent,
): { 'minecraft:piercing_weapon': Record<string, unknown> } | undefined => {
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
    'minecraft:piercing_weapon': result,
  };
};
