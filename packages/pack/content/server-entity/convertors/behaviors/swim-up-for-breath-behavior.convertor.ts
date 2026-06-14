import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SwimUpForBreathBehavior } from '../../interfaces/behaviors/swim-up-for-breath-behavior';
import { validateInteger, validateNumber, validateString } from '../common/validation';

/**
 * Converts a SwimUpForBreathBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSwimUpForBreathBehavior = (
  behavior: Partial<SwimUpForBreathBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.swim_up_for_breath': any } | undefined => {
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

  // Validate materialType
  if (behavior.materialType !== undefined) {
    if (
      !validateString(behavior.materialType, 'materialType') ||
      !['air', 'water', 'any'].includes(behavior.materialType)
    ) {
      return undefined;
    }
    result.material_type = behavior.materialType;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRadius
  if (behavior.searchRadius !== undefined) {
    if (!validateInteger(behavior.searchRadius, 'searchRadius')) {
      return undefined;
    }
    result.search_radius = behavior.searchRadius;
  }

  // Validate speedMod
  if (behavior.speedMod !== undefined) {
    if (!validateNumber(behavior.speedMod, 'speedMod')) {
      return undefined;
    }
    result.speed_mod = behavior.speedMod;
  }

  return {
    'minecraft:behavior.swim_up_for_breath': result,
  };
};
