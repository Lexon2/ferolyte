import { DestructibleByExplosionComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonNegativeNumber } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a destructible_by_explosion component for Minecraft blocks
 */
export const createDestructibleByExplosion = (
  options?: boolean | DestructibleByExplosionComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:destructible_by_explosion': boolean | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'boolean') {
    return {
      'minecraft:destructible_by_explosion': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    const result: any = {};

    if (options.explosionResistance !== undefined) {
      if (
        !validateNonNegativeNumber(
          options.explosionResistance,
          ctx,
          'Explosion resistance must be a non-negative number',
          'explosionResistance',
        )
      ) {
        return undefined;
      }
      result.explosion_resistance = options.explosionResistance;
    }

    return {
      'minecraft:destructible_by_explosion': result,
    };
  }

  logContentError(
    ctx,
    'Destructible by explosion must be a boolean or an object with valid properties',
  );
  return undefined;
};
