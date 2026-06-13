import { TransformationComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { validateVector3 } from '../../../common/validation/content-validation';

/**
 * Creates a transformation component for Minecraft blocks
 */
export const createTransformation = (
  options?: TransformationComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:transformation': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.rotation !== undefined) {
    if (
      !validateVector3(
        options.rotation,
        ctx,
        'Rotation must be a Vector3 array with 3 numeric values',
        'rotation',
      )
    ) {
      return undefined;
    }
    result.rotation = options.rotation;
  }

  if (options.translation !== undefined) {
    if (
      !validateVector3(
        options.translation,
        ctx,
        'Translation must be a Vector3 array with 3 numeric values',
        'translation',
      )
    ) {
      return undefined;
    }
    result.translation = options.translation;
  }

  if (options.scale !== undefined) {
    if (
      !validateVector3(
        options.scale,
        ctx,
        'Scale must be a Vector3 array with 3 numeric values',
        'scale',
      )
    ) {
      return undefined;
    }
    result.scale = options.scale;
  }

  if (options.scalePivot !== undefined) {
    if (
      !validateVector3(
        options.scalePivot,
        ctx,
        'Scale pivot must be a Vector3 array with 3 numeric values',
        'scalePivot',
      )
    ) {
      return undefined;
    }
    result.scale_pivot = options.scalePivot;
  }

  if (options.rotationPivot !== undefined) {
    if (
      !validateVector3(
        options.rotationPivot,
        ctx,
        'Rotation pivot must be a Vector3 array with 3 numeric values',
        'rotationPivot',
      )
    ) {
      return undefined;
    }
    result.rotation_pivot = options.rotationPivot;
  }

  return {
    'minecraft:transformation': result,
  };
};
