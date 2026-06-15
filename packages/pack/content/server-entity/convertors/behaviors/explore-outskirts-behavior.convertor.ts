import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ExploreOutskirtsBehavior } from '../../interfaces/behaviors/explore-outskirts-behavior';
import { validateNumber, validateVector3 } from '../common/validation';

/**
 * Converts an ExploreOutskirtsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertExploreOutskirtsBehavior = (
  behavior: Partial<ExploreOutskirtsBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.explore_outskirts': any } | undefined => {
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate distFromBoundary
  if (behavior.distFromBoundary !== undefined) {
    if (!validateVector3(behavior.distFromBoundary, 'distFromBoundary')) {
      return undefined;
    }
    result.dist_from_boundary = behavior.distFromBoundary;
  }

  // Validate exploreDist
  if (behavior.exploreDist !== undefined) {
    if (!validateNumber(behavior.exploreDist, 'exploreDist')) {
      return undefined;
    }
    result.explore_dist = behavior.exploreDist;
  }

  // Validate maxTravelTime
  if (behavior.maxTravelTime !== undefined) {
    if (!validateNumber(behavior.maxTravelTime, 'maxTravelTime')) {
      return undefined;
    }
    result.max_travel_time = behavior.maxTravelTime;
  }

  // Validate maxWaitTime
  if (behavior.maxWaitTime !== undefined) {
    if (!validateNumber(behavior.maxWaitTime, 'maxWaitTime')) {
      return undefined;
    }
    result.max_wait_time = behavior.maxWaitTime;
  }

  // Validate minDistFromTarget
  if (behavior.minDistFromTarget !== undefined) {
    if (!validateNumber(behavior.minDistFromTarget, 'minDistFromTarget')) {
      return undefined;
    }
    result.min_dist_from_target = behavior.minDistFromTarget;
  }

  // Validate minPerimeter
  if (behavior.minPerimeter !== undefined) {
    if (!validateNumber(behavior.minPerimeter, 'minPerimeter')) {
      return undefined;
    }
    result.min_perimeter = behavior.minPerimeter;
  }

  // Validate minWaitTime
  if (behavior.minWaitTime !== undefined) {
    if (!validateNumber(behavior.minWaitTime, 'minWaitTime')) {
      return undefined;
    }
    result.min_wait_time = behavior.minWaitTime;
  }

  // Validate nextXz
  if (behavior.nextXz !== undefined) {
    if (!validateNumber(behavior.nextXz, 'nextXz')) {
      return undefined;
    }
    result.next_xz = behavior.nextXz;
  }

  // Validate nextY
  if (behavior.nextY !== undefined) {
    if (!validateNumber(behavior.nextY, 'nextY')) {
      return undefined;
    }
    result.next_y = behavior.nextY;
  }

  // Validate timerRatio
  if (behavior.timerRatio !== undefined) {
    if (!validateNumber(behavior.timerRatio, 'timerRatio')) {
      return undefined;
    }
    result.timer_ratio = behavior.timerRatio;
  }

  return {
    'minecraft:behavior.explore_outskirts': result,
  };
};
