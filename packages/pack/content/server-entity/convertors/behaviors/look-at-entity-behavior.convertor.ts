import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { LookAtEntityBehavior } from '../../interfaces/behaviors/look-at-entity-behavior';
import { convertRange } from '../common/convertors';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a LookAtEntityBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertLookAtEntityBehavior = (
  behavior: Partial<LookAtEntityBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.look_at_entity': any } | undefined => {
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

  // Validate lookDistance
  if (behavior.lookDistance !== undefined) {
    if (!validateNumber(behavior.lookDistance, 'lookDistance')) {
      return undefined;
    }
    result.look_distance = behavior.lookDistance;
  }

  // Validate probability
  if (behavior.probability !== undefined) {
    if (!validateNumber(behavior.probability, 'probability')) {
      return undefined;
    }
    result.probability = behavior.probability;
  }

  // Validate lookTime
  if (behavior.lookTime !== undefined) {
    const convertedLookTime = convertRange(behavior.lookTime, 'lookTime');
    if (!convertedLookTime) {
      return undefined;
    }
    result.look_time = convertedLookTime;
  }

  // Validate angleOfViewVertical
  if (behavior.angleOfViewVertical !== undefined) {
    if (!validateInteger(behavior.angleOfViewVertical, 'angleOfViewVertical')) {
      return undefined;
    }
    result.angle_of_view_vertical = behavior.angleOfViewVertical;
  }

  // Validate angleOfViewHorizontal
  if (behavior.angleOfViewHorizontal !== undefined) {
    if (
      !validateInteger(behavior.angleOfViewHorizontal, 'angleOfViewHorizontal')
    ) {
      return undefined;
    }
    result.angle_of_view_horizontal = behavior.angleOfViewHorizontal;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      behavior.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.look_at_entity': result,
  };
};
