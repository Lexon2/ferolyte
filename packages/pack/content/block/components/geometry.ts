import { GeometryComponent } from '../interfaces/block-config';

/**
 * Creates a geometry component for Minecraft blocks
 * @param options The geometry identifier string or options object
 * @returns The geometry component in Minecraft format or undefined if validation fails
 */
export const createGeometry = (
  options?: string | GeometryComponent,
): { 'minecraft:geometry': string | any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  // Handle string case (identifier only)
  if (typeof options === 'string') {
    if (options.length === 0) {
      // @TODO: Add error handling
      console.error('Geometry identifier must be a non-empty string');

      return undefined;
    }
    return {
      'minecraft:geometry': options,
    };
  }

  // Handle object case
  if (typeof options === 'object' && options !== null) {
    if (
      typeof options.identifier !== 'string' ||
      options.identifier.length === 0
    ) {
      // @TODO: Add error handling
      console.error('Geometry identifier must be a non-empty string');

      return undefined;
    }

    const result: any = {
      identifier: options.identifier,
    };

    // Validate and add bone_visibility
    if (options.boneVisibility) {
      const boneVisibility: Record<string, boolean | string> = {};

      for (const bone in options.boneVisibility) {
        const visibility = options.boneVisibility[bone];

        if (typeof visibility !== 'boolean' && typeof visibility !== 'string') {
          // @TODO: Add error handling
          console.error(
            'Bone visibility values must be booleans or valid expressions',
          );

          return undefined;
        }

        boneVisibility[bone] = visibility;
      }

      result.bone_visibility = boneVisibility;
    }

    // Validate and add culling
    if (options.culling !== undefined) {
      if (typeof options.culling !== 'string' || options.culling.length === 0) {
        // @TODO: Add error handling
        console.error('Culling must be a non-empty string');

        return undefined;
      }
      result.culling = options.culling;
    }

    // Validate and add culling_layer
    if (options.cullingLayer !== undefined) {
      if (
        typeof options.cullingLayer !== 'string' ||
        options.cullingLayer.length === 0
      ) {
        // @TODO: Add error handling
        console.error('Culling layer must be a non-empty string');

        return undefined;
      }
      result.culling_layer = options.cullingLayer;
    }

    if (options.cullingShape !== undefined) {
      if (
        typeof options.cullingShape !== 'string' ||
        options.cullingShape.length === 0
      ) {
        console.error('Culling shape must be a non-empty string');

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
        console.error('UV lock must be a boolean or a non-empty string array');

        return undefined;
      }
    }

    return {
      'minecraft:geometry': result,
    };
  }

  // @TODO: Add error handling
  console.error('Geometry must be a string or an object with valid properties');

  return undefined;
};
