import { DestructionParticlesComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateIntegerRange,
  validateNonEmptyString,
} from '../../../common/validation/content-validation';

const VALID_TINT_METHODS = [
  'none',
  'default_foliage',
  'birch_foliage',
  'evergreen_foliage',
  'dry_foliage',
  'grass',
  'water',
] as const;

/**
 * Creates a destruction_particles component for Minecraft blocks
 */
export const createDestructionParticles = (
  options?: DestructionParticlesComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:destruction_particles': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.texture !== undefined) {
    if (
      !validateNonEmptyString(
        options.texture,
        ctx,
        'Texture must be a non-empty string',
        'texture',
      )
    ) {
      return undefined;
    }
    result.texture = options.texture;
  }

  if (options.tintMethod !== undefined) {
    if (
      !validateAllowedValue(
        options.tintMethod,
        VALID_TINT_METHODS,
        ctx,
        'Tint method must be a valid tint method enum value',
        'tintMethod',
      )
    ) {
      return undefined;
    }
    result.tint_method = options.tintMethod;
  }

  if (options.particleCount !== undefined) {
    if (
      !validateIntegerRange(
        options.particleCount,
        0,
        255,
        ctx,
        'Particle count must be a number between 0 and 255',
        'particleCount',
      )
    ) {
      return undefined;
    }
    result.particle_count = options.particleCount;
  }

  return {
    'minecraft:destruction_particles': result,
  };
};
