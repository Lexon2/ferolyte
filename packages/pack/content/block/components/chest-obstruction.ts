import { ChestObstructionComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_OBSTRUCTION_RULES = ['always', 'never', 'shape'] as const;

/**
 * Creates a chest_obstruction component for Minecraft blocks
 */
export const createChestObstruction = (
  options?: ChestObstructionComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:chest_obstruction': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.obstructionRule !== undefined) {
    if (
      !validateAllowedValue(
        options.obstructionRule,
        VALID_OBSTRUCTION_RULES,
        ctx,
        'Obstruction rule must be "always", "never", or "shape"',
        'obstructionRule',
      )
    ) {
      return undefined;
    }
    result.obstruction_rule = options.obstructionRule;
  }

  return {
    'minecraft:chest_obstruction': result,
  };
};
