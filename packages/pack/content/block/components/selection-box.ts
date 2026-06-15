import { SelectionBoxComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateVector3 } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates a selection_box component for Minecraft blocks
 */
export const createSelectionBox = (
  options?: boolean | SelectionBoxComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:selection_box': boolean | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'boolean') {
    return {
      'minecraft:selection_box': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    const result: any = {};

    if (options.origin !== undefined) {
      if (
        !validateVector3(
          options.origin,
          ctx,
          'Origin must be a Vector3 array with 3 numeric values',
          'origin',
        )
      ) {
        return undefined;
      }
      result.origin = options.origin;
    }

    if (options.size !== undefined) {
      if (
        !validateVector3(
          options.size,
          ctx,
          'Size must be a Vector3 array with 3 numeric values',
          'size',
        )
      ) {
        return undefined;
      }
      result.size = options.size;
    }

    return {
      'minecraft:selection_box': result,
    };
  }

  logContentError(
    ctx,
    'Selection box must be a boolean or an object with valid properties',
  );
  return undefined;
};
