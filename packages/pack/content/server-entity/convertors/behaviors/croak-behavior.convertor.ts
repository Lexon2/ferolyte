import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { CroakBehavior } from '../../interfaces/behaviors/croak-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber, validateComplexRange } from '../common/validation';

/**
 * Converts a CroakBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertCroakBehavior = (
  behavior: Partial<CroakBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.croak': any } | undefined => {
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
    if (!validateComplexRange(behavior.duration, 'duration', 0)) {
      return undefined;
    }

    if (Array.isArray(behavior.duration)) {
      result.duration = behavior.duration;
    } else if (typeof behavior.duration === 'number') {
      result.duration = behavior.duration;
    } else if (typeof behavior.duration === 'object') {
      result.duration = {
        range_min: behavior.duration.rangeMin,
        range_max: behavior.duration.rangeMax
      };
    }
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate interval
  if (behavior.interval !== undefined) {
    if (!validateComplexRange(behavior.interval, 'interval', 0)) {
      return undefined;
    }

    if (Array.isArray(behavior.interval)) {
      result.interval = behavior.interval;
    } else if (typeof behavior.interval === 'number') {
      result.interval = behavior.interval;
    } else if (typeof behavior.interval === 'object') {
      result.interval = {
        range_min: behavior.interval.rangeMin,
        range_max: behavior.interval.rangeMax
      };
    }
  }

  return {
    'minecraft:behavior.croak': result
  };
};
