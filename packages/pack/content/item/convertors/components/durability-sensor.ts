import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateNonEmptyString,
  validateNonNegativeNumber,
} from '@ferolyte/common/content/validation/content-validation';

interface DurabilitySensorOptions {
  durability?: number;
  particleType?: string;
  soundEvent?: string;
}

/**
 * Creates a durability_sensor component for Minecraft items
 * @param options The durability sensor options
 * @returns The durability_sensor component in Minecraft format or undefined if validation fails
 */
export const createDurabilitySensor = (
  options?: DurabilitySensorOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:durability_sensor': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (options.durability !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.durability,
        ctx,
        'Durability must be a non-negative number',
        'durability',
      )
    ) {
      return undefined;
    }
    result.durability = options.durability;
  }

  if (options.particleType !== undefined) {
    if (
      !validateNonEmptyString(
        options.particleType,
        ctx,
        'Particle type must be a non-empty string',
        'particleType',
      )
    ) {
      return undefined;
    }
    result.particle_type = options.particleType;
  }

  if (options.soundEvent !== undefined) {
    if (
      !validateNonEmptyString(
        options.soundEvent,
        ctx,
        'Sound event must be a non-empty string',
        'soundEvent',
      )
    ) {
      return undefined;
    }
    result.sound_event = options.soundEvent;
  }

  return {
    'minecraft:durability_sensor': result,
  };
};
