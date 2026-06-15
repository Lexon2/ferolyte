import { ItemVisualComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '@ferolyte/common/content/validation/content-validation';

/**
 * Creates an item_visual component for Minecraft blocks
 */
export const createItemVisual = (
  options?: ItemVisualComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:item_visual': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options !== 'object' || options === null) {
    logContentError(ctx, 'Item visual must be an object with valid properties');
    return undefined;
  }

  const result: any = {};

  if (options.geometry === undefined) {
    logContentError(ctx, 'Geometry is required for item visual');
    return undefined;
  }

  if (typeof options.geometry === 'string') {
    if (
      !validateNonEmptyString(
        options.geometry,
        ctx,
        'Geometry identifier must be a non-empty string',
        'geometry',
      )
    ) {
      return undefined;
    }
    result.geometry = options.geometry;
  } else if (
    typeof options.geometry === 'object' &&
    options.geometry !== null
  ) {
    if (
      !validateNonEmptyString(
        options.geometry.identifier,
        ctx,
        'Geometry identifier must be a non-empty string',
        'geometry.identifier',
      )
    ) {
      return undefined;
    }

    const geometryObj: any = {
      identifier: options.geometry.identifier,
    };

    if (options.geometry.boneVisibility) {
      geometryObj.bone_visibility = {};
      for (const bone in options.geometry.boneVisibility) {
        geometryObj.bone_visibility[bone] =
          options.geometry.boneVisibility[bone];
      }
    }

    result.geometry = geometryObj;
  } else {
    logContentError(
      ctx,
      'Geometry must be a string or an object with valid properties',
    );
    return undefined;
  }

  if (options.materialInstances === undefined) {
    logContentError(ctx, 'Material instances are required for item visual');
    return undefined;
  }

  if (
    typeof options.materialInstances !== 'object' ||
    options.materialInstances === null
  ) {
    logContentError(
      ctx !== undefined
        ? { ...ctx, fieldPath: 'materialInstances' }
        : undefined,
      'Material instances must be an object',
    );
    return undefined;
  }

  const materialInstances: any = {};

  for (const face in options.materialInstances) {
    const material = options.materialInstances[face];

    if (typeof material === 'string') {
      materialInstances[face] = material;
    } else if (typeof material === 'object' && material !== null) {
      const materialObj: any = {};

      if (material.texture) {
        materialObj.texture = material.texture;
      }

      if (material.renderMethod !== undefined) {
        materialObj.render_method = material.renderMethod;
      }

      if (material.faceDimming !== undefined) {
        materialObj.face_dimming = material.faceDimming;
      }

      if (material.ambientOcclusion !== undefined) {
        materialObj.ambient_occlusion = material.ambientOcclusion;
      }

      materialInstances[face] = materialObj;
    }
  }

  result.material_instances = materialInstances;

  return {
    'minecraft:item_visual': result,
  };
};
