import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { PetSleepWithOwnerBehavior } from '../../interfaces/behaviors/pet-sleep-with-owner-behavior';
import { validateInteger, validateNumber } from '../common/validation';

/**
 * Converts a PetSleepWithOwnerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPetSleepWithOwnerBehavior = (
  behavior: Partial<PetSleepWithOwnerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.pet_sleep_with_owner': any } | undefined => {
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

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate searchRadius
  if (behavior.searchRadius !== undefined) {
    if (!validateNumber(behavior.searchRadius, 'searchRadius')) {
      return undefined;
    }
    result.search_radius = behavior.searchRadius;
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  return {
    'minecraft:behavior.pet_sleep_with_owner': result
  };
};
