import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { RaidGardenBehavior } from '../../interfaces/behaviors/raid-garden-behavior';
import { validateInteger, validateNumber, validateStringArray } from '../common/validation';

/**
 * Converts a RaidGardenBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertRaidGardenBehavior = (
  behavior: Partial<RaidGardenBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.raid_garden': any } | undefined => {
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

  // Validate blocks
  if (behavior.blocks !== undefined) {
    if (!validateStringArray(behavior.blocks, 'blocks')) {
      return undefined;
    }
    result.blocks = behavior.blocks;
  }

  // Validate eatDelay
  if (behavior.eatDelay !== undefined) {
    if (!validateInteger(behavior.eatDelay, 'eatDelay')) {
      return undefined;
    }
    result.eat_delay = behavior.eatDelay;
  }

  // Validate fullDelay
  if (behavior.fullDelay !== undefined) {
    if (!validateInteger(behavior.fullDelay, 'fullDelay')) {
      return undefined;
    }
    result.full_delay = behavior.fullDelay;
  }

  // Validate initialEatDelay
  if (behavior.initialEatDelay !== undefined) {
    if (!validateInteger(behavior.initialEatDelay, 'initialEatDelay')) {
      return undefined;
    }
    result.initial_eat_delay = behavior.initialEatDelay;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate maxToEat
  if (behavior.maxToEat !== undefined) {
    if (!validateInteger(behavior.maxToEat, 'maxToEat')) {
      return undefined;
    }
    result.max_to_eat = behavior.maxToEat;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateInteger(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  return {
    'minecraft:behavior.raid_garden': result
  };
};
