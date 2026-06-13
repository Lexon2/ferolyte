import { DestructionParticlesComponent } from '../interfaces/block-config';

/**
 * Creates a destruction_particles component for Minecraft blocks
 * @param options The destruction particles options
 * @returns The destruction_particles component in Minecraft format or undefined if validation fails
 */
export const createDestructionParticles = (
  options?: DestructionParticlesComponent,
): { 'minecraft:destruction_particles': any } | undefined => {
  if (!options) {
    // Empty component is valid for destruction_particles
    return undefined;
  }

  const result: any = {};

  // Validate and add texture
  if (options.texture !== undefined) {
    if (typeof options.texture !== 'string' || options.texture.length === 0) {
      // @TODO: Add error handling
      console.error('Texture must be a non-empty string');

      return undefined;
    }
    result.texture = options.texture;
  }

  // Validate and add tint_method
  if (options.tintMethod !== undefined) {
    const validTintMethods = [
      'none',
      'default_foliage',
      'birch_foliage',
      'evergreen_foliage',
      'dry_foliage',
      'grass',
      'water',
    ];
    if (!validTintMethods.includes(options.tintMethod)) {
      console.error('Tint method must be a valid tint method enum value');

      return undefined;
    }
    result.tint_method = options.tintMethod;
  }

  if (options.particleCount !== undefined) {
    if (
      typeof options.particleCount !== 'number' ||
      options.particleCount < 0 ||
      options.particleCount > 255
    ) {
      console.error('Particle count must be a number between 0 and 255');

      return undefined;
    }
    result.particle_count = options.particleCount;
  }

  return {
    'minecraft:destruction_particles': result,
  };
};
