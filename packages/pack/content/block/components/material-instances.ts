import { MaterialInstancesComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateNonEmptyString,
} from '@ferolyte/common/content/validation/content-validation';

type RenderMethod =
  | 'opaque'
  | 'double_sided'
  | 'blend'
  | 'alpha_test'
  | 'alpha_test_single_sided'
  | 'blend_to_opaque'
  | 'alpha_test_to_opaque'
  | 'alpha_test_single_sided_to_opaque';

const VALID_RENDER_METHODS: RenderMethod[] = [
  'opaque',
  'double_sided',
  'blend',
  'alpha_test',
  'alpha_test_single_sided',
  'blend_to_opaque',
  'alpha_test_to_opaque',
  'alpha_test_single_sided_to_opaque',
];

/**
 * Creates a material_instances component for Minecraft blocks
 */
export const createMaterialInstances = (
  options?: MaterialInstancesComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:material_instances': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options !== 'object' || options === null) {
    logContentError(
      ctx,
      'Material instances must be an object mapping faces to materials',
    );
    return undefined;
  }

  const result: any = {};

  for (const face in options) {
    const material = options[face];
    const faceContext =
      ctx !== undefined ? { ...ctx, fieldPath: face } : undefined;

    if (typeof material === 'string') {
      if (
        !validateNonEmptyString(
          material,
          faceContext,
          `Material texture for face "${face}" must be a non-empty string`,
        )
      ) {
        return undefined;
      }
      result[face] = material;
      continue;
    }

    if (typeof material === 'object' && material !== null) {
      const materialObj: any = {};

      if (material.texture !== undefined) {
        if (
          !validateNonEmptyString(
            material.texture,
            faceContext,
            `Texture for face "${face}" must be a non-empty string`,
            'texture',
          )
        ) {
          return undefined;
        }
        materialObj.texture = material.texture;
      }

      if (material.renderMethod !== undefined) {
        if (
          !validateAllowedValue(
            material.renderMethod,
            VALID_RENDER_METHODS,
            faceContext,
            `Render method for face "${face}" must be a valid render method`,
            'renderMethod',
          )
        ) {
          return undefined;
        }
        materialObj.render_method = material.renderMethod;
      }

      if (material.faceDimming !== undefined) {
        if (
          !validateBooleanValue(
            material.faceDimming,
            faceContext,
            `Face dimming for face "${face}" must be a boolean`,
            'faceDimming',
          )
        ) {
          return undefined;
        }
        materialObj.face_dimming = material.faceDimming;
      }

      if (material.ambientOcclusion !== undefined) {
        if (
          typeof material.ambientOcclusion !== 'boolean' &&
          typeof material.ambientOcclusion !== 'number'
        ) {
          logContentError(
            faceContext !== undefined
              ? { ...faceContext, fieldPath: 'ambientOcclusion' }
              : undefined,
            `Ambient occlusion for face "${face}" must be a boolean or number`,
          );
          return undefined;
        }
        materialObj.ambient_occlusion = material.ambientOcclusion;
      }

      if (material.isotropic !== undefined) {
        if (
          !validateBooleanValue(
            material.isotropic,
            faceContext,
            `Isotropic for face "${face}" must be a boolean`,
            'isotropic',
          )
        ) {
          return undefined;
        }
        materialObj.isotropic = material.isotropic;
      }

      if (material.tintMethod !== undefined) {
        if (
          !validateNonEmptyString(
            material.tintMethod,
            faceContext,
            `Tint method for face "${face}" must be a non-empty string`,
            'tintMethod',
          )
        ) {
          return undefined;
        }
        materialObj.tint_method = material.tintMethod;
      }

      if (material.alphaMaskedTint !== undefined) {
        if (
          !validateBooleanValue(
            material.alphaMaskedTint,
            faceContext,
            `Alpha masked tint for face "${face}" must be a boolean`,
            'alphaMaskedTint',
          )
        ) {
          return undefined;
        }
        materialObj.alpha_masked_tint = material.alphaMaskedTint;
      }

      result[face] = materialObj;
    }
  }

  return {
    'minecraft:material_instances': result,
  };
};
