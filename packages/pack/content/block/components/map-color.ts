import { ColorValue } from '../../common/types/color-value';
import { MapColorComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateNonEmptyString,
} from '@artifex/common/content/validation/content-validation';

const VALID_TINT_METHODS = ['noise', 'underwater', 'sinusoidal'] as const;

/**
 * Creates a map_color component for Minecraft blocks
 */
export const createMapColor = (
  options?: MapColorComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:map_color': ColorValue | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'string' || Array.isArray(options)) {
    if (typeof options === 'string') {
      if (
        !validateNonEmptyString(
          options,
          ctx,
          'Map color string must not be empty',
        )
      ) {
        return undefined;
      }
    } else if (
      options.length !== 3 ||
      !options.every((val) => typeof val === 'number' && val >= 0 && val <= 255)
    ) {
      logContentError(
        ctx,
        'Map color RGB array must contain 3 values between 0 and 255',
      );
      return undefined;
    }

    return {
      'minecraft:map_color': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    if (!options.color) {
      logContentError(
        ctx,
        'Map color object must have a color property',
      );
      return undefined;
    }

    const result: any = {
      color: options.color,
    };

    if (options.tintMethod) {
      if (
        !validateAllowedValue(
          options.tintMethod,
          VALID_TINT_METHODS,
          ctx,
          'Tint method must be "noise", "underwater", or "sinusoidal"',
          'tintMethod',
        )
      ) {
        return undefined;
      }
      result.tint_method = options.tintMethod;
    }

    return {
      'minecraft:map_color': result,
    };
  }

  logContentError(
    ctx,
    'Map color must be a string, RGB array, or an object with valid properties',
  );
  return undefined;
};
