import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FloatWanderBehavior } from '../../interfaces/behaviors/float-wander-behavior';
import { convertRange } from '../common/convertors';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
} from '../common/validation';

/**
 * Converts a FloatWanderBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFloatWanderBehavior = (
  behavior: Partial<FloatWanderBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.float_wander': any } | undefined => {
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

  // Validate additionalCollisionBuffer
  if (behavior.additionalCollisionBuffer !== undefined) {
    if (
      !validateBoolean(
        behavior.additionalCollisionBuffer,
        'additionalCollisionBuffer',
      )
    ) {
      return undefined;
    }
    result.additional_collision_buffer = behavior.additionalCollisionBuffer;
  }

  // Validate allowNavigatingThroughLiquids
  if (behavior.allowNavigatingThroughLiquids !== undefined) {
    if (
      !validateBoolean(
        behavior.allowNavigatingThroughLiquids,
        'allowNavigatingThroughLiquids',
      )
    ) {
      return undefined;
    }
    result.allow_navigating_through_liquids =
      behavior.allowNavigatingThroughLiquids;
  }

  // Validate xzDist
  if (behavior.xzDist !== undefined) {
    if (!validateInteger(behavior.xzDist, 'xzDist', 1)) {
      return undefined;
    }
    result.xz_dist = behavior.xzDist;
  }

  // Validate yDist
  if (behavior.yDist !== undefined) {
    if (!validateInteger(behavior.yDist, 'yDist', 1)) {
      return undefined;
    }
    result.y_dist = behavior.yDist;
  }

  // Validate yOffset
  if (behavior.yOffset !== undefined) {
    if (!validateNumber(behavior.yOffset, 'yOffset')) {
      return undefined;
    }
    result.y_offset = behavior.yOffset;
  }

  // Validate mustReach
  if (behavior.mustReach !== undefined) {
    if (!validateBoolean(behavior.mustReach, 'mustReach')) {
      return undefined;
    }
    result.must_reach = behavior.mustReach;
  }

  // Validate floatWanderHasMoveControl
  if (behavior.floatWanderHasMoveControl !== undefined) {
    if (
      !validateBoolean(
        behavior.floatWanderHasMoveControl,
        'floatWanderHasMoveControl',
      )
    ) {
      return undefined;
    }
    result.float_wander_has_move_control = behavior.floatWanderHasMoveControl;
  }

  // Validate navigateAroundSurface
  if (behavior.navigateAroundSurface !== undefined) {
    if (
      !validateBoolean(behavior.navigateAroundSurface, 'navigateAroundSurface')
    ) {
      return undefined;
    }
    result.navigate_around_surface = behavior.navigateAroundSurface;
  }

  // Validate randomReselect
  if (behavior.randomReselect !== undefined) {
    if (!validateBoolean(behavior.randomReselect, 'randomReselect')) {
      return undefined;
    }
    result.random_reselect = behavior.randomReselect;
  }

  // Validate surfaceXzDist
  if (behavior.surfaceXzDist !== undefined) {
    if (!validateInteger(behavior.surfaceXzDist, 'surfaceXzDist', 0)) {
      return undefined;
    }
    result.surface_xz_dist = behavior.surfaceXzDist;
  }

  // Validate surfaceYDist
  if (behavior.surfaceYDist !== undefined) {
    if (!validateInteger(behavior.surfaceYDist, 'surfaceYDist', 0)) {
      return undefined;
    }
    result.surface_y_dist = behavior.surfaceYDist;
  }

  // Validate useHomePositionRestriction
  if (behavior.useHomePositionRestriction !== undefined) {
    if (
      !validateBoolean(
        behavior.useHomePositionRestriction,
        'useHomePositionRestriction',
      )
    ) {
      return undefined;
    }
    result.use_home_position_restriction = behavior.useHomePositionRestriction;
  }

  // Validate floatDuration
  if (behavior.floatDuration !== undefined) {
    const convertedDuration = convertRange(
      behavior.floatDuration,
      'floatDuration',
    );
    if (!convertedDuration) {
      return undefined;
    }
    result.float_duration = convertedDuration;
  }

  return {
    'minecraft:behavior.float_wander': result,
  };
};
