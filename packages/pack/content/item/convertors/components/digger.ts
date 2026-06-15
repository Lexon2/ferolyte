import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateNonEmptyArray,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@ferolyte/common/content/validation/content-validation';

interface DestroySpeed {
  speed: number;
  block: string;
}

interface DiggerOptions {
  useEfficiency?: boolean;
  destroySpeeds: DestroySpeed[];
}

/**
 * Creates a digger component for Minecraft items
 * @param options The digger options
 * @returns The digger component in Minecraft format or undefined if validation fails
 */
export const createDigger = (
  options?: DiggerOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:digger': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNonEmptyArray(
      options.destroySpeeds,
      ctx,
      'Destroy speeds must be a non-empty array',
      'destroySpeeds',
    )
  ) {
    return undefined;
  }

  const destroySpeeds: { speed: number; block: string }[] = [];

  for (let index = 0; index < options.destroySpeeds.length; index++) {
    const speed = options.destroySpeeds[index];
    const entryContext =
      ctx !== undefined
        ? { ...ctx, fieldPath: `destroySpeeds[${index}]` }
        : undefined;

    if (
      !validatePositiveNumber(
        speed.speed,
        entryContext,
        'Destroy speed must be a positive number',
        'speed',
      )
    ) {
      return undefined;
    }

    if (
      !validateNonEmptyString(
        speed.block,
        entryContext,
        'Block must be a non-empty string',
        'block',
      )
    ) {
      return undefined;
    }

    destroySpeeds.push({
      speed: speed.speed,
      block: speed.block,
    });
  }

  const result: any = {
    destroy_speeds: destroySpeeds,
  };

  if (typeof options.useEfficiency === 'boolean') {
    result.use_efficiency = options.useEfficiency;
  }

  return {
    'minecraft:digger': result,
  };
};
