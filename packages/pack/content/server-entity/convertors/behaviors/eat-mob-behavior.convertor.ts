import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { EatMobBehavior } from '../../interfaces/behaviors/eat-mob-behavior';
import { validateNumber, validateSoundEvent, validateTradeOrLootTablePath } from '../common/validation';

/**
 * Converts an EatMobBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEatMobBehavior = (
  behavior: Partial<EatMobBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.eat_mob': any } | undefined => {
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

  // Validate eatAnimationTime
  if (behavior.eatAnimationTime !== undefined) {
    if (!validateNumber(behavior.eatAnimationTime, 'eatAnimationTime')) {
      return undefined;
    }
    result.eat_animation_time = behavior.eatAnimationTime;
  }

  // Validate eatMobSound
  if (behavior.eatMobSound !== undefined) {
    if (!validateSoundEvent(behavior.eatMobSound, 'eatMobSound')) {
      return undefined;
    }
    result.eat_mob_sound = behavior.eatMobSound;
  }

  // Validate lootTable
  if (behavior.lootTable !== undefined) {
    if (!validateTradeOrLootTablePath(behavior.lootTable, 'lootTable')) {
      return undefined;
    }
    result.loot_table = behavior.lootTable;
  }

  // Validate pullInForce
  if (behavior.pullInForce !== undefined) {
    if (!validateNumber(behavior.pullInForce, 'pullInForce')) {
      return undefined;
    }
    result.pull_in_force = behavior.pullInForce;
  }

  // Validate reachMobDistance
  if (behavior.reachMobDistance !== undefined) {
    if (!validateNumber(behavior.reachMobDistance, 'reachMobDistance')) {
      return undefined;
    }
    result.reach_mob_distance = behavior.reachMobDistance;
  }

  // Validate runSpeed
  if (behavior.runSpeed !== undefined) {
    if (!validateNumber(behavior.runSpeed, 'runSpeed')) {
      return undefined;
    }
    result.run_speed = behavior.runSpeed;
  }

  return {
    'minecraft:behavior.eat_mob': result
  };
};
