import { MaterialInstancesComponent } from '../interfaces/block-config';

type RenderMethod =
  | 'opaque'
  | 'double_sided'
  | 'blend'
  | 'alpha_test'
  | 'alpha_test_single_sided'
  | 'blend_to_opaque'
  | 'alpha_test_to_opaque'
  | 'alpha_test_single_sided_to_opaque';

/**
 * Creates a material_instances component for Minecraft blocks
 * @param options The material instances mapping by face
 * @returns The material_instances component in Minecraft format or undefined if validation fails
 */
export const createMaterialInstances = (
  options?: MaterialInstancesComponent,
): { 'minecraft:material_instances': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options !== 'object' || options === null) {
    // @TODO: Add error handling
    console.error(
      'Material instances must be an object mapping faces to materials',
    );

    return undefined;
  }

  const result: any = {};

  for (const face in options) {
    const material = options[face];

    // Handle simple string texture reference
    if (typeof material === 'string') {
      if (material.length === 0) {
        // @TODO: Add error handling
        console.error(
          `Material texture for face "${face}" must be a non-empty string`,
        );

        return undefined;
      }
      result[face] = material;
      continue;
    }

    // Handle detailed material specifications
    if (typeof material === 'object' && material !== null) {
      const materialObj: any = {};

      if (material.texture !== undefined) {
        if (
          typeof material.texture !== 'string' ||
          material.texture.length === 0
        ) {
          // @TODO: Add error handling
          console.error(
            `Texture for face "${face}" must be a non-empty string`,
          );

          return undefined;
        }
        materialObj.texture = material.texture;
      }

      if (material.renderMethod !== undefined) {
        const validRenderMethods: RenderMethod[] = [
          'opaque',
          'double_sided',
          'blend',
          'alpha_test',
          'alpha_test_single_sided',
          'blend_to_opaque',
          'alpha_test_to_opaque',
          'alpha_test_single_sided_to_opaque',
        ];

        if (!validRenderMethods.includes(material.renderMethod)) {
          // @TODO: Add error handling
          console.error(
            `Render method for face "${face}" must be a valid render method`,
          );

          return undefined;
        }
        materialObj.render_method = material.renderMethod;
      }

      if (material.faceDimming !== undefined) {
        if (typeof material.faceDimming !== 'boolean') {
          // @TODO: Add error handling
          console.error(`Face dimming for face "${face}" must be a boolean`);

          return undefined;
        }
        materialObj.face_dimming = material.faceDimming;
      }

      if (material.ambientOcclusion !== undefined) {
        if (
          typeof material.ambientOcclusion !== 'boolean' &&
          typeof material.ambientOcclusion !== 'number'
        ) {
          // @TODO: Add error handling
          console.error(
            `Ambient occlusion for face "${face}" must be a boolean or number`,
          );

          return undefined;
        }
        materialObj.ambient_occlusion = material.ambientOcclusion;
      }

      if (material.isotropic !== undefined) {
        if (typeof material.isotropic !== 'boolean') {
          // @TODO: Add error handling
          console.error(`Isotropic for face "${face}" must be a boolean`);

          return undefined;
        }
        materialObj.isotropic = material.isotropic;
      }

      if (material.tintMethod !== undefined) {
        if (
          typeof material.tintMethod !== 'string' ||
          material.tintMethod.length === 0
        ) {
          // @TODO: Add error handling
          console.error(
            `Tint method for face "${face}" must be a non-empty string`,
          );

          return undefined;
        }
        materialObj.tint_method = material.tintMethod;
      }

      if (material.alphaMaskedTint !== undefined) {
        if (typeof material.alphaMaskedTint !== 'boolean') {
          console.error(`Alpha masked tint for face "${face}" must be a boolean`);

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
