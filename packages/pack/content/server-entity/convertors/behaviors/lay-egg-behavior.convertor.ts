import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { LayEggBehavior } from '../../interfaces/behaviors/lay-egg-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
  validateSoundEvent,
  validateString,
  validateStringArray,
} from '../common/validation';

const validateTargetMaterialsAboveBlock = (value: any): boolean => {
  if (
    !Array.isArray(value) ||
    !value.every((material) =>
      ['Air', 'Any', 'Lava', 'Water'].includes(material),
    )
  ) {
    console.error(
      'targetMaterialsAboveBlock must be an array of valid materials',
    );

    return false;
  }
  return true;
};

/**
 * Converts a LayEggBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertLayEggBehavior = (
  behavior: Partial<LayEggBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.lay_egg': any } | undefined => {
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

  // Validate allowLayingFromBelow
  if (behavior.allowLayingFromBelow !== undefined) {
    if (
      !validateBoolean(behavior.allowLayingFromBelow, 'allowLayingFromBelow')
    ) {
      return undefined;
    }
    result.allow_laying_from_below = behavior.allowLayingFromBelow;
  }

  // Validate eggType
  if (behavior.eggType !== undefined) {
    if (!validateString(behavior.eggType, 'eggType')) {
      return undefined;
    }
    result.egg_type = behavior.eggType;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate layEggSound
  if (behavior.layEggSound !== undefined) {
    if (!validateSoundEvent(behavior.layEggSound, 'layEggSound')) {
      return undefined;
    }
    result.lay_egg_sound = behavior.layEggSound;
  }

  // Validate laySeconds
  if (behavior.laySeconds !== undefined) {
    if (!validateNumber(behavior.laySeconds, 'laySeconds')) {
      return undefined;
    }
    result.lay_seconds = behavior.laySeconds;
  }

  // Validate onLay
  if (behavior.onLay !== undefined) {
    const convertedOnLay = convertTrigger(behavior.onLay, withFieldPath(ctx, 'onLay'));
    if (!convertedOnLay) {
      return undefined;
    }
    result.on_lay = convertedOnLay;
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

  // Validate targetBlocks
  if (behavior.targetBlocks !== undefined) {
    if (!validateStringArray(behavior.targetBlocks, 'targetBlocks')) {
      return undefined;
    }
    result.target_blocks = behavior.targetBlocks;
  }

  // Validate targetMaterialsAboveBlock
  if (behavior.targetMaterialsAboveBlock !== undefined) {
    if (
      !validateTargetMaterialsAboveBlock(behavior.targetMaterialsAboveBlock)
    ) {
      return undefined;
    }
    result.target_materials_above_block = behavior.targetMaterialsAboveBlock;
  }

  // Validate useDefaultAnimation
  if (behavior.useDefaultAnimation !== undefined) {
    if (!validateBoolean(behavior.useDefaultAnimation, 'useDefaultAnimation')) {
      return undefined;
    }
    result.use_default_animation = behavior.useDefaultAnimation;
  }

  return {
    'minecraft:behavior.lay_egg': result,
  };
};
