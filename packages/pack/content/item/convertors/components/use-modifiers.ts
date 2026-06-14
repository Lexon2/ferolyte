import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonNegativeNumber,
  validateNumber,
  validateString,
} from '@artifex/common/content/validation/content-validation';

interface UseModifiersOptions {
  useDuration: number;
  movementModifier?: number;
  emitVibrations?: boolean;
  startSound?: string;
}

/**
 * Creates a use_modifiers component for Minecraft items
 * @param options The use modifiers options
 * @returns The use_modifiers component in Minecraft format or undefined if validation fails
 */
export const createUseModifiers = (
  options?: UseModifiersOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:use_modifiers': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNonNegativeNumber(
      options.useDuration,
      ctx,
      'Use duration must be a positive number',
      'useDuration',
    )
  ) {
    return undefined;
  }

  const result: any = {
    use_duration: options.useDuration,
  };

  if (options.movementModifier !== undefined) {
    if (
      !validateNumber(
        options.movementModifier,
        ctx,
        'Movement modifier must be a number',
        'movementModifier',
      )
    ) {
      return undefined;
    }
    result.movement_modifier = options.movementModifier;
  }

  if (options.emitVibrations !== undefined) {
    if (
      !validateBooleanValue(
        options.emitVibrations,
        ctx,
        'Emit vibrations must be a boolean',
        'emitVibrations',
      )
    ) {
      return undefined;
    }
    result.emit_vibrations = options.emitVibrations;
  }

  if (options.startSound !== undefined) {
    if (
      !validateString(
        options.startSound,
        ctx,
        'Start sound must be a string',
        'startSound',
      )
    ) {
      return undefined;
    }
    result.start_sound = options.startSound;
  }

  return {
    'minecraft:use_modifiers': result,
  };
};
