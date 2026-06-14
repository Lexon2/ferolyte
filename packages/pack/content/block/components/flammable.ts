import { FlammableComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNumber } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a flammable component for Minecraft blocks
 */
export const createFlammable = (
  options?: boolean | FlammableComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:flammable': boolean | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'boolean') {
    return {
      'minecraft:flammable': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    const result: any = {};

    if (options.catchChanceModifier !== undefined) {
      if (
        !validateNumber(
          options.catchChanceModifier,
          ctx,
          'Catch chance modifier must be a number',
          'catchChanceModifier',
        )
      ) {
        return undefined;
      }
      result.catch_chance_modifier = options.catchChanceModifier;
    }

    if (options.destroyChanceModifier !== undefined) {
      if (
        !validateNumber(
          options.destroyChanceModifier,
          ctx,
          'Destroy chance modifier must be a number',
          'destroyChanceModifier',
        )
      ) {
        return undefined;
      }
      result.destroy_chance_modifier = options.destroyChanceModifier;
    }

    return {
      'minecraft:flammable': result,
    };
  }

  logContentError(
    ctx,
    'Flammable must be a boolean or an object with valid properties',
  );
  return undefined;
};
