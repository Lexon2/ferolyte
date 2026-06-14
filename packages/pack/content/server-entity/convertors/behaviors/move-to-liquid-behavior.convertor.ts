import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { LIQUID_MATERIAL_TYPE } from '../../constants/liquid-material-type';
import { MoveToLiquidBehavior } from '../../interfaces/behaviors/move-to-liquid-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a MoveToLiquidBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveToLiquidBehavior = (
  behavior: Partial<MoveToLiquidBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_to_liquid': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateInteger(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate materialType
  if (behavior.materialType !== undefined) {
    if (!LIQUID_MATERIAL_TYPE.includes(behavior.materialType)) {
      console.error('materialType must be a valid LiquidMaterialType');

      return undefined;
    }
    result.material_type = behavior.materialType;
  }

  return {
    'minecraft:behavior.move_to_liquid': result,
  };
};
