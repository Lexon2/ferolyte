import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { RandomHoverBehavior } from '../../interfaces/behaviors/random-hover-behavior';
import { convertRange } from '../common/convertors';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a RandomHoverBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRandomHoverBehavior = (
  behavior: Partial<RandomHoverBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.random_hover': any } | undefined => {
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

  // Validate hoverHeight
  if (behavior.hoverHeight !== undefined) {
    const convertedHoverHeight = convertRange(
      behavior.hoverHeight,
      'hoverHeight',
    );
    if (!convertedHoverHeight) {
      return undefined;
    }
    result.hover_height = convertedHoverHeight;
  }

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateInteger(behavior.interval, 'interval')) {
      return undefined;
    }
    result.interval = behavior.interval;
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

  return {
    'minecraft:behavior.random_hover': result,
  };
};
