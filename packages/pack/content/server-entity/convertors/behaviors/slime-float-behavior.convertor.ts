import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { SlimeFloatBehavior } from '../../interfaces/behaviors/slime-float-behavior';
import { validateNumber, validatePercentage } from '../common/validation';

/**
 * Converts a SlimeFloatBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSlimeFloatBehavior = (
  behavior: Partial<SlimeFloatBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.slime_float': any } | undefined => {
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

  // Validate jumpChancePercentage
  if (behavior.jumpChancePercentage !== undefined) {
    if (!validatePercentage(behavior.jumpChancePercentage, 'jumpChancePercentage')) {
      return undefined;
    }
    result.jump_chance_percentage = behavior.jumpChancePercentage;
  }

  return {
    'minecraft:behavior.slime_float': result
  };
};
