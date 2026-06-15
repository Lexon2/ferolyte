import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TameableComponent } from '../../../interfaces/components/ai/tameable-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a TameableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTameableComponent = (
  component: Partial<TameableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:tameable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate probability
  if (component.probability !== undefined) {
    if (!validateNumber(component.probability, 'probability', 0, 1)) {
      return undefined;
    }
    result.probability = component.probability;
  }

  // Validate tameEvent
  if (component.tameEvent !== undefined) {
    const convertedTameEvent = convertTrigger(
      component.tameEvent,
      withFieldPath(ctx, 'tameEvent'),
    );
    if (!convertedTameEvent) {
      return undefined;
    }
    result.tame_event = convertedTameEvent;
  }

  // Validate tameItems
  if (component.tameItems !== undefined) {
    if (!Array.isArray(component.tameItems)) {
      console.error('tameItems must be an array');

      return undefined;
    }
    for (const item of component.tameItems) {
      if (typeof item !== 'string') {
        console.error('tameItems must be an array of strings');

        return undefined;
      }
    }
    result.tame_items = component.tameItems;
  }

  // Validate attemptTemperMod
  if (component.attemptTemperMod !== undefined) {
    if (
      !validateNumber(
        component.attemptTemperMod,
        'attemptTemperMod',
        0,
        Number.MAX_SAFE_INTEGER,
      )
    ) {
      return undefined;
    }
    result.attempt_temper_mod = component.attemptTemperMod;
  }

  // Validate minTemper
  if (component.minTemper !== undefined) {
    if (
      !validateNumber(
        component.minTemper,
        'minTemper',
        0,
        Number.MAX_SAFE_INTEGER,
      )
    ) {
      return undefined;
    }
    result.min_temper = component.minTemper;
  }

  // Validate maxTemper
  if (component.maxTemper !== undefined) {
    if (
      !validateNumber(
        component.maxTemper,
        'maxTemper',
        0,
        Number.MAX_SAFE_INTEGER,
      )
    ) {
      return undefined;
    }
    result.max_temper = component.maxTemper;
  }

  return {
    'minecraft:tameable': result,
  };
};
