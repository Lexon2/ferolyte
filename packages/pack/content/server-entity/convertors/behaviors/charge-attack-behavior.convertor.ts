import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { ChargeAttackBehavior } from '../../interfaces/behaviors/charge-attack-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a ChargeAttackBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertChargeAttackBehavior = (
  behavior: Partial<ChargeAttackBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.charge_attack': any } | undefined => {
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

  // Validate maxDistance
  if (behavior.maxDistance !== undefined) {
    if (!validateNumber(behavior.maxDistance, 'maxDistance')) {
      return undefined;
    }
    result.max_distance = behavior.maxDistance;
  }

  // Validate minDistance
  if (behavior.minDistance !== undefined) {
    if (!validateNumber(behavior.minDistance, 'minDistance')) {
      return undefined;
    }
    result.min_distance = behavior.minDistance;
  }

  // Validate successRate
  if (behavior.successRate !== undefined) {
    if (!validateNumber(behavior.successRate, 'successRate')) {
      return undefined;
    }
    result.success_rate = behavior.successRate;
  }

  return {
    'minecraft:behavior.charge_attack': result
  };
};
