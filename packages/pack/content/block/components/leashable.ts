import { LeashableComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateVector3 } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a leashable component for Minecraft blocks
 */
export const createLeashable = (
  options?: LeashableComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:leashable': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.offset !== undefined) {
    if (
      !validateVector3(
        options.offset,
        ctx,
        'Offset must be a Vector3 array with 3 numeric values',
        'offset',
      )
    ) {
      return undefined;
    }
    result.offset = options.offset;
  }

  return {
    'minecraft:leashable': result,
  };
};
