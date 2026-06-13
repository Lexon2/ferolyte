import { ItemSwingSoundsComponent } from '../../interfaces/components/swing-sounds';

/**
 * Creates a swing_sounds component for Minecraft items
 * @param options The swing sounds options
 * @returns The swing_sounds component in Minecraft format or undefined if validation fails
 */
export const createSwingSounds = (
  options?: ItemSwingSoundsComponent,
): { 'minecraft:swing_sounds': Record<string, string> } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: Record<string, string> = {};

  if (options.attackCriticalHit !== undefined) {
    if (typeof options.attackCriticalHit !== 'string') {
      console.error('Attack critical hit sound must be a string');

      return undefined;
    }
    result.attack_critical_hit = options.attackCriticalHit;
  }

  if (options.attackHit !== undefined) {
    if (typeof options.attackHit !== 'string') {
      console.error('Attack hit sound must be a string');

      return undefined;
    }
    result.attack_hit = options.attackHit;
  }

  if (options.attackMiss !== undefined) {
    if (typeof options.attackMiss !== 'string') {
      console.error('Attack miss sound must be a string');

      return undefined;
    }
    result.attack_miss = options.attackMiss;
  }

  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return {
    'minecraft:swing_sounds': result,
  };
};
