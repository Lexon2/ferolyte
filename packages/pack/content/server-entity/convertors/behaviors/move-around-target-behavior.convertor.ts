import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { MoveAroundTargetBehavior } from '../../interfaces/behaviors/move-around-target-behavior';
import { convertRange } from '../common/convertors';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateDegrees, validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a MoveAroundTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveAroundTargetBehavior = (
  behavior: Partial<MoveAroundTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_around_target': any } | undefined => {
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

  // Validate destinationPosSearchSpreadDegrees
  if (behavior.destinationPosSearchSpreadDegrees !== undefined) {
    if (
      !validateDegrees(
        behavior.destinationPosSearchSpreadDegrees,
        'destinationPosSearchSpreadDegrees',
      )
    ) {
      return undefined;
    }
    result.destination_pos_search_spread_degrees =
      behavior.destinationPosSearchSpreadDegrees;
  }

  // Validate destinationPositionRange
  if (behavior.destinationPositionRange !== undefined) {
    const convertedDestinationPositionRange = convertRange(behavior.destinationPositionRange, 'destinationPositionRange');
    if (!convertedDestinationPositionRange) {
      return undefined;
    }
    result.destination_position_range = convertedDestinationPositionRange;
  }

  // Validate destinationPosSpreadDegrees
  if (behavior.destinationPosSpreadDegrees !== undefined) {
    if (
      !validateDegrees(
        behavior.destinationPosSpreadDegrees,
        'destinationPosSpreadDegrees',
      )
    ) {
      return undefined;
    }
    result.destination_pos_spread_degrees =
      behavior.destinationPosSpreadDegrees;
  }

  // Validate heightDifferenceLimit
  if (behavior.heightDifferenceLimit !== undefined) {
    if (
      !validateNumber(behavior.heightDifferenceLimit, 'heightDifferenceLimit')
    ) {
      return undefined;
    }
    result.height_difference_limit = behavior.heightDifferenceLimit;
  }

  // Validate horizontalSearchDistance
  if (behavior.horizontalSearchDistance !== undefined) {
    if (
      !validateInteger(
        behavior.horizontalSearchDistance,
        'horizontalSearchDistance',
      )
    ) {
      return undefined;
    }
    result.horizontal_search_distance = behavior.horizontalSearchDistance;
  }

  // Validate movementSpeed
  if (behavior.movementSpeed !== undefined) {
    if (!validateNumber(behavior.movementSpeed, 'movementSpeed')) {
      return undefined;
    }
    result.movement_speed = behavior.movementSpeed;
  }

  // Validate verticalSearchDistance
  if (behavior.verticalSearchDistance !== undefined) {
    if (
      !validateInteger(behavior.verticalSearchDistance, 'verticalSearchDistance')
    ) {
      return undefined;
    }
    result.vertical_search_distance = behavior.verticalSearchDistance;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.move_around_target': result,
  };
};
