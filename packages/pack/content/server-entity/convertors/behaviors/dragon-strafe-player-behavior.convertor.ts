import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DragonStrafePlayerBehavior } from '../../interfaces/behaviors/dragon-strafe-player-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a DragonStrafePlayerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDragonStrafePlayerBehavior = (
  behavior: Partial<DragonStrafePlayerBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.dragonstrafeplayer': any } | undefined => {
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

  // Validate activeSpeed
  if (behavior.activeSpeed !== undefined) {
    if (!validateNumber(behavior.activeSpeed, 'activeSpeed')) {
      return undefined;
    }
    result.active_speed = behavior.activeSpeed;
  }

  // Validate fireballRange
  if (behavior.fireballRange !== undefined) {
    if (!validateNumber(behavior.fireballRange, 'fireballRange')) {
      return undefined;
    }
    result.fireball_range = behavior.fireballRange;
  }

  // Validate flightSpeed
  if (behavior.flightSpeed !== undefined) {
    if (!validateNumber(behavior.flightSpeed, 'flightSpeed')) {
      return undefined;
    }
    result.flight_speed = behavior.flightSpeed;
  }

  // Validate switchDirectionProbability
  if (behavior.switchDirectionProbability !== undefined) {
    if (
      !validateNumber(
        behavior.switchDirectionProbability,
        'switchDirectionProbability',
      )
    ) {
      return undefined;
    }
    result.switch_direction_probability = behavior.switchDirectionProbability;
  }

  // Validate targetInRangeAndInViewTime
  if (behavior.targetInRangeAndInViewTime !== undefined) {
    if (
      !validateNumber(
        behavior.targetInRangeAndInViewTime,
        'targetInRangeAndInViewTime',
      )
    ) {
      return undefined;
    }
    result.target_in_range_and_in_view_time =
      behavior.targetInRangeAndInViewTime;
  }

  // Validate targetZone
  if (behavior.targetZone !== undefined) {
    if (
      !Array.isArray(behavior.targetZone) ||
      behavior.targetZone.length !== 2 ||
      !behavior.targetZone.every((n) => validateNumber(n, 'targetZone'))
    ) {
      console.error('targetZone must be an array of exactly 2 numbers');

      return undefined;
    }
    result.target_zone = behavior.targetZone;
  }

  // Validate turnSpeed
  if (behavior.turnSpeed !== undefined) {
    if (!validateNumber(behavior.turnSpeed, 'turnSpeed')) {
      return undefined;
    }
    result.turn_speed = behavior.turnSpeed;
  }

  // Validate viewAngle
  if (behavior.viewAngle !== undefined) {
    if (!validateNumber(behavior.viewAngle, 'viewAngle')) {
      return undefined;
    }
    result.view_angle = behavior.viewAngle;
  }

  return {
    'minecraft:behavior.dragonstrafeplayer': result,
  };
};
