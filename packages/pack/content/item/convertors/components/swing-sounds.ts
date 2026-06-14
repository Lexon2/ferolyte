import { ItemSwingSoundsComponent } from '../../interfaces/components/swing-sounds';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateString } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a swing_sounds component for Minecraft items
 * @param options The swing sounds options
 * @returns The swing_sounds component in Minecraft format or undefined if validation fails
 */
export const createSwingSounds = (
  options?: ItemSwingSoundsComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:swing_sounds': Record<string, string> } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: Record<string, string> = {};

  if (options.attackCriticalHit !== undefined) {
    if (
      !validateString(
        options.attackCriticalHit,
        ctx,
        'Attack critical hit sound must be a string',
        'attackCriticalHit',
      )
    ) {
      return undefined;
    }
    result.attack_critical_hit = options.attackCriticalHit;
  }

  if (options.attackHit !== undefined) {
    if (
      !validateString(
        options.attackHit,
        ctx,
        'Attack hit sound must be a string',
        'attackHit',
      )
    ) {
      return undefined;
    }
    result.attack_hit = options.attackHit;
  }

  if (options.attackMiss !== undefined) {
    if (
      !validateString(
        options.attackMiss,
        ctx,
        'Attack miss sound must be a string',
        'attackMiss',
      )
    ) {
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
