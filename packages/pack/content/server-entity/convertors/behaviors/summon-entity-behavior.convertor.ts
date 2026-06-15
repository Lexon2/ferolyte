import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ENTITY_EVENT_TARGETS } from '../../constants/event-target';
import {
  SummonEntityBehavior,
  SummonChoice,
  SummonSequence,
} from '../../interfaces/behaviors/summon-entity-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import {
  validateNumber,
  validateBoolean,
  validateSoundEvent,
  validateHexColor,
  validateInteger,
  validateString,
} from '../common/validation';

/**
 * Converts a SummonSequence to Minecraft format
 * @param sequence The sequence to convert
 * @returns The sequence in Minecraft format or undefined if validation fails
 */
const convertSummonSequence = (
  sequence: Partial<SummonSequence>,
): any | undefined => {
  if (!sequence) {
    return undefined;
  }

  const result: any = {};

  // Validate delay
  if (sequence.delay !== undefined) {
    if (!validateNumber(sequence.delay, 'delay')) {
      return undefined;
    }
    result.delay = sequence.delay;
  }

  // Validate delayPerSummon
  if (sequence.delayPerSummon !== undefined) {
    if (!validateNumber(sequence.delayPerSummon, 'delayPerSummon')) {
      return undefined;
    }
    result.delay_per_summon = sequence.delayPerSummon;
  }

  // Validate entityLifespan
  if (sequence.entityLifespan !== undefined) {
    if (!validateNumber(sequence.entityLifespan, 'entityLifespan')) {
      return undefined;
    }
    result.entity_lifespan = sequence.entityLifespan;
  }

  // Validate baseDelay
  if (sequence.baseDelay !== undefined) {
    if (!validateNumber(sequence.baseDelay, 'baseDelay')) {
      return undefined;
    }
    result.base_delay = sequence.baseDelay;
  }

  // Validate entityType
  if (sequence.entityType !== undefined) {
    if (!validateString(sequence.entityType, 'entityType')) {
      return undefined;
    }
    result.entity_type = sequence.entityType;
  }

  // Validate numEntitiesSpawned
  if (sequence.numEntitiesSpawned !== undefined) {
    if (!validateNumber(sequence.numEntitiesSpawned, 'numEntitiesSpawned')) {
      return undefined;
    }
    result.num_entities_spawned = sequence.numEntitiesSpawned;
  }

  // Validate shape
  if (sequence.shape !== undefined) {
    if (
      !validateString(sequence.shape, 'shape') ||
      !['line', 'circle'].includes(sequence.shape)
    ) {
      return undefined;
    }
    result.shape = sequence.shape;
  }

  // Validate size
  if (sequence.size !== undefined) {
    if (!validateNumber(sequence.size, 'size')) {
      return undefined;
    }
    result.size = sequence.size;
  }

  // Validate soundEvent
  if (sequence.soundEvent !== undefined) {
    if (!validateSoundEvent(sequence.soundEvent, 'soundEvent')) {
      return undefined;
    }
    result.sound_event = sequence.soundEvent;
  }

  // Validate summonCap
  if (sequence.summonCap !== undefined) {
    if (!validateInteger(sequence.summonCap, 'summonCap')) {
      return undefined;
    }
    result.summon_cap = sequence.summonCap;
  }

  // Validate summonCapRadius
  if (sequence.summonCapRadius !== undefined) {
    if (!validateNumber(sequence.summonCapRadius, 'summonCapRadius')) {
      return undefined;
    }
    result.summon_cap_radius = sequence.summonCapRadius;
  }

  // Validate summonEvent
  if (sequence.summonEvent !== undefined) {
    if (!validateString(sequence.summonEvent, 'summonEvent')) {
      return undefined;
    }
    result.summon_event = sequence.summonEvent;
  }

  // Validate target
  if (sequence.target !== undefined) {
    if (!ENTITY_EVENT_TARGETS.includes(sequence.target)) {
      return undefined;
    }
    result.target = sequence.target;
  }

  return result;
};

/**
 * Converts a SummonChoice to Minecraft format
 * @param choice The choice to convert
 * @returns The choice in Minecraft format or undefined if validation fails
 */
const convertSummonChoice = (
  choice: Partial<SummonChoice>,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!choice) {
    return undefined;
  }

  const result: any = {};

  // Validate castDuration
  if (choice.castDuration !== undefined) {
    if (!validateNumber(choice.castDuration, 'castDuration')) {
      return undefined;
    }
    result.cast_duration = choice.castDuration;
  }

  // Validate cooldownTime
  if (choice.cooldownTime !== undefined) {
    if (!validateNumber(choice.cooldownTime, 'cooldownTime')) {
      return undefined;
    }
    result.cooldown_time = choice.cooldownTime;
  }

  // Validate doCasting
  if (choice.doCasting !== undefined) {
    if (!validateBoolean(choice.doCasting, 'doCasting')) {
      return undefined;
    }
    result.do_casting = choice.doCasting;
  }

  // Validate filters
  if (choice.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      choice.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate maxActivationRange
  if (choice.maxActivationRange !== undefined) {
    if (!validateNumber(choice.maxActivationRange, 'maxActivationRange')) {
      return undefined;
    }
    result.max_activation_range = choice.maxActivationRange;
  }

  // Validate minActivationRange
  if (choice.minActivationRange !== undefined) {
    if (!validateNumber(choice.minActivationRange, 'minActivationRange')) {
      return undefined;
    }
    result.min_activation_range = choice.minActivationRange;
  }

  // Validate particleColor
  if (choice.particleColor !== undefined) {
    if (
      !validateHexColor(choice.particleColor, 'particleColor') ||
      !validateInteger(choice.particleColor, 'particleCount')
    ) {
      return undefined;
    }
    result.particle_color = choice.particleColor;
  }

  // Validate sequence
  if (choice.sequence !== undefined) {
    const convertedSequence = choice.sequence
      .map(convertSummonSequence)
      .filter(Boolean);
    if (convertedSequence.length !== choice.sequence.length) {
      return undefined;
    }
    result.sequence = convertedSequence;
  }

  // Validate startSoundEvent
  if (choice.startSoundEvent !== undefined) {
    if (!validateSoundEvent(choice.startSoundEvent, 'startSoundEvent')) {
      return undefined;
    }
    result.start_sound_event = choice.startSoundEvent;
  }

  // Validate weight
  if (choice.weight !== undefined) {
    if (!validateNumber(choice.weight, 'weight')) {
      return undefined;
    }
    result.weight = choice.weight;
  }

  return result;
};

/**
 * Converts a SummonEntityBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSummonEntityBehavior = (
  behavior: Partial<SummonEntityBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.summon_entity': any } | undefined => {
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

  // Validate summonChoices
  if (behavior.summonChoices !== undefined) {
    const convertedChoices = behavior.summonChoices
      .map((choice, index) =>
        convertSummonChoice(
          choice,
          withFieldPath(ctx, `summonChoices[${index}]`),
        ),
      )
      .filter(Boolean);
    if (convertedChoices.length !== behavior.summonChoices.length) {
      return undefined;
    }
    result.summon_choices = convertedChoices;
  }

  return {
    'minecraft:behavior.summon_entity': result,
  };
};
