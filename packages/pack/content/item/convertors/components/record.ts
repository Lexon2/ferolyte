import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateIntegerRange,
  validatePositiveNumber,
} from '@artifex/common/content/validation/content-validation';

const VALID_SOUND_EVENTS = [
  '13',
  'cat',
  'blocks',
  'chirp',
  'far',
  'mall',
  'mellohi',
  'stal',
  'strad',
  'ward',
  '11',
  'wait',
  'pigstep',
  'otherside',
  '5',
  'relic',
] as const;

interface RecordOptions {
  soundEvent: string;
  comparatorSignal?: number;
  duration?: number;
}

/**
 * Creates a record component for Minecraft items
 * @param options The record options
 * @returns The record component in Minecraft format or undefined if validation fails
 */
export const createRecord = (
  options?: RecordOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:record': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      options.soundEvent,
      VALID_SOUND_EVENTS,
      ctx,
      `Sound event must be one of: ${VALID_SOUND_EVENTS.join(', ')}`,
      'soundEvent',
    )
  ) {
    return undefined;
  }

  const result: any = {
    sound_event: options.soundEvent,
  };

  if (options.comparatorSignal !== undefined) {
    if (
      !validateIntegerRange(
        options.comparatorSignal,
        0,
        13,
        ctx,
        'Comparator signal must be a number between 0 and 15',
        'comparatorSignal',
      )
    ) {
      return undefined;
    }
    result.comparator_signal = options.comparatorSignal;
  }

  if (options.duration !== undefined) {
    if (
      !validatePositiveNumber(
        options.duration,
        ctx,
        'Duration must be a positive number',
        'duration',
      )
    ) {
      return undefined;
    }
    result.duration = options.duration;
  }

  return {
    'minecraft:record': result,
  };
};
