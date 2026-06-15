import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  SendEventBehavior,
  EventChoice,
  EventStep,
} from '../../interfaces/behaviors/send-event-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateNumber,
  validateBoolean,
  validateHexColor,
  validateSoundEvent,
  validateString,
} from '../common/validation';

/**
 * Converts an EventStep to Minecraft format
 * @param step The step to convert
 * @returns The step in Minecraft format or undefined if validation fails
 */
const convertEventStep = (step: EventStep): any | undefined => {
  const convertedStep: any = {};

  if (step.baseDelay !== undefined) {
    if (!validateNumber(step.baseDelay, 'baseDelay')) {
      return undefined;
    }
    convertedStep.base_delay = step.baseDelay;
  }

  if (step.event !== undefined) {
    if (!validateString(step.event, 'event')) {
      return undefined;
    }
    convertedStep.event = step.event;
  }

  if (step.soundEvent !== undefined) {
    if (!validateSoundEvent(step.soundEvent, 'soundEvent')) {
      return undefined;
    }
    convertedStep.sound_event = step.soundEvent;
  }

  return convertedStep;
};

/**
 * Converts an EventChoice to Minecraft format
 * @param choice The choice to convert
 * @returns The choice in Minecraft format or undefined if validation fails
 */
const convertEventChoice = (
  choice: EventChoice,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  const convertedChoice: any = {};

  if (choice.minActivationRange !== undefined) {
    if (!validateNumber(choice.minActivationRange, 'minActivationRange')) {
      return undefined;
    }
    convertedChoice.min_activation_range = choice.minActivationRange;
  }

  if (choice.maxActivationRange !== undefined) {
    if (!validateNumber(choice.maxActivationRange, 'maxActivationRange')) {
      return undefined;
    }
    convertedChoice.max_activation_range = choice.maxActivationRange;
  }

  if (choice.cooldownTime !== undefined) {
    if (!validateNumber(choice.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    convertedChoice.cooldown_time = choice.cooldownTime;
  }

  if (choice.castDuration !== undefined) {
    if (!validateNumber(choice.castDuration, 'castDuration')) {
      return undefined;
    }
    convertedChoice.cast_duration = choice.castDuration;
  }

  if (choice.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      choice.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    convertedChoice.filters = convertedFilters;
  }

  if (choice.particleColor !== undefined) {
    if (!validateHexColor(choice.particleColor, 'particleColor')) {
      return undefined;
    }
    convertedChoice.particle_color = choice.particleColor;
  }

  if (choice.weight !== undefined) {
    if (!validateNumber(choice.weight, 'weight')) {
      return undefined;
    }
    convertedChoice.weight = choice.weight;
  }

  if (choice.startSoundEvent !== undefined) {
    if (!validateSoundEvent(choice.startSoundEvent, 'startSoundEvent')) {
      return undefined;
    }
    convertedChoice.start_sound_event = choice.startSoundEvent;
  }

  if (choice.sequence !== undefined) {
    if (!Array.isArray(choice.sequence)) {
      return undefined;
    }
    const convertedSequence = choice.sequence.map(convertEventStep);
    if (convertedSequence.some((step) => step === undefined)) {
      return undefined;
    }
    convertedChoice.sequence = convertedSequence;
  }

  return convertedChoice;
};

/**
 * Converts a SendEventBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSendEventBehavior = (
  behavior: Partial<SendEventBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.send_event': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate castDuration
  if (behavior.castDuration !== undefined) {
    if (!validateNumber(behavior.castDuration, 'castDuration')) {
      return undefined;
    }
    result.cast_duration = behavior.castDuration;
  }

  // Validate lookAtTarget
  if (behavior.lookAtTarget !== undefined) {
    if (!validateBoolean(behavior.lookAtTarget, 'lookAtTarget')) {
      return undefined;
    }
    result.look_at_target = behavior.lookAtTarget;
  }

  // Validate eventChoices
  if (behavior.eventChoices !== undefined) {
    if (!Array.isArray(behavior.eventChoices)) {
      return undefined;
    }
    const convertedChoices = behavior.eventChoices.map((choice, index) =>
      convertEventChoice(choice, withFieldPath(ctx, `eventChoices[${index}]`)),
    );
    if (convertedChoices.some((choice) => choice === undefined)) {
      return undefined;
    }
    result.event_choices = convertedChoices;
  }

  // Validate sequence
  if (behavior.sequence !== undefined) {
    if (!Array.isArray(behavior.sequence)) {
      return undefined;
    }
    const convertedSequence = behavior.sequence.map(convertEventStep);
    if (convertedSequence.some((step) => step === undefined)) {
      return undefined;
    }
    result.sequence = convertedSequence;
  }

  return {
    'minecraft:behavior.send_event': result,
  };
};
