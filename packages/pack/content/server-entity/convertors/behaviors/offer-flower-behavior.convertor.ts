import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { OfferFlowerBehavior } from '../../interfaces/behaviors/offer-flower-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateDegrees, validateNumber, validatePercentage, validateVector3 } from '../common/validation';

/**
 * Converts an OfferFlowerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertOfferFlowerBehavior = (
  behavior: Partial<OfferFlowerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.offer_flower': any } | undefined => {
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

  // Validate chanceToStart
  if (behavior.chanceToStart !== undefined) {
    if (!validatePercentage(behavior.chanceToStart, 'chanceToStart')) {
      return undefined;
    }
    result.chance_to_start = behavior.chanceToStart;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate maxHeadRotationY
  if (behavior.maxHeadRotationY !== undefined) {
    if (!validateDegrees(behavior.maxHeadRotationY, 'maxHeadRotationY')) {
      return undefined;
    }
    result.max_head_rotation_y = behavior.maxHeadRotationY;
  }

  // Validate maxOfferFlowerDuration
  if (behavior.maxOfferFlowerDuration !== undefined) {
    if (!validateNumber(behavior.maxOfferFlowerDuration, 'maxOfferFlowerDuration')) {
      return undefined;
    }
    result.max_offer_flower_duration = behavior.maxOfferFlowerDuration;
  }

  // Validate maxRotationX
  if (behavior.maxRotationX !== undefined) {
    if (!validateDegrees(behavior.maxRotationX, 'maxRotationX')) {
      return undefined;
    }
    result.max_rotation_x = behavior.maxRotationX;
  }

  // Validate searchArea
  if (behavior.searchArea !== undefined) {
    if (!validateVector3(behavior.searchArea, 'searchArea')) {
      return undefined;
    }
    result.search_area = behavior.searchArea;
  }

  return {
    'minecraft:behavior.offer_flower': result
  };
};
