import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { WitherRandomAttackPosGoalBehavior } from '../../interfaces/behaviors/wither-random-attack-pos-goal-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a WitherRandomAttackPosGoalBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertWitherRandomAttackPosGoalBehavior = (
  behavior: Partial<WitherRandomAttackPosGoalBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.wither_random_attack_pos_goal': any } | undefined => {
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

  return {
    'minecraft:behavior.wither_random_attack_pos_goal': result
  };
};
