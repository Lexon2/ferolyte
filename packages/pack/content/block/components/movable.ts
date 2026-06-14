import { MovableComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_MOVEMENT_TYPES = ['push_pull', 'push', 'popped', 'immovable'] as const;
const VALID_STICKY = ['same', 'none'] as const;

/**
 * Creates a movable component for Minecraft blocks
 */
export const createMovable = (
  options?: MovableComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:movable': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      options.movementType,
      VALID_MOVEMENT_TYPES,
      ctx,
      'Movement type must be "push_pull", "push", "popped", or "immovable"',
      'movementType',
    )
  ) {
    return undefined;
  }

  const result: any = {
    movement_type: options.movementType,
  };

  if (options.sticky !== undefined) {
    if (
      !validateAllowedValue(
        options.sticky,
        VALID_STICKY,
        ctx,
        'Sticky must be "same" or "none"',
        'sticky',
      )
    ) {
      return undefined;
    }
    result.sticky = options.sticky;
  }

  return {
    'minecraft:movable': result,
  };
};
