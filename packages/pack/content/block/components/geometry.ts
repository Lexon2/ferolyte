import { GeometryComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateNonEmptyString } from '@artifex/common/content/validation/content-validation';

/**
 * Creates a geometry component for Minecraft blocks
 */
export const createGeometry = (
  options?: string | GeometryComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:geometry': string | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'string') {
    if (
      !validateNonEmptyString(
        options,
        ctx,
        'Geometry identifier must be a non-empty string',
      )
    ) {
      return undefined;
    }
    return {
      'minecraft:geometry': options,
    };
  }

  if (typeof options === 'object' && options !== null) {
    if (
      !validateNonEmptyString(
        options.identifier,
        ctx,
        'Geometry identifier must be a non-empty string',
        'identifier',
      )
    ) {
      return undefined;
    }

    const result: any = {
      identifier: options.identifier,
    };

    if (options.boneVisibility) {
      const boneVisibility: Record<string, boolean | string> = {};

      for (const bone in options.boneVisibility) {
        const visibility = options.boneVisibility[bone];

        if (typeof visibility !== 'boolean' && typeof visibility !== 'string') {
          logContentError(
            ctx !== undefined
              ? { ...ctx, fieldPath: `boneVisibility.${bone}` }
              : undefined,
            'Bone visibility values must be booleans or valid expressions',
          );
          return undefined;
        }

        boneVisibility[bone] = visibility;
      }

      result.bone_visibility = boneVisibility;
    }

    if (options.culling !== undefined) {
      if (
        !validateNonEmptyString(
          options.culling,
          ctx,
          'Culling must be a non-empty string',
          'culling',
        )
      ) {
        return undefined;
      }
      result.culling = options.culling;
    }

    if (options.cullingLayer !== undefined) {
      if (
        !validateNonEmptyString(
          options.cullingLayer,
          ctx,
          'Culling layer must be a non-empty string',
          'cullingLayer',
        )
      ) {
        return undefined;
      }
      result.culling_layer = options.cullingLayer;
    }

    if (options.cullingShape !== undefined) {
      if (
        !validateNonEmptyString(
          options.cullingShape,
          ctx,
          'Culling shape must be a non-empty string',
          'cullingShape',
        )
      ) {
        return undefined;
      }
      result.culling_shape = options.cullingShape;
    }

    if (options.uvLock !== undefined) {
      if (typeof options.uvLock === 'boolean') {
        result.uv_lock = options.uvLock;
      } else if (
        Array.isArray(options.uvLock) &&
        options.uvLock.length > 0 &&
        options.uvLock.every((bone) => typeof bone === 'string')
      ) {
        result.uv_lock = options.uvLock;
      } else {
        logContentError(
          ctx !== undefined ? { ...ctx, fieldPath: 'uvLock' } : undefined,
          'UV lock must be a boolean or a non-empty string array',
        );
        return undefined;
      }
    }

    return {
      'minecraft:geometry': result,
    };
  }

  logContentError(
    ctx,
    'Geometry must be a string or an object with valid properties',
  );
  return undefined;
};
