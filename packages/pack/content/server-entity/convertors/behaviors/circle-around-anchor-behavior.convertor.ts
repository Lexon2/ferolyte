import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { CircleAroundAnchorBehavior } from '../../interfaces/behaviors/circle-around-anchor-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a CircleAroundAnchorBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertCircleAroundAnchorBehavior = (
  behavior: Partial<CircleAroundAnchorBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.circle_around_anchor': any } | undefined => {
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

  // Validate radiusRange
  if (behavior.radiusRange !== undefined) {
    if (!Array.isArray(behavior.radiusRange) || behavior.radiusRange.length !== 2 ||
        !behavior.radiusRange.every(n => validateNumber(n, 'radiusRange'))) {
      console.error('radiusRange must be an array of exactly 2 numbers');

      return undefined;
    }
    result.radius_range = behavior.radiusRange;
  }

  // Validate radiusChangeChance
  if (behavior.radiusChangeChance !== undefined) {
    if (!validateNumber(behavior.radiusChangeChance, 'radiusChangeChance')) {
      return undefined;
    }
    result.radius_change_chance = behavior.radiusChangeChance;
  }

  // Validate heightAboveTargetRange
  if (behavior.heightAboveTargetRange !== undefined) {
    if (!Array.isArray(behavior.heightAboveTargetRange) || behavior.heightAboveTargetRange.length !== 2 ||
        !behavior.heightAboveTargetRange.every(n => validateNumber(n, 'heightAboveTargetRange'))) {
      console.error('heightAboveTargetRange must be an array of exactly 2 numbers');

      return undefined;
    }
    result.height_above_target_range = behavior.heightAboveTargetRange;
  }

  // Validate heightOffsetRange
  if (behavior.heightOffsetRange !== undefined) {
    if (!Array.isArray(behavior.heightOffsetRange) || behavior.heightOffsetRange.length !== 2 ||
        !behavior.heightOffsetRange.every(n => validateNumber(n, 'heightOffsetRange'))) {
      console.error('heightOffsetRange must be an array of exactly 2 numbers');

      return undefined;
    }
    result.height_offset_range = behavior.heightOffsetRange;
  }

  // Validate heightChangeChance
  if (behavior.heightChangeChance !== undefined) {
    if (!validateNumber(behavior.heightChangeChance, 'heightChangeChance')) {
      return undefined;
    }
    result.height_change_chance = behavior.heightChangeChance;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate radiusChange
  if (behavior.radiusChange !== undefined) {
    if (!validateNumber(behavior.radiusChange, 'radiusChange')) {
      return undefined;
    }
    result.radius_change = behavior.radiusChange;
  }

  // Validate radiusAdjustmentChance
  if (behavior.radiusAdjustmentChance !== undefined) {
    if (!validateNumber(behavior.radiusAdjustmentChance, 'radiusAdjustmentChance')) {
      return undefined;
    }
    result.radius_adjustment_chance = behavior.radiusAdjustmentChance;
  }

  // Validate heightAdjustmentChance
  if (behavior.heightAdjustmentChance !== undefined) {
    if (!validateNumber(behavior.heightAdjustmentChance, 'heightAdjustmentChance')) {
      return undefined;
    }
    result.height_adjustment_chance = behavior.heightAdjustmentChance;
  }

  // Validate angleChange
  if (behavior.angleChange !== undefined) {
    if (!validateNumber(behavior.angleChange, 'angleChange')) {
      return undefined;
    }
    result.angle_change = behavior.angleChange;
  }

  return {
    'minecraft:behavior.circle_around_anchor': result
  };
};
