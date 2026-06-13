import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { JumpToBlockBehavior } from '../../interfaces/behaviors/jump-to-block-behavior';
import { validateInteger, validateNumber, validatePercentage, validateStringArray, validateVector2 } from '../common/validation';

/**
 * Converts a JumpToBlockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertJumpToBlockBehavior = (
  behavior: Partial<JumpToBlockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.jump_to_block': any } | undefined => {
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

  // Validate cooldownRange
  if (behavior.cooldownRange !== undefined) {
    if (!validateVector2(behavior.cooldownRange, 'cooldownRange')) {
      return undefined;
    }
    result.cooldown_range = behavior.cooldownRange;
  }

  // Validate forbiddenBlocks
  if (behavior.forbiddenBlocks !== undefined) {
    if (!validateStringArray(behavior.forbiddenBlocks, 'forbiddenBlocks')) {
      return undefined;
    }
    result.forbidden_blocks = behavior.forbiddenBlocks;
  }

  // Validate maxVelocity
  if (behavior.maxVelocity !== undefined) {
    if (!validateNumber(behavior.maxVelocity, 'maxVelocity')) {
      return undefined;
    }
    result.max_velocity = behavior.maxVelocity;
  }

  // Validate minimumDistance
  if (behavior.minimumDistance !== undefined) {
    if (!validateNumber(behavior.minimumDistance, 'minimumDistance')) {
      return undefined;
    }
    result.minimum_distance = behavior.minimumDistance;
  }

  // Validate minimumPathLength
  if (behavior.minimumPathLength !== undefined) {
    if (!validateNumber(behavior.minimumPathLength, 'minimumPathLength')) {
      return undefined;
    }
    result.minimum_path_length = behavior.minimumPathLength;
  }

  // Validate preferredBlocks
  if (behavior.preferredBlocks !== undefined) {
    if (!validateStringArray(behavior.preferredBlocks, 'preferredBlocks')) {
      return undefined;
    }
    result.preferred_blocks = behavior.preferredBlocks;
  }

  // Validate preferredBlocksChance
  if (behavior.preferredBlocksChance !== undefined) {
    if (!validatePercentage(behavior.preferredBlocksChance, 'preferredBlocksChance')) {
      return undefined;
    }
    result.preferred_blocks_chance = behavior.preferredBlocksChance;
  }

  // Validate scaleFactor
  if (behavior.scaleFactor !== undefined) {
    if (!validateNumber(behavior.scaleFactor, 'scaleFactor')) {
      return undefined;
    }
    result.scale_factor = behavior.scaleFactor;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchWidth
  if (behavior.searchWidth !== undefined) {
    if (!validateInteger(behavior.searchWidth, 'searchWidth')) {
      return undefined;
    }
    result.search_width = behavior.searchWidth;
  }

  return {
    'minecraft:behavior.jump_to_block': result,
  };
};
