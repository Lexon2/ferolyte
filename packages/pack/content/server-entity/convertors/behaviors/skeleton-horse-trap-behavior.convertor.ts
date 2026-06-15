import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SkeletonHorseTrapBehavior } from '../../interfaces/behaviors/skeleton-horse-trap-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SkeletonHorseTrapBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSkeletonHorseTrapBehavior = (
  behavior: Partial<SkeletonHorseTrapBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.skeleton_horse_trap': any } | undefined => {
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

  // Validate duration
  if (behavior.duration !== undefined) {
    if (!validateNumber(behavior.duration, 'duration')) {
      return undefined;
    }
    result.duration = behavior.duration;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.skeleton_horse_trap': result,
  };
};
