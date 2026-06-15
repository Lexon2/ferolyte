import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FloatTemptBehavior } from '../../interfaces/behaviors/float-tempt-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
  validateSoundEvent,
  validateStringArray,
} from '../common/validation';

/**
 * Converts a FloatTemptBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFloatTemptBehavior = (
  behavior: Partial<FloatTemptBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.float_tempt': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate canGetScared
  if (behavior.canGetScared !== undefined) {
    if (!validateBoolean(behavior.canGetScared, 'canGetScared')) {
      return undefined;
    }
    result.can_get_scared = behavior.canGetScared;
  }

  // Validate canTemptWhileRidden
  if (behavior.canTemptWhileRidden !== undefined) {
    if (!validateBoolean(behavior.canTemptWhileRidden, 'canTemptWhileRidden')) {
      return undefined;
    }
    result.can_tempt_while_ridden = behavior.canTemptWhileRidden;
  }

  // Validate canTemptVertically
  if (behavior.canTemptVertically !== undefined) {
    if (!validateBoolean(behavior.canTemptVertically, 'canTemptVertically')) {
      return undefined;
    }
    result.can_tempt_vertically = behavior.canTemptVertically;
  }

  // Validate items
  if (behavior.items !== undefined) {
    if (!validateStringArray(behavior.items, 'items')) {
      return undefined;
    }
    result.items = behavior.items;
  }

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    const convertedInterval = convertRange(
      behavior.soundInterval,
      'soundInterval',
    );
    if (!convertedInterval) {
      return undefined;
    }
    result.sound_interval = convertedInterval;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
  }

  // Validate temptSound
  if (behavior.temptSound !== undefined) {
    if (!validateSoundEvent(behavior.temptSound, 'temptSound')) {
      return undefined;
    }
    result.tempt_sound = behavior.temptSound;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  // Validate onStart
  if (behavior.onStart !== undefined) {
    const onStart = convertTrigger(
      behavior.onStart,
      withFieldPath(ctx, 'onStart'),
    );
    if (!onStart) {
      return undefined;
    }
    result.on_start = onStart;
  }

  // Validate onEnd
  if (behavior.onEnd !== undefined) {
    const onEnd = convertTrigger(behavior.onEnd, withFieldPath(ctx, 'onEnd'));
    if (!onEnd) {
      return undefined;
    }
    result.on_end = onEnd;
  }

  // Validate onTemptEnd
  if (behavior.onTemptEnd !== undefined) {
    const onTemptEnd = convertTrigger(
      behavior.onTemptEnd,
      withFieldPath(ctx, 'onTemptEnd'),
    );
    if (!onTemptEnd) {
      return undefined;
    }
    result.on_tempt_end = onTemptEnd;
  }

  return {
    'minecraft:behavior.float_tempt': result,
  };
};
