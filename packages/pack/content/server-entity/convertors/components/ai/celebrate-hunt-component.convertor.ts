import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CelebrateHuntComponent } from '../../../interfaces/components/ai/celebrate-hunt-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a sound interval object
 * @param interval The interval to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the interval is valid
 */
const validateSoundInterval = (
  interval: number | [number, number] | { rangeMin: number; rangeMax: number },
  fieldName: string,
): boolean => {
  if (typeof interval === 'number') {
    if (!validateNumber(interval, `${fieldName}`, 0, Number.MAX_VALUE)) {
      return false;
    }
  } else if (Array.isArray(interval)) {
    if (interval.length !== 2) {
      console.error(`${fieldName} must be an array of two numbers`);

      return false;
    }
    if (
      !validateNumber(interval[0], `${fieldName}[0]`, 0, Number.MAX_VALUE) ||
      !validateNumber(interval[1], `${fieldName}[1]`, 0, Number.MAX_VALUE)
    ) {
      return false;
    }
  } else if (typeof interval === 'object') {
    if (
      !validateNumber(
        interval.rangeMin,
        `${fieldName}.rangeMin`,
        0,
        Number.MAX_VALUE,
      ) ||
      !validateNumber(
        interval.rangeMax,
        `${fieldName}.rangeMax`,
        0,
        Number.MAX_VALUE,
      )
    ) {
      return false;
    }
  } else {
    console.error(
      `${fieldName} must be a number, array of two numbers, or an object with rangeMin and rangeMax`,
    );

    return false;
  }
  return true;
};

/**
 * Converts a CelebrateHuntComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCelebrateHuntComponent = (
  component: Partial<CelebrateHuntComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:celebrate_hunt': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate broadcast
  if (component.broadcast !== undefined) {
    if (typeof component.broadcast !== 'boolean') {
      console.error('broadcast must be a boolean');

      return undefined;
    }
    result.broadcast = component.broadcast;
  }

  // Validate celebrationTargets
  if (component.celebrationTargets !== undefined) {
    // Filters are validated elsewhere
    result.celebration_targets = component.celebrationTargets;
  }

  // Validate celebrateSound
  if (component.celebrateSound !== undefined) {
    if (!validateString(component.celebrateSound, 'celebrateSound')) {
      return undefined;
    }
    result.celebrate_sound = component.celebrateSound;
  }

  // Validate duration
  if (component.duration !== undefined) {
    if (!validateNumber(component.duration, 'duration', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.duration = component.duration;
  }

  // Validate radius
  if (component.radius !== undefined) {
    if (!validateNumber(component.radius, 'radius', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.radius = component.radius;
  }

  // Validate soundInterval
  if (component.soundInterval !== undefined) {
    if (!validateSoundInterval(component.soundInterval, 'soundInterval')) {
      return undefined;
    }

    if (typeof component.soundInterval === 'number') {
      result.sound_interval = component.soundInterval;
    } else if (Array.isArray(component.soundInterval)) {
      result.sound_interval = component.soundInterval;
    } else {
      result.sound_interval = {
        range_min: component.soundInterval.rangeMin,
        range_max: component.soundInterval.rangeMax,
      };
    }
  }

  return {
    'minecraft:celebrate_hunt': result,
  };
};
