import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BegBehavior } from '../../interfaces/behaviors/beg-behavior';
import { validateNumber, validateComplexRange, validateStringArray } from '../common/validation';

/**
 * Converts a BegBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertBegBehavior = (
  behavior: Partial<BegBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.beg': any } | undefined => {
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

  // Validate items
  if (behavior.items !== undefined) {
    if (!validateStringArray(behavior.items, 'items')) {
      return undefined;
    }
    result.items = behavior.items;
  }

  // Validate lookDistance
  if (behavior.lookDistance !== undefined) {
    if (!validateNumber(behavior.lookDistance, 'lookDistance')) {
      return undefined;
    }
    result.look_distance = behavior.lookDistance;
  }

  // Validate lookTime
  if (behavior.lookTime !== undefined) {
    if (!validateComplexRange(behavior.lookTime, 'lookTime', 0)) {
      return undefined;
    }

    if (Array.isArray(behavior.lookTime)) {
      result.look_time = behavior.lookTime;
    } else if (typeof behavior.lookTime === 'number') {
      result.look_time = behavior.lookTime;
    } else if (typeof behavior.lookTime === 'object') {
      result.look_time = {
        range_min: behavior.lookTime.rangeMin,
        range_max: behavior.lookTime.rangeMax
      };
    }
  }

  return {
    'minecraft:behavior.beg': result
  };
};
