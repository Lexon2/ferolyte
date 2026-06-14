import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '@artifex/common/content/validation/content-validation';

interface IconTextures {
  default: string;
  [key: string]: string;
}

type IconOptions = string | { textures: IconTextures };

/**
 * Creates an icon component for Minecraft items
 * @param options The icon options (string or object with textures)
 * @returns The icon component in Minecraft format or undefined if validation fails
 */
export const createIcon = (
  options?: IconOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:icon': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'string') {
    if (
      !validateNonEmptyString(
        options,
        ctx,
        'Icon texture string must not be empty',
      )
    ) {
      return undefined;
    }
    return {
      'minecraft:icon': {
        textures: {
          default: options,
        },
      },
    };
  }

  if (typeof options === 'object' && options !== null && options.textures) {
    if (
      !validateNonEmptyString(
        options.textures.default,
        ctx,
        'Icon textures must have a non-empty default property',
        'textures.default',
      )
    ) {
      return undefined;
    }

    for (const key in options.textures) {
      if (
        !validateNonEmptyString(
          options.textures[key],
          ctx,
          `Icon texture "${key}" must be a non-empty string`,
          `textures.${key}`,
        )
      ) {
        return undefined;
      }
    }

    return {
      'minecraft:icon': {
        textures: options.textures,
      },
    };
  }

  logContentError(ctx, 'Icon must be a string or an object with textures');
  return undefined;
};
