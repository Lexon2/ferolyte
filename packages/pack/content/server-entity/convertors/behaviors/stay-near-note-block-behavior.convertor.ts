import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { StayNearNoteBlockBehavior } from '../../interfaces/behaviors/stay-near-note-block-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a StayNearNoteBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertStayNearNoteBlockBehavior = (
  behavior: Partial<StayNearNoteBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.stay_near_noteblock': any } | undefined => {
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

  // Validate listenTime
  if (behavior.listenTime !== undefined) {
    if (!validateInteger(behavior.listenTime, 'listenTime')) {
      return undefined;
    }
    result.listen_time = behavior.listenTime;
  }

  // Validate speed
  if (behavior.speed !== undefined) {
    if (!validateNumber(behavior.speed, 'speed')) {
      return undefined;
    }
    result.speed = behavior.speed;
  }

  // Validate startDistance
  if (behavior.startDistance !== undefined) {
    if (!validateNumber(behavior.startDistance, 'startDistance')) {
      return undefined;
    }
    result.start_distance = behavior.startDistance;
  }

  // Validate stopDistance
  if (behavior.stopDistance !== undefined) {
    if (!validateNumber(behavior.stopDistance, 'stopDistance')) {
      return undefined;
    }
    result.stop_distance = behavior.stopDistance;
  }

  return {
    'minecraft:behavior.stay_near_noteblock': result
  };
};
