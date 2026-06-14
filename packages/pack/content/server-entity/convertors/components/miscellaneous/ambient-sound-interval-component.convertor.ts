import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AmbientSoundIntervalComponent } from '../../../interfaces/components/miscellaneous/ambient-sound-interval-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates an event name object
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateEventName = (
  value: { condition?: string; eventName?: string },
  fieldName: string,
): boolean => {
  if (value.condition !== undefined) {
    if (!validateString(value.condition, `${fieldName}.condition`)) {
      return false;
    }
  }
  if (value.eventName !== undefined) {
    if (!validateString(value.eventName, `${fieldName}.eventName`)) {
      return false;
    }
  }
  return true;
};

/**
 * Converts an AmbientSoundIntervalComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAmbientSoundIntervalComponent = (
  component: Partial<AmbientSoundIntervalComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:ambient_sound_interval': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate eventName
  if (component.eventName !== undefined) {
    if (!validateString(component.eventName, 'eventName')) {
      return undefined;
    }
    result.event_name = component.eventName;
  }

  // Validate eventNames
  if (component.eventNames !== undefined) {
    if (!Array.isArray(component.eventNames)) {
      console.error('eventNames must be an array');

      return undefined;
    }
    for (const eventName of component.eventNames) {
      if (!validateEventName(eventName, 'eventNames item')) {
        return undefined;
      }
    }
    result.event_names = component.eventNames;
  }

  // Validate range
  if (component.range !== undefined) {
    if (!validateNumber(component.range, 'range', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.range = component.range;
  }

  // Validate value
  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:ambient_sound_interval': result,
  };
};
